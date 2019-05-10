<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <Actionsheet
    v-model="show"
    :title="title"
  >
    <div class="picker">
      <!-- <div class="picker-item borderline">
        <li class="picker-tip">
          请选择
        </li>
      </div> -->
      <div class="picker-item-group">
        <li
          v-for="item in list"
          :key="item.id"
          class="picker-item"
          @click="choose(item)"
        >
          {{ item.title }}
        </li>
      </div>
    </div>
  </Actionsheet>
</template>

<script>
import Actionsheet from './actionsheet'
export default {
  components: {
    Actionsheet
  },
  props: {
    list: Array,
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String
    },
    iconType: {
      type: String,
      default: 'back'
    },
    trackName: {
      type: String,
      default: ''
    },
    // 点遮罩关闭
    isClickHide: {
      type: Boolean,
      default: true
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: this.value
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val
      }
    },
    show: function (v) {
      this.$emit('input', v)
    }
  },
  created: function () {
    var self = this
    this.$Bus.$on(['actionsheet', 'pop'], function () {
      self.$emit('input', false)
    })
  },
  methods: {
    choose (item) {
      this.$emit('choose', item)
      this.$emit('input', false)
    }
  }
}
</script>
