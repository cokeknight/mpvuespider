<!--
  <list toggle color-turn>
    <list-item></list-item>
  </list>
  toggle: 打开toggle开关, 使下面item都有toggle样式
  color-turn: 颜色翻转 由左黑右灰，变成右灰左黑
  gap: 设置li之间的间隙为10
  open: 默认打开第一个
 -->
<template>
  <div class="collapse">
    <div class="collapse-title" @click="handleOpen">
      <div class="list-item-title">
        {{ title }}
      </div>
      <i :class="'arrow ' + (isOpening ? 'arrow-u' : 'arrow-d')" />
    </div>
    <div v-if="isOpening" class="collapse-body">
      <slot />
    </div>
  </div>
</template>
<script>

export default {
  // 自定义标签名字
  name: 'Collapse',
  props: {
    title: String
  },
  data: function () {
    return {
      isOpening: false
    }
  },
  mounted: function () {
    // this.init()
  },
  // 初始化时不会运行，所以要在mounted时加
  updated: function () {
    // this.init()
  },
  methods: {
    handleOpen () {
      this.isOpening = !this.isOpening
    }
  }
}
</script>
