<template>
  <li @click="click">
    <router-link
      v-track="{name:trackName+'_'+name}"
      tag="a"
      :to="dest"
      class="dba"
    >
      <em
        v-if="left_lcon"
        :class="left_lcon"
      /> <em
        v-if="left_ava"
        class="cellbox-samll-avatar"
      ><img :src="left_ava"></em> {{ name }} <span
        v-if="img_src"
        :class="span_class"
      ><div class="cellbox-avatar"><img :src="img_src"></div> > </span> <span
        v-else
        :class="span_class"
      >{{ span_val }}<em
        v-if="icon_class"
        class="icon-middle icon-wh"
        :class="icon_class"
      /><em
        v-if="right_spanval"
        :class="right_spanclass"
        class="rightval_distance"
      >{{ right_spanval }}</em><em v-if="right_arr">{{ right_em_val }}</em><em
        v-if="icon_class_tip"
        class="icon-middle icon-whs"
        :class="icon_class_tip"
        @click="tip"
      /></span>
    </router-link>
  </li>
</template>
<style>
  .set-items1.margin-right li span em.icon-whs {
    width: 15px;
    height: 15px;
    margin-left: 0.5rem;
  }

  .icon-wh {
    width: 2rem;
    height: 2rem;
  }

  .rightval_distance {
    margin-left: 1rem;
  }
</style>
<script>
/*
  * API:
  * 1.左侧传入图标样式class--left_lcon
  * 2.传入名称--name
  * 3.右侧显示图片或者文字--img_src/span_val 以及显示的class--span_class
  * 4.跳转路径--link
  * 5.控制右方箭头显示与否--right_arr
  * */
export default {
  props: {
    rightSpanval: {
      type: String,
      required: false
    },
    iconClass: {
      type: String,
      required: false
    },
    iconClassTip: {
      type: String,
      required: false
    },
    rightSpanclass: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    link: {
      type: String,
      required: false
    },
    linkParams: {
      type: Object,
      required: false
    },
    leftLcon: {
      type: String,
      required: false
    },
    leftAva: {
      type: String,
      required: false
    },
    spanClass: {
      type: String,
      required: false
    },
    // fzc: 不要加类型，有时会是undefined，这时会报错
    spanVal: {
      required: false
    },
    imgSrc: {
      type: String,
      required: false
    },
    rightArr: {
      type: Boolean,
      required: false,
      default: true
    },
    rightEmVal: {
      type: String,
      required: false,
      default: ' > '
    },
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  computed: {
    dest: function() {
      let obj = {};
      if (this.link_params) {
        obj.params = this.link_params;
      }
      if (this.link) {
        obj['name'] = this.link;
      }
      return obj;
    }
  },
  methods: {
    click: function() {
      this.$emit('click');
    },
    tip: function() {
      this.$emit('tip');
    }
  }
};
</script>
<style>
  .dba {
    display: block;
  }
</style>
