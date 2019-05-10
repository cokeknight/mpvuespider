import MP from 'MP'
import { getAccessToken, setAccessToken, removeUser } from 'src/services/wx_auth'
import Conf from 'src/config'
import { delayFuncIn1000,UrlParse } from 'src/common/functions'
import { redirect_wx_auth_uri } from 'src/common/wx_functions'
const errnoNotErrorTip = [1001, -110]
const source = mpvuePlatform === 'h5' ? 1 : 2
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}
export const checkStatus = (response: any) => {

  if (response.statusCode >= 200 && response.statusCode < 300) {
    return response
  }
  const errortext = codeMessage[response.statusCode] || response.statusText

  MP.Tip({
    title: `请求错误 ${errortext}`,
    icon: 'none'
  })
  const error: any = new Error(errortext)
  error.name = response.status
  error.response = response
  throw error
}
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (option: {url: string, data?: object, method?: 'GET' | 'POST'}) {
  const accessToken  =  getAccessToken()
  const postData:any = option.data || {}
  // 默认加上source参数
  //hd 的话是自己带了这个参数 就不用加了
  if (!postData.source) {
    Object.assign(postData, { source,sourceType:source })
  }


  if (option.method === 'GET') {
    option.url += '?' + UrlParse.getSearchQuery(postData)
  }
  return new Promise(
    function (resolve: (res: {errno: number, status: number, data: any, errmsg?: string, message: string }) => void, reject) {
      MP.request({
        header: {
          'access-token': accessToken
        },
        url: option.url, // 仅为示例，并非真实的接口地址
        data: postData,
        method: option.method,
        success(res) {
          let data = res
          if (mpvuePlatform !== 'h5') {
            const result = checkStatus(res)
            data = result.data
          }
          resolve(data)
        },
        fail(res) {
          reject(res)
        }
      })
    }).then((res) => {

      //图片
      if(typeof res === 'string') {
        return res
      }
    // 微信code2session 接口返回未绑定手机状态码是2 2000是udesk的
    if (res.errno === 0 || res.status === 1 || res.status === 2 || res.status === 2000) {
      return res.data
    } else {

      const errmsg = res.errmsg || res.message
      let url = option.url.replace(Conf.path, '')

      if (!errnoNotErrorTip.includes(res.status) && !Conf.errorNotTipApi.includes(url)) {
        MP.Tip(`${errmsg}`)
      }
      // 用户信息过期
      if (res.status === -110 && !Conf.noDeedLoginUrl.includes(url)) {
        MP.Loading.hide() // 这里直接全局取消加载图示
        setAccessToken('')
        removeUser()

        delayFuncIn1000(function() {
          if (mpvuePlatform === 'h5') {
            if (Conf.server === 'wx') {
              // 需要重新去登录
              if (Conf.HAS_BIND){
                redirect_wx_auth_uri()
              } else {
                MP.goRouter(`/account/login?url=${encodeURIComponent(window.location.href)}`)
              }
            } else {
              MP.goRouter(`/account/login?url=${encodeURIComponent(window.location.href)}`)
            }
          } else {
            MP.goRouter('/account/index')
          }
        })
      }
      // if ()
      return Promise.reject(res)
    }
  })
}
