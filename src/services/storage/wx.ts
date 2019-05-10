import { isObject } from "@/common/functions";

declare var wx: any;

const storage: mp.Storage = {
  getAllKeys() {
    try {
      const res = wx.getStorageInfoSync();
      console.log(res);
      return res;
    } catch (e) {
      // Do something when catch error
      console.warn(`storage.getAllKeys${e}`);
    }
  },

  set(key, value) {
    if (!key) {
      console.warn(`storage.set needs parameter`);
      return false;
    }
    try {
      if (isObject(key)) {
        Object.keys(key).forEach((item) => {
          this.set(item, key[item]);
        });
        this.checkMemory();
      } else {
        const data = this.get(key);
        if (data && typeof data === "string") {
          if (data.length + value.length > 1024 * 1024) {
            throw new Error(`${key}超出上限`);
          }
        }
        return wx.setStorageSync(key, value);
      }
    } catch (e) {
      console.warn(`storage.set${e}`);
    }
  },
  checkMemory() {
    const { currentSize } = this.getAllKeys();
    if (currentSize && currentSize > 1024 * 10) {
      throw new Error(`总量超出上限`);
    }
  },
  // 获取值，返回字符串
  get(key) {
    if (!key) {
      console.warn(`storage.get needs parameter`);
      return false;
    }
    try {
      const locStr = wx.getStorageSync(key);
      return locStr;
    } catch (e) {
      console.warn(`storage.set${e}`);
    }
  },
  // 支持字符串和数组
  remove(key) {
    try {
      if (typeof key === "string") {
        return wx.removeStorageSync(key);
      }
      key.forEach((item) => {
        wx.removeStorageSync(item);
      });
    } catch (e) {
      console.warn(`storage.remove${e}`);
    }
  },
  // 支持字符串和数组
  clear() {
    try {
      wx.clearStorageSync();
    } catch (e) {
      console.warn(`storage.remove${e}`);
    }
  }
};
export default storage;
