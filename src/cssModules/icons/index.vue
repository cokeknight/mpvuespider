<template>
  <i :class="'iconfont icon-' + name + ' ' + customClass" @click="clickMe" />
</template>

<script>
export default {
  // 自定义标签名字
  name: 'Icon',
  props: {
    name: {
      default: '',
      type: String
    },
    customClass: String,
    to: String
  },
  methods: {
    clickMe: function () {
      if (this.to) {
        if (mpvuePlatform === 'h5') {
          this.$router.push(this.to)
        } else {
          let to = this.to
          if (this.to[0] !== '/'){
            to = '/' + this.to
          }
          const url = '/page' + to + '/index'
          wx.navigateTo({
            url: url
          })
        }
      }

      this.$emit('click')
    }
  }
}
</script>
