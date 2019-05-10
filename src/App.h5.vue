<template>
  <div id="wrap" :class="{fromApp: isApp}">
    <transition name="translate" mode="out-in">
    <router-view class="view"></router-view>
    </transition>
  </div>
</template>
<script>
import Conf from 'src/config';
export default {
  name: 'App',
  data () {
    return {
      isApp: Conf.server === 'app'
    }
  },
  mounted() {
    // 解决点击事件300ms延时问题
    // FastClick.attach(document.body)
  },
  created() {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    // const mpvuePlatform = 'h5'
    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({key: 'logs'}).data || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync({
    //     key: 'logs',
    //     data: logs
    //   })
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   mpvue.setStorageSync('logs', logs)
    // }
  },
  log() {
    console.log(`log at:${Date.now()}`);
  }
};
</script>

<style lang="less">
  @import './assets/style/common.less';
  .container {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 200 rpx 0;
    box-sizing: border-box;
  }

  /* this rule will be remove */
  * {
    transition: width 2s;
    -moz-transition: width 2s;
    -webkit-transition: width 2s;
    -o-transition: width 2s;
  }
  /*从app过来的就会在外围加上这个class*/
  /*隐藏头部，下面的内容往上顶到头部*/
  .fromApp{
    .titlebar{
      display: none;
    }
    .base-view, .top48, .tab-scroll.fixed{
      top:0;
    }
    .base-view.top-hasSubnav{
      top:47px;
    }
    .tabbox.fixed, .award-tab{
      top:0;
    }
  }
  .translate-enter, .translate-leave-active {
    opacity: 0;
    transform: translate(10px, 0);
  }
  .translate-leave-active, .translate-enter-active {
    transition: all .2s ease;
  }
</style>
