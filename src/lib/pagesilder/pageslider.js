var util = {
  bind: function (func, oThis) {
    if (typeof func !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('what is trying to be bound is not callable')
    }
    var aArgs = Array.prototype.slice.call(arguments, 1),
      fToBind = func,
      fNOP = function () {
      },
      fBound = function () {
        return fToBind.apply(func instanceof fNOP
          ? func
          : oThis || func,
        aArgs.concat(Array.prototype.slice.call(arguments)))
      }
    fNOP.prototype = func.prototype
    fBound.prototype = new fNOP()
    return fBound
  },
  getDate: function () {
    var d = new Date()
    return d.getTime()
  },
  trim: function (str) {
    var rBlank = /(^\s+)|(\s+$)/g
    return str.replace(rBlank, '')
  },
  hasClass: function (node, cls) {
    var clsn = node.className,
      rCls = new RegExp('(^|\\s+)' + cls + '(\\s+|$)', 'g')
    return rCls.test(clsn)
  },
  addClass: function (node, cls) {
    var clsn = node.className
    this.hasClass(node, cls) || (node.className = clsn + ' ' + cls)
  },
  removeClass: function (node, cls) {
    var clsn = node.className,
      rCls = new RegExp('(^|\\s+)' + cls + '(\\s+|$)', 'g')
    this.hasClass(node, cls) && (node.className = this.trim(clsn.replace(rCls, '$1$2')))
  },
  transformY: function (obj, val) {
    var x = val + 'px'
    obj.style.cssText = 'transform: translate3d(0px,' + x + ' , 0px);' + '-webkit-transform: translate3d(0px, ' + x + ' , 0px);' + '-moz-transform: translate3d(0px,' + x + ',0px)'
  },
  // Transforms
  transform: function (obj, transform) {
    var elStyle = obj.style
    obj.style.webkitTransform = obj.style.MsTransform = obj.style.msTransform = obj.style.MozTransform = obj.style.OTransform = elStyle.transform = transform
  },
  transition: function (obj, duration) {
    if (typeof duration !== 'string') {
      duration = duration + 'ms'
    }
    var elStyle = obj.style
    elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration
  }
}
var pageslider = function (opt) {
  this.obj = opt.obj
  this.initpageX = 0
  this.initpageY = 0
  this.pageX = 0
  this.pageY = 0
  this.transtionX = 0
  this.transtionY = 0
  this.lastPageY = 0
  this.inittime = 0
  this.isrunning = false
  this.isAnatimate = false
  this.pageIndex = 1
  this.totalHeight = this.obj.offsetHeight
  this.cutheight = opt.cutheight
  this.height = this.getClientHeight()
  this.pagemax = this.obj.children.length - 1
  this.init()
  this.bind()
}

pageslider.prototype.init = function () {
  // window.onscroll = function () {
  //   window.scrollTo(0, 0)
  //   return false
  // }
}
pageslider.prototype.destroy = function () {
  // window.onscroll = function () {}
  this.unbind()
}
pageslider.prototype.getClientHeight = function () {
  return document.documentElement.clientHeight - this.cutheight
}
pageslider.prototype.bind = function () {
  var touchdown = 'ontouchstart' in window ? 'touchstart' : 'mousedown',
    touchmove = 'ontouchmove' in window ? 'touchmove' : 'mousemove',
    touchup = 'ontouchend' in window ? 'touchend' : 'mouseup'
  this.obj.addEventListener(touchdown, util.bind(this.touchdown, this), false)
  this.obj.addEventListener(touchmove, util.bind(this.touchmove, this), false)
  this.obj.addEventListener(touchup, util.bind(this.touchup, this), false)
  this.obj.addEventListener('transitionend', util.bind(this.transitionend, this), false)
}
pageslider.prototype.unbind = function () {
  var touchdown = 'ontouchstart' in window ? 'touchstart' : 'mousedown',
    touchmove = 'ontouchmove' in window ? 'touchmove' : 'mousemove',
    touchup = 'ontouchend' in window ? 'touchend' : 'mouseup'
  this.obj.removeEventListener(touchdown, util.bind(this.touchdown, this), false)
  this.obj.removeEventListener(touchmove, util.bind(this.touchmove, this), false)
  this.obj.removeEventListener(touchup, util.bind(this.touchup, this), false)
  this.obj.removeEventListener('transitionend', util.bind(this.transitionend, this), false)
}
pageslider.prototype.touchdown = function (othis, e) {
  this.transitionend()
  if (this.isrunning == true) {
    return
  }
  if (this.isAnatimate == true) {
    return
  }
  this.inittime = util.getDate()
  this.initpageY = e.changedTouches[0].pageY
  this.isrunning = true
}
pageslider.prototype.touchmove = function (othis, e) {
  if (this.isAnatimate == true) {
    return
  }
  if (this.isrunning == false) {
    return
  }
  var pageY = e.changedTouches[0].pageY
  var startTranslate = this.lastPageY
  var diff = pageY - this.initpageY
  var currentTranslate = diff + startTranslate
  var max = -this.pagemax * this.height
  if ((diff > 0 && currentTranslate > 0)) {
    currentTranslate = 0 - 1 + Math.pow(-0 + startTranslate + diff, 0.85)
  } else if (diff < 0 && currentTranslate < max) {
    currentTranslate = max + 1 - Math.pow(max - startTranslate - diff, 0.85)
  }
  this.transtionY = currentTranslate
  util.transform(this.obj, 'translate3d(0px, ' + this.transtionY + 'px, 0px)')
}
pageslider.prototype.touchup = function (othis, e) {
  if (this.isAnatimate == true) {
    return
  }
  if (this.isrunning == false) {
    return
  }
  var pageY = e.changedTouches[0].pageY
  this.isAnatimate = true
  this.lastPageY = this.transtionY
  var topPianyi = this.lastPageY % this.height
  var lasttime = util.getDate()
  var duration = lasttime - this.inittime
  var sudu = Math.abs((this.transtionY / (lasttime - this.inittime)) * 1000)
  var direction = pageY - this.initpageY
  if (direction > 0) {
    direction = 'S'
  } else {
    direction = 'D'
  }
  var newheight = this.getClientHeight()
  if (newheight != this.height) {
    this.height = newheight
    var lists = document.querySelectorAll('.page-slider-item')
    for (var i = 0; i < lists.length; i++) {
      lists[i].style.height = this.height + 'px'
    }
  }
  if (direction == 'S') {
    if (sudu > 200 && duration < 500) {
      this.slideUp()
    } else {
      this.slideUpBack()
    }
  } else if (direction == 'D') {
    if (this.pageIndex == (this.pagemax + 1)) {
      this.slidePageBack()
      return
    }
    if (sudu > 200 && duration < 500) {
      this.slidePage()
    } else {
      this.slidePageBack()
    }
  }
}
pageslider.prototype.transitionend = function (othis, e) {
  util.transition(this.obj, 0)
  this.isAnatimate = false
  this.isrunning = false
}
pageslider.prototype.slidePage = function () {
  this.pageIndex++
  var newps = -(this.pageIndex - 1) * this.height
  util.transform(this.obj, 'translate3d(0px, ' + newps + 'px, 0px)')
  util.transition(this.obj, 200)
  this.lastPageY = newps
}
pageslider.prototype.slidePageBack = function () {
  var newps = -(this.pageIndex - 1) * this.height
  util.transform(this.obj, 'translate3d(0px, ' + newps + 'px, 0px)')
  util.transition(this.obj, 300)
  this.lastPageY = newps
}
pageslider.prototype.slideUp = function () {
  this.pageIndex--
  if (this.pageIndex < 1) {
    this.pageIndex = 1
  }
  var newps = -(this.pageIndex - 1) * this.height
  util.transform(this.obj, 'translate3d(0px, ' + newps + 'px, 0px)')
  util.transition(this.obj, 200)
  this.lastPageY = newps
}
pageslider.prototype.slideUpBack = function () {
  var newps = -(this.pageIndex - 1) * this.height
  // util.addClass(this.obj, 'slideSlow')
  util.transform(this.obj, 'translate3d(0px, ' + newps + 'px, 0px)')
  util.transition(this.obj, 300)
  this.lastPageY = newps
}
export default pageslider
