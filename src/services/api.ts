import request from './request'
import { path } from 'src/config'
import { doInitWxApp, localGet, getOpenId } from 'src/services/wx_auth'
import { UrlParse } from 'src/common/functions'
import MP from 'MP'
import storage from 'storage'
import Cookie  from 'cookie'
// 延迟函数 需要在APP lanunch方法结束之后再发起其他的请求
// 因为code2session的时间300ms 都会大于服务器其他的接口的时间 200ms
function launchQueue() {
  return {
    loaded: false,
    appLoad() {
      this.loaded = true
    },
    delayWhenAppLaunchLoaded: function() {
      let self = this
      return new Promise(function(resolve) {
        if (self.loaded) {
          resolve()
        }
        if (mpvuePlatform === 'h5') {
          resolve()
        } else {
          let appLaunchId = setInterval(function() {
            if (self.loaded) {
              resolve()
              clearInterval(appLaunchId)
            }
          }, 100)
        }
      })

    }
  }
}

export const appLaunchQueue = launchQueue()

// 获取用户类型
export interface UserInfoInterface {
  openid: string,
  avatarUrl: string,
  city: string,
  country: string,
  gender: number,
  language: string,
  nickName: string,
  province: string
}

export const useropenid = () => {
}
export const weixinSign = function(param) {
  return request({ url: path + 'common/weixinSign', data: param, method: 'POST' })
}
export const getUserInfo: (payload: object) => Promise<UserInfoInterface> = async function(payload) {
  const result: Promise<UserInfoInterface> = await request({ url: path + 'common/getuserInfo', method: 'POST', data: payload })
  return result
}

export const bindingWeChat = function(param) {
  return request({ url: path + 'tjapi/user/bindingWeChat', data: param, method: 'POST' })
}
export const bindingWeChatNoCheck = function(param) {
  return request({ url: path + 'tjapi/user/bindingWeChatNoCheck', data: param, method: 'POST' })
}

// 微信小程序登录的接口
interface Code2sessionResult {
  thirdSession: string,
  loginCode: string
}

export const code2session = async function(appid, code) {
  const result: Code2sessionResult = await request({ url: path + 'tjapi/user/wxCodeLogin', data: { appid, code }, method: 'POST' })
  return result
}
// 微信小程序  微信授权登录 保存用户信息
export const saveWxUserInfoServer = async function(param) {
  const result = await request({ url: path + 'common/saveWxUserInfoServer', data: param, method: 'POST' })
  return result
}
export const getCity = async function() {
  const result = await request({ url: path + 'tjapi/city/getProvinceList', method: 'POST' })
  return result
}
// 获取列表
export const getList = async function() {
  const result = await request({ url: path + 'common/getList', method: 'POST' })
  return result
}
export const getGeolocation = async function(param) {
  const result = await request({ url: path + 'tjapi/city/coords/transfer', data: param, method: 'POST' })
  return result
}
/*发送手机验证码*/
export const sendRegisterMobileCode = async function(param) {
  return request({ url: path + 'tjapi/user/sendCode', data: param, method: 'POST' })
}

/*** 登录 */
export const doLogin = function(param) {
  return request({ url: path + 'tjapi/user/codeLogin', data: param, method: 'POST' })
}
/***公众号H5绑定 */
export const doWXH5Login = function(param) {
  const channel = Cookie.get('channel')
  const subChannel = Cookie.get('subChannel')
  const identity = Cookie.get('identity') || getOpenId()
  return request({ url: path + 'tjapi/user/publicAccountCodeLogin', data: {channel, subChannel, identity, ...param}, method: 'POST' })
}
/*** 退出 */
export const doLoginOut = function(param) {
  return request({ url: path + 'tjapi/user/logout', data: param, method: 'POST' })
}
/*** 账户 */
export const mine = function(param) {
  // return request({ url: path + 'tjapi/user/mine', data: param, method: 'POST' })
  return appLaunchQueue.delayWhenAppLaunchLoaded().then(function() {
    return request({ url: path + 'tjapi/user/mine', data: param, method: 'POST' })
  })
}
/*** 订单创建 */
export const orderCreate = async function(param, flag) {
  const carConfigDetailModelList =  storage.get('carConfigDetailModelList')
  let extraParam = {}
  if (carConfigDetailModelList) {
    const version_price = parseFloat(carConfigDetailModelList[0]['price'].replace(/¥|,/ig,'')) * 100
    const orderProductAttrs = [// type 值固定，格式如下；
      {'type': 'VERSION', 'value': '尊享版', 'price': version_price}, // 版本
      {'type': 'COLOUR', 'value': carConfigDetailModelList[1]['title'], 'price': 0} // 颜色
    ]
    if (carConfigDetailModelList[2]) {
      orderProductAttrs.push({'type': 'WHEEL', 'value': carConfigDetailModelList[2]['title'], 'price': 0})
    }
    if (carConfigDetailModelList[3]) {
      orderProductAttrs.push({'type': 'INTERIOR', 'value': carConfigDetailModelList[3]['title'], 'price': 0})
    }
    if (carConfigDetailModelList[4]) {
      const optional_price = parseFloat(carConfigDetailModelList[4]['price'].replace(/¥|,/ig,'')) * 100
      orderProductAttrs.push({'type': 'OPTIONAL', 'value': carConfigDetailModelList[4]['title'], 'price': optional_price})
    }
    extraParam = {
      'pickCarDate': '2020年1月份', // 新增提车日期
      'version': '1.0', // 新增，新接口固定该值
      'orderProductAttrs': orderProductAttrs
    }
  }
  // 加上推荐码
  const url = flag==='update' ? 'tjapi/order/updateNew' : 'tjapi/order/create'
  const recommend = localGet('recommend') || ''
  const channel = localGet('channel') || ''
  const subChannel = localGet('subChannel') || ''
  const result = await request({ url: path + url, data: { ...param, ...extraParam, openId: recommend, channel, subChannel }, method: 'POST' })

  return result
}
/***
 * 订单修改
 */
export const orderUpdate = async function(param) {
  return await orderCreate(param, 'update')
}
/*** 订单列表 */
export const orderList = async function(param) {
  const result = await request({ url: path + 'tjapi/order/list', data: param, method: 'POST' })
  return result
}
/*** 订单支付 */
export const orderPay = async function(param) {
  const result = await request({ url: path + 'tjapi/order/pay', data: param, method: 'POST' })
  return result
}
/*** 订单详情 */
export const orderDetail = async function(param) {
  const result = await request({ url: path + 'tjapi/order/detail', data: param, method: 'POST' })
  return result
}
/*** 支付结果查询 */
export const orderPayQuery = async function(param) {
  const result = await request({ url: path + 'tjapi/order/pay/query', data: param, method: 'POST' })
  return result
}
/*** 取消订单 */
export const orderCancel = async function(param) {
  const result = await request({ url: path + 'tjapi/order/cancel', data: param, method: 'POST' })
  return result
}
/*** 申请退订 */
export const orderRefundApply = async function(param) {
  const result = await request({ url: path + 'tjapi/order/refund/apply', data: param, method: 'POST' })
  return result
}
/*** 撤销申请退款 */
export const orderRefundApplyCancel = async function(param) {
  const result = await request({ url: path + 'tjapi/order/refund/apply/cancel', data: param, method: 'POST' })
  return result
}
/** 上传头像 */
export const uploadAva = function(param) {
  const result = request({ url: path + 'tjapi/user/upload', data: param, method: 'POST' })
  return result
}
/*****编辑用户信息 */
export const saveUserInfo = function(param) {
  const result = request({ url: path + 'tjapi/user/save', data: param, method: 'POST' })
  return result
}
// 签到
export const signIn = function(param) {
  const result = request({ url: path + 'tjapi/signin/signin', data: param, method: 'POST' })
  return result
}
export const tracklog = function(param) {
  const result = request({ url: path + 'tjapi/log/push', data: param, method: 'POST' })
  return result
}
/***积分明细 */
export const scoreList = function(param) {
  const result = request({ url: path + 'tjapi/userscore/detail/query', data: param, method: 'POST' })
  return result
}

/*****查询未读消息数据 */
export const messageReadCount = function(param) {
  const result = request({ url: path + 'tjapi/message/readCount', data: param, method: 'POST' })
  return result
}

/*****查询Udesk消息数据 */
export const gainUdeskMessage = function(param) {
  const result = request({ url: 'https://dearcc.udesk.cn/' + 'open_api_v1/customers/get_customer', data: param, method: 'GET' })
  return result
}

export const authWX = function(param) {
  const result = request({ url: 'https://open.weixin.qq.com/connect/qrconnect', data: param, method: 'GET' })
  return result
}

/*****查询消息详细 */
export const gainMessageDetail = function(param) {
  const result = request({ url: path + 'tjapi/message/temp/msgSendDetailList', data: param, method: 'POST' })
  return result
}
/*****解析手机号码 */
export const decryptPhoneNumber = function(param) {
  const result = request({ url: path + 'tjapi/wechat/decrypt', data: param, method: 'POST' })
  return result
}
/*****获取意向金 */
export const orderGetAmount = function(param) {
  const result = request({ url: path + 'tjapi/order/getAmount', data: param, method: 'POST' })
  return result
}

/**获取字符渠道*/
export const orderGetChannel = function(param) {
  const result = request({ url: path + 'tjapi/config/queryPayConfig', data: param, method: 'POST' })
  return result
}


/**微信formID提交*/
export const submitFormId = function(param) {
  const result = request({ url: path + 'tjapi/message/temp/saveForm', data: param, method: 'POST' })
  return result
}


export const shareOrder = function(param) {
  const result = request({ url: path + 'tjapi/wechat/shareOrder', data: param, method: 'POST' })
  return result
}
export const getShareConfig = function(param) {
  const result = request({ url: path + 'tjapi/wechat/getShareConfig', data: param, method: 'POST' })
  return result
}
export const getWxacode = function(param) {
  // const result = request({ url: path + 'tjapi/wechat/shareOrder', data: param, method: 'POST' })
  // const result = request({ url: path + 'tjapi/wechatImg/getPageCode', data: param, method: 'GET' })
  let url = path + 'tjapi/wechatImg/getPageCode?' + UrlParse.getSearchQuery(param)
  return url
}
/*** 新增留资信息 */
export const createLeaveInfo = function(param) {
  return request({ url: path + 'tjapi/source/add', data: param, method: 'POST' })
}
//****微信端是否已经绑定 */
export const isWXBinded = function(param) {
  return request({ url: path + 'tjapi/user/isBinded', data: param, method: 'POST' })
}
function loopLaunchApp() {
  let timeID
  timeID = setInterval(async function() {
    try {
      await doInitWxApp()
      clearInterval(timeID)
      appLaunchQueue.appLoad()
    } catch (e) {
      MP.Tip(e.errMsg)
    }
  }, 1000)
}

export async function initApp() {
  loopLaunchApp()
}
