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

// TODO: authenticate
function readUser(data, callback) {
  var phone = typeof (data.query.phone) === 'string' && data.query.phone.length === 12 ? data.query.phone : false;
  if (!phone) {
    return callback(400, { error: "Missing required field: phone" });
  }
  _data.read('users', phone, function (err, data) {
    if (err) {
      return callback(404);
    }
    delete data.passwordHash;
    return callback(200, data);
  });
}

function updateUser(data, callback) {
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

  if (!(phone && (firstName || lastName || password))) {
    return callback(400, { error: "missing required or optional fields" });
  }

  _data.read('users', phone, function (err, data) {
    if (err) {
      console.log({ err });
      return callback(500);
    }

    if (firstName) {
      data.firstName = firstName;
    }
    if (lastName) {
      data.lastName = lastName;
    }
    if (password) {
      data.passwordHash = helpers.hash(password);
    }

    _data.update('users', phone, data, function (err) {
      if (err) {
        console.log(err);
        return callback(500);
      }
      return callback(200);
    });
  });
}

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