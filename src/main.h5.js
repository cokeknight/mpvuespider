import Vue from 'vue';

const App = require('./App.' + mpvuePlatform + '.vue').default;
// import './assets/style/common.less';
import router from './router/index';
import { track } from 'track';
import Icon from 'src/cssModules/icons/index';
import Feedback from 'src/cssModules/layout/feedback';
import Bus from 'bus';
import MP from 'MP';
import Conf from 'src/config';
import myMixin from 'src/constants/myMixin';
import { WX_AUTH_LOGIN_IN_H5 } from 'src/common/wx_functions'
Vue.component('Feedback', Feedback);
Vue.component('Icon', Icon);
Vue.use(track);
// 混合，主要是取当前vue实例，用于iframe调用当前vm
Vue.mixin(myMixin);

Vue.config.productionTip = false;
App.mpType = 'app';
Vue.prototype.$Bus = Bus;
Vue.prototype.getCurrentRouter = MP.getCurrentRouter
Vue.prototype.getQuery = MP.getQuery;
Vue.prototype.goRouter = MP.goRouter;

if (WX_AUTH_LOGIN_IN_H5()){
  const app = new Vue({
    router,
    ...App
  });
  Conf.appIsStarted = true;
  app.$mount('#app');
}
