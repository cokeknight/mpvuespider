<template>
  <div
    v-show="show"
    :class="'popbox ' + (customClass? customClass: '')"
  >
    <div
      v-track="{name:trackName+'_closepopbox'}"
      class="mask"
      @click="clickMask"
    />
    <div :class="['popbox-body', bodyClass]">
      <slot />
      <span
        v-if="close"
        v-track="{name:trackName+'_closepopbox'}"
        class="close"
        @click="clickMask"
      >x</span>
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
    customClass: String,
    close: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Boolean, Number],
      default: false
    },
    isClickHide: {
      type: Boolean,
      default: true
    },
    trackName: {
      type: String,
      default: ''
    },
    bodyClass: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: this.value
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.show = val;
      }
    },
    show(val) {
      this.$emit('input', val);
      this.$emit(val ? 'show' : 'hide');
    }
  },
  created: function() {
    var self = this;
    this.$Bus.$on(['popbox', 'pop'], function() {
      self.$emit('input', false);
    });
  },
  methods: {
    clickMask() {
      if (this.isClickHide) {
        this.show = false;
      }
      this.$emit('domask');
    }
  }
};
</script>
