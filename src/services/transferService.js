/**
 * Created by xuxin on 16/4/25.
 */
import localData from "localStorage";

let transferData = {};

// localStorage 下用 transfer-k 代替transferData 里的 k
var transferPre = "transfer-";
var transferService = {
  set: function(key, val) {
    if (Object.isObject(key)) {
      Object.forEach(key, function(k, v) {
        setItem(k, v);
      });
      return;
    }
    setItem(key, val);

    function setItem(k, v) {
      transferData[k] = v;
      localData.set(transferPre + k, v);
    }
  },
  get: function(key) {
    return transferData[key] || localData.get(transferPre + key);
  },
  remove: function(key) {
    if (!key) {
      // 删除数据
      if (!Object.isEmptyObject(transferData)) {
        Object.forEach(transferData, function(k, v) {
          localData.remove(transferPre + k);
        });
        // 如果对象是空的说明刷新过。要直接从本地删除
      } else {
        let keys = localData.getAllKeys();
        keys.forEach(function(k) {
          if (/^transfer-/.test(k)) {
            localData.remove(k);
          }
        });
      }
      transferData = {};
    } else if (Object.isArray(key)) {
      key.forEach(function(k) {
        transferService.remove(k);
      });
    } else {
      delete transferData[key];
      localData.remove(transferPre + key);
    }
  },
  init: function() {
    transferService.set(transferData);
  },
  clear: function() {
    transferService.remove();
  }
};

export default transferService;
