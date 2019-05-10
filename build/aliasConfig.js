/**
 * Created by xuxin on 16/6/29.
 */
var path = require('path')

// 获取绝对路径
function getAbsolutePath (addr) {
  if (!/\/src\//.test(addr)) {
    addr = '../src/' + addr
  }
  return path.resolve(__dirname, addr)
}
function getAlternative (path) {
  if (process.env.PLATFORM === 'wx') {
    return getAbsolutePath('components/empty.vue')
  }
  return path
}
module.exports = {
  'src': path.resolve(__dirname, '../src'),
  // '@': path.resolve(__dirname, '../src'),
  'MP': path.resolve(__dirname, '../src/services/MP.ts'),
  // components 下各类组件
  'layout': getAbsolutePath('cssModules/layout/index.vue'),
  'downloadbanner': getAbsolutePath('components/fragment/downloadbanner.vue'),
  'qrcodefooter': getAbsolutePath('components/fragment/qrcodefooter.vue'),
  'pullup': getAlternative(getAbsolutePath('components/pullup/'+ process.env.PLATFORM +'.vue')),
  'countdown': getAbsolutePath('components/fragment/countdown.vue'),
  'loading': getAbsolutePath('components/loading/index.vue'),
  'upload': getAbsolutePath('components/upload/upload.'+ process.env.PLATFORM +'.vue'),
  'xButton': getAbsolutePath('components/button/xButton.vue'),
  'iframeM': getAbsolutePath('components/iframe/index.vue'),

  'waveCircle': getAbsolutePath('components/fragment/waveCircle.vue'),
  'investBtn': getAbsolutePath('components/invest/investBtn.vue'),
  'investList': getAbsolutePath('components/invest/investList.vue'),
  'DynamicCode': getAbsolutePath('components/fragment/dynamicCode.vue'),

  'sixPassword': getAbsolutePath('components/keyboard/sixPassword.vue'),
  'password': getAbsolutePath('components/keyboard/password.vue'),
  'moneyKeyboard': getAbsolutePath('components/keyboard/money.vue'),
  'moneyKeyboard2': getAbsolutePath('components/keyboard/money2.vue'),

  'actionsheet': getAbsolutePath('components/actionsheet/index.vue'),
  'bankSheet': getAbsolutePath('components/actionsheet/bankSheet.vue'),

  'filterbox': getAbsolutePath('components/filterbox/index.vue'),
  'popbox': getAbsolutePath('components/popbox/index.vue'),
  'confirm': getAbsolutePath('components/popbox/confirm.vue'),
  'alert': getAbsolutePath('components/popbox/alert.vue'),
  'share': getAbsolutePath('components/popbox/share.vue'),
  'tip': getAbsolutePath('components/tip/index.vue'),
  'swiper': getAbsolutePath('components/swiper/index.vue'),
  'easySwiper': getAbsolutePath('components/swiper/easySwiper.vue'),
  'vueSwiper': getAbsolutePath('components/swiper/vue-swiper.vue'),
  'scrollView': getAbsolutePath('components/scrollView/index.vue'),
  'titlebar': getAbsolutePath('components/titlebar/' + process.env.PLATFORM + '.vue'),
  'dailyPicker': getAbsolutePath('cssModules/public/dailyPicker/index.' + process.env.PLATFORM + '.vue'),
  'cell': getAbsolutePath('components/fragment/cell.vue'),
  'cellNew': getAbsolutePath('components/fragment/cellNew.vue'),
  'footer': getAbsolutePath('components/fragment/footer.vue'),
  'question': getAbsolutePath('components/question/question.vue'),
  'questionItem': getAbsolutePath('components/question/questionItem.vue'),
  'questionDown': getAbsolutePath('components/question/questionDown.vue'),

  'searchbox': getAbsolutePath('components/searchbox/index.vue'),
  'groupSheet': getAbsolutePath('components/sheet/group.vue'),
  'sheet': getAbsolutePath('components/sheet/index.vue'),
  'inputCode': getAbsolutePath('components/input/inputCode.vue'),
  'inputX': getAbsolutePath('components/input/inputX.vue'),
  'inputNolabel': getAbsolutePath('components/input/inputNolabel'),
  'inputSwitch': getAbsolutePath('components/input/inputSwitch'),
  'geetest': getAbsolutePath('components/geetest/index'),
  'swiper': getAbsolutePath('components/swiper/vue-swiper.vue'),
  // 以后尽量用这个
  'inputM': getAbsolutePath('components/input/inputM.' + process.env.PLATFORM + '.vue'),

  'pageSlider': getAbsolutePath('components/pageSlider/index.vue'),
  'pageSliderItem': getAbsolutePath('components/pageSlider/pageSliderItem.vue'),
  // tab
  'tab': getAbsolutePath('components/tab/index.vue'),
  // upDrag
  'upDrag': getAbsolutePath('components/upDrag/index.vue'),
  // agree
  'agree': getAbsolutePath('components/agree/index.vue'),
  // canvas
  'caliper': getAbsolutePath('components/canvas/caliper/index.vue'),

  'registerGift': getAbsolutePath('components/register/registerGift.vue'),
  // 日历插件
  'datepicker': getAbsolutePath('components/datepicker/index.vue'),
  'datepickerTouch': getAbsolutePath('components/datepicker/datepicker.vue'),
  // scrollTop
  'scrollTop': getAbsolutePath('components/scroll/scrollTop.vue'),
  'fixButton': getAbsolutePath('components/scroll/fixButton.vue'),
  // constants
  'config': getAbsolutePath('constants/config.js'),
  'ApiMap': getAbsolutePath('constants/config.api.js'),
  'myMixin': getAbsolutePath('constants/myMixin.js'),
  'myInvestMixin': getAbsolutePath('constants/investCommonMix.js'),
  'message': getAbsolutePath('constants/message.js'),
  'urlService': getAbsolutePath('constants/url.' + process.env.PLATFORM + '.js'),

  // common,utils
  'page': getAbsolutePath('common/page.js'),
  'functions': getAbsolutePath('common/functions.js'),
  'interaction': getAbsolutePath('common/interaction.js'),
  'dom': getAbsolutePath('common/dom.js'),
  'regexp': getAbsolutePath('common/regexp.js'),
  'touch': getAbsolutePath('common/touch.js'),

  // services
  'api': getAbsolutePath('services/api.ts'),
  'localStorage': getAbsolutePath('services/localStorage.js'),
  'transferService': getAbsolutePath('services/transferService.js'),
  'userService': getAbsolutePath('services/userService.js'),
  'formService': getAbsolutePath('services/formService.js'),
  'cookie': getAbsolutePath('services/cookie.js'),
  'Api2': getAbsolutePath('services/api2.js'),
  'storage': getAbsolutePath('services/storage/' + process.env.PLATFORM + '.ts'),
  // store
  'mutationTypes': getAbsolutePath('store/mutation-types.js'),

  // filters
  'prettyBytes': getAbsolutePath('filters/vue.pretty-bytes.js'),

  // controllers
  'localStorageCtrl': getAbsolutePath('controllers/localStorageCtrl.js'),

  // directive
  'formValidate': getAbsolutePath('directive/formValidate.js'),
  'inputLimit': getAbsolutePath('directive/inputLimit.js'),
  'track': getAbsolutePath('directive/track/' + process.env.PLATFORM + '.js'),
  'zhuge': getAbsolutePath('directive/zhuge.js'),
  // 其它 lib 里的东西
  'md5': getAbsolutePath('lib/md5.min.js'),
  // 中介vue实例
  'bus': getAbsolutePath('services/bus.js'),
  // 过滤函数
  'filtersMap': getAbsolutePath('filters/filtersMap.js')
}
