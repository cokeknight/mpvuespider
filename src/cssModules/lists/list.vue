<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <form
    class="tj-form login-mod login-top"
  >
    <slot />
  </form>
</template>

<script>

export default {
}
</script>
