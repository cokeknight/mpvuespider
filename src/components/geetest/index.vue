<template>
  <div v-show="value" />
</template>
<script>
const geetestObj = {
  instance: null,
  cb: null
};
export default {
  props: {
    afterValidate: {
      type: Function,
      default: null
    },
    value: Boolean
  },
  watch: {
    value(val) {
      if (val) this.showCaptcha();
    }
  },
  created() {
    // 重置
    geetestObj.instance = null;
    geetestObj.cb = null;

    // 取值
    this.$Api({
      name: 'StartCaptcha',
      data: {
        'gt_sdk_version': '3.0.0',
        't': (new Date()).getTime()
      },
      method: 'post'
    }).then(d => {
      window.initGeetest({
        gt: d.gt,
        challenge: d.challenge,
        timeout: '5000',
        new_captcha: d.new_captcha, // 用于宕机时表示是新验证码的宕机
        product: 'bind', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
        offline: !d.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
      }, this.geetestCallBack);
    });
  },
  methods: {
    hide() {
      this.$emit('input');
    },
    // 初始化geetest后回调，参数为极验实例
    geetestCallBack: function(captchaObj) {
      captchaObj
      // 注册成功
        .onReady(() => {
          geetestObj.instance = captchaObj;
          geetestObj.cb && geetestObj.cb();
        })
        // 验证成功
        .onSuccess(() => {
          // 获取验证结果
          let result = captchaObj.getValidate();
          let submitData = {
            xhh_challenge: result.geetest_challenge,
            xhh_validate: result.geetest_validate,
            xhh_seccode: result.geetest_seccode
          };
          // 返回的结果传出去
          this.afterValidate(submitData);
          this.hide();
        })
        // 当点遮罩关闭时触发div隐藏
        .onClose(() => this.hide());
    },
    // 显示
    showCaptcha: function() {
      // 显示极客验证, 如果没初始化完成，则保存回调
      let instance = geetestObj.instance;
      if (!instance) {
        geetestObj.cb = function() {
          geetestObj.instance.verify();
          geetestObj.cb = null;
        };
      } else {
        instance.verify();
      }
    }
  }
};
</script>
