import Conf from 'src/config'
import { localSet, set, setAccessToken } from 'src/services/wx_auth'
import Cookie  from 'cookie'
import * as Api from 'api'

export function getCurrentPageUrl() {
  let pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = '/' + currentPage.route
  return url
}
export function getCurrentPageParameter() {
  let pages: any = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let options = currentPage.options
  return options
}
export function getCurrentPageUrlWithArgs() {
  let pages: any  = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  let options = currentPage.options
  let urlWithArgs = '/' + url + '?'
  for (let key in options) {
    let value = options[key]
    urlWithArgs += key + '=' + value + '&'
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}
// # sourceMappingURL=functions.js.map
export const downloadImage =  function(url) {
  // 微信不支持非https的图片下载，这里了个替换
  return new Promise(function(resolve, reject){
    const downLoad = function (){
      wx.downloadFile({
        url: url,
        success: function(res) {
          resolve(res.tempFilePath);
        }, fail: function(res) {
          downLoad();
        }
      });
    }
    downLoad()
  })
}

export const WX_AUTH_LOGIN_IN_H5 = function () {
  if (Conf.server === 'wx') {
    /****清理旧数据 */
    if (!Cookie.get('hasdeleteidentity4')) {
      Cookie.delete()
      Cookie.set('hasdeleteidentity4', 1)
    }
    const channel  = Cookie.get('channel')
    const identity  = Cookie.get('identity')
    const subChannel  = Cookie.get('subChannel')
    const accessToken  = Cookie.get('accessToken')

    if (accessToken) {
      setAccessToken(accessToken)
      // 登录页面 已经登录 跳转到launch页面
      if (/account\/login/.test(window.location.href)) {
        window.location.href = window.location.origin + '/launch' + window.location.search
        return false
      }
    }
    if (channel) {
      localSet('channel', channel)
      localSet('subChannel', subChannel)
    }
    if(identity) {
      // 说明是从open.weixin.qqq跳转过来的
      Api.isWXBinded({
        channel, subChannel, identity
      }).then((res)=>{
        if (res.isBinded) {
          Conf.HAS_BIND = true
        }
      })
      set('openId', identity)
      return true
    } else {
      redirect_wx_auth_uri()
    }
  } else {
    return true
  }
}
export function redirect_wx_auth_uri () {
  let url= encodeURIComponent(`${window.location.origin}/tjapi/user/thirdLogin?channel=1&subChannel=11&url=${encodeURIComponent(window.location.href)}`)
  window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxe0addeb4373994c7&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=snsapi_base#wechat_redirect`
}
