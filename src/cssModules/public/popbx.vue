<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div class="mask" @click="close">
    <div class="diag-pop">
      <slot />
      <div class="circleclose">
        <Icon name="circleclose" style="font-size: 34px" @click="close" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    list: Array,
    value: {
      type: Boolean,
      required: false,
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
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val
      }
    },
    show: function (v) {
      this.$emit('input', v)
    }
  },
  created: function () {
    var self = this
    this.$Bus.$on(['actionsheet', 'pop'], function () {
      self.$emit('input', false)
    })
  },
  methods: {
    close(){
      this.$emit('input', false)
    }
  }
}
</script>
