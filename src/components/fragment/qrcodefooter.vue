<template>
  <div
    v-if="isWeixin"
    class="qrcodefooter"
  >
    <downloadbanner />
    <!--<div class="qrcodefooter-weixin">-->
    <!--<p>关注官方微服务<br>即刻玩转鑫合汇</p>-->
    <!--</div>-->
    <!--<div class="qrcodefooter-code">-->
    <!--<img src="../../assets/images/index/erweima.png" alt="">-->
    <!--<p>长按识别二维码</p>-->
    <!--</div>-->
  </div>
</template>
<script>
import downloadbanner from 'downloadbanner';

export default {
  components: {
    downloadbanner
  },
  data() {
    return {
      isWeixin: window.Vue.XUtils.isWeixin()
    };
  }
};
</script>
