<!--
  <action-sheet>
    :show.sync: 是否显示(sync必填)
    :lists 菜单数组
    [
      [{
        text: '菜单1'
      }]
      ['菜单2']
    ]
    selected: [] 选中当前第几项，长度要与lists一样, 0为第一个
    :clickMaskHide 点遮罩是否关闭
  </action-sheet>

  事件:
  mask: 点遮罩
  close: 关闭
  cancel: 点取消
  // 这两个会传两个参数 (选中值, 当前选中的坐标)
  change: 选中值时
  confirm: 点确定
  hm:调用滑动时间插件可以如下使用
  <sheet :show.sync="chooseTime">
    <datepicker-touch :current-date.sync="params.time" @change="changeVal" :show.sync="chooseTime" :group-title="true" hideDay></datepicker-touch>
  </sheet>
-->
<template>
  <!--<sheet
    class="groupsheet"
    :clickMaskHide="clickMaskHide"
    :show.sync="showBox"
    :hide-mask="hideMask"
    @close="$emit('close')"
    @mask="$emit('mask')">-->
  <div
    v-show="show"
    class="groupsheet"
  >
    <div
      v-if="groupTitle"
      class="groupTitle"
    >
      <span
        class="cancel"
        @click="cancelClick"
      >{{ cancelText }}</span> <span
        class="confirm"
        @click="confirmClick"
      >{{ confirmText }}</span>
    </div>
    <div class="groupsheet-hold" />
    <div class="groupsheet-content">
      <div
        v-for="(group, index) in lists"
        ref="elems"
        key="index"
        class="item"
      >
        <ul>
          <li
            v-for="(item, count) in group"
            key="count"
            :class="{active: curSelected[index] == count}"
          >
            {{ item.text || item }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import touch from 'touch';
//  import sheet from 'sheet'
import { setStyleText, bind, addClass, removeClass } from 'dom';

let lineHeight = 50;

export default {
  name: 'GroupSheet',
  components: {
    //      sheet
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    lists: {
      type: Array,
      required: true
    },
    // 点遮罩关闭
    clickMaskHide: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    // 当前选中项目
    selected: {
      type: Array
    },
    groupTitle: {
      type: Boolean,
      default: true
    },
    lineHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // move时elem上的css值
      targetDis: 0,
      // 当前选中项的key值集合
      curSelected: [],
      // 选中项对应的值
      value: []
    };
  },
  computed: {
    showBox: {
      set: function(v) {
        this.$emit('update:show', v);
      },
      get: function() {
        return this.show;
      }
    }
  },
  watch: {
    lists: {
      deep: true,
      handler: function() {
        // 保证 ref 渲染完成
        this.$nextTick(function() {
          // 刷新dom
          this.$el.clientHeight;
          this.render();
        });
      }
    }
  },
  mounted() {
    if (this.lineHeight) lineHeight = +this.lineHeight;
    this.render();
  },
  methods: {
    render: function() {
      // 存默认的选中项数据, 下标对应对lists下标
      let curSelected = [];
      // 有默认选中项则copy一份过来, 并保证他的长度
      if (this.selected) {
        curSelected = this.selected.slice(0, this.lists.length);
      }
      this.$refs.elems.forEach((elem, index) => {
        // 子元素长度
        let childLen = this.lists[index].length;
        // 子元素可以滑动的最大长度
        // 这个用户向上最大可以选择的长度
        // 最少要留2个在界面，要不然没有选中项，所以+2
        elem.maxChildLen = 2 - childLen;
        // 出始化绑定touch事例与事件
        this.initBind(elem);
        // 数组下标
        let curIndex = Math.max(curSelected[index] || 0, 0);
        curIndex = Math.min(curIndex, childLen - 1);
        // 填充当前选中项，用于for循环
        curSelected[index] = curIndex;
        // css滚动位置 cssPos = - 数组下标, 这时第一个是当前选中项
        // 因为设计要求第2个为选中项，所以在这个基础上+1
        elem.scrollDis = lineHeight * (1 - curIndex);
        // 设置默认样式
        this.setCssDis(elem);
      });
      // 保存已经选中的坐标
      this.curSelected = curSelected;
      this.collectValue();
      this.$emit('change', this.value, this.curSelected);
    },
    initBind: function(elem) {
      // 如果已经绑定过事件就不要再绑定了
      // 因为vue会复用,所以只加一次就可以了
      if (!elem.touch) {
        let instance = touch(elem, {
          start: () => {
            // 开始时要设置为0
            // 防止之前遗留下的距离对这个产生影响
            this.targetDis = 0;
          },
          // 捕捉touchmove
          move: ({ diff }) => {
            // 这时不考虑最大，最小的滑动距离
            this.setCssDis(elem, diff.top);
          },
          // 捕捉touchend
          end: () => {
            this.end(elem);
          }
        });
        // 挂载实例
        elem.touch = instance;
        // 绑定动画效果
        bind(elem, 'transitionend', () => {
          this.transitionEnd(elem);
        });
      }
    },
    end: function(elem) {
      // 值没变就不更新
      if (!this.targetDis || this.targetDis == elem.scrollDis) return;
      // 选中的是第几个
      let times = this.targetDis / lineHeight;
      // css可滑动到第几个
      let ratio = Math.ceil(times);
      // 对上下限作处理
      ratio = this.filterIndex(elem, ratio);
      // 把当前滚动的距离更新到elem.scrollDis里
      elem.scrollDis = ratio * lineHeight;
      // 不是整倍数, 则要加动画, 如果不作判读。
      // 当用户正好拖到到节点位置就不会触发回调
      // 回调收transitionend触发
      if (times != ratio) {
        addClass(elem, 'is-transition');
      }
      // 更新css
      this.setCssDis(elem);
      // 更新选中项的下标
      this.updateSelected(ratio, elem);
      // 不是倍数，也就是说用户正好拖到到节点位置
      // 这时不用加动画效果，要直接触发
      if (times == ratio) {
        this.transitionEnd(elem);
      }
    },
    // 根据当前选中项index算出选中项的下标
    updateSelected: function(ratio, elem) {
      let index = Math.abs(ratio - 1);
      // 当前是第几个elem
      let which = this.$refs.elems.indexOf(elem);
      this.curSelected.splice(which, 1, index);
    },
    // index为css滑动的坐标, 返回有效值
    filterIndex: function(elem, index) {
      // 如果超过最大的就要减去2, 要不然选中为空
      if (index <= elem.maxChildLen) {
        index = elem.maxChildLen;
      }
      // 这时是往下拖动,要留一个，要不然选中为空
      if (index > 1) {
        index = 1;
      }
      return index;
    },
    setCssDis: function(elem, dis) {
      let curDis = elem.scrollDis + (dis || 0);
      setStyleText(elem, '-webkit-transform:translateY(' + curDis + 'px);transform:translateY(' + curDis + 'px)');
      this.targetDis = curDis;
    },
    // 选中项后的回调
    transitionEnd: function(elem) {
      removeClass(elem, 'is-transition');
      this.collectValue();
      this.$emit('change', this.value, this.curSelected);
    },
    // 收集选中的项
    collectValue: function() {
      let ref = [];
      let lists = this.lists;
      lists.forEach((item, index) => {
        item = this.curSelected[index];
        ref.push(lists[index][item]);
      });
      this.value = ref;
    },
    cancelClick: function() {
      this.showBox = false;
      this.$emit('cancel');
    },
    confirmClick: function() {
      this.collectValue();
      this.showBox = false;
      this.$emit('confirm', this.value, this.curSelected);
    }
  }
};
</script>
