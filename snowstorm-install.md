# Snowstorm installation and configuration

## Server requirements

We've installed it on Ubuntu 18.04 server with 4 vCPUs, 8GB RAM and 160GB SSD. This is a \$40 per month server on Digital Ocean.

The Snowstorm server contains the Elasticsearch database, the Snowstorm runtime and an Nginx server acting as a proxy. Only Nginx is available from the outside.

## Versions

- Ubuntu 18.04.3 LTS
- Elasticsearch 6.8.3 (Important! This is _not_ the latest version! Do not use Eliasticsearch 7!)
- Snowstorm 4.5.1
- Java 11.0.4
- Apache Maven 3.6.0
- Nginx 1.14.0

## Compiling from source

We saw improved request throughput after downloading and compiling from source compared to the pre-built binary.

```
wget https://github.com/IHTSDO/snowstorm/archive/4.5.1.zip
unzip 4.5.1.zip
cd snowstorm-4.5.1
mvn clean package
```

### Optional install

We installed http://tomcat.apache.org/native-doc/ as well, as Snowstorm was suggesting it on startup, but it's not necessary. Suggest to get everything running first and consult someone who knows their Java about whether Tomcat Native is necessary.

## Elasticsearch config

/etc/elasticsearch/elasticsearch.yml:

```
# Elasticsearch will complain about this setting being too low. Not sure if it's necessary to change it,
# but you can set it to 100000 to get rid of the warnings.
# search.max_open_scroll_context: 100000
```

/etc/elasticsearch/jvm.options:

```
# Memory limits for Elasticsearch, very important to set these so it has enough memory.
-Xms4g
-Xmx4g
```

## First import

Upload the snapshot .zip-file to the server and run the following command to start Snowstorm and begin the import. It will take 20-30 minutes. You will get an "import complete" message once it's done.

```
java -Xms2g -Xmx2g -jar snowstorm/snowstorm-4.5.1.jar --delete-indices --import=SnomedCT_InternationalRF2_PRODUCTION_20190731T120000Z.zip --exit &
```

## nginx configuration

This is the nginx config for the domain where Snowstorm is accessible.

This is what it does:

- Caches requests (currently disabled)
- Requires a password for all write requests (POST, PATCH/PUT etc)
- Enable CORS
- Use certbot and Let's encrypt for SSL in Nginx

/etc/nginx/sites-available/snowstorm.rundberg.no:

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
        # Enable or disable the cache by uncommenting/commenting the next line
#        proxy_cache                     snowstorm;
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

## ufw config

```
To                         Action      From
--                         ------      ----
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80,443/tcp (Nginx Full)    ALLOW IN    Anywhere
8080                       DENY IN     Anywhere
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80,443/tcp (Nginx Full (v6)) ALLOW IN    Anywhere (v6)
8080 (v6)                  DENY IN     Anywhere (v6)
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
ExecStart=/usr/bin/java -Xms2g -Xmx2g -jar /home/netlife/snowstorm/snowstorm-4.5.1.jar --snowstorm.rest-api.readonly=true --spring.config.location=/home/netlife/snowstorm/application-local.properties
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

## Helpful commands

### Delete all Elasticsearch indices

```
curl -XDELETE 'http://localhost:9200/*'
```

### Full import

```
java -Xms2g -Xmx2g -jar snowstorm/snowstorm-4.5.1.jar --delete-indices --import-full=SnomedCT_InternationalRF2_PRODUCTION_20190731T120000Z.zip --exit &
```
