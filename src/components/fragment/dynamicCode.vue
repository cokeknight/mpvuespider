<template>
  <span
    v-track="{name:trackName+'_huoqudongtaima'}"
    class="dynamicCode"
    :class="(isCounting ? 'dynamicCode-gray': '') + customClass"
    @click="sendDynamicCode"
  >{{ msgDisplay }}</span>
</template>

<script>
// 逻辑每隔1s取系统时间与点击时stamp对比得出当前时间
// 原因在app中，倒计时时锁屏js就不运行了，开锁后继续运行
const GET_CODE = '点击获取';
const GET_CODE_AGAIN = '重新获取';

const COUNT_TIME = 120;

var stamp;

export default {
  props: {
    customClass: String,
    msg: {
      type: String,
      default: GET_CODE
    },
    trackName: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: 'S'
    }
  },
  data() {
    return {
      count: null,
      isCounting: false,
      tm: null
    };
  },
  computed: {
    msgDisplay: function() {
      var msg = this.msg;
      if (this.isCounting) {
        msg = this.count + this.unit;
        // 说明已经付过值了
      } else if (this.count != null) {
        msg = this.msg;
      }
      return msg;
    }
  },
  destroyed() {
    console.log('destroyed');
    this.$nextTick(function() {
      clearInterval(this.tm);
    });
  },
  mounted() {
    // register.vue里使用
    this.$emit('countDown', this.countDown);
  },
  methods: {
    clear() {
      this.count = null;
      this.isCounting = null;
    },
    sendDynamicCode: function() {
      if (!this.isCounting) {
        this.$emit('click', this.countDown);
      }
    },
    countDown: function(cb) {
      var self = this;
      this.isCounting = true;
      this.count = COUNT_TIME;
      // 记录当前时间戳
      stamp = Date.now();
      this.tm = setInterval(function() {
        self.loop(cb);
      }, 1000);
    },
    loop: function(cb) {
      this.count = COUNT_TIME - parseInt((Date.now() - stamp) / 1000);
      if (this.count <= 0) {
        clearInterval(this.tm);
        this.isCounting = false;
        // 倒计时结束回调
        cb && cb();
      }
    }
  }
};
</script>
