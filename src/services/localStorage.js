/**
 * Created by xuxin on 16/3/28.
 */
let localData = {
  // 取出localStorage所有的keys
  getAllKeys: function() {
    return Object.keys(window.localStorage);
  },
  // 设置成字符串 同时支持{}
  set: function(key, val) {
    if (!key) return;
    if (Object.isObject(key)) {
      Object.forEach(key, function(k, v) {
        parse(k, v);
      });
    } else {
      parse(key, val);
    }

    function parse(k, v) {
      // 转化为字符串
      v = JSON.stringify(v);
      // 保存到localStorage
      window.localStorage.setItem(k, v);
    }
  },
  // 获取值，返回字符串
  get: function(key) {
    if (!key) return;
    var locStr = window.localStorage.getItem(key);

    try {
      locStr = JSON.parse(locStr);
    } catch (e) {
    }

    return locStr;
  },
  // 清除localStorage
  // 支持字符串和数组
  remove: function(key) {
    if (!key) return;
    if (Object.isObject(key)) {
      Object.forEach(key, function(k, v) {
        window.localStorage.removeItem(key);
      });
      return;
    }
    window.localStorage.removeItem(key);
  }
};

export default localData;
