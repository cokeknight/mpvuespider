var utils = require('./utils')
var config = require('../config')
var isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isProduction
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isProduction
  }),
  postcss: [
    // hm:此处从1%改为5%、last 2 versions改为last 10 versions--- 为了兼容苹果系统8 在等两年可以还原
    require('autoprefixer')({
      browsers: [
        "> 85%",
        "last 20 versions",
        "not ie <= 8"
      ]
    })
  ]
}
