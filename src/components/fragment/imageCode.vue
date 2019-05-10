<template>
  <img
    v-track="{name:trackName+'_imagecode'}"
    :src="captchaImage"
    class="imageCode"
    @click="refresh"
  >
</template>

<script>
// 逻辑每隔1s取系统时间与点击时stamp对比得出当前时间
// 原因在app中，倒计时时锁屏js就不运行了，开锁后继续运行
import { UrlParse } from 'src/common/functions';

export default {
  props: {
    url: String,
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      captchaImage: this.getCaptchaImage()
    };
  },
  methods: {
    getCaptchaImage() {
      const i = new Date();
      return UrlParse.addQuery(this.url, {
        t: i.getTime()
      });
    },
    refresh: function() {
      this.captchaImage = this.getCaptchaImage();
    }
  }
};
</script>
