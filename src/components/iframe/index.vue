<template>
  <div
    class="iframebox"
    :style="{top: top}"
  >
    <iframe
      :src="src"
      name="myiFrame"
      frameborder="0"
      marginheight="0px"
      marginwidth="0px"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    top: {
      type: String
    }
  }
};
</script>
