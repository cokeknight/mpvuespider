/**
 * Created by xuxin on 16/8/6.
 */
import Vue from 'vue'
import Router from 'vue-router'
import Conf from 'config'
import Api from 'api'
import routes from '../routers/index'
import page from 'page'
import localStorageCtrl from 'localStorageCtrl'
import { xhh } from 'interaction'
import { remainPageTime } from 'track'
import Bus from 'bus'
import urlService from 'urlService'
import userService from 'userService'

page.saveGlobalCookie()
page.weixin_init()

// 基础功能
Vue.use(Router)

let {
  isShowFooter,
  showFooter,
  hideFooter,
  resetPop,
  closeFirstLoading
} = Vue.XUtils

// fzc:位置不能放到上面
// urlRedirect会对vue1.0的 /#!/ 自动转化为 /#/!/
// #acd => #/acd
let router = new Router({
  routes,
  linkActiveClass: ''
})
// 一些老的页面要转化为新页面
urlService.checkOldUrl(router)

// 开始跳转
router.beforeEach(function (to, from, next) {
  // 记录路由
  Conf.router.from = from
  Conf.router.to = to
  // 关闭scrollTop组件
  Conf.scrollTopState.bool = false
  /** 记录页面停留时间***/
  /* 很多页面没有titlebar 需要清楚***/
  remainPageTime.tongji()
  // 默认滑动到top=0
  window.scrollTo(0, 0)
  // 还原可能的弹出窗
  resetPop()
  // 刷新页面的localstorage
  localStorageCtrl.refresh()
  if (Conf.firstInit) {
    Api.isLogin.call(this, {
      resolve: function (json) {
        Conf.isLogin = json.boolen === 1
        Conf.firstInit = false
        closeFirstLoading()
        if (!Conf.isLogin) {
          localStorageCtrl.clearAll()
          // 如果是旧的渠道页则直接跳过去
          if (Conf.oldRegisterPageRoute) {
            next(Conf.oldRegisterPageRoute)
            Conf.oldRegisterPageRoute = ''
            return
          }
        } else {
          localStorageCtrl.getFirstUser()
        }
        transitionNext(to, from, next)
      }
    })
  } else {
    Conf.isFirstApp = false
    transitionNext(to, from, next)
  }
  // 关闭窗口
  window.Vue.XUtils.closePop()
  // 清除Bus所有事件
  // 像新闻详情之类的用同一个模板的，组件只初始化一次
  // 如果这个时候清除掉事件，之后交互会有问题
  // 比如当前新闻页滑动到底部，再跳到下一页就还在底部
  if (to.name !== from.name) {
    Bus.$off()
  }
})

// 是否需要重置普遍提现到存管提现
function redirectWithdraw (fromName, toName) {
  // 开启全面存管 且 要去的是普通提现页 且 是不被允许访问的路由
  return Conf.open_all_cg && toName === 'withdraw' && Conf.canGoDefaultWithdraw.indexOf(fromName) == -1
}

function transitionNext (to, from, next) {
  let name = to.name
  let fromName = from.name
  if (Conf.isLogin) {
    if (Conf.canNotGoAfterLogin.indexOf(name) !== -1) {
      // 强制 根据存在url 会强制跳转
      if (to.query.url && to.query.force === '1') {
        window.location.href = to.query.url
      } else {
        next({ 'name': Conf.url.account })
      }
    } else if (redirectWithdraw(fromName, name)) {
      let newRouter = Object.assign({}, to, { name: 'withdrawZS' })
      next(newRouter)
    } else if (!Conf.isApp && Conf.stateRedirection[name] && !userService.getAttr('zxjh')) {
      // 判断是不是振鑫计划的
      next({ 'name': '404' })
    } else {
      next()
    }
  } else {
    if (Conf.noNeedLogin.indexOf(name) !== -1) {
      // 如果需要登陆后返回的则记录他的router信息
      if (Conf.needBack.indexOf(fromName) !== -1) {
        urlService.setRedirectUrl({
          name: from.name,
          params: from.params,
          query: from.query
        })
      }
      next()
    } else {
      // 跳到app就不运行下面
      if (xhh.goAppLogin()) return
      urlService.setRedirectUrl({
        name: to.name,
        params: to.params,
        query: to.query
      })
      next({ 'name': Conf.url.login })
    }
  }
}

router.afterEach(function (to, from, next) {
  let name = to.name
  // 当前页要发的请求
  // 比如: 同盾、web_log
  page.afterEach(name)
  // 特定页面需要显示footer
  if (isShowFooter(name)) {
    showFooter()
  } else {
    hideFooter()
  }
  // Loading.hide(name)
  // 记录从app过来时跳到的页面路由名字
  if (Conf.isApp) {
    try {
      xhh.render(to)
    } catch (e) {}
  }
})

export default router
