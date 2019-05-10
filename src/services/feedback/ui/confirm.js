/**
 * Created by xuxin on 2017/3/3.
 */
import Vue from "vue";
import confirm from "src/components/popbox/confirm.vue";

let ConfirmConstructor = Vue.extend(confirm);
let instance;

let Confirm = function(options) {
  Vue.prototype.$Bus.$on(["confirm", "pop"], function() {
    instance.visible = false;
  });
  let self = this;
  options = options || {};
  if (typeof options === "string") {
    options = {
      msg: options
    };
  }

  let cancel = options.onCancel;
  let confirm = options.onConfirm;
  options.onCancel = function() {
  };
  options.onConfirm = function() {
  };
  if (cancel) {
    options.onCancel = function() {
      instance.visible = false;
      cancel.call(self);
    };
  }

  if (confirm) {
    options.onConfirm = function() {
      instance.visible = false;
      confirm.call(self);
    };
  }

  if (!options.cancelText) {
    options.cancelText = "取消";
  }
  if (!options.confirmText) {
    options.confirmText = "确定";
  }

  if (!instance) {
    instance = new ConfirmConstructor();
    Object.assign(instance, options);
    // 文档外渲染生成$el
    instance.$mount();
    document.body.appendChild(instance.$el);
    instance.dom = instance.$el;
  } else {
    Object.keys(options).forEach(function(key) {
      if (instance[key]) {
        instance[key] = options[key];
      }
    });
  }
  instance.visible = true;
  return instance;
};

export default Confirm;
