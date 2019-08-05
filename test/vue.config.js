const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        node_modules: path.resolve('node_modules'),
      },
    },
  },
}
