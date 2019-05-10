import Vue from 'vue'
import App from './App.wx'
import "./assets/style/common.less";
import Icon from 'src/cssModules/icons/index'
import Bus from 'bus'
import wxfeedback from 'src/services/feedback/wx'
import { addTrack, wxTrack } from 'src/directive/track/wx'
import FeedbackWrapComponent from 'src/cssModules/layout/feedback'
import MP from 'MP'
import config from 'src/config'
import * as Api from 'api'
Object.assign(MP, wxfeedback)
MP.wxTrack = wxTrack
MP.addTrack = addTrack
Vue.component('Icon', Icon)
Vue.component('Feedback', FeedbackWrapComponent)
//todo
// nginx  配置图片
console.log(Promise.prototype.finally);
Vue.config.productionTip = false;
App.mpType = 'app';
Vue.prototype.$Bus = Bus;
Vue.prototype.getCurrentRouter = MP.getCurrentRouter
Vue.prototype.getQuery = MP.getQuery;
Vue.prototype.goRouter = MP.goRouter;
Vue.mixin({
  methods: {
    uploadFormId(e) {
      const messageFormId = e.target.formId;
      const messageType = e.target.dataset.type;
      if (messageFormId.indexOf('mock')===-1){
        Api.submitFormId({ messageFormId, messageType });
      }
    }
  }
});
const app = new Vue({
  ...App
});
app.$mount('#app');
config.appIsStarted = true;
