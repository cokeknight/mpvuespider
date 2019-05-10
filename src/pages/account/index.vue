<!--suppress ALL -->
<template>
  <Layout footer :titlebar="false">
    <div class="mine">
      <!--头像-->
      <div>
        <div
          class="tab-main-list head-div"
        >
          <div class="head-left">
            <!--头像-->
            <img
              v-track="{name:'avatarUrl'}"
              class="header-img"
              :src="userInfo.avatarUrl"
              mode="aspectFill"
              @click="goEditInfo"
            >
            <!--名字-->
            <div v-if="!isLogin" class="header-tip">
              <button style="font-size:18px;"
              class="no-button-bg font18" @click="wxLogin"
              >
                登录/注册
              </button>
            </div>
            <div v-if="isLogin" class="header-m">
              <div
                class="headTitle"
                @click="goEditInfo"
              >
                {{ userInfo.nickName }}
              </div>
            </div>
          </div>

          <!--签到按钮-->
          <Btn v-if="isLogin"
               :custom-class="userInfo.isSign===0?'btn1 btn-mod': 'btn2 btn-mod'"
               auto-disable
               track-name="signin"
               :text="userInfo.isSign==1 ?'已签到':'签到'"
               @click="signIn"
          >
          </Btn>
          <!-- <button
            v-track="{name:'signin'}"
            :class="userInfo.isSign===0?'btn1 btn-mod': 'btn2 btn-mod'"
            @click="signIn"
          >
            {{ userInfo.isSign===1 ?'已签到':'签到' }}
          </button> -->
          <!--分割线-->
        </div>
        <div class="segView"></div>
        <div class="account-info">
          <form
            class="list-no-last"
            report-submit data-type="refund_total" @submit="uploadFormId"
          >
            <button class="no-button" type="button" form-type="submit" @click="goMyOrder" v-track="{name: 'myOrder'}">
              <ListItem label="我的订单" :show-arr="isLogin" :custom-class="!isLogin?'nologin':''" front-icon="mine-order" track-name="myOrder">
              </ListItem>
            </button>
          </form>
          <!-- <ListItem label="我的收藏" show-arr front-icon="mine-collect">
          </ListItem> -->
          <!-- <ListItem v-if="!mpvuePlatform" :show-arr="isLogin" :custom-class="!isLogin?'nologin':''" label="在线客服" track-name="mine-service" front-icon="mine-service">
            <button open-type="contact"></button>
          </ListItem> -->
          <div v-if="isLogin" class="account-logout">
            <Btn
              track-name="login_out"
              custom-class="btn-primary"
              @click="doLoginOut"
            >
              退出登录
            </Btn>
          </div>
        </div>
      </div>
      <DealPopbox v-model="hideDading" @cancel1="normal" @confirm1="next" />
    </div>
    <Feedback />
    <!-- <div v-if="hideDading" class="mask" @click="hideDading=false"></div> -->
  </Layout>
</template>
<script>

import Layout from 'layout';
import * as Api from 'api';
import { goRouter } from 'src/common/functions';
import ListItem from 'src/cssModules/lists/list-item';
import DealPopbox from 'src/cssModules/public/dealPopbox';
import Btn from 'src/cssModules/public/btn';
import MP from 'MP';
import storage from 'storage'
import config from 'src/config'
import Cookie  from 'cookie'

import {
  getAccessToken,
  wx_Auth_Login,
  getThirdSession,
  setThirdSession,
  setAccessToken,
  setUser,
  removeUser,
  checkSetting
} from 'src/services/wx_auth'

const defaultUserInfo = {
  avatarUrl: config.imgUrl + 'no_login_new.png',
  nickName: '',
  score: '',
  isSign: false
};
export default {
  components: {
    Layout,
    ListItem,
    Btn,
    DealPopbox
  },
  onerror(err) {
    wx.showToast({
      title: err,
      icon: 'success'
    });
  },
  data() {
    return {
      btnOpenType: false,
      isLogin: false,
      hideDading: false,
      ImgUrl: config.imgUrl,
      mpvuePlatform: mpvuePlatform === 'h5',
      userInfo: {
        avatarUrl: config.imgUrl + 'no_login_new.png',
        nickName: '',
        score: '',
        isSign: false
      }
    };
  },
  // onReady后执行 如果用户没登录 会仅触发一次
  mounted() {
    if (mpvuePlatform === 'h5') {
      this.updateUserInfo();
      // this.checkDeal()
    }
  },
  onShow(){
    // 延迟300ms 等待feedback组件全部加载完成
    setTimeout(this.updateUserInfo, 300)
    MP.wxTrack();
  },
  methods: {
    loginUsePassword() {
      this.goRouter('account/login');
    },
    normal() {
      this.hideDading = false;
    },
    next() {
      this.goRouter('account/myOrder?status=11');
    },
    closeDiag() {
      this.hideDading = false;
    },
    checkDeal() {
      Api.orderList({ status: 11 }).then((res) => {
        if (res.list.length > 0) {
          this.hideDading = true;
        } else {
          this.hideDading = false;
        }
      });
    },
    updateUserInfo() {
      MP.Loading.show()
      // const userInfo = getUserInfo()
      // if (userInfo) {
      //   this.isLogin = true
      //   Object.assign( this.userInfo, userInfo)
      // }
      Api.mine().then(res=>{
        MP.Loading.hide()
        this.isLogin = true
        if (!res) return false
        res.nickName =res.nickName || ''
        res.score = res.score || 0
        setUser(res)
        res.isSign = res.isSign
        if(!res.avatarUrl){
          res.avatarUrl = defaultUserInfo.avatarUrl
        }
        Object.assign( this.userInfo, res)
      })
    },
    // 点击签到
    signIn() {
      if (!this.userInfo.isSign) {
        MP.Loading.show();
        Api.signIn().then((res) => {
          this.userInfo.isSign = 1;
          this.updateUserInfo();
          MP.Loading.hide();
          MP.Tip('签到成功，+' + res + '积分');
        });
      }
    },
    async wxLogin(e) {
      Api.appLaunchQueue.delayWhenAppLaunchLoaded().then(async () => {
        const thirdSession = getThirdSession();
        // thirdSession 存在 未綁定手機
        if (thirdSession) {
          try {
            await checkSetting('scope.userInfo')
            this.goRouter('account/weixinAuthLogin');
          } catch (error) {
            this.goRouter('account/weixinAuth')
          }
        } else {
          await wx_Auth_Login(e);
          const accessToken = getAccessToken();
          // 登录成功 手动设置 是否绑定手机号码的状态
          if (accessToken) {
            setThirdSession('');
            this.btnOpenType = false;
            MP.Tip('登录成功');
            this.checkDeal();
            this.updateUserInfo();
          }
        }
      })
      // const userInfo = e.target.userInfo;
      // storage.set('wxuserInfo',userInfo)
      // // await Api.saveUserInfo({
      // //   avatarUrl: userInfo.avatarUrl,
      // //   nickName: userInfo.nickName,
      // //   gender: userInfo.gender
      // // })
      // if (!userInfo) return;

    },
    goJifendetails(score) {
      goRouter.call(this, 'account/jifen?total=' + score);
    },
    goNext() {
      goRouter.call(this, 'mine/fans');
    },
    // 跳转到我的基本信息编辑页面
    goEditInfo() {
      if(this.isLogin){
        goRouter.call(this, 'account/editInfo');
      }
    },
    goMyOrder(){
      if (this.isLogin) {
        this.goRouter('account/myOrder')
      }
    },
    // normal(){
    //   this.hideDading = false
    // },
    // next(){
    //   this.goRouter('account/myOrder?status=11')
    // },
    doLoginOut() {
      MP.Confirm({
        title: '提示',
        msg: '确定要退出登录吗？',
        onConfirm: ()=>{
          Api.doLoginOut().then(()=>{
            removeUser()
            Object.assign( this.userInfo, defaultUserInfo)
            setAccessToken('')
            if (config.server === 'wx') {
              // 针对H5 微信端
              Cookie.delete('identity')
            }
            MP.Tip('退出成功')
            /** 退出的就不应该再谈这个已经授权的按钮了 */
            config.HAS_BIND = false
            this.isLogin = false
            MP.Loading.hide()
            // h5 跳转到登录页面
            if (this.mpvuePlatform) {
              this.goRouter('account/login');
            }
            //
          }).catch(() => {
            MP.Loading.hide();
          });
        }
      });
    }

  }
};

</script>

<style lang="less">
  .mine {
    .head-div {
      width: 100%;
      background-color: white;
      display: flex;
      padding-top: 40px;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #eeeeee;
      padding-bottom: 20px;

      .head-left {
        flex-direction: row;
        display: flex;
      }

      .btn1 {
        width: 69px;
        height: 30px;
        background-color: #3BD1CA;
        border-radius: 15px 0 0 15px;
        color: white;
        font-size: 14px;
        margin: 0px;
        line-height: 30px;
        min-width: 50px;
      }

      .btn2 {
        width: 69px;
        height: 30px;
        background-color: #EAEAEA;
        border-radius: 15px 0 0 15px;
        color: #979797;
        font-size: 14px;
        margin: 0px;
        line-height: 30px;
        min-width: 50px;
      }

      .header-img {
        width: 64px;
        height: 64px;
        border-radius: 32px;
        margin-left: 15px;
      }

      .header-m {
        margin-left: 10px;
        flex: 1;

        .headTitle {
          font-size: 20px;
          color: #333333;
          min-height: 36px;
        }

        .headScore {
          font-size: 14px;
          color: #C5C5C5;
        }
      }
    }

    .list-menu-label {
      // color: #333333;
      // font-size: 16px;
    }

    .segView {
      height: 10px;
      background-color: #F7F7F7;
    }

    .three-div {
      display: flex;
      width: 100%;
      flex-direction: row;
      border-bottom: 13px rgba(247, 247, 247, 1) solid;

      .item-div {
        width: 1/3*100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .item-top {
          padding-top: 16px;
          text-align: center;
          color: #333333;
          font-size: 16px;
        }

        .item-bottom {
          text-align: center;
          padding-bottom: 13px;
          color: #979797;
          opacity: 0.5603;
          font-size: 13px;
        }
      }
    }

    .account-logout {
      margin-top: 81px;
    }
  }

</style>



