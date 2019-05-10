var path = require('path')
var utils = require('./utils')
var config = require('../config')
var webpack = require('webpack')
var vueLoaderConfig = require('./vue-loader.conf')
// const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
var aliasConfig = require('../build/aliasConfig')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}
var env = process.env.NODE_ENV

// var repeatedModule = ['pullup', 'inputX', 'titlebar']
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  entry: {
    app: `./src/main.${process.env.PLATFORM}.js`
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // plugin: [new TsconfigPathsPlugin()],
    extensions: ['.js', '.vue','.ts', '.tsx','.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: aliasConfig
  },
  module: {
    rules: [
      // ts文件的loader

      // {
      //   test: /\.(js|vue)$/,
      //   loader: 'eslint-loader',
      //   enforce: 'pre',
      //   include: [resolve('src'), resolve('test')],
      //   options: {
      //     formatter: require('eslint-friendly-formatter')
      //   },
      //   exclude: [/node_modules/, path.resolve(resolve('src/lib'))]
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'NODE_ENV': "'" +env + "'",
      'mpvue': 'global.mpvue',
      'mpvuePlatform': "'" + process.env.PLATFORM + "'",
      'process.env.NODE_ENV': "'" +env + "'"
    }),
    new VueLoaderPlugin()
  ]
}
