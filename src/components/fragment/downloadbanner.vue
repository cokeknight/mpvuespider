<template>
  <div
    v-show="show"
    class="downloadbanner"
  >
    <i
      v-track="{name:trackName+'_closeopenapp'}"
      class="resg-close"
      @click="hideit"
    /> <img
      class="downloadbanner-logo"
      src="../../assets/images/index/tit-logo.png"
    >
    <router-link
      v-track="{name:trackName+'_openapp'}"
      :to="{name: 'openapp'}"
      class="downloadbanner-btn"
    >
      下载APP
    </router-link>
  </div>
</template>

<script>
import userService from 'userService';

export default {
  props: {
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: !userService.getAttr('hide_download')
    };
  },
  watch: {
    'show': function(newValue) {
      !newValue ? this.$emit('hide') : this.$emit('show');
    }
  },
  created: function() {
    if (!this.show) {
      this.$emit('hide');
    }
  },
  methods: {
    hideit() {
      this.show = false;
      userService.setAttr('hide_download', true);
    }
  }
};
</script>
