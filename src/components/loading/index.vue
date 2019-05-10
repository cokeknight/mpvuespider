<template>
  <div v-show="visible" class="loadingbox">
    <div class="loadingbox-body">
      <div class="loadingbox-ios">
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
        <div class="loadingbox-piece"></div>
      </div>
      <div class="loadingbox-text">
        加载中
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    widget: {
      type: Boolean,
      default: true
    },
    value: Boolean
  },
  data() {
    return {
      visible: true
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.visible = val;
      }
    }
  }
};
</script>
