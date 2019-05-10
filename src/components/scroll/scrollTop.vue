<template>
  <div
    id="fixedTools"
    class="hidden-xs hidden-sm"
  >
    <a
      id="backtop"
      class="border-bottom"
      @click="backTop"
    >Top</a>
  </div>
</template>
<style>
  #fixedTools {
    position: fixed;
    right: 40px;
    bottom: 40px;
    background: #FFF;
    z-index: 1000;
    border-radius: 18px;
  }

  #fixedTools a {
    /*  padding: 10px; */
    display: block;
    color: #999;
    width: 38px;
    height: 38px;
    color: #10a0eb;
    font-size: 16px;
    line-height: 38px;
    text-align: center;
    text-decoration: none;
  }
</style>
<script>
import Bus from 'bus';

export default {
  data() {
    return {};
  },
  methods: {
    backTop() {
      Bus.$emit('IScroll:top', 1000);
    }
  }
};
</script>
