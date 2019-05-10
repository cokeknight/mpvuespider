/**
 * Created by xuxin on 16/4/28.
 *
 * track 指令
 * v-track="{name: 'home', event: 'click', pid: '10000'}"
 * name是该点的事件对象名
 * event是触发事件类型,默认是click
 * pid是指项目id
 *
 * 目前会将 用户id  uid和项目id  pid携带过去
 * 其他类型的id 之后再去统计
 *
 * 使用localstorage 是为了应对app被kill掉的情况
 * hm: addTrackNormal 页面进入直接调用该方法会报错，wap.vm还没存储，需要在setTimeout内包含调用
 */
import 'src/constants/prototype'
import { on } from 'src/lib/dom'
import { remainPageTime, trackSetup, addTrack, addTrackNormal } from './index'
import Conf from 'src/config'
const debugTrack = Conf.debugTrack // 是否调试埋点 也就是打出埋点记录
window.addTrack = addTrack
let track = {}
// 是否正式环境
let isProduction = Conf.isProduction
track.install = function (Vue) {
  Vue.directive('track', {
    update () {},
    inserted (el, binding, vnode) {
      if (!debugTrack) {
        if (process.env.NODE_ENV === 'development') {
          isProduction = 1
        }
        if (!isProduction) return
      }
      let track = binding.value
      if (!track.name || track.name == '') return
      track = track || {}
      let trackName = track.name || 'unknown'
      let trackEvent = track.event || 'click'
      let trackPid = track.pid ? track.pid : ''

      on(el, trackEvent, function () {
        /** * 从一次性初始化时候绑定改成在click事件中绑定，因为子路由可能切换，这个时候需要获取正确的路由
        v-track="{name:'{{routerName}}_titlebarchangeNav'+item.title}">
        因为指令中不能使用this，使用这种办法去后期解析
        ***/
        // console.log(trackName)
        let match = trackName.match(/{{(.*)}}/)
        if (match) {
          trackName = trackName.replace(/{{(.*)}}/g, function (val, key) {
            if (key === 'routerName') return vnode.context.$router.currentRoute.name
          })
        }
        addTrack(track, trackEvent, trackPid, trackName)
      })
    },
    unbind () {}
  })
}
export { track, remainPageTime, trackSetup, addTrack, addTrackNormal }
