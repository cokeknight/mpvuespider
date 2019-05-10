<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div v-if="show" class="mask" @click="close1">
    <div class="diag-pop">
      <div class="dialog-content">
        <p class="diag-tip">
          温馨提示
        </p>
        <p class="diag-message">
          您还有订单未完成支付哦~
        </p>
        <div class="diag-btn-wrap">
          <button
            class="btn-mod btn-normal diag-btn diag-btn mag-r10"
            @click="cancel1"
          >
            随便逛逛
          </button>
          <button
            class="btn-mod btn-normal diag-btn"
            @click="confirm1"
          >
            前去支付
          </button>
        </div>
      </div>
      <div class="circleclose">
        <Icon name="circleclose" style="font-size: 34px" @click="close1" />
      </div>
    </div>
  </div>
</template>
<script>
import Btn from  'src/cssModules/public/btn'
export default {
  components:{
    Btn
  },
  props: {
    widget:{
      type: Boolean,
      default: true
    },
    list: Array,
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    onConfirm: Function,
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
    },
    close: {
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
    closeDiag(){
      this.$emit("input", false)
    },
    close1(){
      this.$emit("input", false)
    },
    clickDiag(){
      this.$emit("input", false)
    },
    cancel1 () {
      this.$emit("cancel1")
    },
    confirm1(){
      this.$emit("confirm1")
    }
  }
}
</script>
