<!--
  分发内容
  <div slot="list"></div>
  加载中
  <div slot="loading"></div>
  没更多内容
  <div slot="noMore"></div>
  没内容
  <div slot="noData"></div>

  触发几种事件
  nodata: 没数据时
  parseData: 对ajax返回的格式进行整理, 主要用于解析页码相关
  completed: 每次拉取数据成功后调用，数据作为第一个参数传入,第二个参数为isReset。如果为true说明已经更新条件，lists要重新计算
  last: 最后一页了
  finished: nodata/last 综合体,触发时也把finished触发下
  todo 没有内容居中
 -->
<template>
  <!-- 当js滚动条设置到这个组件时，会以第一个子元素为scrollbar，为保证"暂无内容"等在滚动条内容，就加了这个div -->
  <div>
    <div ref="container" :class="'pullup ' + (isNoData? 'emptybg': '')">
      <div v-if="topRefresh && isRefreshing" class="pullup-text pullup-top-refresh">
        <i :class="'pull-icon pull-icon_loading ' + (enableRefreshing? 'pull-animate_rotate':'')"></i> <span class="pull-text">下拉刷新</span>
      </div>
      <div v-if="pullupData" ref="list" class="pullup-list" :style="wrapperStyle">
        <slot name="list"></slot>
      </div>
      <div ref="depend" :style="getDependStyle()">
        <div v-if="isScrolling || loading" class="pullup-text pullup-abs">
          <slot name="loading">
            加载中...
          </slot>
        </div>
        <!-- 样式放到了里面，防止影响自定义的内容 -->
        <div v-if="isLastPage" class="pullup-text">
          <slot name="noMore">
            {{ !noMoreTip ? '没有更多内容' : '' }}
          </slot>
        </div>
        <div v-if="isNoData">
          <slot name="noData">
            <div v-if="picNoData || picNoDataText" class="pullup-nodate-pic">
              <span class="without" />
              <div class="info" v-html="picNoDataText || '暂无数据'" />
            </div>
            <div v-else class="pullup-text">
              <div class="pullupmask">
                <div class="emptymessage">
                  <Icon name="emptymessage" />
                  <p class="emptymessagetext">
                    暂无更多内容
                  </p>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Api from 'api';

const isTouch = 'ontouchend' in document;
const touchend = isTouch ? 'touchend' : 'mouseup';
const windowHeight = document.documentElement.clientHeight;
const offsetBottom = 100; // 距离最底部距离
const DEFAULT_DURATION = 200; // 默认过渡动画事件
const MAX_TOP_REFRESH_HEIGHT = 50;
var containerScrollTop = 0
var scrollNode;
// 计算IScroll是否滑动到最下边
function isScrollToBottom() {
  // 未用iscroll则判断原始滚动
  if (!scrollNode) return isScrollToContainerBottom();

  var h = scrollNode.clientHeight; // 总高度
  var transform = scrollNode.style.transform || scrollNode.style.webkitTransform;
  var scrollTop = (transform.match(/-([^p])+/) || [0])[0]; // 滚动过的高度
  return h - Math.abs(scrollTop) - windowHeight <= offsetBottom;
}

// fix 20190328 下拉下载 原来是利用整体的body 滚动条高度或者iscroll元素，因为不适用iscroll元素，改成使用 当前元素来重设
// fix 20190401 下拉加载 参考了美团 饿了么 现在重新改成整体的body
// 用body判断是否scroll到底部
function isScrollToContainerBottom() {
  let client = document.compatMode === 'BackCompat' ? document.body : document.documentElement
  let scrollHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight, client.clientHeight)
  // 获取当前位置
  let totalheight = windowHeight + window.scrollY
  containerScrollTop = window.scrollY

  return scrollHeight <= totalheight + offsetBottom
  // container = d
  // let client = document.compatMode === 'BackCompat' ? document.body : document.documentElement
  // let scrollHeight = Math.max(container.scrollHeight, container.clientHeight);
  // // 获取当前位置
  // let currnetHeight = container.clientHeight + container.scrollTop;
  // console.log(container.scrollHeight, container.clientHeight)
  // return scrollHeight <= currnetHeight + offsetBottom;
}

// 这两个事件同时触发 finished
let emitFinished = ['nodata', 'last'];

export default {
  props: {
    noMoreTip: Boolean,
    isInit: {
      type: Boolean,
      default: true
    },
    value: {
      type: Boolean,
      default: false
    },
    api: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: Object
    },
    method: {
      type: String,
      default: 'get'
    },
    // 是否支持头部下拉刷新第一页内容
    topRefresh: {
      type: Boolean,
      default: false
    },
    // 头部拉多大距离触发事件
    topRefreshDis: {
      type: Number,
      default: 100
    },
    // 没数据的时候用图文并茂的方式显示
    // false的时候只显示数字
    picNoData: {
      type: Boolean,
      default: false
    },
    // 只设置这一个也可以显示图文并茂
    // 支持html
    picNoDataText: {
      type: String
    },
    // 没更多内容/暂无数据 是否放上列表上面
    // 司马小鑫是倒序
    dependToTop: {
      type: Boolean,
      default: false
    },
    // 有些时候不应该加高度
    setDependHeight: {
      type: Boolean,
      default: true
    },
    // 参数有变的时候不用滚动到头部
    resetNoScroll: Boolean
  },
  data() {
    return {
      p: 1,
      // 计算时候，300ms内不允许再发请求
      timestamp: +new Date(),
      pagesize: 10,
      isScrolling: false,
      isNoData: false,
      pullupData: false,
      isLastPage: false,
      setting: {},
      loading: false,
      // 是否重置参数重新请求
      // 是的话pullup:completed传第二个参数为true
      // 这里父级就知道要重新计算数组
      isReset: false,
      isRefreshing: false,
      // 下拉刷新使用的属性
      startY: 0,
      offset: 0,
      duration: 0,
      startOffset: 0,
      isMoving: false,
      enableRefreshing: false
    };
  },
  computed: {
    wrapperStyle() {
      return {
        transition: `${this.duration}ms`,
        transform: `translate3d(0, ${this.offset}px, 0)`
      };
    }
  },
  watch: {
    value: {
      // 外面往里面请求重新请求
      immediate: true,
      handler(bool) {
        if (bool) {
          this.reset();
          this.dispatch('input', false);
        }
      }
    },
    // 切换tab时reset
    'params': {
      handler: function() {
        this.reset();
      },
      deep: true
    },
    'api': function() {
      this.reset();
    },
    'method': function() {
      this.reset();
    }
  },
  mounted() {
    //      查找scrollnode, 目前知识查找了两层，正确做法是查到$root为止
    scrollNode = this.$el.querySelector('.scrollNode') || this.$parent.$el.querySelector('.scrollNode');
    // container = this.$refs.container;
    // 如果要求 // 没更多内容/暂无数据 是否放上列表上面
    // 则在这里移动一下
    if (this.dependToTop) {
      window.Vue.util.before(this.$refs.depend, this.$refs.list);
    }
    this.render();
  },
  // 销毁时触发
  beforeDestroy() {
    this.removeEvent();
  },
  methods: {
    bounceTouchmove(e){
      var me = this;
      var el = e.target;
      // 当前touch的元素及父元素是否要拦截touchmove事件
      var isPrevent = true;
      while (el !== document.body && el !== document) {
        var cls = el.classList;
        if (cls) {
          if (cls.contains('pullup') || cls.contains('mescroll-touch')) {
            isPrevent = false; // 如果是指定条件的元素,则无需拦截touchmove事件
            break;
          } else if (cls.contains('mescroll-touch-x') || cls.contains('mescroll-touch-y')) {
            // 如果配置了水平或者垂直滑动
            var curX = e.touches ? e.touches[0].pageX : e.clientX; // 当前第一个手指距离列表顶部的距离x
            var curY = e.touches ? e.touches[0].pageY : e.clientY; // 当前第一个手指距离列表顶部的距离y

            if (!me.preWinX) me.preWinX = curX; // 设置上次移动的距离x
            if (!me.preWinY) me.preWinY = curY; // 设置上次移动的距离y

            // 计算两点之间的角度
            var x = Math.abs(me.preWinX - curX);
            var y = Math.abs(me.preWinY - curY);
            var z = Math.sqrt(x * x + y * y);

            me.preWinX = curX; // 记录本次curX的值
            me.preWinY = curY; // 记录本次curY的值

            if (z !== 0) {
              var angle = Math.asin(y / z) / Math.PI * 180; // 角度区间 [0,90]
              if ((angle <= 45 && cls.contains('mescroll-touch-x')) || (angle > 45 && cls.contains('mescroll-touch-y'))) {
                isPrevent = false; // 水平滑动或者垂直滑动,不拦截touchmove事件
                break;
              }
            }
          }
        }
        el = el.parentNode; // 继续检查其父元素
      }

      // 拦截touchmove事件:是否可以被禁用&&是否已经被禁用 (这里不使用me.preventDefault(e)的方法,因为某些情况下会报找不到方法的异常)
      if (isPrevent && e.cancelable && !e.defaultPrevented && typeof e.preventDefault === "function") e.preventDefault();
    },
    // 添加最小高度
    getDependStyle: function() {
      if (this.setDependHeight) {
        // return 'min-height:40px'
      }
    },
    scrollEnd(isNoGetData) {
      // 当tab切换的时候会先清空lists这样就会优先触发这个函数
      // 而这时是需要重新配制参数发ajax的
      let self = this;
      setTimeout(function() {
        if (isNoGetData) return;
        self.getScrollData();
      }, 0);
    },
    // 头部下拉刷新触发的事件
    scrollTopRefresh: function(dis) {
      if (!this.topRefresh || dis < this.topRefreshDis) return;
      this.isRefreshing = true;
      this.reset();
    },
    addEvent: function() {
      if (this.topRefresh) {
        this.$refs.container.addEventListener('touchstart', this._topRefreshTouchstart, { passive: false });
        this.$refs.container.addEventListener('touchmove', this._topRefreshTouchmove, { passive: false });
        this.$refs.container.addEventListener('touchcancel', this._topRefreshTouchcancel, { passive: false });
        this.$refs.container.addEventListener(touchend, this._topRefreshTouchend, { passive: false });
      }
      document.addEventListener('scroll', this.getScrollData, false);
      //todo  这个影响微信H5订单页面的滚动
      window.addEventListener('touchmove', this.bounceTouchmove, {passive: false});
      this.$Bus.$on('IScroll:end', this.scrollEnd);
      this.$Bus.$on('IScroll-topRefresh', this.scrollTopRefresh);


    },
    removeEvent: function() {
      if (this.$refs && this.$refs.container) {
        this.$refs.container.removeEventListener('touchstart', this._topRefreshTouchstart, { passive: false });
        this.$refs.container.removeEventListener('touchmove', this._topRefreshTouchmove, { passive: false });
        this.$refs.container.removeEventListener('touchcancel', this._topRefreshTouchcancel, { passive: false });
        this.$refs.container.removeEventListener(touchend, this._topRefreshTouchend, { passive: false });
        window.removeEventListener('touchmove', this.bounceTouchmove, {passive: false});
        document.removeEventListener('scroll', this.getScrollData, false);
        this.$Bus.$off('IScroll:end', this.scrollEnd);
        this.$Bus.$off('IScroll-topRefresh', this.scrollTopRefresh);
      }
    },
    render: function(callback) {
      this.addEvent();
      if (this.resetNoScroll) {
        document.body.scrollTop = 0;
      }
      if (!this.isInit) {
        return false;
      }
      // 解决原生tab切换问题
      let clonParams = Object.assign({}, this.params);
      // 拼合参数, 这样方便监控传入参数修改后重置各参数
      this.finalParams = Object.assign({
        pagesize: this.pagesize,
        p: this.p,
        page: this.p,
        page_no: this.p
      }, this.params);
      // this.finalParams = this.params
      this.loading = true;
      this.settings = {
        method: this.method,
        data: this.finalParams,
        resolve: function(d) {
          this.loading = false;
          callback && callback();
          if (this.topRefresh) {
            this.isRefreshing = false;
          }
          // 判断是否是原生切换 阻止了请求回调
          if (!this.cmp(clonParams, this.params)) {
            return false;
          }
          if (d.boolen) {
            // 还可以手工整理页码格式
            this.dispatch('parseData', d);

            let list;
            let page = d.data.page;

            // 统一页码格式
            if (!page) {
              page = this.keepPageSame(d.data);
            }

            if (!d.data.list) {
              list = d.data.data;
            } else {
              list = d.data.list;
            }

            // 防止某些接口list为空的时候传一个空zifuchan
            // 下面判断lenght就会报错
            list = list || [];

            let totlaPage = parseInt(page.total_page || page.totalPage || page.total);
            let curPage = parseInt(page.current_page || page.pageNo);

            this.isScrolling = false;

            // 页码不对则什么也不作
            if (curPage != this.finalParams.p) {
              // if (!list.length) this.isNoData = true
              return false;
            }
            // 往上调了下，因为tab的时候如果这时没数据就不会运行他了
            this.dispatch('completed', list, this.isReset);
            // 有很多情况是数据放在list外面的，考虑到之前写的，这里提供一种选择
            this.dispatch('completedGetAllData', d.data, this.isReset);

            // 只有当第一次请求就没数据时
            // 才会触发这里，因为如果是最后一页再请求下一页是不会发请求的
            if (!list.length) {
              this.isNoData = true;
              this.removeEvent();
              this.dispatch('nodata');
              return false;
            } else {
              this.pullupData = true;
            }

            // 非最后一页
            if (totlaPage >= curPage + 1) {
              // this.finalParams.page_no = this.finalParams.page = this.finalParams.p = ++curPage
              this.finalParams.pageNum = this.finalParams.page = this.finalParams.p = ++curPage;
            } else {
              // 最后一页了, 没数据
              this.removeEvent();
              this.dispatch('last');
              this.isLastPage = true;
            }
            if (this.isReset) {
              this.isReset = false;
            }
          } else {
            this.isScrolling = false;
            this.isNoData = true;
            this.removeEvent();
            this.dispatch('nodata');
            return false;
          }

          // 防止数据过少占不满全屏
          this.$nextTick(function() {
            this.getScrollData();
          });
        }
      };
      if (!this.isScrolling) {
        this.getList();
      }
    },
    cmp: function(x, y) {
      if (x === y) {
        return true;
      }
      if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
      }
      if (x.constructor !== y.constructor) {
        return false;
      }
      for (var p in x) {
        // Inherited properties were tested using x.constructor === y.constructor
        if (x.hasOwnProperty(p)) {
          // Allows comparing x[ p ] and y[ p ] when set to undefined
          if (!y.hasOwnProperty(p)) {
            return false;
          }
          // If they have the same strict value or identity then they are equal
          if (x[p] === y[p]) {
            continue;
          }
          // Numbers, Strings, Functions, Booleans must be strictly equal
          if (typeof (x[p]) !== 'object') {
            return false;
          }
          // Objects and Arrays must be tested recursively
          if (!Object.equals(x[p], y[p])) {
            return false;
          }
        }
      }
      for (p in y) {
        // allows x[ p ] to be set to undefined
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
          return false;
        }
      }
      return true;
    },
    // 获取数据
    getList: async function() {
      this.isScrolling = true;
      const res = await Api[this.api](this.settings.data);

      this.settings.resolve.call(this, { data: res, boolen: 1 });

    },
    // 重新添加配制项
    reset: function(callback) {
      var curTimestamp = +new Date();
      var diff = curTimestamp - this.timestamp;
      // 300ms内不允许再次提交
      if (diff < 300 && !this.resetNoScroll) {
        return false;
      } else {
        this.timestamp = curTimestamp;
      }
      // 出借页取结束标的时候不用到头部
      if (!this.params.only_end) {
        // 初始化时滚动到头部
        this.$Bus.$emit('IScroll:top');
      }
      this.isReset = true;
      this.removeEvent();
      this.resetData();
      this.render(callback);
    },
    resetData() {
      this.isScrolling = false;
      this.isNoData = false;
      this.isLastPage = false;
    },
    // 检查是否满足上拉条件
    getScrollData(e) {
      // 因为前面绑定了touchend事件，所以当tab切换时点的时候就会触发请求下一页
      // nextTick的时候需要下拉的v-if就删了，所以会多出一次ajax
      // 可以通过this.el是否存在来解决这个问题
      if (this.isScrolling || this.isLastPage || this.isNoData || !this.$el) return false;
      if (isScrollToBottom()) {
        this.getList();
      }
    },
    keepPageSame: function(data) {
      return {
        total_page: data.total_page || data.totalPages || 1,
        current_page: data.current_page || data.nowPage || data.current_Page || 1
      };
    },
    // emit事件出去
    dispatch: function() {
      var args = [].slice.call(arguments);
      this.$emit.apply(this, args);
      // 发出finished事件
      if (emitFinished.indexOf(args[0]) !== -1) {
        this.$emit('finished');
      }
    },
    _topRefreshTouchstart(event) {
      this.startY = event.touches[0].clientY;
      this.startOffset = this.offset;
      this.duration = 0;
      this.isRefreshing = true;
      this.enableRefreshing = false;

      if(containerScrollTop > 0){
        this.isTouch = false;
        return;
      }

      this.isTouch = true;
    },
    _topRefreshTouchmove(event) {
      let scrollTop = window.scrollY
      if(!this.isTouch) {
        return
      }

      const currentY = event.touches[0].clientY;
      const offset = currentY - this.startY;
      if (offset > 0) { // 向下拉
        if (scrollTop <= 0) {
          event.preventDefault(); // 阻止浏览器默认的滚动,避免触发bounce
        }
      }
      if (offset < 0) {
        this.isMoving = false;
        return;
      }
      this.isMoving = true;
      // 下拉
      if (offset <= MAX_TOP_REFRESH_HEIGHT) {
        this.offset = offset;
        // 指定距离 < 下拉距离 < 指定距离*2
      } else if (offset > MAX_TOP_REFRESH_HEIGHT && offset < MAX_TOP_REFRESH_HEIGHT * 2) {
        this.offset = MAX_TOP_REFRESH_HEIGHT + (offset - MAX_TOP_REFRESH_HEIGHT) * 0.5;
      } else {
        this.offset = MAX_TOP_REFRESH_HEIGHT + MAX_TOP_REFRESH_HEIGHT * 0.5 + (offset - MAX_TOP_REFRESH_HEIGHT * 2) * 0.2;
      }
      this.isRefreshing = true;
    },
    _topRefreshTouchcancel(){
      // 微信下拉滚动的时候 会自动触发cancel事件
      // window.alert('_topRefreshTouchcancel')
    },
    _topRefreshTouchend() {
      // window.alert('_topRefreshTouchend')
      if (this.offset > 0 && this.isMoving) {
        if (this.offset !== this.startOffset) {
          if (this.offset > MAX_TOP_REFRESH_HEIGHT) {
            this.offset = MAX_TOP_REFRESH_HEIGHT;
          }
          // this.offset = 0
          this.startOffset = 0;
          this.duration = DEFAULT_DURATION;
          this.enableRefresh();
          // this.isRefreshing = false
          // this.reset()
        }
      } else {
        this.getScrollData();
      }
    },
    enableRefresh() {
      this.enableRefreshing = true;
      this.reset(() => {
        this.offset = 0;
        this.isRefreshing = false;
      });
    }
  }
};
</script>

<style>
  .pullup-text {
    text-align: center;
    line-height: 40px;
    color: #aaa;
  }
</style>
