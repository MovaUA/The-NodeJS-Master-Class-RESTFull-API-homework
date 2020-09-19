/*
Primary file for the API
*/

// Dependencies
const http = require("http");
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// The server should responde to the requests
const server = http.createServer(function (req, res) {
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

      res.writeHead(statusCode);
      res.end(payloadString);

      console.log('request:', data);
      console.log('response:', { statusCode, payload });
    });
  });
});

// Start the server
server.listen(3000, function () {
  console.log("The server is listening on port 3000");
});

const handlers = {};

handlers.sample = function (data, callback) {
  callback(406, { name: 'sample handler' });
}

handlers.notFound = function (data, callback) {
  callback(404);
}

const router = {
  'sample': handlers.sample,
};