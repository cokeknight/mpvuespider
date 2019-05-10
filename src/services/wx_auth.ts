import MP from 'MP'
import storage from 'storage'
import auth from 'src/services/globalData'
import config from 'src/config'
import * as Api from  'api'
import Cookie  from 'cookie'
let isInit = false

function getServerThirdSession(result) {
  return result.thirdSession
}

/**
 * 清空权限数据
 */
export function relaunchWxApp() {
  console.info('[wx_login] reladunc, clear login_code and third_session')
  isInit = false
  setThirdSession('')
  setAccessToken('')
}

/**
 * 检查session_key是否过期
 */
export async function checkThridSession() {
  try {
    const rest = await MP.checkSession()
    console.log(rest)
    console.info('[wx_login] check third session success')
  } catch (e) {
    // 异步刷新
    console.info('[wx_login] check third session fail')
    await refreshThirdSession()
  }
}

/**
 * 检查用户信息并抛出异常
 */
export async function checkUserInfoWithError() {
  await checkUserInfo(true)
}

/**
 * 检查是否授权用户信息
 */
export async function checkUserInfo(throwException = false) {
  // 信息完整通过校验
  if (isUserComplete()) {
    console.info('[wx_login] check user info success')
    return true
  }
  // 尝试获取用户信息
  const rawUser = await getWxUserInfo()
  if (rawUser == null) {
    return redirectToLoginPage('获取用户信息失败', throwException)
  }
  console.info('[wx_login] getUserInfo succeess, begin decode')
  // 服务端解析用户信息（还需要考虑thridSession失效问题）
  const success = await saveWxUserInfo(rawUser)
  return success ? true : redirectToLoginPage('服务端解析失败', throwException)
}

/**
 * 检查用户是否已经注册会员
 */
export async function checkUserMember() {
  // const member = store.getState('member')
  // if (member == null) {
  //   console.info('[wx_login] member info is empty')
  //   await Tips.modal('请点击绑定手机，享受更多会员特权')
  //   wepy.switchTab({url: '/pages/customer/index_template'})
  //   // 抛出异常
  //   throw new Error('尚未绑定手机')
  // }
  // // 还需要检查用户信息是否完整
  // await checkUserInfo()
}

/**
 * 保存并注册用户
 */
export async function saveWxUserPhone() {
  // if (data.encryptedData == null) {
  //   return false
  // }
  // const url = `${baseUrl}/auth/register_phone`
  // const param = {
  //   encryptedData: data.encryptedData,
  //   iv: data.iv,
  //   thirdSession: getThirdSession(),
  //   app_code: getAppCode()
  // }
  // const result = await http.get(url, param)
  // return result.memberId != null
}

/**
 * 处理电话号码事件
 */
export async function handleGetPhoneNumber() {
  // if (detail.errMsg == 'getPhoneNumber:fail user deny' || detail.errMsg == 'getPhoneNumber:fail:cancel to confirm login') {
  //   await Tips.alert('请允许授权')
  //   throw new Error('用户未授权电话号码')
  // }
  // try {
  //   // 其他错误不尝试注册
  //   if (detail.errMsg != 'getPhoneNumber:ok') {
  //     console.info(`[login] get phone number fail, message=${detail.errMsg}`, detail)
  //     return false
  //   }
  //   Tips.loading()
  //   const result = await saveWxUserPhone(detail)
  //   if (result) {
  //     await store.refresh('member')
  //     return true
  //   }
  // } catch (e) {
  //   // 判断已注册的情况
  //   if (e.serverCode == 52000) {
  //     console.info('[login] 用户已注册，刷新本地缓存', e)
  //     await store.refresh('member')
  //     return true
  //   } else {
  //     console.warn('注册失败', e)
  //     return false
  //   }
  // } finally {
  //   Tips.loaded()
  // }
}

/**
 * 保存微信用户信息
 */
export async function saveWxUserInfo(userinfo) {
  try {
    // Tips.loading()
    const result = await decodeUserInfo(userinfo)
    if (!result.errno) {
      console.info('[wx_login] saveWxUserInfo succeess', result.user)
      setUser(result.user)
      return true
    } else {
      console.warn('[wx_login] saveWxUserInfo fail, result is null')
      return false
    }
  } catch (e) {
    if (e.statusCode === 403) {
      // 异步刷新
      refreshThirdSession().then()
      console.warn('[wx_login] saveWxUserInfo fail, session_key invalid, relogin')
    } else {
      console.error('[wx_login] saveWxUserInfo fail, server exception', e)
    }
    return false
  } finally {
    // Tips.loaded()
  }
}

async function decodeUserInfo(userinfo) {
  const param = {
    userinfo,
    thirdSession: getThirdSession(),
    app_code: getAppCode()
  }
  return await Api.saveWxUserInfoServer(param)
}

/**
 *  启动程序
 */
export async function doInitWxApp() {
  // 已初始化，直接返回
  if (isInit === true) {
    console.info('[wx_login] app already init, flag=', isInit)
    return
  }
  // 未初始化，开始进行程序初始化
  if (isLoginCodeEmpty()) {
    // 登录状态失效，重新建立session
    console.info('[wx_login] login_code invalid, relogin wx')
    await createServerSession()
    storage.getAllKeys()
    // 保存全局配置
    // await store.initWithData(config)
    // 异步获取优惠券
    // store.use('coupon').then()
  } else {
    console.info('[wx_login] login_code is ok, load store', getOpenId())
    // await initStore()
  }
}

/**
 * 刷新服务端的session_key
 */
export async function refreshThirdSession() {
  const { code } = await MP.login()
  const appCode = getAppCode()
  const result: any = await Api.code2session(appCode, code)
  const thirdSession = getServerThirdSession(result)
  const { accessToken } = result
  setAccessToken(accessToken)
  setThirdSession(thirdSession || '')
  if (!thirdSession) {
    console.log('[wx_login] refreshThirdSession fail, message is empty')
  }
}

/***小程序一键授权手机号+验证登录 */
/***输入参数 是button getPhoneNumber的出参 */
export async function wx_Auth_Login(e) {
  MP.Loading.show()
  await checkThridSession()
  const thirdSession = getThirdSession()

  // 未绑定手机号 存在thirdSession 需要获取获取手机号进行登录
  if (thirdSession) {
    const detail = e.mp.detail
    if (!detail.encryptedData) {
      MP.Loading.hide()
      return false
    }
    const accessToken = getAccessToken()
    if (!accessToken) {
      try {
        await Api.decryptPhoneNumber({ ...detail, thirdSession })
        const result = await Api.bindingWeChatNoCheck({ thirdSession })
        const { accessToken } = result
        if (accessToken) {
          setAccessToken(accessToken)
        }
      } catch (e) {
        console.warn(e)
      }
    }
  } else {
    await refreshThirdSession()
    MP.Loading.hide()
  }
}

/**
 * 创建服务器会话
 * 小程序客户端调用wx.login，回调里面包含js_code。
 * 然后将js_code发送到服务器A（开发者服务器）,服务器A向微信服务器
 * 发起请求附带js_code、appId、secretkey和grant_type参数，以换取用户的openid和session_key（会话密钥）。
 */
async function createServerSession() {
  const { code } = await MP.login()

  const appCode = getAppCode()
  // 基础参数
  // const param = {
  //   appCode: appCode,
  //   code: code,
  //   withConfig: true
  // }
  // 启动路径
  // const path = wepy.$instance.globalData.launchPath
  // if (path) {
  //   param.scene = path
  // }
  const result: any = await Api.code2session(appCode, code) //"o7l475Pr_RDlVtahoo8KBmMJlEYE")
  // 保存权限信息

  console.warn('保存权限信息', result)
  const { accessToken, openId } = result
  storage.set('openId', openId)
  setAccessToken(accessToken)
  // // 客户端拿到3rdSessionId后缓存到storage
  const thirdSession = getServerThirdSession(result)
  setThirdSession(thirdSession || '')
}

/**
 * 获取微信的用户信息
 */
export async function getWxUserInfo() {
  // 检查用户授权情况
  const { authSetting } = await MP.getSetting()
  // 如果有授权，获取微信用户信息
  const isAuth = authSetting['scope.userInfo']
  console.info(`[wx_login] scope.userInfo=${isAuth}`)
  if (isAuth === true) {
    const rawUser = await MP.getUserInfo()
    console.info('[wx_login] get wx user_info success, user=', rawUser.userInfo)
    return rawUser
  } else {
    return null
  }
}

/**
 * 重定向到登录页面
 */
export function redirectToLoginPage(errMsg, throwException) {
  wx.navigateTo({ url: '/pages/home/login' })
  if (throwException) {
    throw new Error(`[wx_login] check user_info fail, ${errMsg}`)
  }
  return false
}

/**
 * 检查用户信息是否完整
 */
function isUserComplete() {
  const user = getUserInfo()
  return hasUser() && user.avatarUrl != null && user.nickName != null
}

/**
 * 检查LoginCode是否为空
 */
function isLoginCodeEmpty() {
  const code = getAccessToken()
  return code == null || code === '' || code === 'null'
}

// getter and setter

function hasUser() {
  return getUserInfo() != null
}

function getAppCode() {
  // return wepy.$instance.globalData.appid
}
// 微信里localstorage不能保存 使用cookie
export function getAccessToken() {
  if (config.server === 'wx') {
    return Cookie.get('accessToken')
  }
  return get('accessToken')
}

export function setAccessToken(loginCode) {
  if (config.server === 'wx') {
    return Cookie.set('accessToken', loginCode, false, 7)
  }
  set('accessToken', loginCode)
}

export function getThirdSession() {
  return get('third_session')
}

export function setThirdSession(thirdSession) {
  set('third_session', thirdSession)
}

export function getUserInfo() {
  const user = get('userInfo')
  return user
}
export function removeUser() {
  remove('userInfo')
}
export function setUser (user) {
  // store.save('user', user)
  const userInfo = getUserInfo() || {}
  set('userInfo', Object.assign(userInfo, user))
}

// export function setRecommend(recommend) {
//   set('recommend', recommend)
// }

// export function getRecommend() {
//   return get('recommend')
// }
function remove(key) {
  delete auth[key]
  storage.remove(key)
}
// 本地存储 内部变量 H5使用cookie
// recommend channel subChannel 使用内部存储
// openId accessToken 需要持久化存储
export function localGet(key){
  if (mpvuePlatform === 'h5') {
    return Cookie.get(key)
  }
  return auth[key]
}
export function localSet(key, val){
  if (mpvuePlatform === 'h5') {
    Cookie.set(key, val)
  }
  auth[key] = val
}
export function set (key, value) {
  if (config.server === 'wx') {
    Cookie.set(key, value)
  }
  auth[key] = value
  storage.set(key, value)
}
// 每次读取都是从内存中读取 而不是缓存中读取 这样保证一次打开不会请求之前留存的数据
export function get(key): any {
  // H5里吧accessToken存在缓存里
  let val = auth[key] || storage.get(key)
  if (config.server === 'wx') {
    return val || Cookie.get(key)
  }
  return val
}
export function getOpenId (){
  if (config.server === 'wx') {
    return Cookie.get('openId')
  }
  return get('openId') || storage.get('openId')
}
export function removeOpenId(){
  if (config.server === 'wx') {
    Cookie.delete('openId')
  }
  set('openId', '')
  storage.set('openId', null)
}

/***仅限H5微信 */
// export function getCookieKey (key){
//   if (config.server === 'wx') {
//     return Cookie.get(key)
//   }
// }
export function checkSetting(scope){
  return new Promise(function(resolve, reject){
    wx.getSetting({
      success(res) {
        if (res.authSetting[scope]){
          resolve(true)
        } else {
          reject()
        }
      },
      fail(error) {
        reject()
        console.warn(error)
      }
    })
  })

}
