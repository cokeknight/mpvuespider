<template>
  <div v-if="!PLATFORM_H5" :class="customClass">
    <Popbox v-model="showPopbox" v-bind="popboxProps" widget></Popbox>
    <Tip v-model="showTip" v-bind="tipProps" widget></Tip>
    <Confirm v-model="showConfirm" v-bind="confirmProps" widget></Confirm>
    <Alert v-model="showAlert" v-bind="alertProps" widget></Alert>
    <Xloading v-model="showLoading" widget></Xloading>
  </div>
</template>

<script>
import Popbox from 'src/components/popbox/zxjhPopbox.vue'
import Tip from 'src/components/tip/index'
import Confirm from 'src/components/popbox/confirm'
import Alert from 'src/components/popbox/alert'
import Xloading from 'src/components/loading/index.vue'
import MP from 'MP'
export default {
  components: {
    Popbox,
    Tip,
    Xloading,
    Confirm,
    Alert
  },
  inheritAttrs: false,
  props: {
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
      PLATFORM_H5: mpvuePlatform === 'h5',
      showAlert:false,
      showTip:false,
      showConfirm:false,
      showPopbox: false,
      showLoading: false,
      popboxProps:'',
      confirmProps:'',
      tipProps:'',
      alertProps:''
    }
  },
  onShow(){
    this.showAlert=false
    this.showTip=false
    this.showConfirm=false
    this.showPopbox= false
    this.showLoading= false
  },
  mounted(){
    if (!this.PLATFORM_H5) {
      MP.Bus.$on('wx-popbox', (props) => {
        this.popboxProps = props
        this.showPopbox = true
      })
      MP.Bus.$on('wx-confirm', (props) => {
        this.confirmProps = props
        this.showConfirm = true
      })
      MP.Bus.$on('wx-tip', (props) => {
        this.tipProps = props
        this.showTip= true
      })
      MP.Bus.$on('wx-alert', (props) => {
        this.alertProps = props
        this.showAlert = true
      })
      MP.Bus.$on('wx-loading', (showLoading = true) => {
        this.showLoading = showLoading
      })
    }
  }

}
</script>

