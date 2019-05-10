import MP from "MP";

/**
 * 提示与加载工具类
 */
class WxFeedback {
  static isLoading = false;
  static pause = false;

  /**
   * 弹出提示框
   */

  static success(title, duration = 500): any {
    wx.showToast({
      title: title,
      icon: "success",
      mask: true,
      duration: duration
    });

    if (duration > 0) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, duration);
      });
    }
  }

  /**
   * 弹出确认窗口
   */
  static modal(text, title = "提示") {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        showCancel: false,
        success: res => {
          resolve(res);
        },
        fail: res => {
          reject(res);
        }
      });
    }).catch(() => {
    });
  }

  /**
   * 弹出确认窗口
   */
  static confirm(text, payload = {}, title = "提示") {
    return new Promise((resolve, reject) => {
      wx.showModal({
        title: title,
        content: text,
        showCancel: true,
        success: res => {
          if (res.confirm) {
            resolve(payload);
          } else if (res.cancel) {
            reject(payload);
          }
        },
        fail: res => {
          reject(payload);
        }
      });
    }).catch(() => {
    });
  }

  static toast(title, onHide?: () => void, icon: "success" = "success") {
    wx.showToast({
      title: title,
      icon: icon,
      mask: true,
      duration: 500
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }

  /**
   * 警告框
   */
  static alert(title) {
    wx.showToast({
      title: title,
      image: "/images/icons/alert.png",
      mask: true,
      duration: 500
    });
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }

  /**
   * 错误框
   */

  static error(title, onHide) {
    wx.showToast({
      title: title,
      image: "/images/icons/error.png",
      mask: true,
      duration: 500
    });
    // 隐藏结束回调
    if (onHide) {
      setTimeout(() => {
        onHide();
      }, 500);
    }
  }

  /**
   * 弹出加载提示
   */
  static loading(title = "加载中") {
    if (this.isLoading) {
      return;
    }
    this.isLoading = true;
    if (wx.showLoading) {
      wx.showLoading({
        title: title,
        mask: true
      });
    } else {
      wx.showNavigationBarLoading({});
    }
  }

  /**
   * 加载完毕
   */
  static loaded() {
    if (this.isLoading) {
      this.isLoading = false;
      if (wx.hideLoading) {
        wx.hideLoading({});
      } else {
        wx.hideNavigationBarLoading({});
      }
    }
  }

  /**
   * 弹出下拉动作栏
   */
  static action(...items) {
    return new Promise((resolve, reject) => {
      wx.showActionSheet({
        itemList: items,
        success: function(res) {
          const result = {
            index: res.tapIndex,
            text: items[res.tapIndex]
          };
          resolve(result);
        },
        fail: function(res) {
          reject(res.errMsg);
        }
      });
    }).catch(() => {
    });
  }

  static actionWithFunc(items, ...functions) {
    wx.showActionSheet({
      itemList: items,
      success: function(res) {
        const index = res.tapIndex;
        if (index >= 0 && index < functions.length) {
          functions[index]();
        }
      }
    });
  }

  static share(title, url, desc) {
    return {
      title: title,
      path: url,
      desc: desc,
      success: function(res) {
        WxFeedback.toast("分享成功");
      }
    };
  }

  static setLoading() {
    this.isLoading = true;
  }
}

export default {
  // Tip: ({ msg }) =>  WxFeedback.toast(msg),
  // Confirm: ({ title, content: text, payload= {} }) =>  WxFeedback.confirm(text, payload, title),
  // Alert: ({ title }) =>  WxFeedback.alert(title),
  // Popbox: ({ title, content: text }) =>  WxFeedback.modal(text, title),
  Tip: (props) => {
    let options = props || {};
    if (typeof options === "string") {
      options = {
        msg: options
      };
    }
    MP.Bus.$emit("wx-tip", options);
  },
  Confirm: (props) => {
    MP.Bus.$emit("wx-confirm", props);
  },
  Alert: (props) => {
    MP.Bus.$emit("wx-alert", props);
  },
  Popbox: (props) => {
    MP.Bus.$emit("wx-popbox", props);
  },
  Loading: {
    show(flag) {
      if (flag === 'native') {
        WxFeedback.loading()
      } else {
        MP.Bus.$emit("wx-loading");
      }
    },
    hide(flag) {
      if (flag === 'native') {
        WxFeedback.loaded()
      } else {
        MP.Bus.$emit("wx-loading", false);
      }
    }
  },
  success: ({ title }) => WxFeedback.success(title),
  error: WxFeedback.error,
  loading: WxFeedback.loading,
  loaded: WxFeedback.loaded
};
