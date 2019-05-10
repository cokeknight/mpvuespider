// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var localConf = {}

try {
  localConf = require('./local')
} catch (e) {
  if (process.env.NODE_ENV === 'development') {
    console.log('build目录下无local.js文件')
  }
}

// 代理到外网ip
const remoteIp = 'http://pv.sohu.com/cityjson?ie=utf-8'
// 代理地址
var target = localConf.mockUrl || localConf.proxyHost
const tjTarget = localConf.tgTarget
// 埋点代理地址
var tracklogtarget = localConf.tracklogtarget

var fileExtConfig = {
  swan: {
    template: 'swan',
    script: 'js',
    style: 'css',
    platform: 'swan'
  },
  tt: {
    template: 'ttml',
    script: 'js',
    style: 'ttss',
    platform: 'tt'
  },
  h5: {
    template: 'html',
    script: 'js',
    style: 'less',
    platform: 'h5'
  },
  wx: {
    template: 'wxml',
    script: 'js',
    style: 'wxss',
    platform: 'wx'
  },
  my: {
    template: 'axml',
    script: 'js',
    style: 'acss',
    platform: 'my'
  }
}
if (!process.env.PLATFORM) {
  process.env.PLATFORM = process.argv[process.argv.length - 1] || 'wx'
}
var fileExt = fileExtConfig[process.env.PLATFORM]

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, `../dist/${fileExt.platform}/index.html`),
    assetsRoot: path.resolve(__dirname, `../dist/${fileExt.platform}`),
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report,
    fileExt: fileExt
  },
  test:{
    index: path.resolve(__dirname, `../dist/${fileExt.platform}/index.html`),
    assetsRoot: path.resolve(__dirname, `../dist/${fileExt.platform}`),
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    // 在小程序开发者工具中不需要自动打开浏览器
    autoOpenBrowser: false,
    assetsSubDirectory: '',
    assetsPublicPath: '/',
    proxyTable: process.env.PLATFORM === 'wx' ? false : {
      '/tjapi': {
        target: tjTarget,
        changeOrigin: true,
        pathRewrite: {
          '^/tjapi': '/tjapi'
        }
      },
      '/common': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/common': '/common'
        }
      },
      // 出借详情页里的出借协议
      '/Index': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/Index': '/Index'
        }
      },
      '/Public': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/Public': '/Public'
        }
      },
      '/Weixin': {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          '^/Weixin': '/Weixin'
        }
      },
      '/tracklog': {
        target: tracklogtarget,
        changeOrigin: true,
        pathRewrite: {
          '^/tracklog': '/produce.php'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
    fileExt: fileExt
  }
}
