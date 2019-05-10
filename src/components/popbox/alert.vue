<template>
  <div>
    <pop-box
      v-model="visible"
      :is-click-hide="isClickHide"
      @domask="onMask"
    >
      <div
        v-if="title && title !='null'"
        class="popbox-header"
      >
        <h3 class="popbox-title">
          {{ title }}
        </h3>
      </div>
      <div class="popbox-content">
        <div
          class="popbox-align"
        >
          {{ msg }}
        </div>
      </div>
      <div class="popbox-foot">
        <a
          v-track="{name:trackName+'clickBtn'}"
          class="primary"
          @click="onConfirm"
        >{{ text || confirmText }}</a>
      </div>
    </pop-box>
  </div>
</template>

<script>
import popBox from 'popbox';

export default {
  name: 'Alert',
  components: {
    popBox
  },
  props: {
    widget: {
      type: Boolean,
      default: true
    },
    customClass: String,
    value: Boolean,
    extra: {
      type: Object
    },
    title: {
      type: String
    },
    isClickHide: Boolean,
    confirmText: {
      type: String,
      default: '确定'
    },
    msg: {
      type: String,
      default: '确定吗'
    },
    trackName: {
      type: String,
      default: ''
    },
    onClick: {
      type: Function,
      default: function() {
      }
    },
    // isClickHide: {
    //   default: false
    // },
    // 弃用，之后请用 confirmText
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: false
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.visible = val;
      }
    }
  },
  methods: {
    onConfirm: function() {
      if (this.onClick) {
        this.onClick();
      }

      this.visible = false;
      this.$emit('input', false);
    },
    // 点击遮罩层
    onMask: function() {
    }
  }
};
</script>
