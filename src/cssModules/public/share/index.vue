<!--
  <share-sheet
    title: 弹框标题
    flagTitle: 悬浮按钮文本
    clickMaskHide: 点遮罩是否关闭
  ></share-sheet>

  注: 产品要求只有app才显示这个组件

  shareType 爱车介绍页面 是邀请的海报 lovecar
            支付成功页面 是下定成功的海报 paysuccess

-->
<template>
  <div v-if="server!=='wx'||mpvuePlatform==='wx'" class="sharesheet">
    <div class="sharesheet-flag" @click="showAction(true)" v-if="showSharePop">
      <icon name="share" v-if="shareType!=='orderdetail'"></icon>
      <img v-if="ImgUrl&&shareType==='orderdetail'" :src="ImgUrl+'friends.png?t=121'" width="41" height="34" class="weixinhaoyou" />
      <!-- <p>{{ flagTitle }}</p> -->
    </div>
    <Actionsheet
    :value="show"
    @input="showAction"
    >
      <div class="sharesheet-content">
        <!-- <p class="sharesheet-line">
          分享到
        </p> -->
        <ul class="flex-box">
          <li v-if="server === 'wx'" class="share-item" @click="share('pengyouquan')">
            <icon name="share-pyq"></icon>
            <p>微信朋友圈</p>
          </li>
          <li v-if="mpvuePlatform==='wx'" class="share-item" @click="sharePoster">
            <!-- <icon name="share-pyq"></icon> -->
            <img v-if="ImgUrl" :src="ImgUrl+'poster.png?t=21'" width="41" height="34" class="pengyouquan" />
            <p>生成专属海报</p>
          </li>
          <li v-if="server === 'wx' && mpvuePlatform==='h5'" class="share-item" @click="share('weixin')">
            <icon name="share-weixin"></icon>
            <p>微信</p>
          </li>
          <li v-if="mpvuePlatform==='wx'" class="share-item">
            <!-- <icon name="share-weixin"></icon> -->
            <button open-type="share" class="no-button-bg" @click="showAction(false)">
              <img v-if="ImgUrl" :src="ImgUrl+'friends.png?t=21'" width="41" height="34" class="weixinhaoyou" />
              <p>告诉好友</p>
            </button>
          </li>
          <li v-if="server === 'h5'&&mpvuePlatform==='h5'" class="share-item" @click="share('weibo')">
            <a :href="weiboUrl" style="display:block">
              <icon name="share-weibo"></icon>
              <p>微博</p></a>
          </li>
        </ul>
      </div>
      <div class="sharesheet-cancel" @click="showAction(false)">
        取消
      </div>
    </Actionsheet>
    <Poster title="生成海报" v-model="showPoster" @input="showPosterAction" :shareType="shareType"/>
  </div>
</template>

<script>
import shareService from 'src/plugin/share/share'
import Actionsheet from '../actionsheet'
import Conf from 'src/config'
import Poster from 'src/cssModules/public/share/poster';

export default {
  name: 'ShareSheet',
  components: {
    Actionsheet,
    Poster
  },
  props: {
    showSharePop: Boolean,
    pageHide: Boolean,
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    shareType: String,
    clickMaskHide: {
      type: Boolean,
      default: true
    },
    flagTitle: {
      type: String,
      default: '分享'
    }
  },
  onUnload() {
    this.showPoster = false
  },
  onHide() {
    this.showPoster = false
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val

      }
    }
  },
  data() {
    return {
      ImgUrl: Conf.imgUrl,
      showPoster: false,
      show: false,
      weiboUrl: '',
      mpvuePlatform: mpvuePlatform,
      server: Conf.server
    };
  },
  async mounted(){
    this.weiboUrl = await shareService.weibo.render()
  },
  methods: {
    showAction(val){
      this.show = val
      this.$emit('input', val)
      this.$emit('hidden', val)
    },
    share(type) {
      if (type === 'weibo') return;
      this.shareAction(type);
    },
    sharePoster(){
      this.show = false
      this.$emit('input', false)
      this.$emit('hidden', true)
      this.showPoster = true
    },
    showPosterAction(val){
      this.$emit('hidden', val)
    },
    shareAction() {
      // if (type === 'weixin') {

      // }
    }
  }
};
</script>
