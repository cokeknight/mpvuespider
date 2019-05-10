<!-- 
  <btn-group>内容</btn-group>
  属性:
  auto: 两边padding减小
  bottom: 按钮固定在底部
  justify: 两边对齐
  gap: 左右留白10
  space-top: 距离上面距离，50px通常比较远
 -->
<template>
  <div :class="btnClass">
    <slot />
  </div>
</template>

<script>
var shapeArr = ['justify', 'auto', 'bottom', 'gap', 'full']

export default {
  // 自定义标签名字
  name: 'BtnGroup',
  props: {
    // 两端对齐
    justify: Boolean,
    // 去掉最小宽度，根据实际内容撑
    auto: Boolean,
    // 是否悬挂到最底部
    bottom: Boolean,
    // 全屏显示
    full: Boolean,
    // 左右是否留白
    gap: Boolean,
    // 距离上面距离，50px通常比较远
    spaceTop: Boolean
  },
  data: function () {
    return {
    }
  },
  computed: {
    btnClass: function () {
      var str = 'btn-group ', self = this
      shapeArr.forEach(function (item) {
        if (self[item]) {
          str += ' btn-group-' + item
        }
      })
      if (this.spaceTop) {
        str += ' btn-space-top'
      }
      return str
    }
  },
  created: function () {
  },
  methods: {
  }
}
</script>
