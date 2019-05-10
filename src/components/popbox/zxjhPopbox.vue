<template>
  <div>
    <pop-box
      v-model="visible"
      :is-click-hide="isClickHide"
      class="homeCgTip"
      custom-class="dianka"
      @domask="onMask"
    >
      <h4>{{ context }}</h4>
      <x-button
        :text="btnMsg"
        track-name="zxjh_review"
        custom-class="btn-primary"
        @click="onConfirm"
      />
      <Icon v-track="{name:trackName+'clickBtn'}"
            name="circleclose"
            @click="close"
      />
    </pop-box>
  </div>
</template>

<script>
import popBox from 'popbox';
import xButton from 'src/cssModules/public/btn';

export default {
  name: 'DKPopbox',
  components: {
    popBox,
    xButton
  },
  props: {
    widget: {
      type: Boolean,
      default: true
    },
    btnMsg: String,
    value: {
      type: Boolean,
      default: false
    },
    extra: {
      type: Object
    },
    title: {
      type: String
    },
    context: String,
    confirmText: {
      type: String,
      default: '确定'
    },
    pageUrl: String,
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
    onClose: {
      type: Function,
      default: function() {
      }
    },
    isClickHide: {
      default: false
    },
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
    close: function() {
      this.visible = false;
      if (this.onClose) {
        this.onClose();
      }
      this.$emit('input', false);
    },
    // 点击遮罩层
    onMask: function() {
    }
  }
};
</script>
