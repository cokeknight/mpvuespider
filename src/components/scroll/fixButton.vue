<template>
  <div
    v-show="show"
    @click="clickBtn"
  >
    <slot />
  </div>
</template>
<!--当到达某一位置的时候scrollView派发事件-->
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: true
    },
    dom: {
      default: null
    },
    shelterDom: {
      default: null
    }
  },
  data() {
    return {
      btnScrollTop: 0,
      show: this.value,
      blockHeight: 0
    };
  },
  created() {
    this.$Bus.$on('IScroll:scrollChange', this.scrollChange);
  },
  methods: {
    scrollChange(obj) {
      // 此处添加模板节点判断，如没有设置节点，则认为不开启此滑动消失功能
      if (!this.dom) return false;
      if (this.shelterDom) {
        this.blockHeight = this.shelterDom.offsetHeight;
      }
      // 计算节点离上方位置 节点离上方的位置-屏幕高度+节点高度+遮罩高度
      this.btnScrollTop = (this.dom.offsetTop - obj.element.offsetHeight + this.blockHeight) + obj.scrollTop;
      if (this.btnScrollTop < 0) {
        this.show = false;
      } else if (!this.show) {
        this.show = true;
      }
    },
    clickBtn() {
      this.$emit('click');
    }
  }
};
</script>
