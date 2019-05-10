<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div
    v-if="show"
    :class="'actionsheet ' + customClass"
  >
    <div
      v-track="{name:trackName+'_close'}"
      class="actionsheet-mask"
      @click="maskClick"
    />
    <div
      ref="main"
      :class="'actionsheet-body' + animation"
    >
      <h3
        v-if="title"
        class="actionsheet-title"
      >
        <span>{{ title }}</span>
        <Icon
          v-if="!hideIcon"
          v-track="{name:trackName+'_close'}"
          name="bigclose"
          custom-class="icon"
          @click="close"
        />
      </h3>
      <h3
        v-if="showConfirm"
        class="actionsheet-title actionsheet-operate"
      >
        <span class="operate" @click="close">取消</span> <span class="operate" @click="confirm">确定</span>
      </h3>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    customClass:{
      type: String,
      default: ''
    },
    list: Array,
    showConfirm: Boolean,
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String
    },
    iconType: {
      type: String,
      default: 'back'
    },
    trackName: {
      type: String,
      default: ''
    },
    // 点遮罩关闭
    isClickHide: {
      type: Boolean,
      default: true
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      show: this.value,
      animation: ''
    };
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
          this.animation = ' show';
        },0);
      }

      if (mpvuePlatform === 'h5') {
        if (v) {
          document.body.parentNode.className = 'noscroll';
        } else {
          document.body.parentNode.className = '';
        }
      }
    }
  },
  created: function() {
    var self = this;
    this.$Bus.$on(['actionsheet', 'pop'], function() {
      self.$emit('input', false);
    });
  },
  methods: {
    confirm() {
      this.$emit('confirm');
      this.close();
    },
    maskClick: function() {
      if (this.isClickHide) {
        this.close();
      }
    },
    close: function() {
      this.$emit('input', false);
    }
  }
};
</script>
