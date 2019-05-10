<template>
  <div class="simulakeyboardcontainer">
    <list-item>
      <div
        class="m-input m-input-cancel simulainput"
        @click="showCursor"
      >
        {{ currentValue }} <span :class="'fb-Search_FauxInput ' + (showCursorFlag? 'showcursor' : '')">{{ currentValue }}</span>
        <icon size="20"
              @click="dispatch('clear')" v-if="showClose" class="m-input-close" :href="sign" />
      </div>
      <template slot="side">
        <span
          class="bestidea"
          @click="dispatch('best')"
          v-zhuge="{name: '出借-输入金额-点击最优方案', data: {'项目类型': opts.prj_business_type_name}}"
        >最优方案</span>
      </template>
    </list-item>
    <section class="simulakeyboard">
      <div class="numgrid">
        <ul class="row">
          <li @touchstart="key(1)">
            <a>1</a>
          </li>
          <li @touchstart="key(2)">
            <a>2</a>
          </li>
          <li @touchstart="key(3)">
            <a>3</a>
          </li>
        </ul>
        <ul class="row">
          <li @touchstart="key(4)">
            <a>4</a>
          </li>
          <li @touchstart="key(5)">
            <a>5</a>
          </li>
          <li @touchstart="key(6)">
            <a>6</a>
          </li>
        </ul>
        <ul class="row">
          <li @touchstart="key(7)">
            <a>7</a>
          </li>
          <li @touchstart="key(8)">
            <a>8</a>
          </li>
          <li @touchstart="key(9)">
            <a>9</a>
          </li>
        </ul>
        <ul class="row">
          <li><a>.</a></li>
          <li @touchstart="key(0)">
            <a>0</a>
          </li>
          <li @touchstart.stop.prevent="dispatch('hide')">
            <icon
              href="keyboard_close"
              size="32"
              color="#000" />
          </li>
        </ul>
      </div>
      <div class="rightside">
        <li @touchstart="cancle">
          <span><icon
            href="keyboard_delete"
            size="32"
            color="#000" /></span>
        </li>
        <li
          class="investbtn"
          @click="dispatch('done')"
          v-zhuge="{name: '出借-输入金额-点击键盘按钮（立即出借）', data: {'项目类型': opts.prj_business_type_name, '键盘按钮': '立即出借'}}"
        >
          <span>立即出借</span>
        </li>
      </div>
    </section>
  </div>
</template>
<script>

import inputM from 'inputM';

const isValidInteger = /^\d+$/;

export default {
  components: {
    inputM
  },
  props: {
    reset: {
      type: Boolean,
      default: false
    },
    trackName: {
      type: String,
      default: ''
    },
    // 关闭按钮 href
    sign: {
      type: String,
      default: 'failure'
    },
    value:,
    opts: {
      type: Object,
      default: {}
    }
  },
  computed: {
    showClose: function() {
      return this.currentValue && !this.readOnly;
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function(value) {
        this.setCurrentValue(value);
      }
    }
  },
  data: function() {
    return {
      readOnly: false,
      currentValue: '',
      showCursorFlag: true, // 是否显示光标 内部变量
      form: {
        money: ''
      }
    };
  },
  mounted() {
  },
  methods: {
    showCursor: function() {
      this.showCursorFlag = true;
    },
    dispatch: function(type, val) {
      // 需要更新数据
      if (type == 'clear') {
        this.clear();
        return;
      }
      if (type === 'done') {
        if (this.currentValue == '') {
          this.$Tip('请输入金额');
          return false;
        }
      }
      this.$emit(type, val);
    },
    key(num) {
      let newNum = this.currentValue + num;
      if (isValidInteger.test(newNum)) {
        this.showCursorFlag = false;
        this.$emit('input', newNum);
        this.setCurrentValue(newNum);
      }
    },
    clear() {
      this.$emit('input', '');
      this.setCurrentValue('');
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
    },
    cancle() {
      let value = this.currentValue.substring(0, this.currentValue.length - 1);
      this.$emit('input', value);
      this.setCurrentValue(value);
    }
  }
};
</script>
