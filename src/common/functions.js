/**
 * Created by xuxin on 16/3/24.
 */
import Conf from 'config'
import Vue from 'vue'
import Bus from 'bus'
import MP from 'MP'
let headerConf = Conf.header
let loadingConf = Conf.loading
let footerConf = Conf.footer
const tabRouterMap = ['/account/index','/message/index','/launch/index']
const topRouterMap = ['/loveCar/index']
// ajax请求触发loading, 页面切换触发loading, 分情况记录
let loading = {
  count: 0,
  pageChange: false,
  show (change) {
    // app过来的第一个页面，不让显示遮罩，防止与app的重叠
    if (Conf.isFirstApp) return
    if (change) {
      this.pageChange = true
    }
    this.count++
    loadingConf.show = true
  },
  hide (change) {
    if (Conf.isFirstApp) return
    if (change) {
      this.pageChange = false
    }
    this.count--
    if (this.count <= 0 && !this.pageChange) {
      this.count = 0
      loadingConf.show = false
    }
  }
}

let functions = {}
functions = {
  isHTTP: function(url){
    return /^https?:\/\/.+/.test(url)
  },
  // 关闭弹出框
  closePop: function () {
    Bus.$emit('pop')
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  formatTime(timestamp) {
    let date = timestamp
    if (typeof date !== 'object') {
      date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    }
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(this.formatNumber).join('/') + ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },
  formatDate(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('-')
  },
  timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '/';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  },
  timestampToTimeftdian(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '.';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();
    return Y+M+D+h+m+s;
  },
  // 非了一般功能还有可以匹配对象
  // eg: {name: 1}indexOf[{name: 2}, {name: 1}] 返回1
  indexOf: function (obj, arr) {
    if (!arr) return
    if (!Object.isObject(obj)) {
      return arr.indexOf(obj)
    } else {
      let keys = Object.keys(obj),
        index = -1
      arr.forEach(function (item, count) {
        if (index != -1) return
        let isHas = true
        keys.forEach(function (k) {
          if (index != -1 || !isHas) return
          if (obj[k] !== item[k]) {
            isHas = false
          }
        })
        if (isHas) {
          index = count
        }
      })
      return index
    }
  },
  setHeader (title) {
    headerConf.title = title || Conf.chinese.title
  },
  showFooter () {
    footerConf.show = true
  },
  hideFooter () {
    footerConf.show = false
  },
  isShowFooter (name) {
    let arr = Conf.footerCanSee
    return arr[name] !== undefined
  },
  resetPop () {
    // toast.hide()
    // alert.hide()
    loading.hide()
    // confirm.hide()
  },
  closeFirstLoading () {
    let loading = document.getElementById('loading')
    if (loading) {
      loading.parentNode.removeChild(loading)
      document.getElementById('wrap').style.display = 'block'
    }
  },
  // 获取url里的search字段，返回一个json
  getQuery () {
    let href = window.location.href
    if (href.indexOf('?') === -1) return {}
    href = href.substring(href.indexOf('?'), href.indexOf('#') > 0 ?  href.indexOf('#') :  href.length)
    let search = (href.match(/\?([^?]+)$/) || [])[1]
    let map = null
    if (search) {
      // 反向解析url格式
      search = decodeURI(search)
      map = {}
      search.replace(/([^&=\s]*)\s*=\s*([^&=\s]*)/g, function (all, a, b) {
        map[a] = b
      })
    }
    return map
  },
  goHref(goUrl){
    if (mpvuePlatform === 'h5') {
      window.location.href=goUrl;
    } else {
      wx.navigateTo({
        url: '/pages/webview/index?url='+ goUrl
      })

    }
  },
  reLaunchLoop(url,callback){
    setTimeout(()=>{
      wx.reLaunch({
        url,
        fail: ()=>{
          console.log('reLaunch')
          this.reLaunchLoop(url)
        },
        success: function(){
          callback()
        }
      }),
      200})
  },
  goNoBack(router, callback){
    let currenRouter = router
    if (currenRouter.charAt(0) !== '/') {
      currenRouter = '/' + currenRouter
    }
    if (mpvuePlatform === 'h5') {
      if (MP.wap.vm) {
        MP.wap.vm.$router.push(currenRouter)
      }
    } else {
      const currenWXPage = getCurrentPageUrl()
      let router = currenRouter
      let search = ''

      if (currenWXPage === `/pages${currenRouter}`) return false
      if (currenRouter.indexOf('?') !== -1) {
        const href = currenRouter.split('?')
        router = href[0]
        search = '?' + href[1]
      }
      if (tabRouterMap.includes(currenRouter)) {
        this.reLaunchLoop(`/pages${router}`,callback)
      } else {
        if (topRouterMap.includes(currenRouter)) {
          this.reLaunchLoop( `/pages${router}${search}`,callback)
        }else{
          this.reLaunchLoop(`/pages${router}/index${search}`,callback)
        }
      }
    }


  },
  // 1,333,112 ==> 1333112
  moneyToDigit (v) {
    return parseFloat(v.toString().replace(/,/g, ''))
  },
  // 1333112(.00) ==>  1,333,112(.00)
  digitToMoney (v) {
    return v.toString().replace(/(\d)(?=(\d{3})+(\.\d{2}|$))/g, '$1,')
  },
  isWeixin () {
    return window.navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1
  },
  openapp (paramsStr) {
    // var paramIndex = window.location.href.indexOf('?')
    // var paramsStr = paramIndex !== -1 ? window.location.href.slice(paramIndex) : false
    var appUrl = 'xhh://xhh.app'

    if (paramsStr) {
      appUrl = appUrl + '/openwith' + paramsStr
    }

    var appInfo = {
      appUrl: appUrl, // 打开APP客户端链接
      downloadUrl: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yrz.atourong' // 下载客户端或者去App Store的链接
    }

    var t1 = new Date().getTime()

    iframe2open()
    jump2download()

    // 利用iframe打开客户端
    function iframe2open () {
      let u = navigator.userAgent
      let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      let src = appInfo.appUrl
      if (isiOS) {
        window.location = src
        window.location = src
      } else {
        let iframe = document.createElement('iframe')
        iframe.src = src
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
    }

    // 跳转下载页面
    function jump2download () {
      var _timer = null

      clearTimeout(_timer)
      _timer = setTimeout(function () {
        var t2 = new Date().getTime()

        if (t2 - t1 <= 600) {
          window.location = appInfo.downloadUrl
        }
      }, 400)
    }
  },
  // 操作scrollTop组件
  scrollTopChange (y) {
    let name = window.WAP.vm.$route.name
    // 当前路由name在config-scrollTopList配置中才会进行展示判断
    if (Conf.scrollTopList.indexOf(name) !== -1) {
      if (!Conf.scrollTopState.bool && y < 0) {
        // 没显示的状态，去显示
        Conf.scrollTopState.bool = true
      } else if (Conf.scrollTopState.bool && y >= 0) {
        Conf.scrollTopState.bool = false
      }
    }
  },
  // 把数字转为带千字符的
  toThousands (nums = '') {
    var num = nums && nums.toString(), result = '', decimal = ''
    // 先判断是否是带小数的
    if (~num.indexOf('.')) {
      decimal = num.substr(num.indexOf('.'))
      num = num.substr(0, num.indexOf('.'))
    }
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result
      num = num.slice(0, num.length - 3)
    }
    if (num) result = num + result
    return result + decimal
  },
  trigger (event, dom) {
    var e = document.createEvent('MouseEvents')
    e.initEvent(event, true, true)
    dom.dispatchEvent(e)
  },
  // 密码强度
  getPasswordStrength (str, callback) {
    // 会处理掉特殊字符 所以不一致的时候就是有特殊字符
    function checkName (val) {
      var reg = new RegExp("[`~!@#$^&*()=|{}'-:;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      var rs = ''
      for (var i = 0, l = val.length; i < val.length; i++) {
        if (LETTER.test(val.substr(i, 1)) || indexNUMBER.test(val.substr(i, 1))) {
          rs = rs + val.substr(i, 1)
        } else {
          rs = rs + val.substr(i, 1).replace(reg, '')
        }
      }
      return rs !== val
    }
    var commonWord = ['123456', 'admin', 'admin1', 'admin12', 'admin123']
    var SPECIAL = /[^a-zA-Z0-9]/,
      NUMBER = /^[0-9]\d*$/, // 纯数字
      LETTER = /^[A-Za-z]+$/, // 纯字母
      indexNUMBER = /\d+/, // 含数字
      indexLETTER = /[a-z]/i // 含字母
    if (str.length < 6) {
      return 0
    }
    // 弱
    // 密码是commonWord里面三种时候是弱、字符串用同一个字符构造是弱（同一数字、同一字母）
    if (commonWord.indexOf(str) >= 0 || ((str.split(str.substring(0, 1))).length - 1) == str.length) {
      return 0
    }
    // 中
    let rate = 0
    // 纯数字或字母 长度大于等于8是中级
    if (NUMBER.test(str) || LETTER.test(str)) {
      if (str.length >= 8) rate = 1
      return rate
    }
    // 两种组合>=6 <8 中级
    // 数字-字母 数字-特殊 字母-特殊
    if ((indexNUMBER.test(str) && indexLETTER.test(str)) || (indexNUMBER.test(str) && checkName(str)) || (indexLETTER.test(str) && checkName(str))) {
      if (str.length >= 6 && str.length < 8) rate = 1
      if (str.length >= 8) {
        rate = 2
        return rate
      }
    }
    // 强
    if (indexNUMBER.test(str) && indexLETTER.test(str) && checkName(str) && str.length > 6) {
      rate = 2
      return rate
    }
    return rate
  },
  tempFudaiJifenShowText (level) {
    let gdjf = 0 // 固定积分
    let fbk = 0 // 翻倍卡倍率
    switch (level) {
    case 0:
      fbk = 2
      break
    case 1:
      gdjf = 600
      fbk = 3
      break
    case 2:
      gdjf = 700
      fbk = 4
      break
    case 3:
      gdjf = 800
      fbk = 5
      break
    case 4:
      gdjf = 900
      fbk = 6
      break
    case 5:
      gdjf = 1000
      fbk = 7
      break
    default:
    }
    return `${gdjf > 0 ? gdjf + '积分+' : ''}领取后的首笔出借可获${fbk}倍积分，当月有效`
  }
}

let XUI = {
  Loading: loading
}

Vue.XUI = XUI
Vue.XUtils = functions

export const UrlParse = {
  // param {x:1,y:2}
  getSearchQuery(param) {
    const searchQuery = Object.keys(param).reduce(function(accumulator, item){
      if (param[item]){
        accumulator.push(`${item}=${param[item]}`);

      }
      return accumulator
    }, [])
    return searchQuery.join('&');
  },
  extendQuery(oldQuery, newQuery) {
    if (typeof oldQuery === 'string') {
      oldQuery = oldQuery.split('&').reduce((accumulator, currentValue) => {
        const temp = currentValue.split('=');
        accumulator[temp[0]] = temp[1];
        return accumulator;
      }, {});
    }
    return Object.assign({}, oldQuery, newQuery);
  },
  addQuery(path, param, replace = false) {
    const patharr = path.split('?');
    let realPath = patharr[0];
    let searchQuery = patharr[1];
    if (replace || !searchQuery) {
      searchQuery = this.getSearchQuery(param);
    } else {
      searchQuery = this.getSearchQuery(this.extendQuery(searchQuery, param));
    }
    return realPath += `?${searchQuery}`;
  },
  replaceQuery(path, param) {
    return this.addQuery(path, param, true);
  },
};
export const loadScript = function (url, cb) {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;
  script.onload = function () {
    cb && cb()
  }
  document.body.appendChild(script);
}
export { XUI, functions }
export function getCurrentPageUrl() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = `/${currentPage.route}`
  return url
}
export function getCurrentPageUrlWhenUnload() {
  const pages = getCurrentPages()    //获取加载的页面
  const currentPage = pages[pages.length-2]    //获取当前页面的对象
  const url = currentPage.route    //当前页面url
  return url
}
export function getCurrentPageParameter() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage) {
    const options = currentPage.options
    return options
  }
  return {}
}

export function getCurrentPageUrlWithArgs() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const url = currentPage.route
  const options = currentPage.options
  let urlWithArgs = `/${url}?`
  for (let key in options) {
    const value = options[key]
    urlWithArgs += `${key}=${value}&`
  }
  urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
  return urlWithArgs
}
export function getPreiviousRoutename(){
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 2]
  const url = currentPage.route
  return url
}


function delayFuncInTimes(times){
  var flag = true
  return function(callback){
    if (flag) {
      callback()
    }
    flag = false
    setTimeout(function(){
      flag = true
    }, times)
  }
}


// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

// 格式化时间戳
export function FmtDate(obj) {
  const d = new Date(obj * 1000)    //根据时间戳生成的时间对象
  return d .Format("yyyy-MM-dd hh:mm");
  // return `${
  //   d.getMonth() + 1}-${
  //   d.getDate()} ${
  //   d.getHours()}:${
  //   d.getMinutes()}`
}

// 格式化时间戳
export function FmtDateRe(obj) {
  const d = new Date(obj * 1000)    //根据时间戳生成的时间对象
  return `${
    d.getMonth() + 1}-${
    d.getDate()} ${
    d.getHours()}:${
    d.getMinutes()}`
}

export const delayFuncIn1000 = delayFuncInTimes(1000)
export function goRouter (router, type){
  let currenRouter = router
  if (mpvuePlatform === 'h5' && functions.isHTTP(currenRouter)) {
    window.location.href = currenRouter;
    return;
  }
  if (currenRouter.charAt(0) !== '/') {
    currenRouter = '/' + currenRouter
  }
  const isRedirectTo = type === 'redirectTo'
  if (mpvuePlatform === 'h5') {
    if (MP.wap.vm) {
      MP.wap.vm.$router.push(currenRouter)
    }
  } else {
    const currenWXPage = getCurrentPageUrl()
    MP.wxPreiviousRoutename = currenRouter
    let router = currenRouter
    let search = ''

    if (currenWXPage === `/pages${currenRouter}`) return false
    if (currenRouter.indexOf('?') !== -1) {
      const href = currenRouter.split('?')
      router = href[0]
      search = '?' + href[1]
    }
    if (tabRouterMap.includes(currenRouter)) {
      wx.switchTab({
        url: `/pages${router}`
      })
    } else {
      if (topRouterMap.includes(currenRouter)) {
        wx[isRedirectTo? 'redirectTo': 'navigateTo']({
          url: `/pages${router}${search}`
        })
      }else{
        wx[isRedirectTo? 'redirectTo': 'navigateTo']({
          url: `/pages${router}/index${search}`,
          fail: function(error){
            console.warn(error)
          }
        })
      }
    }
  }
}
export function isType(obj) {
  const s = Object.prototype.toString.call(obj)
  const match = s.match(/\[object (.*?)\]/)
  if (match) {
    return match[1].toLowerCase()
  }
}
export function isObject(o) {
  return isType(o) === 'object'
}
export function isString(o) {
  return isType(o) === 'string'
}
export function isBoolean(o) {
  return isType(o) === 'boolean'
}
export function isNumber(o) {
  return isType(o) === 'number'
}
export function isFunction(o) {
  return isType(o) === 'function'
}
export function isArray(o) {
  return Array.isArray(o)
}
export function isEmptyObject(obj) {
  let name
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}
