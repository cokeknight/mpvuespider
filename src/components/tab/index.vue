<!--
  current li选中状态要加的class
  value 必传参数，用入控制当前选中项(v-model="index")
  list 传入的数组[item], item可以是简单的数据类型，也可以是对象，是对象的话要包括text字段用于显示, sort 排序箭头 asc:箭头向上 desc:箭头向下
  fixed 是否固定到头部
  切换的时候会发出 'click' 事件
  matchRoute 初始化时用list里自动匹配当前路由，选中当前状态
  type: 外观样式
      line: 当前状态下面有根蓝线 如: /faq
      circle: 圆角篮筐 如:/invest
      gray: 当前状态灰背景 如鑫利宝详情页: /xlb/detail/1/2/136
  touchMove：外部改变value值，组件会自动判断选中内容是否被遮挡，会自动展示出来。
-->
<template>
  <div
    ref="tabs"
    :class="['tabbox', type, fixed ? 'fixed' : '']"
  >
    <!-- <ul v-touch:menu class="css3-flex"> -->
    <ul class="css3-flex">
      <li
        v-for="(item, count) in list"
        :key="item.text"
        v-track="{name:trackName + 'tabswitch' + (item.text || item)}"
        :class="count == curIndex ? current : ''"
        @click="changeNav(count, item)"
      >
        {{ item.text || item }} <span v-if="item.sort == 'desc'">↑</span> <span v-if="item.sort == 'asc'">↓</span>
      </li>
    </ul>
  </div>
</template>
<script>
// let indexOf = window.Vue.XUtils.indexOf

export default {
  props: {
    current: {
      type: String,
      default: 'active'
    },
    list: {
      required: true,
      type: Array
    },
    value: {
      default: 0
    },
    type: {
      type: String,
      default: 'line'
    },
    fixed: {
      type: Boolean,
      default: false
    },
    // 自动匹配路由
    matchRoute: {
      type: Boolean,
      default: false
    },
    trackName: {
      type: String,
      default: ''
    },
    touchMove: {
      type: Boolean,
      default: false
    },
    marginNum: {
      type: Number,
      default: 0
    }
  },
  data: function() {
    return {
      // vue2.0不允许改根据属性传来的值
      curIndex: this.value
    };
  },
  watch: {
    'value'(val, old) {
      this.curIndex = val;
      if (this.touchMove) {
        // 计算当前的位置
        this.translateNewX(val, old);
      }
    }
  },
  mounted: function() {
    // 自动匹配路由
    // if (this.matchRoute) {
    //   let match = {
    //     name: this.$route.name
    //   }
    //   this.curIndex = indexOf(match, this.list)
    // } else {
    //   this.curIndex = this.value
    // }
    // if (this.curIndex) {
    //   // 计算当前的位置
    //   this.translateNewX(this.curIndex, 0)
    // }
  },
  methods: {
    changeNav: function(count, item) {
      if (this.curIndex == count && !item.sort) return;
      // 正常切换
      if (this.curIndex != count) {
        this.$emit('input', count);
        this.$emit('click', count, this.list[count]);
      }
      // 同一个导航第二次点击
      // 如果有sort说明要排序，可以重复点击
      if (this.curIndex == count && item.sort) {
        this.$emit('click', count, this.list[count]);
      }
      this.curIndex = count;
      // 回到顶部
      this.$Bus.$emit('IScroll:top');
    },
    translateNewX(val, old) {
      // ul宽度
      let ulWidth = this.$refs.tabs.scrollWidth;
      // li宽度
      let itemWidth = this.$refs.tabs.firstChild.scrollWidth;
      // li个数
      let liNum = this.list.length;
      // 屏幕宽度
      let totalWidth = document.body.offsetWidth;
      // 左右两头的时候这样处理
      if (val == 1 || val == 0) {
        this.changeScrollLeft(0);
      } else if (val == liNum - 1) {
        this.changeScrollLeft(this.$refs.tabs.scrollWidth - document.body.offsetWidth);
      } else {
        // 不是两头的时候，看往右走 还是往左走
        let nextLeft = 0, nextRight = 0, itemLeft = 0, itemScrollLeft = this.getScrollLeft() + document.body.offsetWidth;
        if (val > old) {
          // 右侧,判断下个页面是否能全部展示
          nextRight = this.calculationItemWidth(val + 1);
          // 当前左滑动距离 + 屏幕尺寸 < nextRight,下一个展示不全的时候
          if (itemScrollLeft < nextRight) {
            this.changeScrollLeft(nextRight - document.body.offsetWidth);
          }
        } else {
          // 左侧
          nextLeft = this.calculationLeftWidth(val - 1);
          if (nextLeft <= this.getScrollLeft()) {
            this.changeScrollLeft(nextLeft);
          }
        }
      }
    },
    changeScrollLeft(num) {
      this.$refs.tabs.scrollLeft = num;
    },
    getScrollLeft() {
      return this.$refs.tabs.scrollLeft;
    },
    calculationItemWidth(index) {
      // 计算当前index的全部宽度
      let wid = 0;
      for (var i = 0; i <= index; i++) {
        wid += this.$refs.tabs.firstChild.children[i].scrollWidth + this.marginNum * 2;
      }
      return wid;
    },
    calculationLeftWidth(index) {
      // 计算当前index的全左侧宽度
      let wid = 0;
      for (var i = 0; i < index; i++) {
        wid += this.$refs.tabs.firstChild.children[i].scrollWidth + this.marginNum * 2;
      }
      return wid;
    }
  }
};
</script>
