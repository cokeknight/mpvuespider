<template>
  <div
    id="PageSlider"
    ref="page"
    :class="'pageslider ' + name"
    @touchmove="disabletouch"
    @touchstart="disabletouch"
  >
    <slot />
  </div>
</template>

<script>
import PageSlider from '../../lib/pagesilder/pageslider.js';
import Conf from 'config';

export default {
  props: {
    name: String
  },
  mounted() {
    var cutheight = 48;
    if (Conf.device == 2 || Conf.device == 1) {
      cutheight = 0;
    }
    this.slider = new PageSlider({ obj: this.$refs.page, cutheight: cutheight });
  },
  destroy() {
    this.slider.destroy();
  },
  methods: {
    disabletouch: function(e) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
};
</script>
