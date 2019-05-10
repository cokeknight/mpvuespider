<!--
  同意对勾选择组件
  check-用于判断是否勾选，双向绑定，状态改变时派发事件.click-agree(check)

  有两种外观
  1. 原型按钮(默认)
  2. 方框里面有个对号(需传square)
-->
<template>
  <span
    class="agreebox"
    :class="{square: square}"
  >
    <icon
      :href="iconHref"
      :class="{'agreebox-right': this.check}"
      @click="goChange"
    />
  </span>
</template>
<style>

</style>
<script>
import { addTrackNormal } from 'track';

export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    trackName: {
      type: String,
      default: ''
    },
    square: Boolean
  },
  data() {
    return {
      check: this.value
    };
  },
  computed: {
    iconHref: function() {
      if (!this.square) {
        return 'disagree';
      } else if (this.check) {
        return 'right';
      } else {
        return '';
      }
    }
  },
  methods: {
    goChange() {
      this.check = !this.check;
      // 注册埋点
      addTrackNormal(this.trackName + '_' + (this.check ? 'true' : 'false'));
      // 派发
      this.$emit('input', this.check);
    }
  }
};
</script>
