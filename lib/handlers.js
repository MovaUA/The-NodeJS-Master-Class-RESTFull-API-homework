const _data = require('./data');
const helpers = require('./helpers');
const helper = require('./helpers');

const handlers = {
  users,
  ping,
  sample,
  notFound
};

function users(data, callback) {
  if (typeof (_users[data.method]) === 'undefined') {
    return callback(405);
  }
  _users[data.method](data, callback);
}

const _users = {
  post: createUser,
  get: readUser,
  put: updateUser,
  delete: deleteUser
};

function createUser(data, callback) {
  const firstName =
    typeof (data.payload.firstName) === 'string' &&
      data.payload.firstName.trim().length > 0 &&
      data.payload.firstName.trim().length < 65
      ? data.payload.firstName.trim()
      : false;
  const lastName =
    typeof (data.payload.lastName) === 'string' &&
      data.payload.lastName.trim().length > 0 &&
      data.payload.lastName.trim().length < 65
      ? data.payload.lastName.trim()
      : false;
  const phone =
    typeof (data.payload.phone) === 'string' &&
      data.payload.phone.trim().length === 12
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof (data.payload.password) === 'string' &&
      data.payload.password.trim().length > 0 &&
      data.payload.password.trim().length < 65
      ? data.payload.password.trim()
      : false;
  const tosAgreement =
    typeof (data.payload.tosAgreement) === 'boolean'
      ? data.payload.tosAgreement
      : false;

  if (!(firstName && lastName && phone && password && tosAgreement)) {
    return callback(400);
  }

  _data.read('users', phone, function (err, data) {
    if (!err) {
      return callback(400, { error: "the user already exists" });
    }
    const passwordHash = helpers.hash(password);
    if (!passwordHash) {
      console.log({ err: { message: "can't hash password" } });
      return callback(500, { error: "can't create user: can't hash password" });
    }
    const user = {
      firstName,
      lastName,
      phone,
      passwordHash,
      tosAgreement
    };
    _data.create('users', phone, user, function (err) {
      if (err) {
        console.log(err);
        return callback(500, { error: "can't create user" });
      }
      callback(200);
    });
  });
}
function readUser(data, callback) { }
function updateUser(data, callback) { }
function deleteUser(data, callback) { }

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