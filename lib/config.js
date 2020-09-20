const environments = {};

environments.staging = {
  httpPort: 3000,
  httpsPort: 3001,
  envName: 'staging',
  hashSecret: 'super duper secret',
};

environments.production = {
  httpPort: 5000,
  httpsPort: 5001,
  envName: 'production',
  hashSecret: 'super super duper secret',
};

const envName = process.env.hasOwnProperty('NODE_ENV')
  ? process.env.NODE_ENV.toLowerCase()
  : '';

const env = environments.hasOwnProperty(envName)
  ? environments[envName]
  : environments.staging;

module.exports = env;
