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
  gap: 距离下面是不是有空隙

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
  <list-item
    :show-arr="showArr"
    :to="to"
    :replace="replace"
    class="list-menu-bank"
    :class="{'has-bank-code': icon}"
    @click="$emit('click')"
  >
    <i
      v-if="icon"
      :class="'bank-' + icon"
    />
    <dl>
      <dt>{{ title }}</dt>
      <dd v-if="info">
        {{ info }}
      </dd>
    </dl>
    <template slot="side">
      {{ side }}
    </template>
  </list-item>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'ListBank',
  props: {
    icon: {
      type: String,
      detault: ''
    },
    title: String,
    info: String,
    // 跳转路由
    to: [String, Object],
    // 路由是否替换
    replace: Boolean,
    showArr: Boolean,
    side: String
  },
  data: function () {
    return {
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>
