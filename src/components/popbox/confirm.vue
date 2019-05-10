<template>
  <div>
    <pop-box
      v-model="visible"
      :track-name="trackName"
      :is-click-hide="isClickHide"
      :class="className"
      custom-class="dianka diankaconfirm"
      :close="close"
    >
      <div
        v-if="title"
        class="popbox-header"
      >
        <h3 class="popbox-title">
          {{ title }}
        </h3>
      </div>
      <div class="popbox-content">
        <div class="popbox-align">
          {{ msg }}
        </div>
      </div>
      <div class="popbox-foot">
        <a
          v-track="{name:trackName+'_cancle'}"
          @click="cancel"
        >{{ cancelText }}</a> <a
          v-track="{name:trackName+'_confirm'}"
          class="primary"
          @click="confirm"
        > {{ confirmText }} </a>
      </div>
      <Icon v-if="showCloseIcon" v-track="{name:trackName+'clickBtn'}"
            name="circleclose"
            @click="closeC"
      />
    </pop-box>
  </div>
</template>

<script>
import popBox from 'popbox';

export default {
  name: 'Confirm',
  components: {
    popBox
  },
  props: {
    widget: {
      type: Boolean,
      default: true
    },
    onConfirm: Function,
    onCancel: Function,
    value: Boolean,
    showCloseIcon: {
      type: Boolean,
      default: true
    },
    trackName: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: '确定吗？'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确认'
    },
    isClickHide: {
      type: Boolean,
      default: true
    },

    className: String,
    close: {
      type: Boolean,
      default: false
    }
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
  },
  methods: {
    closeC() {
      this.visible = false;
      this.$emit('input', false);
    },
    cancel() {
      this.visible = false;
      this.$emit('input', false);
      if (this.onCancel) {
        // 小程序里 弹出框不会立刻消失
        setTimeout(() => {
          this.onCancel();
        }, 0);
      }
    },
    confirm() {
      this.visible = false;
      this.$emit('input', false);
      if (this.onConfirm) {
        // 小程序里 弹出框不会立刻消失
        setTimeout(() => {
          this.onConfirm();
        }, 0);
      }
    }
  }
};
</script>
