const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

const lib = {};

lib.baseDir = path.join(__dirname, '../.data');

lib.create = function (dir, file, data, callback) {
  fs.open(path.join(lib.baseDir, dir, file + '.json'), 'wx', function (err, fileDescriptor) {
    if (err || !fileDescriptor) {
      return callback({ message: "can't create a file", err });
    }

    var stringData = JSON.stringify(data);

    fs.writeFile(fileDescriptor, stringData, function (err) {
      if (err) {
        return callback({ message: "can't write to file", err });
      }
      fs.close(fileDescriptor, function (err) {
        if (err) {
          return callback({ message: "can't close a file", err });
        }
        return callback();
      });
    });
  });
};

lib.read = function (dir, file, callback) {
  fs.readFile(path.join(lib.baseDir, dir, file + '.json'), 'utf8', function (err, data) {
    if (err) {
      return callback(err, data);
    }
    parsedData = helpers.parseJsonToObject(data);
    callback(err, parsedData);
  });
};


lib.update = function (dir, file, data, callback) {
  fs.open(path.join(lib.baseDir, dir, file + '.json'), 'r+', function (err, fileDescriptor) {
    if (err || !fileDescriptor) {
      return callback({ message: "can't open a file", err });
    }

    fs.ftruncate(fileDescriptor, function (err) {
      if (err) {
        return callback({ message: "can't truncate a file", err });
      }

      var stringData = JSON.stringify(data);

      fs.writeFile(fileDescriptor, stringData, function (err) {
        if (err) {
          return callback({ message: "can't write to file", err });
        }
        fs.close(fileDescriptor, function (err) {
          if (err) {
            return callback({ message: "can't close a file", err });
          }
          return callback();
        });
      });
    });

  });
};


lib.delete = function (dir, file, callback) {
  fs.unlink(path.join(lib.baseDir, dir, file + '.json'), function (err) {
    if (err) {
      return callback({ message: "can't unlink a file", err });
    }
    return callback();
  });
};

module.exports = lib;
