/**
 * Created by xuxin on 2017/3/3.
 */
import Vue from "vue";
import tip from "src/components/tip/index.vue";

let TipConstructor = Vue.extend(tip);

let instance;
let instances = [];
let seed = 1;

const Tip = function(options) {
  options = options || {};
  if (typeof options === "string") {
    options = {
      msg: options
    };
  }
  let userOnClose = options.onClose;
  let id = "tip_" + seed++;

  options.onClose = function() {
    Tip.close(id, userOnClose);
  };
  instance = new TipConstructor();
  Object.assign(instance, options);
  instance.id = id;
  instance.show = true;
  // 文档外渲染生成$el
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.dom = instance.$el;
  instances.push(instance);
  return instance;
};

Tip.close = function(id, userOnClose) {
  for (let i = 0, len = instances.length; i < len; i++) {
    if (id === instances[i].id) {
      if (typeof userOnClose === "function") {
        userOnClose(instances[i]);
      }
      if (instances[i].hide) {
        instances[i].hide();
      }
      instances.splice(i, 1);
      break;
    }
  }
};

export default Tip;
