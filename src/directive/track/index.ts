import Conf from 'src/config'
import storage from 'storage'
import { isEmptyObject, isObject } from 'src/common/functions'
import * as Api from 'src/services/api'
import MP from 'MP'


// 是否正式环境
let isProduction = Conf.isProduction
const debugTrack = Conf.debugTrack // 是否调试埋点 也就是打出埋点记录
let trackConf = {
  localKey: 'tracklog',
  trackUrl: 'tracklog',
  sendTime: 10000,
  topic: 'test',
  product: 'xhh'
}

let IS_SENDING = false
let sendingObj: Array<any> = [] // 发送埋点统计期间, 若用户点击, 将值记在sendingObj中,请求返回之后, 若成功付给localstorage,若失败更新localstorage

// 网站启动前，如果本地埋有点信息，要把他先存在这里
// 等网站启动后再发
// let oldTrackData: any = null

if (isProduction) {
  initTrack()
}

let triggerInitTime = 0
function getTime () {
  let d = new Date()
  return d.getTime()
}
function initTrack () {
  send() // 初始化时发送上次未发送的数据
  if (mpvuePlatform === 'h5') {
    window.setInterval(function () { send() }, trackConf.sendTime)
  } else {
    setInterval(function () { send() }, trackConf.sendTime)
  }

  // 页面刷新不对
  // window.onbeforeunload = function () {
  //  send()
  // }

  function send () {
    let payload = storage.get(trackConf.localKey)
    // 网站没启动就不要发，之前的埋点就保存下，下次发的时候一起发出去
    // 没启动之前之前没多少埋点，直接去掉
    // if (!Conf.appIsStarted) {
    //   oldTrackData = payload
    //   return
    // } if (oldTrackData) {
    //   payload = oldTrackData.concat(payload || [])
    //   storage.set(trackConf.localKey, payload)
    //   oldTrackData = null
    // }
    if (isEmptyObject(payload)) {
      return
    }
    let data = payload // { 'topic': trackConf.topic, 'payload': payload }
    IS_SENDING = true
    Api.tracklog(data).then(() => {
      storage.remove(trackConf.localKey)
      if (sendingObj.length) {
        storage.set(trackConf.localKey, sendingObj)
        sendingObj = []
      }
      IS_SENDING = false
    }).catch(() => {
      if (!isEmptyObject(sendingObj)) {
        let trackObj = storage.get(trackConf.localKey)
        trackObj = trackObj.concat(sendingObj)
        storage.set(trackConf.localKey, trackObj)
        // sendingObj = [] // 失败的情况下也应该清空，因为已经保存在storage里面了
      }
      IS_SENDING = false
    })
  }
}
function saveTrackToLocal (trackId, isneed?: Boolean) {
  if (!isProduction) return
  if (!isneed) {
    if (!triggerInitTime) {
      triggerInitTime = getTime()
    } else if (getTime() - triggerInitTime < 1000) { // 1s之内的点击只记录一次
      return
    }
  }
  trackId['trackTime'] = getTime() / 1000
  let key = trackConf.localKey
  let trackObj = storage.get(key) || []
  /** *处理原先是对象的数据类型****/
  if (isObject(trackObj)) {
    storage.remove(key)
    trackObj = []
  }
  if (IS_SENDING) {
    sendingObj.push(trackId)
    return
  }
  trackObj.push(trackId)
  storage.set(key, trackObj)
}
let trackSetup = {
  base: {
    site: trackConf.product,
    module: null,
    action: 'remaintime',
    platform: null,
    hmsr: null,
    brand: null,
    deviceId: null,
    app_version: null,
    wxtype: null
  },
  add: function (options) {
    let trackId: any = Object.assign({}, this.base, options)
    console.log(trackId)
    saveTrackToLocal(trackId, true)
  }
}
interface RemainPageTimeI {
  data: Array<any>,
  tongji: (trackpageUrl: string) => void
}
const remainPageTime: RemainPageTimeI = {
  data: [],
  /** 统计每个页面的停留时间****/
  tongji: function (trackpageUrl) {
    let href = trackpageUrl
    // let uid = userService.user ? (userService.user.uid ? userService.user.uid : 0) : 0
    if (this.data[0]) {
      let item: any = this.data[this.data.length - 1]
      item['remaintime'] = (getTime() - item.begintime) / 1000
      trackSetup.add({
        pageUrl: item.url,
        remaintime: item['remaintime'],
        begintime: item['begintime'],
        // uid: uid
      })
    }
    this.data.push({ url: href, begintime: getTime() })
  }
}
let addTrack = function (track, trackEvent, trackPid, trackName, pageName?: String, trackpageUrl?: String) {
  Object.assign(trackSetup.base, {
    platform: Conf.platform,
    hmsr: Conf.hmsr,
    brand: Conf.brand,
    model: Conf.model,
    deviceId: Conf.deviceId,
    app_version: Conf.appVersion,
    wxtype: Conf.wxtype
  })
  // let uid = userService.user ? (userService.user.uid ? userService.user.uid : 0) : 0
  // todopageName, trackpageUrl
  let tempPageName =  pageName || MP.wap.preiviousRoutename || MP.wap.vm.$route.name
  let tempTrackpageUrl =  trackpageUrl || window.location.href

  let trackid = track.id ? track.id : ''
  let trackId = Object.assign({}, trackSetup.base,
    {
      module: tempPageName,
      action: tempTrackpageUrl,
      // uid: uid,
      pid: trackPid,
      name: trackName,
      pageUrl: trackpageUrl,
      id: trackid
    })
  if (debugTrack) {
    console.log(trackId)
  }
  // 不能使用process.env.NODE_ENV 因为ts环境真的有这个变量
  if (!isProduction) {
    return
  }
  saveTrackToLocal(trackId)
}
const addTrackNormal = (trackName, pageName?: String, trackpageUrl?: String) => addTrack({}, 'click', '', trackName, pageName, trackpageUrl)
export { remainPageTime, trackSetup, addTrack, addTrackNormal }
