/**
 * Created by xuxin on 2017/4/11.
 */
import { wap } from 'interaction'
import Conf from 'config'
import page from 'page'
import { functions } from 'functions'
import { closest } from 'dom'

const URL = {
  home: 'home',
  login: 'login',
  account: 'account',
  toConfirmBank: 'toConfirmBank'
}

// 记录要跳转的外部url地址
let outside = null

const DEFAULT_URL = 'home'

let redirectUrl = {
  name: DEFAULT_URL,
  params: {},
  query: {}
}

// 重置路由入口，跳到相应的路由
// this为路由对象
function bindHashChange (routeName, query, params) {
  var router = this
  // 跳转函数，方便第二次删除
  function goRouter () {
    router.push({
      name: routeName,
      query: query,
      params: params
    })
    // 路由重置成功
    Conf.resetRouter = false
    window.removeEventListener('hashchange', goRouter)
  }
  // 重置路由
  Conf.resetRouter = true
  // 绑定事件
  // 这里网站没启动无法跳转，只能等页面跳转的时候优先跳这个
  window.addEventListener('hashchange', goRouter, false)
}

// ############### cookie 相关
const GLOBAL_COOKIE = ['device', 'hmsr', 'keyword']
// 保存url里GLOBAL_COOKIE里的字段到cookie
function saveCookie (obj) {
  var str, cookieObj
  // 如果参数里有GLOBAL_COOKIE中字段则保存。
  // 从obj把这个删掉
  GLOBAL_COOKIE.forEach(function (k) {
    str = obj[k]
    if (str) {
      cookieObj = cookieObj || {}
      cookieObj[k] = str
    }
  })
  // 值存到cookie里
  if (cookieObj) {
    page.saveGlobalCookie(cookieObj)
  }
}

let urlService = {
  go (name) {
    name = name || DEFAULT_URL
    if (wap.vm && wap.vm.$router) {
      wap.vm.$router.push(name)
    } else {
      window.location.hash = name
    }
  },
  goLogin () {
    let name = 'login'
    if (wap.vm && wap.vm.$router) {
      wap.vm.$router.push({ name: name })
      // wap.vm.$router.replace({name: name})
    } else {
      window.location.hash = name
    }
  },
  get: (name) => URL[name] || DEFAULT_URL,
  setRedirectUrl (obj) {
    // 未传参时，存在vm实例，则设为当前地址    若不存在vm实例，则默认跳到home
    if (!obj) {
      if (wap.vm && wap.vm.$route) {
        let cur = wap.vm.$route.name
        redirectUrl = {
          name: cur,
          params: wap.vm.$route.params,
          query: wap.vm.$route.query
        }
      } else {
        this.setRedirectUrl(DEFAULT_URL)
      }
    } else if (Object.isString(obj)) {
      redirectUrl = {
        name: obj,
        params: {},
        query: {}
      }
    } else if (Object.isObject(obj)) {
      redirectUrl = obj
    }
  },
  setOutside (site) {
    outside = site
  },
  redirectAfterLogin () {
    if (outside) {
      window.location.replace(outside)
    } else if (redirectUrl.name) {
      let cur = redirectUrl.name
      if (cur === 'deepDetails') cur = 'investDetails'
      wap.vm.$router.replace({
        name: cur,
        query: redirectUrl.query,
        params: redirectUrl.params
      })
    } else {
      wap.vm.$router.replace({ name: DEFAULT_URL })
    }
  },
  // 旧wap站页面修改
  // vue会自动把 /#!/ ==> /#/!/
  // #acc ==> /#/acc
  checkOldUrl: function (router) {
    var hash = window.location.hash,
      query = {},
      params = {},
      reg = /\/!\//,
      routerName, str, cookieObj
    // vue1.0 /#/!/ ==> /#/
    if (reg.test(hash)) {
      window.location.hash = hash = hash.replace(reg, '/')
    }
    // vue自动把#转化为 #/
    // 针对老的落地页 eg: http://xxx.xinhehui.com/#ac=index.register
    if ((/#\/ac=index/.test(hash))) {
      // 取出老的路由
      routerName = hash.match(/#[^&]+/)[0].replace(/\//, '')
      // 对象查找，查出新的路由
      routerName = Conf.oldUrl[routerName]
      if (!routerName) return
      // 参数
      str = hash.slice(routerName.length)
      if (str) {
        str.replace(/([^&=\s]*)\s*=\s*([^&=\s]*)/g, function (all, a, b) {
          query[a] = b
        })
      }
      // 筛选出需要保存到cookie字段保存到cookie
      saveCookie(query)
      // 保存旧的落地页路由, 有时监控路由不准确
      Conf.oldRegisterPageRoute = {
        name: routerName,
        query,
        params
      }
      return
    }

    routerName = hash.replace(/\?.*/, '')
    routerName = Conf.oldUrl[routerName]
    query = functions.getQuery()
    // 由于改版规划路由，要对app嵌入的wap路由作转化
    if (routerName) {
      // 筛选出需要保存到cookie字段保存到cookie
      saveCookie(query)
      bindHashChange.call(router, routerName, query, params)
    }
  },
  // 此函数监听在app内部的wap页面跳转到活动站，发送href打开新的webView
  appUrlJump (e) {
    var el = closest(e.target, 'a')
    // 是app 且 存在a 且href有值
    if (!Conf.isApp || Conf.appVersion < 660 || !el || !el.href) return
    // 域名
    var origin = window.location.origin
    var href = el.href
    var reg = new RegExp('^' + origin)
    // 必须是以http开头 且 从第一个字母算包含不包含当前域名则算外网
    // 过滤 href="javascrip:;"
    if (/^http/.test(href) && !reg.test(href)) {
      window.XHH.doAction('openWindow', { url: href })
      e.preventDefault()
    }
  }
}

export default urlService
