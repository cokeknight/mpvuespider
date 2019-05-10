/**
 * Created by xuxin on 16/8/6.
 */
// cookie相关操作
let cookie = {
  get: function(name, isJson) {
    let myCookie = document.cookie;
    let ref = "";
    if (myCookie.length > 0) {
      let reg = new RegExp("(?:^|;)\\s*" + name + "=" + "([^;]*)");
      ref = (myCookie.match(reg) || [])[1];
      if (ref) {
        ref = unescape(ref);
        if (isJson) {
          ref = JSON.parse(ref);
        }
      } else {
        ref = "";
      }
    }
    return ref;
  },
  // domain只有同一个主域名才可以设置。否则cookie设置失败
  set: function(name, value, domain, expiredays) {
    domain = domain ? ";domain=" + domain : "";
    expiredays = expiredays || "";
    if (expiredays) {
      let now = new Date();
      expiredays = new Date(Date.now() + expiredays * 24 * 60 * 60 * 1000).toGMTString();
      expiredays = ";expires=" + expiredays;
    }
    if (Object.isObject(value)) {
      value = JSON.stringify(value);
    }
    document.cookie = name + "=" + escape(value) + expiredays + domain + "; path=/";
  },
  // 删除cookie,空则为删除所有cookie
  // 支持string / []
  delete: function(name) {
    var isArray = Array.isArray(name);
    if (document.cookie) {
      var keys = document.cookie.match(/[^ =;]+(?==)/g);
      keys.forEach(function(k) {
        if (!name || isCurrentName(k)) {
          document.cookie = k + "=0;expires=" + new Date(0).toUTCString();
        }
      });
    }

    // 是不是当前name
    function isCurrentName(k) {
      var state = false;
      if (isArray) {
        name.forEach(function(k1) {
          if (k1 == k) {
            state = true;
          }
        });
      } else {
        if (name == k) {
          state = true;
        }
      }
      return state;
    }
  }
};

export default cookie;
