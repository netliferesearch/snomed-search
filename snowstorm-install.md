# Snowstorm installation and configuration

## Server requirements

We've installed it on Ubuntu 18.04 server with 4 vCPUs, 8GB RAM and 160GB SSD. For comparison, this is a \$40 per month server on Digital Ocean.

## Server setup

The Snowstorm server contains the Elasticsearch database, the Snowstorm runtime and an Nginx server acting as a proxy. Only Nginx is available from the outside.

## Versions

- Ubuntu 18.04.3 LTS
- Java 11.0.4
- Apache Maven 3.6.0
- Elasticsearch 6.8.3
- Snowstorm 4.3.8
- Nginx 1.14.0

## Compiling from source

We saw improved request throughput after downloading and compiling from source compared to the pre-built binary.

Compiling is done by running `mvn clean package` after downloading the source.

### Optional install

We installed http://tomcat.apache.org/native-doc/ as Snowstorm was suggesting it on startup, but it's not necessary. Suggest to get everything running first.

## Configuration

/etc/elasticsearch/elasticsearch.yml:

```
# A lower number is probably fine, but we don't know how low it can be
search.max_open_scroll_context: 100000
```

/etc/elasticsearch/jvm.options:

```
-Xms4g
-Xmx4g
```

/etc/nginx/sites-available/snowstorm.rundberg.no

```
proxy_cache_path        /var/cache/nginx levels=1:2 keys_zone=snowstorm:10m max_size=10g
                        inactive=60m use_temp_path=off;

server {

        server_name snowstorm.rundberg.no;

        location / {
                limit_except GET HEAD OPTIONS {
                        auth_basic "Snowstorm";
                        auth_basic_user_file /etc/nginx/.htpasswd;
                }

     if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        #
        # Custom headers and headers various browsers *should* be OK with but aren't
        #
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        #
        # Tell client that this pre-flight info is valid for 20 days
        #
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
     }
     if ($request_method = 'POST') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
     }
     if ($request_method = 'GET') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range';
     }

#               proxy_cache                     snowstorm;
                add_header                      X-Cache-Status          $upstream_cache_status;
                proxy_ignore_headers            Cache-Control Expires;
                proxy_cache_valid               30d;
                proxy_cache_valid               any 1h;
                proxy_cache_use_stale           error timeout http_500 http_502 http_503 http_504;
                proxy_cache_background_update   on;
                proxy_cache_lock                on;

                proxy_pass                      http://localhost:8080;
                proxy_redirect                  off;
                proxy_set_header                Host                    $host;
                proxy_set_header                X-Real-IP               $remote_addr;
                proxy_set_header                X-Forwarded-For         $proxy_add_x_forwarded_for;
                proxy_max_temp_file_size        0;

                client_max_body_size            1024M;
                client_body_buffer_size         128k;

                proxy_connect_timeout           90;
                proxy_send_timeout              90;
                proxy_read_timeout              90;

                proxy_buffer_size               4k;
                proxy_buffers                   4 32k;
                proxy_busy_buffers_size         64k;
                proxy_temp_file_write_size      64k;
        }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/snowstorm.rundberg.no/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/snowstorm.rundberg.no/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = snowstorm.rundberg.no) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name snowstorm.rundberg.no;
    return 404; # managed by Certbot


}
```

## Startup

/etc/systemd/system/snowstorm.service:

```
[Unit]
Description=snowstorm
Requires=elasticsearch.service
After=elasticsearch.service

[Service]
WorkingDirectory=/home/netlife/snowstorm
User=netlife
ExecStartPre=/bin/sleep 60
ExecStart=/usr/bin/java -Xms2g -Xmx2g -jar /home/netlife/snowstorm/snowstorm-4.3.8.jar --snowstorm.rest-api.readonly=true --spring.config.location=/home/netlife/snowstorm/application-local.properties
StandardOutput=journal
StandardError=journal
SyslogIdentifier=snowstorm
SuccessExitStatus=143

[Install]
WantedBy=multi-user.target
```

/home/netlife/snowstorm/application-local.properties:

```
server.port=8080
snowstorm.rest-api.readonly=false
```

# First import

sudo systemctl stop snowstorm

java -Xms2g -Xmx2g -jar snowstorm/snowstorm-4.3.8.jar --delete-indices --import=SnomedCT_InternationalRF2_PRODUCTION_20190731T120000Z.zip --exit &

# Helpful commands

## Delete all Elasticsearch indices

curl -XDELETE 'http://localhost:9200/*'

## Full import

java -Xms2g -Xmx2g -jar snowstorm/snowstorm-4.3.8.jar --delete-indices --import-full=SnomedCT_InternationalRF2_PRODUCTION_20190731T120000Z.zip --exit &
