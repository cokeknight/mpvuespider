<template>
  <span
    class="countdown"
    v-html="htmlStr"
  />
</template>

<script>
// d:天 h:时 m:分 s:秒
// 当倒计时结束的时候触发事件 countDownFinish
var templType = {
  investList: '<span>{d}天{h}:{m}:{s}</span>',
  // investList: '<span>{d}</span>天 <span>{h}</span>时<span>{m}</span>分<span>{s}</span>秒', // 出借列表
  details: '{d}天{h}时{m}分{s}秒' // 出借详情
};

export default {
  props: {
    timestamp: {
      type: Number,
      required: true
    },
    // 固定两位
    fixed: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'investList'
    },
    // 此组件只用为传参一个介质，在这里不作任何处理，倒计时结束时抛出
    // 可以把一个数组的index传过来，结束时传过去，方便修改对应对象
    item: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      htmlStr: ''
    };
  },
  watch: {
    'timestamp': function(v) {
      if (v) {
        this.restart(v);
      }
    }
  },
  beforeDestroy: function() {
    clearTimeout(this.setTime_id);
  },
  // 插入dom时触发
  // ready等事件时，如果之前dom编译过。再次从内存中调进来是不会触发的
  mounted: function() {
    this.tmpl = templType[this.type];
    this.restart();
  },
  methods: {
    restart: function(v) {
      // 清空时间指针，重新开始
      clearTimeout(this.seTime_id);
      this.stamp = (v || this.timestamp) * 1000;
      this.oldDow = Date.now();
      this.oldStamp = this.stamp;
      this.canOff = 5 * 60; // 差距超过5分钟则说明本地调整时间，不作矫正

      this.parseTime();
    },
    check: function() {
      // 时间相差  s
      var offDate = parseInt((Date.now() - this.oldDow) / 1000);
      // 倒计时相差 s
      var offStamp = parseInt(Math.abs(this.stamp - this.oldStamp) / 1000);
      // 对比两都的值
      var dis = Math.abs(offDate - offStamp);
      // 如果值不相等 且 误差小于5分钟则矫正
      if (!dis && dis < this.canOff) {
        this.stamp = this.oldStamp - offDate * 1000;
      }
    },
    parseTime: function() {
      // 当移除元素时就没this.$el，不判读会报错
      if (!this.$el) return;
      var times = parseInt(this.stamp / 1000), // 一共多少秒
        self = this,
        oneDay = 24 * 60 * 60,
        oneHour = 60 * 60,
        target = {},
        remain, d, h, m, s; // 剩余多少/天/小时/分/秒

      remain = times / oneDay; // 剩余天数
      d = parseInt(remain); // 天数
      remain = times % oneDay; // 剩余秒数
      h = parseInt(remain / oneHour); // 小时
      remain = remain % oneHour; // 剩余秒数
      m = parseInt(remain / 60); // 分钟
      remain = remain % 60; // 剩余秒数
      s = parseInt(remain); // 秒数

      if (this.fixed) {
        if (h < 10) {
          h = '0' + h;
        }
        if (m < 10) {
          m = '0' + m;
        }
        if (s < 10) {
          s = '0' + s;
        }
      }

      target.d = d;
      target.h = h;
      target.m = m;
      target.s = s;

      // 没有天的时候要去掉天数
      if (!d && !this.isSetDay) {
        this.isSetDay = true;
        this.tmpl = this.tmpl.replace(/^[^天]+天\s*/, '');
      }

      // 填充数据
      this.htmlStr = this.tmpl.replace(/\{([^}]+)}/g, function(a, b) {
        return target[b];
      });
      this.stamp -= 1000;
      if (this.stamp < 0) {
        this.$emit('finish', this.item);
        return;
      }
      this.setTime_id = setTimeout(function() {
        // 检查是不是对
        self.check();
        self.parseTime();
      }, 1000);
    }
  }
};
</script>
