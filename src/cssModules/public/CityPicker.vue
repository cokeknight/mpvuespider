<!--2017-3-7删除了 接收外面要求关闭弹框的事件 可在父组件中修改show来改变sheet状态-->
<template>
  <Actionsheet
    v-model="show"
    :title="title"
  >
    <div class="picker">
      <div v-if="province" class="picker-item borderline">
        <li

          class="picker-no-tip"
        >
          {{ province }} {{ city }}
        </li>
        <!-- <li class="picker-tip">
          请选择
        </li> -->
      </div>
      <li class="picker-item picker-darker">
        定位到的位置
      </li>
      <li class="picker-item picker-geo" @click="chooseCurrentCity">
        {{ currentCity ? currentCity.name_cn :'暂时无法获取定位' }}
      </li>
      <li class="picker-item picker-darker">
        全部
      </li>
      <scroll-view v-if="!mpvuePlatform" scroll-y class="picker-item-group" :scroll-top="scrollTop" style="height: 300px;">
        <li
          v-for="item in citylist"
          :key="item.code"
          class="picker-item picker-item-child arrow arrow-r"
          @click="choose(item)"
        >
          {{ item.name_cn }}
        </li>
      </scroll-view>
      <div v-if="mpvuePlatform" class="picker-item-group">
        <li
          v-for="item in citylist"
          :key="item.code"
          class="picker-item picker-item-child arrow arrow-r"
          @click="choose(item)"
        >
          {{ item.name_cn }}
        </li>
      </div>
    </div>
  </Actionsheet>
</template>

<script>
import * as Api from 'api'
import Actionsheet from './actionsheet'
import getGeolocation from 'src/lib/geolocation'
export default {
  name: 'CityPicker',
  components: {
    Actionsheet
  },
  props: {
    list: Array,
    title: {
      type: String
    },
    value: {
      type: Boolean,
      required: true,
      default: false
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
  data: function () {
    return {
      mpvuePlatform: mpvuePlatform === 'h5',
      scrollTop: 0,
      show: this.value,
      rawdata: '',
      citylist: [],
      currentCity: '',
      province: '',
      city: ''
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (val) {
        this.show = val
      }
    },
    show: function (v) {
      this.citylist = this.rawdata
      this.province = ''
      this.city = ''
      this.$emit('input', v)
    }
  },
  created: function () {
    var self = this
    this.$Bus.$on(['actionsheet', 'pop'], function () {
      self.$emit('input', false)
    })
  },
  async mounted () {
    await this.init()

  },
  /****mpvue 小程序不生效 第一次走mounted 第二次走onShow */
  async onShow(){
    await this.init()
  },
  methods: {
    async init(){
      let data = await Api.getCity()
      data = this.convertCity(data)
      this.citylist = data
      getGeolocation().then((cityCode) => {
        this.currentCity = this.getCity(cityCode)
        this.$emit('choose', this.currentCity)
      })

      this.rawdata = data
    },
    getCity(cityCode){
      for (let i=0;i<this.citylist.length;i++){
        let item = this.citylist[i].children.find(item=>{
          return item.cityCode == cityCode
        })
        if (item) {
          item.province = this.citylist[i]['name_cn']
          return item
        }
      }
    },
    convertCity(provinceArr){
      let data = provinceArr.map((item)=>item.provinceArr)
      data = data.reduce((total, item)=>{
        total = total.concat(item)
        return total
      },[])
      for (let i=0;i<data.length;i++){
        data[i]['level'] = 1
        data[i]['name_cn'] = data[i]['provinceName']
        data[i]['code'] = data[i]['provinceCode']
        data[i]['children'] = data[i]['cityArr']
        for (let j=0;j<data[i]['children'].length;j++){
          data[i]['children'][j]['name_cn'] = data[i]['children'][j]['cityName']
        }
      }
      return data
    },
    choose (item) {
      if(item.level === 1) {
        this.province = item.name_cn
        this.citylist = this.rawdata.find((child) => child.code === item.code)['children']
        if (mpvuePlatform === 'h5') {
          setTimeout(() => {
            document.querySelector('.picker-item-group').scrollTo(0, 0)
          }, 0);
        } else {
          // mpvue 强制刷新值未0
          this.scrollTop = '55551'
          this.$set(this, 'scrollTop', '')
        }
      }else {
        this.city = item.name_cn
        item.province = this.province
        this.$emit('choose', item)
        this.$emit('input', false)
      }
    },
    chooseCurrentCity(){
      if (this.currentCity){
        this.$emit('choose', this.currentCity)
      }
    },
    close: function () {
      this.$emit("close")
    }
  }
}
</script>
