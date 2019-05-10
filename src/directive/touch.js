var touch = {},
  threshold = 30

var types = ['touchstart', 'touchmove', 'touchend']
function Swipe (node, opts) {
  this.node = node
  this.cb = opts.cb || function () {}
  this.type = opts.type
  this.threshold = opts.threshold || threshold
  this.bindEvent()
}

Swipe.prototype = {
  bindEvent: function () {
    var node = this.node,
      handle = this.handle,
      self = this
    types.forEach(function (type) {
      node.addEventListener(type, function (e) {
        handle.call(self, e)
      })
    })
  },
  handle: function (e) {
    switch (e.type) {
    case 'touchstart':
      this.record(e, 'start')
      break
    case 'touchmove':
      this.record(e, 'move')
      break
    case 'touchend':
      this.record(e, 'end')
    }
  },
  record: function (e, type) {
    // 双击事件
    if (this.start && type == 'start' && this.type == 'dbclick' && (e.timeStamp - this.start.d < 300)) {
      // 延迟多次点击的时间
      this.start = null
      this.cb()
      return
    }
    // end时没e，所以要用之前存的
    if (type == 'end') {
      this[type] = this.move || this.start
    } else {
      this[type] = {
        x: e.touches[0].pageX,
        y: e.touches[0].pageY,
        d: e.timeStamp
      }
    }
    this.render(type)
  },
  render: function (type) {
    if (type == 'start' || this.type == 'dbclick') return
    var myType = this.type
    var threshold = this.threshold
    // 移动
    if (myType == 'move' && type == 'move') {
      this.node.scrollLeft += this.start.x - this.move.x
      this.cb()
      return
    }
    // 结束事件
    if (type == 'end') {
      // 方向
      var dirX = this.end.x - this.start.x
      var dirY = this.end.y - this.start.y
      // swipe 距离, 大于阈值才能成功
      var disX = Math.abs(dirX) - threshold
      var disY = Math.abs(dirY) - threshold
      if (disX > 0 || disY > 0) {
        var state = (myType == 'swiperight' && dirX > 0) ||
          (myType == 'swipeleft' && dirX < 0) ||
          (myType == 'swipeup' && dirY < 0) ||
          (myType == 'swipedown' && dirY > 0)
        if (state) {
          this.cb()
        }
      }
    }
  }
}

// v-touch:swipeup.20="abc" 绑定 swipeup 事件 当滑动距离超过20px触发事件
// 支持4种事件
// swipeup swipedown swipeleft swiperight dbclick
// v-touch:menu就是menu内的元素inset的宽度超出menu宽度，inset随touchmove移动
touch.install = function (Vue) {
  Vue.directive('touch', {
    bind: function (el, binding) {
      var arg = binding.arg
      var type = arg == 'menu' ? 'move' : arg
      var reg = /\.([^.]*)/
      var threshold
      if (reg.test(binding.rawName)) {
        threshold = parseInt(RegExp.$1)
      }
      var mySwipe = new Swipe(el, {
        cb: binding.value,
        type: type,
        threshold: threshold
      })
    }
  })
}

export default touch
