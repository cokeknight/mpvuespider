import config from 'src/config'
import * as Api from 'src/services/api'
import { getCurrentPageUrl, UrlParse } from 'src/common/functions'
import { localGet, getOpenId }  from 'src/services/wx_auth'

// declare function require(moduleName: string): any
declare var window: any
declare var NODE_ENV: any
const source = mpvuePlatform === 'h5' ? 1 : 2
class Share {
  appkey: string
  copyWriteMap: object
  copyWriteType: string
  shareConfig: mp.shareConfig | null
  constructor (props: any) {
    this.copyWriteType = 'default'
    this.appkey = 'sasa'
    this.shareConfig = null
  }
  static defaultShareConfig(){
    return {
      "path":"",
      "imageUrl":"",
      "title":"",
      "desc":""
    }
  }
  async getServerShareConfig() {
    if (!this.shareConfig) {
      const res = await Api.shareOrder({
        sourceType: source
      })
      this.shareConfig = {
        title: res.title,
        desc: res.desc,
        imgUrl: res.imageUrl,
        link: res.path
      }
    } else {
      return true
    }
  }
  getShareConfig (params ?: object) {
    let opt: mp.shareConfig & any = this.shareConfig
    Object.assign(opt, params || {})
    // 分享建立关系的参数
    // H5里使用openid作为推荐码
    let recommend = getOpenId()
    let channel = localGet('channel')
    let subChannel = localGet('subChannel')
    let time = new Date().getTime()
    // 分享的链接 可以配置路由 register之类的
    let link
    let imgUrl = opt.imgUrl
    if (mpvuePlatform === 'h5') {
      const currentUri =  window.location.hash
      opt.link = opt.link || currentUri.match(/#\/([^?]+)/)[1]

      // 检测是不是绝对地址
      if (/^http/.test(opt.link)) {
        opt.isAbsolutePath = true
      }
      // 不是绝对地址，但是是以 / 开头的要把 / 去掉，方便后面拼接
      if (!opt.isAbsolutePath && opt.link.charAt(0) === '/') {
        opt.link = opt.link.slice(1)
      }

      imgUrl = window.location.protocol + '//' + window.location.host + opt.imgUrl
      if (opt.imgUrl.indexOf('http') !== -1) {
        imgUrl = opt.imgUrl
      }
      if (opt.isAbsolutePath) {
        link = opt.link
      } else {
        link = window.location.protocol + '//' + window.location.host + '/' + UrlParse.addQuery(opt.link, { recommend, channel, subChannel, time })
      }
    } else {
      if (!/http:\/\//.test(opt.imgUrl) ) {
        if (opt.imgUrl.charAt(0) === '/') {
          opt.imgUrl = opt.imgUrl.slice(1)
        }
        opt.imgUrl = config.remoteUrl + opt.imgUrl
      }
      if (!opt.path) {
        console.warn('没设置path变量，使用当前页面')
      } else {
        // 微信小程序使用的变量是path
        link = opt.path + '?recommend=' + recommend
      }
    }

    let title = opt.title
    let desc = opt.desc
    console.log(link)
    return {
      title,
      desc,
      link,
      imgUrl
    }
  }
}
class WeiboShare extends Share {
  constructor (props?: object) {
    super(props)
  }
  async render (): Promise<String> {
    if (config.server === 'wx') {
      // throw new Error('微博分享在微信中不可用')
      return ''
    }
    await this.getServerShareConfig()
    if (this.shareConfig) {
      let share = this.getShareConfig({
        link: 'launch'
      })
      let link = share.link
      const weiboUrl = 'javascript:void((function(s,d,e,r,l,p,t,z,c){var%20f=\'http://v.t.sina.com.cn/share/share.php?appkey=' + this.appkey + '\',u=z||d.location,p=[\'&url=\',e(u),\'&title=\',e(t||d.title),\'&source=\',e(r),\'&sourceUrl=\',e(l),\'&content=\',c||\'gb2312\',\'&pic=\',e(p||\'\')].join(\'\');function%20a(){if(!window.open([f,p].join(\'\'),\'mb\',[\'toolbar=0,status=0,resizable=1,width=440,height=430,left=\',(s.width-440)/2,\',top=\',(s.height-430)/2].join(\'\')))u.href=[f,p].join(\'\');};if(/Firefox/.test(navigator.userAgent))setTimeout(a,0);else%20a();})(screen,document,encodeURIComponent,\'\',\'\',\'' + this.shareConfig.imgUrl + '\',\'' + this.shareConfig.title + '\',\'' + link + '\',\'' + this.shareConfig.desc + '\',\'\'))'
      return weiboUrl
    } else {
      return ''
    }
  }
}
class WeixinShare extends Share {
  isXiaochengxu: Boolean // 是否是小程序
  url: String // 初次的url
  wxConfig: Object
  updateShareMenu: () => void
  constructor (props?: object) {
    super(props)
    if (mpvuePlatform !== 'h5') {
      this.isXiaochengxu = true
    }
  }
  async init() {
    await this.getServerShareConfig()
    if (mpvuePlatform === 'h5') {
      // 微信H5
      this.setShareConfig()
      // window.alert('微信分享只能在微信中使用')
      // throw new Error('微信分享只能在微信中使用')
    }
  }
  setShareConfig() {
    const url = window.location.href.split('#')[0]
    Api.getShareConfig({ url: url }).then(res => {
      this.wxConfig = res
      this.bindConfig()
    })
  }
  bindConfig () {
    // 有时会报 windown.wx 不存在
    // 这样保证不会出问题
    let setInterval_id

    if (window.wx && this.wxConfig) {
      this.config(this.wxConfig)
    } else {
      setInterval_id = setInterval(() => {
        if (window.wx && this.wxConfig) {
          clearInterval(setInterval_id)
          this.config(this.wxConfig)
        }
      }, 1000)
    }
  }
  config (conf) {
    let wx = window.wx
    wx.config({
      debug: config.SHAREDEBUG && NODE_ENV === 'development',
      appId: conf.appId,
      timestamp: conf.timestamp,
      nonceStr: conf.noncestr,
      signature: conf.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'updateAppMessageShareData',
        'updateTimelineShareData',
        'onMenuShareQQ',
        'onMenuShareWeibo'
      ]
    })
    // H5 固定分享链接
    this.setParam({
      link: 'launch'
    })
  }
  // 配制参数
  // isAbsolutePath 是非绝对路径，是的话就不用再组装路径，默认是 false
  setParam (params?: object) {
    const opts = this.getShareConfig(params)
    const wx = window.wx
    wx.ready(function () {
      if (wx.updateAppMessageShareData) {
        wx.updateAppMessageShareData(opts)// 监听"分享给朋友"
        wx.updateTimelineShareData(opts)// 监听"分享到朋友圈 分享到QQ"
      } else {
        wx.onMenuShareAppMessage(opts)// 监听"分享给朋友"
        wx.onMenuShareTimeline(opts)// 监听"分享到朋友圈"
        wx.onMenuShareQQ(opts)// 监听"分享到QQ"
      }
      wx.onMenuShareWeibo(opts)// 监听"分享到微博"
    })
  }
  async getUpdateShareMenu (params) {
    if (!this.isXiaochengxu) return
    await this.getServerShareConfig()
    const opts = this.getShareConfig(params)
    return function () {
      if (!params.path) {
        opts.link = getCurrentPageUrl()
      }
      // 小程序里使用openid作为推荐码
      let recommend = getOpenId()
      opts.link = UrlParse.addQuery(opts.link, { recommend })
      return {
        title: opts.title,
        path: opts.link,
        imageUrl: opts.imgUrl
      }
    }
  }

}

const weibo: WeiboShare =  new WeiboShare()
const weixin: WeixinShare =  new WeixinShare()
export default {
  weibo,
  weixin,
  defaultShareConfig: Share.defaultShareConfig
}

