<!--
  属性:
  split: 返回值的分界线 eg: '-' ==> '1878-2-1'
  show: 显示隐藏
  clickMaskHide: 点遮罩是否关闭
  currentDate: 默认传过来的值，没就按当前算
  2018-04-10新增功能
  flashback: 时间倒叙展示
  minTime: 最小选中月份
  justNow: 最大选中为当前月份
  groupTitle：group不展示title
  hideDay: 不展示天那一列

  事件:
  mask: 点遮罩
  close: 关闭
  cancel: 点取消
  // 这两个会传两个参数 (选中值字符串, 当前选中的坐标)
  change: 选中值时
  confirm: 点确定
-->
<template>
  <group-sheet
    :click-mask-hide="clickMaskHide"
    :show.sync="showBox"
    :lists="lists"
    :selected="selected"
    :group-title="groupTitle"
    line-height="45"
    @close="$emit('close')"
    @mask="$emit('mask')"
    @confirm="dispatch('confirm')"
    @cancel="dispatch('cancel')"
    @change="change"
  />
</template>

<script>
import groupSheet from 'groupSheet';

// 生成天/月之类的数组
function createArr(max) {
  let i = 1, str = '';
  for (; i <= max; i++) {
    str += i < 10 ? '0' + i : i;
    if (i !== max) {
      str += ',';
    }
  }
  return str.split(',');
}

// 生成年的数组
function createYearArr(year, rang) {
  rang = parseInt(rang || 20);
  let i = year - rang;
  if (this.minTimeYear) {
    i = this.minTimeYear;
  }
  let max = year + rang;
  if (this.justNow) {
    max = new Date().getFullYear();
  }
  let str = '';
  for (; i <= max; i++) {
    // 年份倒叙
    if (this.flashback) {
      str = i + str;
      if (i !== max) {
        str = ',' + str;
      }
    } else {
      str += i;
      if (i !== max) {
        str += ',';
      }
    }
  }
  return str.split(',');
}

// 生成天数数组
function createDaysArr(year, month) {
  let days = new Date(year, month, 0);
  days = days.getDate();
  return createArr(days);
}

let months = createArr(12);

export default {
  name: 'Datepicker',
  components: {
    groupSheet
  },
  props: {
    split: {
      type: String,
      default: '-'
    },
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    // 点遮罩关闭
    clickMaskHide: {
      type: Boolean,
      default: true
    },
    // 比如: 2018-12-1
    currentDate: String,
    hideDay: {
      type: Boolean,
      default: false
    },
    groupTitle: {
      type: Boolean,
      default: true
    },
    // 最大可选日期，为当前月份
    justNow: {
      type: Boolean,
      default: false
    },
    // 最小可选日期
    minTime: {
      type: String,
      default: ''
    },
    // 年份倒叙
    flashback: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      lists: [],
      selected: [],
      // 选中项对应的值
      value: '',
      minTimeYear: this.minTime ? this.minTime.split('-')[0] : '',
      minTimeMonth: this.minTime ? this.minTime.split('-')[1] : ''
    };
  },
  computed: {
    showBox: {
      set: function(v) {
        this.$emit('update:show', v);
      },
      get: function() {
        let isShow = this.show;
        if (isShow) {
          this.init();
        }
        return isShow;
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    init: function() {
      // currentDate空字符串 curDate: Invalid Date
      // 传null会按1970年算
      let myDate = this.currentDate;
      let curDate = myDate ? new Date(myDate) : new Date();
      let y = curDate.getFullYear();
      let m = curDate.getMonth() + 1;
      let d = curDate.getDate();
      // 当前数组
      let ys = createYearArr.call(this, y, '');
      let ms = createArr(12);
      // 有设置的最小年份
      if (this.minTime) {
        // 当所选中的年份 等于最小可选年份的时候 手动更改月份
        if (y == this.minTimeYear) {
          ms = ms.slice(ms.indexOf(this.minTimeMonth));
        }
      }
      // 最大可选年份为当月年份
      if (this.justNow) {
        // 所选中年份 等于实际当前年份
        if (y == new Date().getFullYear()) {
          ms = ms.slice(0, ms.indexOf('0' + (new Date().getMonth() + 1)) + 1);
        }
      }
      let ds = createDaysArr(y, m);
      let lists = [ys, ms];
      let values = [y, m];
      // hm:隐藏天这一列的时候，不添加这列数据
      if (!this.hideDay) {
        lists.push(ds);
        values.push(d);
      }
      let selected = Array(lists.length);
      values.forEach((v, index) => {
        v = v + '';
        if (v < 10) {
          v = '0' + v;
        }
        values[index] = v;
        selected[index] = lists[index].indexOf(v);
      });
      // 选中项的值保存
      this.value = values.join(this.split);
      this.lists = lists;
      this.selected = selected;
    },
    change: function(values, selected) {
      // 记录改变的坐标
      let changeIndex = null;
      let copyLists = this.lists.slice();
      let curSelected = selected.slice();
      curSelected.forEach((v, index) => {
        if (v !== this.selected[index] && changeIndex == null) {
          changeIndex = index;
        }
      });
      // 数据没变
      if (changeIndex == null) {
        // 当确认按钮不展示的时候 第一次展示时候 把默认值返回上去
        if (!this.groupTitle && this.showBox) {
          this.dispatch('change');
        }
        return;
      }
      let isChangeLists = true;
      switch (changeIndex) {
        // 年变了
        case 0:
          curSelected[1] = curSelected[2] = 0;
          values[1] = '01';
          // 不更新天
          if (!this.hideDay) {
            values[2] = '01';
            // 更新天数
            copyLists[2] = createDaysArr(values[0], 1);
          }
          break;
        // 月变了
        case 1:
          curSelected[2] = 0;
          // 不更新天
          if (!this.hideDay) {
            values[2] = '01';
            // 更新天数
            copyLists[2] = createDaysArr(values[0], 1);
          }
          break;
        case 2:
          isChangeLists = false;
      }
      this.value = values.join(this.split);
      this.selected = curSelected;
      if (isChangeLists) {
        this.lists = copyLists;
      }
      this.dispatch('change');
    },
    dispatch: function(type) {
      this.$emit(type, this.value, this.selected);
      if (type == 'confirm') {
        this.$emit('update:currentDate', this.value);
      }
    }
  }
};
</script>
