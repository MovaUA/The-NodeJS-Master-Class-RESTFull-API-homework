/*
Primary file for the API
*/

// Dependencies
const http = require("http");
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');
const handlers = require('./lib/handlers');

// _data.create('test', 'newfile', { foo: 'bar' }, function (err) {
//   console.log({ err });
// });
// _data.create('test', 'newfile', { foo: 'bar' }, function (err) {
//   console.log({ err });
// });
// _data.read('test', 'newfile', function (err, data) {
//   console.log({ err, data });
// });
// _data.read('test', 'newfile', function (err, data) {
//   console.log({ err, data });
// });
// _data.read('test', 'newfileX', function (err, data) {
//   console.log({ err, data });
// });
// _data.read('test', 'newfileX', function (err, data) {
//   console.log({ err, data });
// });
// _data.update('test', 'newfile', { fizz: 'buzz' }, function (err) {
//   console.log({ err });
// });
// _data.update('test', 'newfile', { fizz: 'buzz' }, function (err) {
//   console.log({ err });
// });
// _data.delete('test', 'newfile', function (err) {
//   console.log({ err });
// });
// _data.delete('test', 'newfile', function (err) {
//   console.log({ err });
// });

const unifedServer = function (req, res) {
  let parsedUrl = url.parse(req.url, true);

  let path = parsedUrl.pathname;
  let trimmedPath = path.replace(/^\/+|\/+$/g, '');
  let method = req.method.toLowerCase();
  let query = parsedUrl.query;
  let headers = req.headers;

  let decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();

    // route the request to handler
    var handler = typeof (router[trimmedPath]) !== 'undefined'
      ? router[trimmedPath]
      : handlers.notFound;

    const data = {
      trimmedPath,
      query,
      method,
      headers,
      payload: buffer,
    };

    handler(data, function (statusCode, payload) {
      statusCode = typeof (statusCode) === 'number' ? statusCode : 200;
      payload = typeof (payload) === 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('request:', data);
      console.log('response:', { statusCode, payload });
    });
  });
};

// The server should responde to the requests
const httpServer = http.createServer(unifedServer);

const httpsServerOptions = {
  key: fs.readFileSync(__dirname + '/https/key.pem'),
  cert: fs.readFileSync(__dirname + '/https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOptions, unifedServer);

// Start the server
httpServer.listen(config.httpPort, function () {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} environment`);
});
httpsServer.listen(config.httpsPort, function () {
  console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} environment`);
});

const router = {
  ping: handlers.ping,
  'sample': handlers.sample,
};