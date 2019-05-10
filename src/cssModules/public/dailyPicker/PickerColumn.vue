<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div
    ref="picker"
    class="picker-column"
    :style="'height: '+ itemHeight * visibleItemCount +'px'"
  >
    <ul :style="wrapperStyle">
      <li
        v-for="(item,index) in list"
        :key="item.id"
        :style="'height: ' + itemHeight+'px'"
        :class="'picker-column-item ' + (index === currentIndex? 'selected': '') "
      >
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
import { range,isObj } from './utils';
const DEFAULT_DURATION = 200;
export default {
  name: 'CityPicker',
  props: {
    list: Array,
    itemHeight: {
      type: Number,
      default: 10
    },
    visibleItemCount: Number
  },
  data() {
    return {
      startY: 0,
      offset: 0,
      duration: 0,
      startOffset: 0,
      options: this.list,
      currentIndex: this.defaultIndex
    };
  },
  computed: {
    count() {
      return this.list.length;
    },
    wrapperStyle(){
      const baseOffset = (this.itemHeight * (this.visibleItemCount - 1)) / 2;
      return {
        transition: `${this.duration}ms`,
        transform: `translate3d(0, ${this.offset + baseOffset}px, 0)`,
        lineHeight: `${this.itemHeight}px`
      };
    }
  },

  watch: {
    defaultIndex() {
      this.setIndex(this.defaultIndex);
    }
  },
  mounted(){
    const picler = this.$refs.picker
    picler.addEventListener('touchstart', this.onTouchStart,{ passive: false })
    picler.addEventListener('touchmove', this.onTouchMove,{ passive: false })
    picler.addEventListener('touchend', this.onTouchEnd,{ passive: false })
    picler.addEventListener('touchcancel', this.onTouchEnd,{ passive: false })
  },
  created() {
    this.$parent.children && this.$parent.children.push(this);
    this.setIndex(this.currentIndex);
  },

  beforeDestroy() {
    const { children } = this.$parent;
    children && children.splice(children.indexOf(this), 1);
    const picler = this.$refs.picker
    picler.removeEventListener('touchstart', this.onTouchStart,{ passive: false })
    picler.removeEventListener('touchmove', this.onTouchMove,{ passive: false })
    picler.removeEventListener('touchend', this.onTouchEnd,{ passive: false })
    picler.removeEventListener('touchcancel', this.onTouchEnd,{ passive: false })
  },
  methods:{
    setValue(value) {
      const { options } = this;
      for (let i = 0; i < options.length; i++) {
        if (this.getOptionText(options[i]) === value) {
          return this.setIndex(i);
        }
      }
    },
    getOptionText(option) {
      return isObj(option) && this.valueKey in option ? option[this.valueKey] : option;
    },
    isDisabled(option) {
      return isObj(option) && option.disabled;
    },
    adjustIndex(index) {
      index = range(index, 0, this.count);
      for (let i = index; i < this.count; i++) {
        if (!this.isDisabled(this.options[i])) return i;
      }
      for (let i = index - 1; i >= 0; i--) {
        if (!this.isDisabled(this.options[i])) return i;
      }
    },
    onTouchStart(event) {
      this.startY = event.touches[0].clientY;
      this.startOffset = this.offset;
      this.duration = 0;
      // event.preventDefault();
    },
    setIndex(index, userAction) {
      index = this.adjustIndex(index) || 0;
      this.offset = -index * this.itemHeight;

      if (index !== this.currentIndex) {
        this.currentIndex = index;
        userAction && this.$emit('change', index);
      }
    },
    getValue() {
      return this.options[this.currentIndex];
    },
    onTouchMove(event) {
      console.log('touchsmove')
      event.preventDefault();
      const deltaY = event.touches[0].clientY - this.startY;
      this.offset = range(
        this.startOffset + deltaY,
        -(this.count * this.itemHeight),
        this.itemHeight
      );
    },

    onTouchEnd() {
      console.log('touchend')
      if (this.offset !== this.startOffset) {
        this.duration = DEFAULT_DURATION;
        const index = range(Math.round(-this.offset / this.itemHeight), 0, this.count - 1);
        this.setIndex(index, true);
      }
    },
  }
}
</script>
