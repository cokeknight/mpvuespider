/* istanbul ignore next */

import Vue from 'vue'
const isWx = mpvuePlatform != 'h5'
const isServer = Vue.prototype.$isServer
const SPECIAL_CHARS_REGEXP = /([:\-_]+(.))/g
const MOZ_HACK_REGEXP = /^moz([A-Z])/
const ieVersion = mpvuePlatform === 'h5' ? (isServer ? 0 : Number(document.documentMode)) : 0

/* istanbul ignore next */
const trim = function (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}
/* istanbul ignore next */
const camelCase = function (name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function (_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter
  }).replace(MOZ_HACK_REGEXP, 'Moz$1')
}
export const trimStr = (str) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
/* istanbul ignore next */
export const on = isWx ? noop : (function () {
  if (!isServer && document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const off = isWx ? noop : (function () {
  if (!isServer && document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/* istanbul ignore next */
export const once = function (el, event, fn) {
  var listener = function () {
    if (fn) {
      fn.apply(this, arguments)
    }
    off(el, event, listener)
  }
  on(el, event, listener)
}

/* istanbul ignore next */
export function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

/* istanbul ignore next */
export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName
      }
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

/* istanbul ignore next */
export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ')
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}

/* istanbul ignore next */
export const getStyle = ieVersion < 9 ? function (element, styleName) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'styleFloat'
  }
  try {
    switch (styleName) {
    case 'opacity':
      try {
        return element.filters.item('alpha').opacity / 100
      } catch (e) {
        return 1.0
      }
    default:
      return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null)
    }
  } catch (e) {
    return element.style[styleName]
  }
} : function (element, styleName) {
  if (isServer) return
  if (!element || !styleName) return null
  styleName = camelCase(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '')
    return element.style[styleName] || computed ? computed[styleName] : null
  } catch (e) {
    return element.style[styleName]
  }
}

/* istanbul ignore next */
export function setStyle (element, styleName, value) {
  if (!element || !styleName) return

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop])
      }
    }
  } else {
    styleName = camelCase(styleName)
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')'
    } else {
      element.style[styleName] = value
    }
  }
}
// fzc: inputlimit里有改变input值的时候有用到
export function trigger (el, type) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(type, true, true)
  el.dispatchEvent(e)
}
// closest：同jquery-closest E:closest(e.target, 'a')
export function closest (el, selector) {
  var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.matchesSelector || el.oMatchesSelector
  while (el) {
    if (matchesSelector.call(el, selector)) {
      break
    }
    el = el.parentElement
  }
  return el
}
// hm:后面方法是从7q复制过来的
export function setStyleText (elem, str) {
  elem.style.cssText = str
}
export function getStyleText (elem, str) {
  return elem.style.cssText
}
// 绑定事件
export function bind (elem, event, handler, type) {
  if (!(elem && event && handler)) return
  type = !!type
  elem = querySelector(elem)
  // fzc 测试发现给body加scroll事件没效果
  if (elem.tagName && elem.tagName.toLowerCase() === 'body' && event === 'scroll') {
    elem = window
  }
  elem.addEventListener(event, handler, type)
}
// 解绑
export function unbind (elem, event, handler, type) {
  if (!(elem && event && handler)) return
  type = !!type
  elem = querySelector(elem)
  // fzc 测试发现给body加scroll事件没效果
  if (elem.tagName && elem.tagName.toLowerCase() === 'body' && event === 'scroll') {
    elem = window
  }
  elem.removeEventListener(event, handler, type)
}
// 取iscroll节点
export function getIScrollNode () {
  return querySelector('.myWrap.active .scroll-inner,.myWrap.v-enter-active .scroll-inner')
}
// 取滑动元素, 有可能是自定义元素也可能是body
export function getScroller () {
  //  有时在刚过来的时候还没加上.active，这时他会有个默认的.v-enter-active,这样可以准确取得当前的scroller
  return getIScrollNode() || querySelector('body')
}
// 取元素, 如果是('.a,.b')不要用原生的，此函数可以保证他的前后顺序
// 原生找到第一个满足条件的元素，不管参数的顺序
// 原生查找逻辑:
// 1. 由外到内
// 2. 由上到下，
export function querySelector (elem) {
  let ref
  if (isString(elem)) {
    let arr = elem.split(',')
    // 以空格为分隔符，如果数据大于1说明是多个中选一个
    // 按先后顺序取node
    if (arr.length > 1) {
      arr.forEach(node => {
        if (!ref) {
          ref = querySelector(node)
        }
      })
    }
  } else if (elem.window === window) {
    ref = elem
  }
  return elem.nodeType ? elem : (ref || document.querySelector(elem))
}

// 数据类型, 返回他的数据类型
export function isType (obj) {
  var s = Object.prototype.toString.call(obj)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

// 是否对象类型
export function isObject (o) {
  return isType(o) === 'object'
}

// 是否字符串类型
export function isString (o) {
  return isType(o) === 'string'
}

// 是否布尔类型
export function isBoolean (o) {
  return isType(o) === 'boolean'
}

// 是否number类型
export function isNumber (o) {
  return isType(o) === 'number'
}

// 是否function类型
export function isFunction (o) {
  return isType(o) === 'function'
}

// 是否数组类型
export function isArray (o) {
  return Array.isArray(o)
}

// 是否空对象
export function isEmptyObject (obj) {
  let name
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}
// 默认空函数
export function noop () {
}
