/**
 * Created by xuxin on 16/8/6.
 */
import '../constants/prototype'
import touchDirective from '../directive/touch'
import scrollViewDirective from '../directive/scrollView'
import { track } from 'track'
import { zhuge } from '../directive/zhuge'
import formValidateDirective from '../directive/formValidate'
import inputLimitDirective from '../directive/inputLimit'
import Api from '../services/api'
import turnDirective from '../directive/turn'
import setPayDirective from '../directive/setPay'
import clipboard from '../directive/clipboard'
import fixedBottom from '../directive/fixedBottom'
import allFilter from '../filters/all'
import myMixin from 'myMixin'
import Conf from 'config'

import Tip from '../services/ui/tip'
import Confirm from '../services/ui/confirm'
import Alert from '../services/ui/alert'
import Popbox from '../services/ui/popbox'
import Bus from 'bus'

// 全局组件
import globalComponent from './globalComponent.js'
if (Conf.isProduction) {
  require('../lib/iconfont/iconfont')
}

let pluginCtrl = {
  init (Vue) {
    // 指令
    // Vue.use(scrollDirective) // 触发滚动
    Vue.use(touchDirective) // touch
    Vue.use(scrollViewDirective) // 添加IScroll滚动条
    Vue.use(track) // 添加埋点指令
    Vue.use(zhuge) // 添加诸葛io
    Vue.use(formValidateDirective) // 表单验证
    Vue.use(inputLimitDirective) // input money/number 指令主要是解决iphone可以输入非数字的问题
    Vue.use(turnDirective) // 轮播
    Vue.use(setPayDirective) // 去设置支付密码
    Vue.use(clipboard) // 复制文本
    Vue.use(fixedBottom) // 解决底部固定的问题
    // 过滤器
    Vue.use(allFilter)

    // 混合，主要是取当前vue实例，用于iframe调用当前vm
    Vue.mixin(myMixin)

    // 全局组件
    globalComponent.install(Vue)

    Vue.prototype.$Tip = Tip
    Vue.prototype.$Confirm = Confirm
    Vue.prototype.$Alert = Alert
    Vue.prototype.$Popbox = Popbox
    Vue.prototype.$Bus = Bus
    Vue.prototype.$Api = Api
  }
}

export default pluginCtrl
