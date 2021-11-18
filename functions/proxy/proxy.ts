import { Handler } from '@netlify/functions';
require('isomorphic-fetch');

export const handler: Handler = async (event, context) => {
  const path = event.path.substr(25);
  const url = new URL(`${path}?${event.rawQuery}`, process.env.PROXY_HOSTNAME);

  const response = await fetch(url.toString(), {
    method: event.httpMethod,
    ...(event.body ? { body: event.body } : {}),
    headers: { ...event.headers, host: '' },
  });

  const body = await response.text();

  return {
    statusCode: response.status,
    body,
    headers: {
      ...Object.fromEntries(response.headers.entries()),
      'Access-Control-Allow-Origin': process.env.URL,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, OPTIONS, HEAD',
      'Access-Control-Allow-Headers': 'Authorization, Origin, X-Requested-With, Content-Type, Accept',
    },
  };
};
