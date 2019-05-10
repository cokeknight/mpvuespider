<!-- 
  <box2></box2>
  这有padding值
 -->
<template>
  <div
    class="m-box2"
    @click="$emit('click')"
  >
    <slot />
  </div>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Box2'
}
</script>
