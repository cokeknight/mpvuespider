<!-- 
  <warning>内容</warning>
  属性:
  show-close: 是否显示close按钮
  absolute: 是否用绝对定位，默认在文档流内

  事件:
  close: 关闭时触发
 -->
<template>
  <div
    v-if="showBox"
    class="xhh-warning"
    :class="{'xhh-warning-hasclose': showClose, 'xhh-warning-absolute': absolute}"
  >
    <slot />
    <icon
      v-if="showClose"
      class="xhh-warning-close"
      href="close"
      @click="clickClose"
    />
  </div>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Warning',
  props: {
    showClose: Boolean,
    // 是否绝对定位
    absolute: Boolean
  },
  data: function () {
    return {
      showBox: true
    }
  },
  methods: {
    clickClose: function () {
      this.showBox = false
      this.$emit('close')
    }
  }
}
</script>
