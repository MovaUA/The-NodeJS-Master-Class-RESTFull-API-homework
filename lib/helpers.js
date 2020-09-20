const crypto = require('crypto');
const config = require('./config');

const helpers = {};

helpers.hash = function (str) {
  if (typeof (str) === 'string' && str.length > 0) {
    var hash = crypto.createHmac('sha256', config.hashSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

helpers.parseJsonToObject = function (str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log({ message: "can't parse JSON", error: e });
    return {};
  }
};

helpers.createRandomString = function (strLength) {
  if (typeof (strLength) !== 'number' || strLength <= 0) {
    return false;
  }

  const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let randomString = '';
  for (let i = 0; i < strLength; i++) {
    const randomCharacter = possibleCharacters.charAt(Math.random() * possibleCharacters.length);
    randomString += randomCharacter;
  }

  return randomString;
}

module.exports = helpers;