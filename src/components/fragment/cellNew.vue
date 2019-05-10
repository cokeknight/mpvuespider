<template>
  <router-link
    v-track="{name:trackName+'_'+ value}"
    tag="li"
    :to="dest"
    class="list-menu-head"
  >
    <span class="list-menu-main">{{ value }}</span> <span
      v-if="img_src || right_value"
      class="list-menu-side no-flex"
    >
      <em v-if="img_src"><img
        :src="img_src"
        alt=""
      ></em>
      <em
        v-else
        :class="right_class"
      >{{ right_value }}</em>
    </span> <em
      v-if="!isEmptyObject"
      class="xhh-arr"
    />
  </router-link>
</template>

<script>
/*
  * demo
  * {
   id: 'phone',
   name: '手机认证',
   img_src: '',
   right_value: '',
   right_class: '',
   link_params: {name: '11'}
   }
  * img_src优先级高，为true不展示right_value
  * link_params为空对象的话，默认右侧箭头不显示
  * */
export default {
  props: {
    value: {
      type: String,
      required: true
    },
    trackName: {
      type: String,
      default: ''
    },
    linkParams: {
      type: Object,
      required: false
    },
    rightValue: {
      type: String,
      required: false
    },
    rightClass: {
      type: String,
      required: false
    },
    imgSrc: {
      type: String,
      required: false
    }
  },
  computed: {
    dest: function() {
      let obj = this.link_params || {};
      return obj;
    },
    isEmptyObject() {
      var t;
      for (t in this.link_params) {
        return !1;
      }
      return !0;
    }
  },
  methods: {}
};
</script>
