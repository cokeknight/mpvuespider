import { xhh } from 'interaction'
import config from 'config'
import Vue from 'vue'

const askUserToSignDbContract = function (callback, options = { force: false }) {
  if (options.force || config.isLogin) {
    this.$Api.isDbPopBox.call(this, {
      method: 'POST'
    }).then(data => {
      if (data.boolen === 1) {
        const result = data.data
        if (result.pop_zx_layer === 1) {
          const msg = `<h4>尊敬的用户：</br>鑫信三号现更替第三方担保公司，请知悉</h4><p class="confirm"><span>点击确认即视为同意</span><a href="/#/about/xxthDetail">《鑫信三号担保主体变更通知》</a></p>`
          const showAlert = () => {
            this.$Popbox({
              title: '',
              msg: '<div style="padding:20px 0" class="font16 aboutXXTH">' + msg + '</div>',
              visible: true,
              text: '确认',
              context: result.context,
              btn_msg: '查看详情',
              onClose: function () {
                if (config.isApp) {
                  xhh.doAction('close')
                } else {
                  callback && callback()
                }
              },
              page_url: result.page_url,
              onConfirm: function () {
                // 显示方案B
                if (config.isApp) {
                  // window.location.href = result.page_url
                  xhh.doAction('openWindow', { url: result.page_url, backIsRefresh: true })
                } else {
                  window.location.href = result.page_url
                }
                // if (result.method === 'A') {
                //   this.$router.push({name: 'aboutSelectPlan'})
                // } else if (result.method === 'B') {
                //   this.$router.push({name: 'aboutXXTHDetail_planB'})
                // }
                // this.$Api.askUserToSignDbContract.call(this, {
                //   method: 'POST'
                // }).then(data => {
                //   if (data.boolen === 1) {
                //     if (config.isApp) {
                //       xhh.doAction('close')
                //     } else {
                //       callback && callback()
                //     }
                //   } else {
                // callback && callback()
                //   }
                // })
              }
            })
          }
          Vue.nextTick(showAlert)
        } else {
          callback && callback()
        }
      } else {
        callback && callback()
      }
    })
  } else {
    callback && callback()
  }
}
export default askUserToSignDbContract
