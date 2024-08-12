const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      util: require.resolve('util/'),
      process: require.resolve('process/browser')
    }
  }
};
