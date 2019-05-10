import { isObject } from "src/common/functions";

declare var window: any;

const storage: mp.Storage = {
  getAllKeys: function() {
    return {
      keys: Object.keys(window.localStorag)
    };
  },
  // 设置成字符串 同时支持{}
  set: function(key, val) {
    if (!key) return;
    if (!key) return;
    if (isObject(key)) {
      Object.keys(key).forEach(function(k, v) {
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
    let locStr = window.localStorage.getItem(key);
    if (locStr) {
      try {
        locStr = JSON.parse(locStr);
      } catch (e) {
        throw e;
      }
      return locStr;
    }
    return false;
  },
  // 清除localStorage
  // 支持字符串和数组
  remove: function(key) {
    if (!key) return;
    if (isObject(key)) {
      Object.keys(key).forEach(function(k, v) {
        window.localStorage.removeItem(key);
      });
      return;
    }
    window.localStorage.removeItem(key);
  },
  clear: () => {
  },
  checkMemory: () => {
  }
};
export default storage;
