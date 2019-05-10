<!--
  <btn>内容</btn>
  属性:
  color: blue|yellow|red|white 按钮的背景颜色
  small: 小按钮，高度，字的大小都有些缩小
  auto: 两边padding减小
  single: 方角按钮，默认一行显示
  full: 全屏样式
  bottom: 按钮固定在底部
  space-top: 距离上面距离，50px通常比较远
  to: 跳转路由, 调用myMixin加的共用go函数,支持以下几条格式
    1. <icon to="routerName"></icon>
    2. <icon to="/path"></icon>
    3. <icon :to="{}"></icon>
  replace: 路由跳转时用replace替换现有路由, 没to则replace也没用

  事件:
  click: 点击时触发
 -->
<template>
  <button
    v-track="{name: trackName}"
    type="button"
    :disabled="disabled"
    :class="btnClass"
    :formType="getFormType"
    :open-type="openType"
    @getphonenumber="getPhoneNumberFunc"
    @click="clickMe"
  >
    <span v-if="text">{{ text }}</span>
    <slot />
  </button>
</template>

<script>
var btnMap = {
  blue: 'btn-primary',
  yellow: 'btn-warning',
  red: 'btn-danger',
  white: 'btn-default'
}

// 小按钮 瘦按钮(左右留白小) 直角
var shapeArr = ['small', 'auto', 'single', 'bottom', 'full']

export default {
  // 自定义标签名字
  name: 'Btn',
  props: {
    getPhoneNumber:{
      type: Function,
    },
    openType:{
      default:'',
      type: String,
    },
    text: {
      default:'',
      type: String,
    },
    btnType: {
      default:'',
      type: String,
    },
    customClass:String,
    color: String,
    // 小按钮
    small: Boolean,
    // 去掉最小宽度，根据实际内容撑
    auto: Boolean,
    // 方角
    single: Boolean,
    // 通栏
    full: Boolean,
    // 是否悬挂到最底部
    bottom: Boolean,
    // 距离上面距离，50px通常比较远
    spaceTop: Boolean,
    // 埋点
    trackName: String,
    // 跳转路由
    to: [String, Object],
    // 路由是否替换
    replace: Boolean,

    autoDisable: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      disabled: false
    }
  },
  computed: {
    getFormType: function () {
      if (mpvuePlatform === 'h5') {
        return false
      } else {
        return this.btnType
      }
    },
    btnClass: function () {
      var str = 'btn-mod ', self = this
      str += btnMap[this.color] || 'btn-normal'

      shapeArr.forEach(function (item) {
        if (self[item]) {
          str += ' btn-' + item
        }
      })
      if (this.spaceTop) {
        str += ' btn-space-top'
      }
      if (this.customClass) {
        str += " " + this.customClass
      }

      return str
    }
  },
  methods: {
    clickMe: function (event) {
      if (this.formType ==='submit') { //小程序使用form的submit方法
        return false
      }
      if (this.autoDisable && this.disabled){
        return false
      }
      if (this.to) {
        this.go(this.to, this.replace ? 'replace' : '')
      }
      if (this.autoDisable) {
        this.disabled = true
      }
      this.$emit('click',event)
    },
    getPhoneNumberFunc(e){
      this.$emit('getphonenumber', e)
    },
    enable: function () {
      this.disabled = false
    }
  }
}
</script>
