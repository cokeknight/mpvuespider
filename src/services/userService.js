/**
 * Created by xuxin on 16/4/19.
 */
import Vue from "vue";
import localData from "localStorage";
import * as Api from "api";
import Conf from "config";
import { zhuge } from "zhuge";

const localUser = "userInfo";
const defaultAvatar = require("../assets/img/account/no_login_new.png");
// hm:默认User配置
const dafaultUser = {
  avatar: defaultAvatar
};
const parseIntObj = [
  "user_is_qfx",
  "uid_type",
  "is_active",
  "is_all",
  "is_binding_bank",
  "is_change_uname",
  "is_could_invest",
  "is_email_auth",
  "is_id_auth",
  "is_mobile_auth",
  "is_newbie",
  "is_passwd_recharge",
  "is_paypwd_edit",
  "is_paypwd_mobile_set",
  "is_recharged",
  "is_set_photo",
  "is_set_sqa",
  "isXinPartner"
];

// 设置全存管相关字段
function setOpenAllCg() {
  let user = userService.user;
  // 是否开启全面存管单帐户
  // wap端 || app端版本大于等于710 这时按user.open_all_cg
  // app低版本的强制设置未开通
  user.open_all_cg = Conf.open_all_cg = (!Conf.appVersion || Conf.appVersion >= 710) ? user.open_all_cg : false;
  // 是否显示全存管提示开启存管帐户
  Conf.show_cg_tip = user.open_all_cg && !user.is_zs;
}

// fzc: accountBalance/top_xhh_amount_view 已经没有应用场景,全局搜索过
// 之前有用主要用于一个单独的充值/提现页，已经已经删除
// 删除
let userService = {
  user: Object.assign({}, dafaultUser),
  setUser(obj) {
    // 只要是更新用户信息，就一定是登陆状态
    Conf.isLogin = true;
    Object.assign(this.user, {
      avatar: defaultAvatar
    }, this.parseIntFun(obj));
    this.user.avatar = this.user["ava"] && this.user["ava"]["url_s300"] ? this.user["ava"]["url_s300"] : this.user.avatar;
    Vue.set(this.user);
    localData.set(localUser, this.user);
    setOpenAllCg();
  },
  getUser(vm, cb) {
    this.getUserFromLocal();
    if (this.isInCache()) {
      cb && cb.call(vm, this.user);
    } else {
      // 防止localStorage被清空
      // 先判断是否登录,若登录则请求用户信息,否则不处理
      userService.getUserFromRemote(vm, cb);
    }
    return this.user;
  },
  getUserFromLocal() {
    if (!this.isInCache() && localData.get(localUser)) {
      this.user = localData.get(localUser);
      if (localData.get(localUser)) zhuge.userIdentify(localData.get(localUser));
      setOpenAllCg();
    }
    return this.user;
  },
  getUserFromRemote: function(vm, cb) {
    Api.getUserInfo.call(this, {
      resolve: function(json) {
        if (json.boolen) {
          userService.setUser(json.data);
          zhuge.userIdentify(json.data);
          cb && cb.call(vm, userService.user);
        }
      }
    });
  },
  init: function(isGetFromRemote) {
    if (isGetFromRemote) {
      userService.getUser();
    } else {
      userService.getUserFromLocal();
    }
  },
  isInCache() {
    return this.user.uid;
  },
  getAva() {
    return this.user.avatar;
  },
  setAva(val) {
    this.user.avatar = val;
    localData.set(localUser, this.user);
    return this.user.avatar;
  },
  getAttr(attr) {
    return this.user[attr];
  },
  setAttr(attr, val) {
    if (attr) {
      Vue.set(this.user, attr, val);
      localData.set(localUser, this.user);
    }
  },
  clear() {
    this.user = Object.assign({}, dafaultUser);
    localData.remove(localUser);
    // 重置状态
    setOpenAllCg();
  },
  parseIntFun(obj) {
    for (let item of parseIntObj) {
      if (obj[item]) {
        obj[item] = parseInt(obj[item]);
      }
    }
    return obj;
  }
};

export default userService;
