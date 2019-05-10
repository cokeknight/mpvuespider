<template>
  <div :class="'wap-base bg-white view ' + (customClass?customClass:'')">
    <Titlebar v-if="PLATFORM_H5 && titlebar"
              class="login-title"
              v-bind="$attrs"
    />
    <div v-if="!PLATFORM_H5" class="app-footer">
    </div>
    <div :class="'base-view ' + (PLATFORM_H5 && titlebar? 'h5' : 'wx') + (hidden ? ' hidden': '') +(PLATFORM_H5 && footer ?' hasfooter' : '') + (!PLATFORM_H5?' wexin':'')">
      <slot />
    </div>
    <div v-if="PLATFORM_H5 && footer" class="app-footer">
      <AppFooter></AppFooter>
    </div>
  </div>
</template>

<script>
import Titlebar from 'titlebar'
import AppFooter from 'src/components/fragment/footer'
export default {
  components: {
    Titlebar,
    AppFooter
  },
  inheritAttrs: false,
  props: {
    hidden:{
      type: Boolean,
      default: false
    },
    customClass: {
      type: String,
      default: ''
    },
    footer: {
      type: Boolean,
      default: false
    },
    titlebar: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      PLATFORM_H5: mpvuePlatform === 'h5'
    }
  }

}
</script>

