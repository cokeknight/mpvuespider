import { checkStatus } from './request'
import { goRouter, getCurrentPageUrl,getCurrentPageParameter } from 'src/common/functions'
import Bus from 'bus'
import Conf from 'src/config'
// import Confirm from './feedback/ui/confirm';
declare function require(moduleName: string): any
// declare var PLATFORM_H5: any
declare var document: any
declare var window: any
declare var global: any
// interface MPInterface {
//   request: any,
//   showToast: any,
//   blur?: any ,
//   // checkSession(): Promise<wx.GeneralCallbackResult>,
//   // getSetting(): Promise<wx.GetSettingSuccessCallbackResult>,
//   // getAccountInfoSync(): wx.AccountInfo,
//   // getUserInfo(): Promise<wx.GetUserInfoSuccessCallbackResult>,
//   // navigateTo(object: wx.NavigateToOption): void,
//   // login(): Promise<wx.LoginSuccessCallbackResult>,
//   // getStorageSync(): wx.GetStorageSuccessCallbackResult
// }
interface RequestOption {
  header?: object,
  url: string,
  data: object,
  method: string,
  success: (res: any) => void,
  fail: (ex: any) => void,
}
// const noop = () => {}
let MP: any = {
  // request: null,
  // showToast: null,
  // blur: undefined,
  // checkSession: null,
  // getSetting: null,
  // getAccountInfoSync: null,
  // getUserInfo: null,
  // navigateTo: null,
  // login: null,
  // getStorageSync: null
}

if (mpvuePlatform === 'h5') {
  const fetch = require('axios')
  const feedback = require('src/services/feedback/h5').default
  MP.wap = { vm : '' }
  MP.request = function request (option: RequestOption) {
    const fetchOpt: {url: string, method: string, headers: object, data?: any, Accept?: string} = {
      url: option.url,
      method: option.method,
      // header 会对think产生问题
      // headers: {
      //   'Content-Type': 'text/plain; charset=utf-8',
      // },
      headers: Object.assign(option.header || {}, {
        'Content-Type': 'application/json; charset=utf-8'
      }),
      Accept: 'application/json'
    }
    if (option.method === 'POST') {
      fetchOpt.data = JSON.stringify(option.data)
    }
    return fetch(fetchOpt).then(function(response) {
      response.statusCode = response.status
      checkStatus(response)
      return response.data
    }).then(function(json) {
      return option.success(json)
    }).catch(function(ex) {
      return option.fail(ex)
    })
  }
  Object.assign(MP, feedback)
  MP.blur = function () {
    setTimeout(() => {
      let scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
      window.scrollTo(0, Math.max(scrollHeight - 1, 0))
    }, 10)
  }
  MP.getQuery = function () {
    return this.$route.query
  }
  MP.goBack =  function () {
    MP.wap.vm.$router.back()
  }
  MP.getPreiviousRoutename =  function () {
    // return MP.wap.preiviousRoutename
    return Conf.router.from.name
  }
  MP.getCurrentRouter =  function () {
    return this.$route.name //MP.wap.vm.$router.name
  }

} else {
  // 小程序里面会存在加载比较慢 导致bug
  // const feedback = require('src/services/feedback/wx').default
  // const addTrack = require('src/directive/track/wx').default
  MP = {}
  MP.request = wx.request

  const methodUsePromise = ['checkSession', 'login', 'getSetting', 'getUserInfo']
  for (let i = 0; i < methodUsePromise.length; i++) {
    MP[methodUsePromise[i]] = function () {
      return new Promise(function (resolve, reject) {
        wx[methodUsePromise[i]]({
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res)
          }
        })
      })

    }
  }
  MP.getQuery = function () {
    return getCurrentPageParameter()
  }
  MP.goBack =  function () {
    wx.navigateBack({
      delta: 1
    })
  }
  MP.getPreiviousRoutename =  function () {
    return MP.wxPreiviousRoutename
  }
  MP.getCurrentRouter =  function () {
    return getCurrentPageUrl()
  }
}
MP.Bus = Bus
MP.goRouter = goRouter
global.MP = MP
export default MP
