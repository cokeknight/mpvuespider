/**
 * Created by xuxin on 16/4/25.
 */
import localData from "localStorage";

// let forms = ['investForm', 'bindBank']
let forms = ["investForm"];
let formArray = {};
let prefix = "form-";

let formService = {
  setForm(name, formData) {
    formArray[name] = formData;
    localData.set(prefix + name, formData);
  },
  getForm(name) {
    if (forms.indexOf(name) !== -1) {
      return Object.isEmptyObject(formArray[name]) ? (localData.get(prefix + name) || {}) : formArray[name];
    }
    return {};
  },
  clearForm(key) {
    if (Object.isArray(key)) {
      key.forEach(function(k) {
        clearItem(k);
      });
    } else if (Object.isString(key)) {
      clearItem(key);
    } else {
      for (var k in formArray) {
        if (formArray.hasOwnProperty(k)) {
          clearItem(k);
        }
      }
    }

    // 清空单个
    function clearItem(k) {
      // 设置成空
      if (forms.indexOf(k) != -1) {
        formArray[k] = {};
        localData.remove(prefix + k);
      }
    }
  },

  init: function() {
    forms.forEach(function(elem) {
      let data = localData.get(prefix + elem);
      if (data === undefined || data === "" || data === null) {
        formArray[elem] = {};
        localData.set(prefix + elem, {});
      } else {
        formArray[elem] = data;
      }
    });
  },
  refreshFormToLocal: function(obj, key) {
    if (!!key && typeof obj === "object") {
      localData.set(prefix + key, obj);
    }

    for (var k in formArray) {
      localData.set(prefix + k, formArray[k]);
    }
  }
};

export default formService;
