<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <div catchtouchmove="ture">
    <Actionsheet
      v-model="show"
      :title="title"
    >
      <div class="picker poster">
        <div class="card">
          <canvas id="canvas" canvas-id="canvas" :style="{width:width + 'px',height:height + 'px'}" class="canvas"></canvas>
        </div>
        <div class="poster-footer">
          <!-- <Btn @click="saveImage" custom-class="btn-border selected" >
            保存图片
          </Btn> -->
          <button class="btn btn-normal btn-primary btn-border selected" @click="saveImage">
            保存图片
          </button>
        </div>
      </div>
    </Actionsheet>
    <div v-if="showDiag" class="mask" @click="showDiagAction">
        <div class="diag-pop">
          <div class="dialog-content">
            <p class="diag-tip">
              您已禁止授权保存到相册，需要您重新设置
            </p>
            <div class="diag-btn-wrap">
              <button class="btn btn-normal btn-primary btn-border"
              open-type="openSetting" @opensetting="saveImageAction">打开设置页</button>
            </div>
          </div>
          <div class="circleclose" @click="showDiagAction">
            <i class="iconfont icon-circleclose"></i>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import Actionsheet from '../actionsheet'
import Btn from 'src/cssModules/public/btn';
import {downloadImage} from 'src/common/wx_functions'
import config from 'src/config';
import * as Api from 'api'
import storage from 'storage'
import MP from 'MP'
import {
  getUserInfo
} from 'src/services/wx_auth'

const POSTERIMGS = {
  'lovecar': 'poster_launch',
  'paysuccess': 'poster_after',
  'orderdetail': 'poster_launch'
}
export default {
  components: {
    Actionsheet,
    Btn
  },
  props: {
    shareType:String,
    list: Array,
    value: {
      type: Boolean,
      required: true,
      default: false
    },
    title: {
      type: String
    },
    iconType: {
      type: String,
      default: 'back'
    },
    trackName: {
      type: String,
      default: ''
    },
    // 点遮罩关闭
    isClickHide: {
      type: Boolean,
      default: true
    },
    hideIcon: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showDiag: false,
      ImgUrl: config.imgUrl,
      width:0,
      height:0,
      show: this.value,
      imagePath: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val
        if (this.show) {
          this.init()
        }
      }
    },
    show: function (v) {
      this.$emit('input', v)
    }
  },
  created: function () {
    var self = this
    this.$Bus.$on(['actionsheet', 'pop'], function () {
      self.$emit('input', false)
    })
  },
  mounted(){
    // this.init()
  },
  methods: {

    init(){
      this.showDiag = false
      MP.Loading.show()
      const recommend = storage.get('openId') || ''
      //没有openid
      if (!recommend) {
        return false
      }

      // downloadImage()
      // Api.getWxacode({scene: recommend, page:'pages/launch/index'}).then((wxacode)=>{
        let download1 = downloadImage(this.ImgUrl+POSTERIMGS[this.shareType]+ '.jpg?t=2')
        let download2 = downloadImage(Api.getWxacode({scene: recommend, page:'pages/launch/index'}))
        this.width = wx.getSystemInfoSync().windowWidth /1.5;
        this.ctx = wx.createCanvasContext('canvas');
        this.height = 992 * this.width / 704;
        setTimeout(()=>{
          Promise.all([download1, download2]).then(res=>{
            const [tempFilePath,wxacode] = res
            this.draw(tempFilePath,wxacode)
          })
        },0)

        // downloadImage(this.ImgUrl+'poster1.jpg').then((tempFilePath)=>{
        //   this.draw(tempFilePath,wxacode)
        // })
      // })


    },
    draw(tempFilePath,wxacode){
      const self = this

      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctx.drawImage(tempFilePath, 0, 0, this.width, this.height);
      // this.ctx.draw()
      let userInfo = getUserInfo() || storage.get('userInfo')
      let nickName = userInfo && userInfo.nickName
      if (this.shareType==='paysuccess'){
        const deal = storage.get('deal')
        nickName = deal.name
      } else {
        if (!nickName) {
          userInfo = storage.get('wxuserInfo')
          nickName = userInfo && userInfo.nickName
        }
        if (!nickName) nickName = '天际汽车'
      }
      if (nickName) {
        this.ctx.setFontSize(25);
        this.ctx.setFillStyle('#ffffff');
        this.ctx.setTextAlign('left');
        this.ctx.fillText(nickName,  26, 40);
      }

      // }
      //

      this.ctx.drawImage(wxacode, this.width/2 - 25, this.height - 100,50, 50);

      this.ctx.draw();
      MP.Loading.hide()
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'canvas',
          success: function (res) {
            self.imagePath = res.tempFilePath
          },
          fail: function (res) {
            console.log(res);
          }
        });
      }, 200)
    },
    choose (item) {
      this.$emit('choose', item)
      this.$emit('input', false)
    },
    showDiagAction(){
      this.showDiag = false
      this.show = false
      this.$emit('input', false)
    },
    saveImageAction(){
      const self = this
      wx.saveImageToPhotosAlbum({
        filePath: self.imagePath,
        success(res) {
          wx.showModal({
            content: '图片已保存到相册，赶紧晒一下吧~',
            showCancel: false,
            confirmText: '好的',
            confirmColor: '#333',
            success: function (res) {
              if (res.confirm) {
                self.show = false
                self.$emit('input', false)
              }
            },fail:function(res){
              console.log(11111)
            }
          })
        },
        fail: function(res){
          console.log(res)
        }
      })
    },
    saveImage(){
      const self = this
      wx.getSetting({
        success(res) {
          if(!res.authSetting["scope.writePhotosAlbum"]){
            wx.authorize({
              scope: "scope.writePhotosAlbum",
              success() {
                self.saveImageAction()
              },
              fail(res){
                self.showDiag = true
              }
            })
          } else {
            self.saveImageAction()
          }
        }
      })
    }
  }
}
</script>
