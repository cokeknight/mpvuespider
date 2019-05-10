<!--
  <icon></icon>
  属性:(icon默认是20px)
  href: svg用于区别其它icon的id值，eg: 'warning' / '#warning'
  small: 15px
  big: 25px
  rotate: 旋转180度，用于显示/隐藏层的
  size: 显示icon大小，宽=高=size
        1. 数字
        2. small(20) / big35()
  to: 跳转路由, 调用myMixin加的共用goRouter函数,支持以下几条格式
      1. <icon to="routerName"></icon>
      2. <icon to="/path"></icon>
      3. <icon :to="{}"></icon>

  replace: 路由跳转时用replace替换现有路由 <icon replace></icon>

  fill: 给icon着色

  事件:
  click: 点icon会$emit一个click事件
 -->
<template>
  <svg :style="styleStr" :class="svgClass" aria-hidden="true" @click="clickMe($event)">
    <use :xlink:href="useName"></use>
  </svg>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Icon',
  props: {
    href: {
      type: String,
      required: true,
      default: ''
    },
    //阻止冒泡
    stop: {
      type: Boolean,
      default: false
    },
    // 按钮大小
    size: String,
    // 填充颜色
    fill: String,
    // 跳转路由
    to: [String, Object],
    // 路由是否替换
    replace: Boolean,
    // 小图标 15 * 15
    small: Boolean,
    // 大图标 25 * 25
    big: Boolean,
    // 旋转180度，用于显示/隐藏层的
    rotate: Boolean
  },
  computed: {
    useName: function () {
      var str = this.href
      if (!/^#/.test(str)) {
        str = '#' + str
      }
      return str
    },
    styleStr: function () {
      var ref = {}
      if (parseInt(this.size)) {
        ref.width = ref.height = this.size
      }
      ref.fill = this.fill
      return ref
    },
    svgClass: function () {
      var ref = ['iconbox']
      if (this.size == 'small' || this.small) {
        ref.push('iconbox-small')
      }
      if (this.size == 'big' || this.big) {
        ref.push('iconbox-big')
      }
      if (this.rotate) {
        ref.push('rotate')
      }
      return ref
    }
  },
  methods: {
    clickMe: function (event) {
      if (this.stop) {
        event.stopPropagation()
      }
      if (this.to) {
        this.goRouter(this.to, this.replace ? 'replace' : '')
      }
      this.$emit('click')
    }
  }
}
</script>
