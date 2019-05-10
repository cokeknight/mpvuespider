<!--
  这个只是sheet的基础组件，只有基本的功能, 弹框
  <sheet
    :show.sync: 是否显示
    clickMaskHide：点遮罩是否关闭弹框
  ></sheet>

  事件:
  mask: 点遮罩
  close: 关闭时

  @touchmove.stop.prevent: 防止滑动时滚动条动
-->
<template>
  <div
    v-show="showBox"
    class="sheetbox"
    @touchmove.stop.prevent
  >
    <div
      class="masklayer"
      @click="clikHandler(true)"
    />
    <div
      ref="main"
      class="sheetbox-wrap"
      :class="{show: showTransition}"
    >
      <div
        v-if="$slots.title"
        class="sheetbox-title"
      >
        <slot name="title" />
      </div>
      <div class="sheetbox-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import { bind } from 'dom';
// 是否在bus上注册过事件
let isBindedBus;

export default {
  name: 'Sheet',
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    // 点遮罩关闭
    clickMaskHide: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showBox: false,
      showTransition: false
    };
  },
  watch: {
    // 要有个时间间隔，这样才有动画效果
    // 所以不能用computed,它会立即赋值，就没动画了
    show: function(v) {
      this.setState(v);
      if (v && !isBindedBus) {
        isBindedBus = true;
        this.$Bus.$on(['sheet', 'pop'], function() {
          // 这个是切换页面时触发，不应该显示动画
          this.showTransition = this.showBox = isBindedBus = false;
        });
      }
    }
  },
  mounted() {
    // 绑定对象。关闭弹框时，先运行css动画结束再关闭弹框
    bind(this.$refs.main, 'transitionend', () => {
      if (!this.showTransition) {
        this.showBox = false;
        this.$emit('close', false);
      }
    });
  },
  methods: {
    // click事件
    clikHandler(isMask) {
      if (isMask) {
        this.$emit('mask');
        if (!this.clickMaskHide) return;
      }
      this.setState();
    },
    setState(isShow) {
      if (isShow) {
        // 要等更新完才可以加class要不然会一起作赋值操作
        // 不要这个可以一起显示，但是不会有动画
        this.$nextTick(() => {
          // 刷新dom，方便下面加class的时候产生动画
          this.$el.clientHeight;
          this.showTransition = isShow;
        });
        this.showBox = isShow;
      } else {
        this.showTransition = isShow;
      }
      this.$emit('update:show', isShow);
    }
  }
};
</script>
