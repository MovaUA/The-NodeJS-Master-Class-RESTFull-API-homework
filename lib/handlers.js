const handlers = {
  ping: function (data, callback) {
    callback(200);
  },
  sample: function (data, callback) {
    callback(406, { name: 'sample handler' });
  },
  notFound: function (data, callback) {
    callback(404);
  },
};

module.exports = handlers;