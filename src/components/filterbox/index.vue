<!--
filtertop:控制当前组件离页面最顶部的具体
-->
<template>
  <div
    v-show="show"
    class="filterbox"
    :style="{top: filtertop + 'px'}"
  >
    <div
      v-track="{name:trackName+'_closefilterbox'}"
      class="mask"
      :style="{top: filtertop + 'px'}"
      @click="clickMask"
    />
    <div class="filterbox-body">
      <slot />
      <div class="filterbox-reset">
        <span
          v-track="{name: trackNameReset}"
          @click="reset"
        >重置</span> <span
          v-track="{name: trackNameConfirm}"
          class="active"
          @click="submit"
        >确定</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
    filtertop: {
      type: String,
      default: '48'
    },
    trackNameReset: String,
    trackNameConfirm: String
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
    },
    reset() {
      this.$emit('resetFilterType');
    },
    submit() {
      this.$emit('submitFilterType');
    }
  }
};
</script>
