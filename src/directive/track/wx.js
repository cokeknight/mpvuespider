import { getCurrentPageUrl, getCurrentPageUrlWithArgs } from 'src/common/functions'
import { addTrackNormal,remainPageTime } from './index'

export function addTrack(trackName) {
  // 在onshow里才能使用
  const pageName = getCurrentPageUrl()
  const trackpageUrl = getCurrentPageUrlWithArgs()
  addTrackNormal(trackName, pageName, trackpageUrl)
}
export const bindWXPage = function (App) {
  const onShow = App.onShow
  return function () {
    const pages = getCurrentPageUrl()
    remainPageTime.tongji(pages)
    if (onShow) {
      onShow()
    }
  }
}
export function wxTrack () {
  const pages = getCurrentPageUrl()
  remainPageTime.tongji(pages)
}
