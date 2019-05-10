<!--
  替换inputX/inputNolabel
  <input-m></input-m>
  readOnly: 是否只读
  placeholder: 占位
  type： input类型
  trackName: 埋点
  sign：关闭按钮 href
  disabled: 关闭原生输入 手动传入value
  showIcon: 有内容时右侧叉号强制出现 试用于只读的情况
  cursor: 打开模拟光标 适用于只读情况 有内容时使用这个
  showCursor: 手动控制光标展示 强制控制 可能展示 可能隐藏用这个
  只读与不可点击情况不同，只读情况默认事件能够触发，但是不可点击不行！！

  事件:
  input/focus/blur/clear
  小程序的input控件取消掉input监听事件，不然会发生抖动
  提示也改成tip
 -->
<template>
  <div class="input-item">
    <div
      class="m-input"
      :class="{'m-input-cancel': showClose, 'm-input-ico': eyebool }"
    >
      <input
        ref="input"
        v-track="{name: trackName + '_insertinput' }"
        :value="inputValue"
        :readonly="readOnly"
        :type="inputType"
        :placeholder="placeholder"
        :maxlength="maxlength"
        :focus_bool="focusBool"
        :disabled="disabled"
        :placeholderClass="placeholderClass"
        :class="customClass"
        @input="dispatch('input', $event.target.value)"
        @focus="dispatch('focus', $event.target.value)"
        @blur="dispatch('blur', $event.target.value)"
        @click="dispatch('click')"
      > <span
        v-show="showCursorBool"
        class="m-input-cursor"
      />
      <Icon
        v-if="showClose"
        v-track="{name: trackName + '_clear'}"
        custom-class="m-input-close"
        :name="sign"
        @click="dispatch('clear')"
      />
      <icon
        v-if="eyebool && showClose && eye"
        custom-class="register-eye"
        name="openeye"
        @click="changeEye(false)"
      />
      <icon
        v-if="eyebool && showClose && !eye"
        custom-class="register-eye"
        name="closeeye"
        @click="changeEye(true)"
      />
    </div>
    <p class="error">
      {{ formErr.tip }}
    </p>
  </div>
</template>
<script>
let innerValue = '';
import validateRule from 'src/constants/validate';
import MP from 'MP';

export default {
  props: {
    customClass: String,
    placeholderClass: String,
    rule: String,
    readOnly: Boolean,
    placeholder: {
      type: String,
      default: ''
    },
    focusBool: Boolean,
    maxlength: {
      type: Number,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    showIcon: {
      type: Boolean,
      required: false
    },
    cursor: {
      type: Boolean,
      required: false
    },
    eyebool: {
      type: Boolean,
      required: false
    },
    showCursor: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      default: 'text'
    },
    value: {
      type: String,
      required: false,
      default: ''
    },
    trackName: {
      type: String,
      default: ''
    },
    // 关闭按钮 href
    sign: {
      type: String,
      default: 'failure'
    }
  },
  data() {
    return {
      inputValue: '',
      inputValue2: '',
      eye: false,
      inputType: this.type,
      formErr: {
        tip: ''
      }
    };
  },
  onUnload() {
    innerValue = '';
  },
  // onHide(){

  //   innerValue = ''
  // },
  computed: {
    showClose: function() {
      return this.inputValue2 && (!this.readOnly || this.showIcon);
    },
    showCursorBool() {
      var bool = false;
      //用默认的有内容时候 光标闪烁
      if (this.cursor) {
        bool = this.value && this.cursor;
      } else {
        //根据showCursor控制
        bool = this.showCursor;
      }
      return bool;
    }
  },
  watch: {
    'value': function(v) {
      if (innerValue) {
        return false;
      }
      innerValue = v;
      this.inputValue = v;
      this.inputValue2 = v;
    }
  },
  // mounted(){
  //   console.log('mounted',this.value)
  // },
  // onReady(){
  //   console.log('onReady',this.value)
  // },
  onShow() {
    this.inputValue = this.value;
    innerValue = this.value;
  },
  methods: {
    validate: function() {
      if (this.rule) {
        const ruleName = this.rule;
        const currentValidateRule = validateRule[ruleName];
        for (let i = 0; i < currentValidateRule.length; i++) {
          if (!currentValidateRule[i]['regex'].test(this.value)) {
            // this.formErr.tip = currentValidateRule[i]['tip']
            MP.Tip({
              msg: currentValidateRule[i]['tip']
            });
            return false;
          }
        }
      }
      return true;
    },
    clearFormErrTip() {
      this.formErr.tip = '';
    },
    dispatch: function(type, val) {
      this.$emit(type, val);
      // 需要更新数据
      if (type == 'clear') {
        this.inputValue2 = ' ';
        this.inputValue = '55551';
        this.$set(this, 'inputValue', '');
        this.$forceUpdate();
      } else if (type == 'blur') {
        this.updateValue(val);
      } else if (type == 'input') {
        this.$emit('input', val);
        this.inputValue2 = val;
      }
    },
    // 小程序中如果这样一变更就修改UI  就会导致input抖动
    updateValue: function(value = '') {
      this.$emit('input', value);
      // setTimeout(() => {
      //   this.dispatch('input', value)
      // },0)
      // if (this.maxlength){
      //   if (value.length > this.maxlength){
      //     value =  value.substring(0,this.maxlength-1)
      //   }
      // }
      // if (this.formErr.tip) {
      //   this.formErr.tip = ''
      // }
      // }, 0)
      // if (this.formErr.tip) {
      //   this.formErr.tip = ''
      // }
    },
    focus: function() {
      this.$refs.input.focus();
    },
    changeEye(bool) {
      this.eye = bool;
      //切换的同时修改type,默认是pass切换text
      this.inputType = bool ? 'text' : 'password';
    }
  }
};
</script>
<style>
  .error {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #f00;
    line-height: 18px;
    font-size: 12px;
  }
</style>

