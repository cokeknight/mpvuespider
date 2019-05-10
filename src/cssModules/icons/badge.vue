<template>
  <div class="badeg">
    <Icon :name="iconName" :custom-class="customClass" />
    <i class="badeg-count">{{ badge }}</i>
  </div>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Badeg',
  props: {
    customClass: String,
    iconName: String,
    badge: Number // 徽章
  },
  mounted () {
    console.log(this)
  }
}
</script>
