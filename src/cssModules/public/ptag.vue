<!--
  <btn>内容</btn>
  属性:
  color: blue|yellow|red|white 按钮的背景颜色
  small: 小按钮，高度，字的大小都有些缩小
  auto: 两边padding减小
  single: 方角按钮，默认一行显示
  full: 全屏样式
  bottom: 按钮固定在底部
  space-top: 距离上面距离，50px通常比较远
  to: 跳转路由, 调用myMixin加的共用go函数,支持以下几条格式
    1. <icon to="routerName"></icon>
    2. <icon to="/path"></icon>
    3. <icon :to="{}"></icon>
  replace: 路由跳转时用replace替换现有路由, 没to则replace也没用

  事件:
  click: 点击时触发
 -->
<template>
  <div
    :class="customClass"
  >
    {{ text }}
  </div>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Btn',
  props: {
    text: String,
    // 小按钮
    customClass: String
  }
}
</script>
