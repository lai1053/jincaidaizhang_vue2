var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://47.106.68.247:80/web-bovms"',//'"http://47.106.68.247:80/web-bovms"',
})
// http://10.10.17.134:8080/web-bovms
