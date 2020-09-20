const users = require('./users');

const handlers = {
  users,
  ping,
  sample,
  notFound
};

function ping(data, callback) {
  callback(200);
}

function sample(data, callback) {
  callback(406, { name: 'sample handler' });
}

function notFound(data, callback) {
  callback(404);
}


module.exports = handlers;