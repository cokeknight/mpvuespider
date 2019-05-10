<!-- 
  scale: 缩放比例 默认0.3 
  inline: 是否一行显示
 -->
<template>
  <div class="iconloading" :class="{inline: inline}" :style="setStyle">
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
    <div class="iconloading-piece"></div>
  </div>
</template>

<script>
export default {
  name: 'IconLoading',
  props: {
    scale: [String, Number],
    inline: Boolean
  },
  computed: {
    setStyle: function () {
      let str = ''
      let scale = parseInt(this.scale)
      if (scale) {
        str = 'transform: scale(' + scale + ');-webkit-transform: scale(' + scale + ')'
      }
      return str
    }
  }
}
</script>
