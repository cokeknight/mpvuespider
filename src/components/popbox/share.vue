<template>
  <div class="pop-share">
    <pop-box v-model="toShow">
      <div
        v-show="showGuide"
        v-track="{name:'hideGuide'}"
        class="share"
        @click="hideGuide()"
      >
        <!-- 微信情况下的分享 -->
        <img
          v-if="isWeixin"
          src="../../assets/img/sima/weixin1.png"
          alt=""
          class="yesweixin"
        >
        <!--  非微信下的分享 -->
        <img
          v-else
          src="../../assets/img/sima/1feiweixin.png"
          alt=""
          class="noweixin"
        >
      </div>
      <div
        v-show="!showGuide"
        class="content"
      >
        <div
          v-show="!twoCode"
          class="xpduser-share"
        >
          <ul class="css3-flex">
            <li>
              <a
                v-zhuge="{name: '我的二维码-选择邀请平台', data: {'平台': '微信好友'}}"
                v-track="{name:'fenxiangweixin'}"
                href="javascript:;"
                @click="goShare"
              > <img
                src="../../assets/images/activity/weixin.png"
                width="45"
              > <br>微信好友 </a>
            </li>
            <li>
              <a
                v-zhuge="{name: '我的二维码-选择邀请平台', data: {'平台': '微信朋友圈'}}"
                v-track="{name:'fenxiangfriends'}"
                href="javascript:;"
                @click="goShare"
              > <img
                src="../../assets/images/activity/friends.png"
                width="45"
              > <br>微信朋友圈 </a>
            </li>
            <li @click="twoCode = true">
              <a href="javascript:;"><img
                src="../../assets/images/xpdShare/ewm.png"
                width="45"
                alt=""
              ><br>我的二维码</a>
            </li>
            <li>
              <a
                v-zhuge="{name: '我的二维码-选择邀请平台', data: {'平台': 'QQ'}}"
                v-track="{name:'fenxiangweibo2'}"
                href="javascript:;"
                @click="goShare"
              > <img
                src="../../assets/images/activity/weibo2.png"
                width="45"
              > <br>QQ </a>
            </li>
          </ul>
        </div>
        <!-- 二维码 -->
        <div
          v-show="twoCode"
          class="xpduser-sharepop-con"
        >
          <p>邀请好友扫一扫，完成注册</p>
          <img
            :src="qrUrl"
            width="180"
            alt=""
          >
          <p class="xpduser-sharepop-yqm">
            邀请码：<span>{{ qrcode }}</span>
          </p>
        </div>
        <p class="xpduser-cancle">
          <a
            v-track="{name:'closecode'}"
            @click="toShow = false"
          >取消</a>
        </p>
      </div>
    </pop-box>
  </div>
</template>
<style>
  .pop-share .popbox-body {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-radius: 0;
    background: none;
  }
</style>
<script>
import popBox from 'popbox';
import Api from 'api';
import page from 'page';
import config from 'config';
import { xhh } from 'interaction';

export default {
  components: {
    popBox
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isXpd: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      show: false,
      toShow: false,
      showGuide: false,
      isWeixin: false,
      qrUrl: '',
      qrcode: '',
      url: '',
      href: '',
      twoCode: false,
      appObj: {},
      money: this.isXpd ? '898' : '888'
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.show = val;
      }
    },
    show(val) {
      if (config.isApp && val) {
        // 是App
        //          window.XHH.doAction('share', this.appObj)
        xhh.goToNative('goInvite');
      } else {
        // 分享弹框关闭的时候 把twoCode改为false
        if (!val) {
          this.twoCode = false;
        } else {
          this.toShow = val;
        }
      }
    },
    toShow(val) {
      this.$emit('input', val);
    }
  },
  mounted() {
    this.isWeixin = window.Vue.XUtils.isWeixin();
    this.getRecomQrcode();
  },
  methods: {
    getRecomQrcode: function() {
      function resolve(res) {
        if (res.boolen == 1) {
          this.qrUrl = res.data.qrcode;
          this.qrcode = res.data.code;
          this.url = res.data.url;
          this.href = 'http://service.weibo.com/share/share.php?appkey=336306246&title=我在专业理财平台鑫合汇理财，出借短期灵活，安全透明，限时送168元出借满减券，点击本链接注册还可额外领取我派发给你的20元鑫拍档红包哦，快来吧&url=//' + this.url + '&searchPic=false&style=simple';
          // 配制微信分享
          page.weixin.setParam({
            url: res.data.url,
            title: this.money + '元鑫拍档红包正在派送中，下手要快！',
            desc: '我理财一直用鑫合汇，既安全又省心。送您' + this.money + '元新手大礼包，邀请您一起赚钱！',
            imgUrl: '../../../assets/images/share/xpd-share.png'
          });
          this.appObj = {
            content: '我理财一直用鑫合汇，既安全又省心。送您' + this.money + '元新手大礼包，邀请您一起赚钱！',
            imgUrl: '../../../assets/images/share/xpd-share.png',
            webUrl: res.data.url,
            title: this.money + '元鑫拍档红包正在派送中，下手要快！'
          };
        } else {
          this.qrUrl = '../../assets/images/activity/erweima.png';
        }
      }

      let options = {
        data: {},
        resolve: resolve
      };
      Api.getRecomQrcode.call(this, options);
    },
    goShare: function() {
      this.showGuide = true;
    },
    hideGuide: function() {
      this.showGuide = false;
    }
  }
};
</script>
