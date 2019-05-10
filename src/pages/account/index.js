import Vue from 'vue'
import App from './index.vue'

import shareService from 'src/plugin/share/share'

// export default {
//   config:{
//     "enablePullDownRefresh": true
//   }
// }
//需要一个默认值
let shareInfo = shareService.defaultShareConfig()

shareService.weixin.getUpdateShareMenu({
  path: 'pages/launch/index'
}).then((share)=>{
  shareInfo = share()
})

const app = new Vue({
  ...App,
  onShareAppMessage: function(){
    return shareInfo
  }
})

app.$mount()

