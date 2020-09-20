const _data = require('../data');
const helpers = require('../helpers');

function tokens(data, callback) {
  if (typeof (_tokens[data.method]) === 'undefined') {
    return callback(405);
  }
  _tokens[data.method](data, callback);
}

const _tokens = {
  post: createToken,
  get: readToken,
  put: extendToken,
  delete: deleteToken,
  verifyToken: verifyToken,
};

function createToken(data, callback) {
  const phone =
    typeof (data.payload.phone) === 'string' &&
      data.payload.phone.trim().length === 12
      ? data.payload.phone.trim()
      : false;
  const password =
    typeof (data.payload.password) === 'string' &&
      data.payload.password.length > 0 &&
      data.payload.password.length < 65
      ? data.payload.password
      : false;

  if (!(phone && password)) {
    return callback(400, { error: "required fields are missing" });
  }

  _data.read('users', phone, function (err, user) {
    if (err) {
      return callback(404);
    }

    const passwordHash = helpers.hash(password);
    if (passwordHash !== user.passwordHash) {
      return callback(400, { error: "password does not match" });
    }

    const token = {
      id: helpers.createRandomString(20),
      phone,
      expires: Date.now() + 1000 * 60 * 60,
    };

    _data.create('tokens', token.id, token, function (err) {
      if (err) {
        console.log(err);
        return callback(500, { error: "can't create a token" });
      }
      return callback(200, token);
    });
  });
}

function readToken(data, callback) {
  var id = typeof (data.query.id) === 'string' && data.query.id.trim().length === 20 ? data.query.id.trim() : false;
  if (!id) {
    return callback(400, { error: "Missing required field: id" });
  }
  _data.read('tokens', id, function (err, token) {
    if (err) {
      return callback(404);
    }
    return callback(200, token);
  });
}

function extendToken(data, callback) {
  const id =
    typeof (data.payload.id) === 'string' &&
      data.payload.id.trim().length === 20
      ? data.payload.id.trim()
      : false;
  const extend =
    typeof (data.payload.extend) === 'boolean'
      ? data.payload.extend
      : false;

  if (!(id && extend)) {
    return callback(400, { error: "missing required or optional fields" });
  }

  _data.read('tokens', id, function (err, token) {
    if (err) {
      console.log({ err });
      return callback(500);
    }

    if (token.expires < Date.now()) {
      return callback(400, { error: "token is expired already" });
    }

    token.expires = Date.now() + 1000 * 60 * 60;

    _data.update('tokens', id, token, function (err) {
      if (err) {
        console.log(err);
        return callback(500);
      }
      return callback(200);
    });
  });
}

function deleteToken(data, callback) {
  const id =
    typeof (data.query.id) === 'string' &&
      data.query.id.trim().length === 20
      ? data.query.id.trim()
      : false;

  if (!id) {
    return callback(400, { error: "missing required field: id" });
  }

  _data.read('tokens', id, function (err, token) {
    if (err) {
      console.log({ err });
      return callback(404);
    }

    _data.delete('tokens', id, function (err) {
      if (err) {
        console.log({ err });
        return callback(404);
      }
      return callback(200);
    });
  });
}

function verifyToken(id, phone, callback) {
  _data.read('tokens', id, function (err, token) {
    if (err) {
      return callback(false);
    }
    if (phone !== token.phone || token.expires < Date.now()) {
      return callback(false);
    }
    return callback(true);
  });
}

module.exports = tokens;
