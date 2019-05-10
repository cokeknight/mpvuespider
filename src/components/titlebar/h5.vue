<!--
  <title-bar back-name="xxx" :index="index" :navs="navs" title="理财记录" $on="titleCallBack"></title-bar>
  navs: [{title:xxx, status:1}, {title:xxx, status:2}] 不传则没下拉
  titleCallBack 回调把当前obj传回去
  index 指定显示navs第几个，会默认触发titleCallBack
  tab 如果为true说明头部是tab，nav就是tab里的元素

  bgColor: 如果black则标题栏背景为透明
  rightlink：标题栏右侧文字，点击会触发click-right-link事件
  righticon：标题栏右侧icon的href
  rightshow：标题栏右侧内容是否显示, 默认显示
  back: 默认显示返回箭头，可根据传递的icon标签，进行修改
  back-func: 定义一个函数，当点击返回按钮时执行。在一些app嵌套页面里面，返回时候可能不只是浏览
  记录返回，或者webView关闭，可能也有一些业务逻辑操作。此时这样写（:back-func="appGoBack"）,在
  使用组件内定义appGoBack方法，进行业务逻辑操作，在app内点击返回按钮时候，只要不是应该直接关闭
  的webView页面，都会调用此方法，appGoBack方法名不可更改！！可参考views-xlb-account.vue、common-interaction.js-goBack方法。
  back-route: 定义返回路由
 -->
<template>
  <div
    class="titlebar"
    :class="{transparent: bgColor == 'black'}"
  >
    <!-- tab导航 -->
    <div
      v-if="tab"
      class="titlebar-tab"
    >
      <ul>
        <li
          v-for="(item, count) in navs"
          :key="item.title"
          v-track="{name:'titlebarchangeNav'+item.title}"
          :class="{active: index == count}"
          @click="changeNav(item, count)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <!-- 一般文字导航 -->
    <h1
      v-else
      v-track="{name:this.routerName + '_titlebartoggleDiv'}"
      class="titlebar-title"
      @click="toggleDiv"
    >
      {{ localtitle }}
      <span
        v-if="navs.length"
        class="titlebar-choose"
      >
        <i class="down-arrow" />
      </span>
    </h1>
    <!-- svg -->
    <span
      v-if="back"
      v-track="{name: this.routerName + '_titlebarGoBack'}"
      class="titlebar-back"
      :style="{ top: titleTop + 'px'}"
      @click="goBack"
    >
      <Icon
        name="back"
        custom-class="icon-goback"
      />
    </span>
    <p
      v-if="rightshow"
      class="titlebar-subhead"
      :style="{ top: titleTop + 'px'}"
      @click="sendRightLinkClick"
    >
      <span
        v-if="rightlink"
        v-track="{name: this.routerName + '_clickrightlink'}"
        class="titlebar_rightlink"
      >{{ rightlink }}</span>
      <Icon
        v-if="righticon"
        v-track="{name: this.routerName + '_clickrightlink'}"
        custom-class="titlebar_rightlink"
        :name="righticon"
      >
        {{ rightlink }}
      </icon>
    </p>
    <!-- 下拉菜单 -->
    <div
      v-if="navs.length && showList && !tab"
      class="titlebar-navlist"
    >
      <ul>
        <li
          v-for="(item, count) in navs"
          :key="item.title"
          v-track="{name: this.routerName + '_titlebarchangeNav' + item.title}"
          :class="{active: index == count}"
          @click="changeNav(item, count)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div
      v-if="showList"
      v-track="{name:this.routerName + '_titlebarShowList'}"
      class="titlebar-mask"
      @click="showList = false"
    />
  </div>
</template>

<script>
import Conf from 'src/config'
// import { xhh, wap } from 'interaction'

export default{
  // 组件名
  name: 'Titlebar',
  props: {
    title: {
      hasIScroll: false // 是否用了js滚动条
    },
    navs: {
      type: Array,
      default: function () {
        return []
      }
    },
    golink: {
      type: String,
      default: ''
    },
    backTrackName: {
      type: String,
      default: 'titlebarGoBack'
    },
    trackName: {
      type: String,
      default: ''
    },
    backFunc: {
      type: Function
    },
    backRoute: {
      type: String
    },
    bgColor: {
      type: String
    },
    rightlink: {
      type: String
    },
    // 右边内容是否显示
    rightshow: {
      type: Boolean,
      default: true
    },
    righticon: {
      type: String
    },
    // 头部是不是tab，理财记录: 司马小鑫/投票项目
    tab: {
      type: Boolean,
      default: false
    },
    back: {
      type: String,
      default: 'back'
    },
    close: {
      type: Boolean,
      default: false
    },
    step: {
      default: 1
    },
    value: {
      default: 1
    },
    titleTop: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      showList: false,
      localtitle: this.title,
      routerName: Conf.router.to.name
    }
  },
  computed: {
    index: function () {
      return this.value
    }
  },
  watch: {
    title: function (v) {
      this.localtitle = v
    }
  },
  mounted () {
    this.hasIScroll = document.querySelector('.scrollNode')
  },
  methods: {
    toggleDiv: function () {
      if (!this.navs.length) return
      this.showList = !this.showList
    },
    onDbclick: function () {
      if (this.hasIScroll) {
        document.body.scrollTop = 0
        return
      }
      var h = document.body.scrollTop
      Move()

      // t当前时间 b初始化值(一开始距离) c终点 d持续时间ms
      function easeInOut (t, b, c, d) {
        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b
        return -c / 2 * ((t -= 2) * t * t * t - 2) + b
      }

      function Move () {
        var t = 0, c = h, d = 100
        clearTimeout(Move._t)
        function _run () {
          if (t < d) {
            t++
            var paser = -Math.ceil(easeInOut(t, -h, c, d))
            document.body.scrollTop = paser
            Move._t = setTimeout(_run, 10)
          } else {
            document.body.scrollTop = c + 'px'
          }
        }

        _run()
      }
    },
    goBack: function () {
      // 如果历史记录为1的话，点返回跳到首页
      if (this.backRoute) {
        this.$router.push({name: this.backRoute})
      } else if (this.backFunc) {
        this.backFunc()
      } else if (window.history.length === 1) {
        this.$router.push({ name: 'home' })
      } else {
        // Conf.transition.isBack = true
        this.$router.go(-(this.step))
      }
      this.$emit('goBack')
    },
    changeNav: function (item, index) {
      // 防止重复选择
      if (this.index === index) return
      this.localtitle = item.title
      this.showList = false
      this.$emit('input', index)
      this.$emit('callBack', item, index)
    },
    sendRightLinkClick: function () {
      if (this.golink) {
        this.$router.push({ name: this.golink })
      }
      this.$emit('submenu')
    }
  }
}
</script>
