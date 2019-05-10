<template>
  <div
    v-if="show"
    :style="style"
    :class="'tipbox ' + className + ' ' + animation"
  >
    <div class="tipbox-msg">
      <span>{{ msg }}</span>
      <div
        x-arrow=""
        class="popper__arrow"
      />
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
    value: Boolean,
    msg: {
      type: String,
      default: '开了点小差~~'
    },
    top: {
      type: Number,
      default: 75
    },
    className: String
  },
  data: function() {
    return {
      show: false,
      animation: 'top '
    };
  },
  computed: {
    style() {
      return 'top:' + this.top + '%';
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.show = val;
      }
    },
    // 要有个时间间隔，这样才有动画效果
    show: function(v) {
      if (v) {
        setTimeout(() => {
          this.animation = ' ';
          setTimeout(() => {
            this.animation = ' bottom';
            setTimeout(() => {
              this.show = false;
              this.$emit('input', false);
            }, 600);
          }, 2000);
        });
      }
    }
  }
};
</script>
