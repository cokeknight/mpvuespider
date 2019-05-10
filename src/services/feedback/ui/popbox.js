/**
 * Created by xuxin on 2017/3/3.
 */
import Vue from "vue";

let PopConstructor = Vue.extend(require("src/components/popbox/zxjhPopbox.vue").default);

let instance;

let Popbox = function(options) {
  Vue.prototype.$Bus.$on(["alert", "pop"], function() {
    instance.visible = false;
  });
  let self = this;
  options = options || {};
  if (typeof options === "string") {
    options = {
      msg: options
    };
  }

  let confirm = options.onConfirm;
  options.onConfirm = function() {
  };
  options.onMask = function() {
  };
  if (confirm) {
    options.onConfirm = function() {
      instance.visible = false;
      confirm.call(self);
    };
  }

  let onMask = options.onMask;

  if (onMask) {
    options.onMask = function() {
      instance.visible = false;
      onMask.call(self);
    };
  }
  if (!options.confirmText) {
    options.confirmText = "确定";
  }

  if (!instance) {
    instance = new PopConstructor();
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

export default Popbox;
