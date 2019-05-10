<!-- 
  <box></box>
  属性
  title: 标题
  headNoBorder: 标题下面的线去掉
  noGap: 没有距离下面的间距

  <template slot="head"></template>
  放到head下
  如果没head 或者 title 则不显示标题.m-box-head

  <template slot="body"></template>
  <box></box>
  这种情况都放到.m-box-body中, body在上

  注: 用slot时请用template，否则会多出一个标签嵌套
 -->
<template>
  <div
    class="m-box"
    :class="{'no-gap': noGap}"
    @click="$emit('click')"
  >
    <div
      v-if="$slots.head || title"
      class="m-box-head"
      :class="{'no-border': headNoBorder}"
    >
      <slot name="head">
        <h3
          v-if="title"
          class="m-box-tit"
        >
          {{ title }}
        </h3>
      </slot>
    </div>
    <div class="m-box-body">
      <slot name="body" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Box',
  props: {
    title: {
      type: String,
      default: ''
    },
    // 标题下面的线要不要
    headNoBorder: {
      type: Boolean,
      default: false
    },
    // 没有距离下面的间距
    noGap: {
      type: Boolean,
      default: false
    }
  }
}
</script>
