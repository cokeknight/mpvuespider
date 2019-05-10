import Vue from 'vue'
import Router from 'vue-router'
import Conf from 'src/config'
import routers from './routers'
import { remainPageTime } from 'src/directive/track/index'
import shareService from 'src/plugin/share/share'
import storage from 'storage'
import MP from 'MP'

declare var window:any
Vue.use(Router)


const router = new Router({
  mode: 'history',
  routes: routers
})

router.beforeEach(function (to: any, from: any, next) {
  if (!window.initUrl) {
    window.initUrl = window.location.href.split('#')[0]
  }
  // 记录路由
  Conf.router.from = from
  Conf.router.to = to
  storage.set('from', from.name)
  storage.set('to', to.name)
  /**记录页面停留时间***/
  /* 很多页面没有titlebar 需要清楚***/
  remainPageTime.tongji(window.location.href)
  // 默认滑动到top=0
  window.scrollTo(0, 0)
  next()
})
router.afterEach((to, from) => {
  if (Conf.server === 'wx') {
    shareService.weixin.init()
  }
})

window.onpopstate = (event)=>{
  const { currentRoutename } = MP.wap
  if (currentRoutename) {
    const currentRouterConfig:any = routers.find((item)=>item.name === currentRoutename)
    if (currentRouterConfig.onpopstate) {
      currentRouterConfig.onpopstate()
    }    
  }   
}
// window.history.pushState('forward', null, '#');
// window.history.forward(1);
export default router
