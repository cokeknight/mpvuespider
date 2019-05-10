// export const path = process.env.PLATFORM === 'development' ? 'http://localhost:8080/'
//   : 'https://xhhfe.xinhehui.com/'
let serverUrl: any = null
let remoteUrl: any = null
let ImgUrl: any
let ImgUrls: any
declare var window: any
import { functions } from 'src/common/functions'

if (mpvuePlatform === 'h5') {
  serverUrl = `${window.location.origin}/`

} else {
  // serverUrl = 'https://tj-api-test2.7qqf.com/' // 'https://xhhfe.xinhehui.com/'
  // serverUrl = 'https://m.enovatemotors.com/'
  serverUrl = 'https://m-uat.enovatemotors.com/'

}
if (NODE_ENV === 'development') {
  remoteUrl = 'https://xhhfe.xinhehui.com/'
} else {
  remoteUrl = 'https://xhhfe.xinhehui.com/'
  if (mpvuePlatform === 'wx') {
    serverUrl = 'https://m.enovatemotors.com/'
  }
}
ImgUrl = 'https://obs-5025.obs.cn-east-2.myhuaweicloud.com/prod/'
// ImgUrls = 'https://obs-5025.obs.cn-east-2.myhuaweicloud.com/prod/'
export const path = serverUrl
// 一些不需要登录校验的页面
export const noDeedLogin = [
  'pages/index/index',
  'pages/home/login'
]

let isWeixin =  mpvuePlatform === 'h5' && functions.isWeixin()
if (mpvuePlatform === 'h5') {
  const query = functions.getQuery()
  if (query && query.isWeixin) {
    isWeixin = true
  }
}
const config: any = {
  server: isWeixin ? 'wx' : 'h5', // 当前浏览器环境
  platform: mpvuePlatform, // 编译平台
  noDeedLogin: [
    'pages/index/index',
    'pages/home/login'
  ],
  path: serverUrl,
  remoteUrl: remoteUrl,
  imgUrl: ImgUrl,
  imgUrls: ImgUrls,
  ACCESSTOKEN_Expired: -110,
  SHAREDEBUG: false,
  HAS_BIND: false, // 微信内嵌H5 是否绑定
  isProduction: NODE_ENV === 'production',
  // platform: isWeixin ? 'wx' : 'h5', // 当前浏览器环境 todo  后续会有 ios  app之类
  hmsr: '', // 连接里带的hmsr参数
  brand: '', // 手机品牌
  model: '', // 手机型号
  deviceId: '', // 手机deviceId
  appVersion: '', // 手appVersion
  wxtype: isWeixin ? 1 : 0,
  appIsStarted: false, // APP启动标志
  debugTrack: NODE_ENV === 'production', // 开启埋点直接console的模式
  router: {
    from: {},
    to: {}
  }, // 路由的保存对象
  errorNotTipApi: [
    'tjapi/order/pay/query',
    'tjapi/city/coords/transfer',
    'https://dearcc.udesk.cn/open_api_v1/customers/get_customer',
    'tjapi/order/pay/check',
    'tjapi/log/push',
    'tjapi/message/temp/saveForm'
  ],
  noDeedLoginUrl: [
    'tjapi/message/readCount'
  ]
}
// export const serverUrl2 = 'http://tj-api-test2.7qqf.com:8080/'
export default config
