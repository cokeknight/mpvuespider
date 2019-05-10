<!--

  <list-item>
    默认显示main内容
  </list-item>
  label: 左侧内容(主要用于表单时的label)
  main: 中间内容
  side: 右栏内容
  to: 跳转路由, 调用myMixin加的共用go函数,支持以下几条格式
    1. <icon to="routerName"></icon>
    2. <icon to="/path"></icon>
    3. <icon :to="{}"></icon>
  replace: 路由跳转时用replace替换现有路由, 没to则replace也没用
  show-arr: 显示右边的箭头
  toggle: 手风琴效果
  color-turn: 颜色翻转，由左黑右灰，变成右灰左黑
  no-bg: 去掉背景
  no-border 去掉下边框
  gap: 距离下面是不是有空隙
  track: 常见问题中，可以设置此项，埋点Name中添加当前点击文字

  eg:

  <list-item label="" to="invest" replace show-arr color-turn toggle>
    <template slot="label"></template>
    <template slot="main"></template>
    <template slot="side"></template>
    <template slot="body"></template>
  </list-item>
  label 与 <template slot="label"></template>同时出现时显示template内容

  注:
  1. 用slot时请用template，否则会多出一个标签嵌套
  2. 自动显示小箭头的几种情况
    a: show-arr: true
    b: to有传值
    c: toggle:true
    d: list组件toggle:true
 -->
<template>
  <div
    v-track="{name: trackName + (track ? '_' + main : '')}"
    :class="toggleClass"
    @click="clickMe"
  >
    <label>
      <div
        class="list-menu-head"
      >
        <img v-if="frontAvatar" :src="frontAvatar" :size="iconSize" class="front-avatar" />
        <Icon v-if="frontIcon" :name="frontIcon" :size="iconSize" custom-class="front-icon" />
        <div
          v-if="showLabel"
          class="list-menu-label no-flex"
        >
          <slot name="label" />
        </div>
        <div
          v-if="label"
          class="list-menu-label no-flex"
        >
          {{ label }}
        </div>
        <div v-if="!useMainText" class="list-menu-main">
          <slot name="main" /><slot />
        </div>
        <div v-if="useMainText" class="list-menu-main">
          {{ main }}
        </div>
        <div
          v-if="canShowArr"
          :class="'list-menu-side no-flex ' + (sideClass || '')"
        >
          <slot name="side" />
          <i
            v-if="canShowArr"
            :class="'arrow ' + ( canShowArr ? 'arrow-r' : (isOpening ? 'arrow-u' : 'arrow-d'))"
          />
        </div>
        <div
          v-if="showSide && !side"
          :class="'list-menu-side no-flex ' + (sideClass || '')"
        >
          <slot name="side" />
        </div>
        <div
          v-if="showSide && side"
          :class="'list-menu-side ' + (sideClass || '')"
        >
          <div class="imgDiv">
            <img v-if="sideAvatar" :src="side" class="side-avatar" />
          </div>
          <span class="side">{{ sideAvatar ? '' : side }}</span>
        </div>
        <div v-if="arrowClass" class="list-menu-side no-flex">
          <i :class="'arrow ' + arrowClass" />
        </div>
      </div>
      <div
        class="list-menu-body"
      >
        <slot name="body" />
      </div>
      <div
        v-if="$slots.bodyimg"
        class="list-menu-bodyimg"
      >
        <slot name="bodyimg" />
      </div>
    </label>
  </div>
</template>

<script>

export default {
  // 自定义标签名字
  name: 'ListItem',
  props: {
    sideAvatar:Boolean,
    customClass:{
      type: String,
      default:''
    },
    frontAvatar: String, //前置头像
    iconSize: String,
    frontIcon: {
      type: String,
      default: ''
    }, //前置ICON
    arrowClass: String,
    sideClass: String,
    label: {
      type: String,
      default: ''
    },
    main: String,
    useMainText: {
      type: Boolean,
      default: false
    },
    side: [String, Number],
    // 跳转路由
    to: [String, Object],
    // 路由是否替换
    replace: Boolean,
    showLabel: Boolean, //显示label模板
    showSide: Boolean, //显示右侧模板菜单
    showArr: Boolean,
    // 手风琴效果, 显示/隐藏
    toggle: Boolean,
    // 颜色翻转，由左黑右灰，变成右灰左黑
    colorTurn: Boolean,
    // 是否去掉白背景
    noBg: Boolean,
    // 是否去掉下边框
    noBorder: {
      type: Boolean,
      default: false
    },
    // 埋点
    trackName: String,
    // 距离下面10px
    gap: Boolean,
    track: {
      type: Boolean,
      default: false
    }
  },
  data: function () {
    return {
      // 如果父组件list加上toggle会修改myToggle
      // toggle不可以修改，所以新创建一个
      myToggle: this.toggle,
      // toggle 当前状态
      isOpening: false
    }
  },
  computed: {
    // 能显示arr
    canShowArr: function () {
      return this.showArr || this.to || this.myToggle
    },
    toggleClass: function () {
      var curClass = 'list-menu-item'
      if (this.myToggle) {
        curClass += this.isOpening ? ' list-menu-open' : ' list-menu-close'
      }
      // 颜色翻转
      if (this.colorTurn) {
        curClass += ' color-turn'
      }
      // 是否去掉背景
      if (this.noBg) {
        curClass += ' no-bg'
      }
      // 是否去掉背景
      if (this.noBorder) {
        curClass += ' no-border'
      }
      // 是否距离下面有空隙
      if (this.gap) {
        curClass += ' space-bottom'
      }
      if (this.customClass) {
        curClass +=' ' +this.customClass
      }
      return curClass
    }
  },
  methods: {
    toggleState: function () {
      if (this.myToggle) {
        this.isOpening = !this.isOpening
        this.$emit('toggle', this.isOpening)
        // 与list组件交互
        this.$emit('listItemToggle', {
          vueUid: this._uid,
          isOpening: this.isOpening
        })
      }
    },
    clickMe: function (event) {
      // 跳转路由时，如果他是个toggle的话就不跳
      if (this.to && !this.myToggle) {
        this.go(this.to, this.replace ? 'replace' : '')
      }
      this.$emit('click')
    }
  }
}
</script>
