<template>
  <section
    class="pageslider-item"
    :style="{height:height+'px'}"
  >
    <div class="pageslider-item-content">
      <slot />
    </div>
    <div
      v-show="isShowDropDown"
      class="drop-down drop-down-anim"
    >
      <i />
    </div>
    </div>
  </section>
</template>

<script>
import Conf from 'config';

export default {
  props: {
    isShowDropDown: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      height: 0
    };
  },
  created() {
    this.height = document.documentElement.clientHeight - 48;
    if (Conf.device == 2 || Conf.device == 1) {
      this.height = document.documentElement.clientHeight;
    }
  }
};
</script>
