/**
 * Created by xuxin on 16/4/26.
 */
import userService from 'userService'
import formService from 'formService'
import transferService from 'transferService'
import Conf from 'config'

let localStorageCtrl = {
  render () {
    // 初始化forms,user,transfer对象
    formService.init()
    userService.init()
    transferService.init()
  },
  clearAll () {
    formService.clearForm()
    userService.clear()
    transferService.clear()
  },
  refresh () {
    formService.refreshFormToLocal()
  },
  getUser () {
    if (!userService.isInCache()) {
      userService.init(true)
    }
  },
  // 只有首次才用这个
  // 他的作用就是如果是微信/app过来的，防止缓存就直接从服务端取值
  getFirstUser: function () {
    if (Conf.platform !== 'wap') {
      userService.getUserFromRemote()
    } else {
      localStorageCtrl.getUser()
    }
  }
}

export default localStorageCtrl
