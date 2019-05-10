/**
 * Created by xuxin on 16/4/22.
 */

var type = function (o) {
  var s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

var typeArr = ['Null', 'Undefined', 'Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'RegExp', 'Element', 'NaN', 'Infinite']
typeArr.forEach(function (t) {
  Object['is' + t] = function (o) {
    return type(o) === t.toLowerCase()
  }
})

Object.isEmptyObject = function (obj) {
  let name
  for (name in obj) {
    if (obj.hasOwnProperty(name)) {
      return false
    }
  }
  return true
}

// 对象添加forEach函数
// fn this 为当前对象
// 两个参数  k, v
Object.forEach = function (obj, fn) {
  // 不是对象则返回
  if (!Object.isObject(obj)) return
  var keys = Object.keys(obj)
  if (keys.length) {
    keys.forEach(function (k) {
      fn.call(obj, k, obj[k])
    })
  }
}
