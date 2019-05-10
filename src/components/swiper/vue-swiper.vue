<!--
https://github.com/weilao/vue-swiper
loop-是否自动轮播
current-设置默认页数,父组件可时时修改控制当前展示页面(第一页传入数值1,不能传0)
direction-vertical（垂直）、horizontal（水平）设置方向
scrollViewInit-此组件全屏与scrollView一起使用时候（参考-about-security）
offsetNum-试用于外层div有padding或者margin不是全屏的情况，传入差别的像素值
full-全屏的时候使用
offsetBool-在clientWidth与offsetWidth尺寸不一致的时候，页数改变时候使用offsetWidth计算移动宽度（参考company-xindun）
notCentered-默认为false,传入true时候，组件不控制初始化时候居中位置，可与initTranslateX同时使用（参考company-xindun）
initTranslateX-默认传入第一次时translateX的位置，可与notCentered同时使用（参考company-xindun）
-->
<template>
  <div ref="scrollDiv"
       :class="[direction, {'dragging': dragging}]"
       @wheel="_onWheel"
  >
    <div ref="swiperWrap" class="swiper-wrap" :style="{
           'transform' : 'translate3d(' + translateX + 'px,' + translateY + 'px, 0)',
           'transition-duration': transitionDuration + 'ms', 'height': avtiveHeight + 'px'}"
         @transitionend="_onTransitionEnd"
    >
      <slot></slot>
    </div>
    <ol v-show="paginationVisible"
        class="swiper-pagination"
    >
      <li v-for="(slide, $index) in slideEls"
          :key="$index"
          class="swiper-pagination-bullet"
          :class="{'current': $index+1 === currentPage}"
          @click="paginationClickable && setPage($index+1)"
      ></li>
    </ol>
    <img v-if="ImgUrl" :src="ImgUrl+'icon-prev.png'" class="swiper-prev" @click="prev" />
    <img v-if="ImgUrl" :src="ImgUrl+'icon-next.png'" class="swiper-next" @click="next" />
  </div>
</template>
<!--<style lang="less" src="./vue-swiper.less"></style>-->
<script type="text/babel">
  const VERTICAL = 'vertical'
  const HORIZONTAL = 'horizontal'
  import config from 'src/config'
  export default {
    props: {
      direction: {
        type: String,
        default: VERTICAL,
        validator: (value) => [VERTICAL, HORIZONTAL].indexOf(value) > -1
      },
      mousewheelControl: {
        type: Boolean,
        default: true
      },
      performanceMode: {
        type: Boolean,
        default: false
      },
      paginationVisible: {
        type: Boolean,
        default: false
      },
      paginationClickable: {
        type: Boolean,
        default: false
      },
      loop: {
        type: Boolean,
        default: false
      },
      speed: {
        type: Number,
        default: 500
      },
      current: {
        type: Number,
        default: 1
      },
      scrollViewInit: {
        type: Boolean,
        default: true
      },
      offsetNum: {
        type: Number,
        default: 0
      },
      full: {
        type: Boolean,
        default: false
      },
      offsetBool: {
        type: Boolean,
        default: false
      },
      notCentered: {
        type: Boolean,
        default: false
      },
      initTranslateX: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        ImgUrl: config.imgUrl,
        currentPage: this.current,
        lastPage: 1,
        translateX: this.initTranslateX,
        translateY: 0,
        startTranslate: 0,
        delta: 0,
        dragging: false,
        startPos: null,
        transitioning: false,
        slideEls: [],
        translateOffset: 0,
        transitionDuration: 0,
        centerNumber: 0,
        //反方向的触发位置及移动距离
        startObversePos: null,
        obverseDelta: 0,
        startOldTranslate: 0,
        obverseNum: 1,
        avtiveHeight: 0
      }
    },
    watch: {
      //监听外层current改变，切换轮播
      current (val) {
        this.setPage(val)
      },
      //内部重新设置之后，设置当前height
      currentPage (val) {
        this.setTimeOutActive()
      }
    },
    mounted () {
      this._onTouchMove = this._onTouchMove.bind(this)
      this._onTouchEnd = this._onTouchEnd.bind(this)
      this.$refs.scrollDiv.addEventListener('touchstart',this._onTouchStart,true)
      this.slideEls = [].map.call(this.$refs.swiperWrap.children, el => el)
      if (this.full) {
        [].forEach.call(this.$refs.swiperWrap.children, (item) => {
          item.style.width = document.body.clientWidth + 'px'
        })
      } else {
        if (!this.notCentered) {
          //判断初始位置起点,试用于不全屏模式
          this.centerNumber = (document.body.clientWidth - this.$refs.swiperWrap.children[0].clientWidth - this.offsetNum) / 2
          //这个问题我也碰到过了，发现vue-swiper是通过判断偏移量>0来决定要不要e.preventDefault()，在上下滑动时，无论你怎么垂直下滑，都不可避免会产生水平便宜，vue-swiper处理就阻止默认下滑了，
          // 所以解决办法是，在源码第139行，偏移量0稍微改一下比如改为10，这样，由于竖直滑动引起的微小水平便宜量可以被过滤掉
          if (!this.current && this.centerNumber > 10) {
            this.translateX = this.centerNumber
          }
        }
      }
      if (this.loop) {
        this.$nextTick(function () {
          this._createLoop()
          this.setPage(this.currentPage, true)
          //等待第一页加载图片
          setTimeout(() => {
            this.setTimeOutActive()
          }, 500)
        })
      } else {
        this.setPage(this.currentPage, true)
        setTimeout(() => {
          this.setTimeOutActive()
        }, 500)
      }
    },
    methods: {

      // alert1(e){
      //   console.info(e)
      //   e.preventDefault()
      //   alert('111',e);
      // },
      next () {

        var page = this.currentPage
        if (page < this.slideEls.length || this.loop) {
          this.setPage(page + 1)
        } else {
          this._revert()
        }
      },
      prev () {

        var page = this.currentPage
        if (page > 1 || this.loop) {
          this.setPage(page - 1)
        } else {
          this._revert()
        }
      },
      setTimeOutActive () {
        this.setActiveHeight()
      },
      setActiveHeight () {
        var avtiveEl = this.slideEls[this.currentPage - 1]
        this.avtiveHeight = avtiveEl.offsetHeight
        this.$Bus.$emit('IScroll:refresh')
      },
      setPage (page, noAnimation) {
        var self = this
        this.lastPage = this.currentPage
        if (page === 0) {
          this.currentPage = this.slideEls.length
        } else if (page === this.slideEls.length + 1) {
          this.currentPage = 1
        } else {
          this.currentPage = page
        }
        if (this.loop) {
          if (this.delta === 0) {
            this._setTranslate(self._getTranslateOfPage(this.lastPage))
          }
          setTimeout(function () {
            self._setTranslate(self._getTranslateOfPage(page))
            if (noAnimation) return
            self._onTransitionStart()
          }, 0)
        } else {
          this._setTranslate(this._getTranslateOfPage(page))
          if (noAnimation) return
          this._onTransitionStart()
        }
      },
      isHorizontal () {
        return this.direction === HORIZONTAL
      },
      isVertical () {
        return this.direction === VERTICAL
      },
      _onTouchStart (e) {

        this.startPos = this._getTouchPos(e)
        this.delta = 0
        this.startTranslate = this._getTranslateOfPage(this.currentPage)
        this.startTime = new Date().getTime()
        this.dragging = true
        this.transitionDuration = 0
        if (this.scrollViewInit) {
          this.startObversePos = this._getTouchObversePos(e)
          this.startOldTranslate = this.translateX
          this.touchendStop = false
        }
        e.currentTarget.addEventListener('touchmove', this._onTouchMove, {passive: false})
        e.currentTarget.addEventListener('touchend', this._onTouchEnd, {passive: false})
      },
      _onTouchMove (e) {
        if (this.touchendStop) {
          return false
        }
        this.delta = this._getTouchPos(e) - this.startPos
        if (this.scrollViewInit) {
          this.obverseDelta = this._getTouchObversePos(e) - this.startObversePos
          //第一次进入不计算
          if (this.toPlusInt(this.obverseDelta) > this.toPlusInt(this.delta)) {
            this.touchendStop = true
            e.currentTarget.removeEventListener('touchmove', this._onTouchMove)
            e.currentTarget.removeEventListener('touchend', this._onTouchEnd)
            e.currentTarget.removeEventListener('mousemove', this._onTouchMove)
            e.currentTarget.removeEventListener('mouseup', this._onTouchEnd)
            this.translateX = this.startOldTranslate
            this.obverseNum = 0
          } else if (!this.performanceMode && this.toPlusInt(this.delta) > 3) {
            this._setTranslate(this.startTranslate + this.delta)
            this.$emit('slider-move', this._getTranslate())
            e.stopPropagation()
          }
        } else if (!this.performanceMode) {
          this._setTranslate(this.startTranslate + this.delta)
          this.$emit('slider-move', this._getTranslate())
          e.stopPropagation()
        }
        if (this.isVertical() || this.obverseNum && this.isHorizontal() && Math.abs(this.delta) > 0) {
          // 判断默认行为是否可以被禁用
          if (e.cancelable) {
            // 判断默认行为是否已经被禁用
            if (!e.defaultPrevented) {
              e.preventDefault()
            }
          }
        }
      },
      _onTouchEnd (e) {
        // alert('end');
        if (this.touchendStop) {
          return false
        }
        this.dragging = false
        this.transitionDuration = this.speed
        var isQuickAction = new Date().getTime() - this.startTime < 1000
        if (this.delta < -100 || (isQuickAction && this.delta < -15)) {
          this.next()
        } else if (this.delta > 100 || (isQuickAction && this.delta > 15)) {
          this.prev()
        } else {
          this._revert()
        }
        e.currentTarget.removeEventListener('touchmove', this._onTouchMove)
        e.currentTarget.removeEventListener('touchend', this._onTouchEnd)
        e.currentTarget.removeEventListener('mousemove', this._onTouchMove)
        e.currentTarget.removeEventListener('mouseup', this._onTouchEnd)
      },
      _onWheel (e) {
        if (this.mousewheelControl) {
          // TODO Support apple magic mouse and trackpad.
          if (!this.transitioning) {
            if (e.deltaY > 0) {
              this.next()
            } else {
              this.prev()
            }
          }
          if (this._isPageChanged()) e.preventDefault()
        }
      },
      _revert () {
        this.setPage(this.currentPage)
      },
      _getTouchPos (e) {
        var key = this.isHorizontal() ? 'pageX' : 'pageY'
        return e.changedTouches ? e.changedTouches[0][key] : e[key]
      },
      _getTouchObversePos (e) {
        var key = !this.isHorizontal() ? 'pageX' : 'pageY'
        return e.changedTouches ? e.changedTouches[0][key] : e[key]
      },
      toPlusInt (num) {
        var mess = num + ''
        if (num >= 0) return num
        return parseInt(mess.substr(1))
      },
      _onTransitionStart () {
        this.transitioning = true
        this.transitionDuration = this.speed
        if (this._isPageChanged()) {
          this.$emit('slide-change-start', this.currentPage)
        } else {
          this.$emit('slide-revert-start', this.currentPage)
        }
      },
      _onTransitionEnd () {
        this.transitioning = false
        this.transitionDuration = 0
        this.delta = 0
        if (this._isPageChanged()) {
          this.$emit('slide-change-end', this.currentPage)
        } else {
          this.$emit('slide-revert-end', this.currentPage)
        }
      },
      _isPageChanged () {
        return this.lastPage !== this.currentPage
      },
      _setTranslate (value) {
        var translateName = this.isHorizontal() ? 'translateX' : 'translateY'
        if (this.centerNumber) {
          this[translateName] = value + this.centerNumber
        } else {
          this[translateName] = value
        }
      },
      _getTranslate () {
        var translateName = this.isHorizontal() ? 'translateX' : 'translateY'
        return this[translateName]
      },
      _getTranslateOfPage (page) {
        if (page === 0) return 0
        var propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight'
        if (this.offsetBool) {
          propName = this.isHorizontal() ? 'offsetWidth' : 'offsetHeight'
        }
        return -[].reduce.call(this.slideEls, function (total, el, i) {
          return i > page - 2 ? total : total + el[propName]
        }, 0) + this.translateOffset + this.initTranslateX
      },
      _createLoop () {
        var propName = this.isHorizontal() ? 'clientWidth' : 'clientHeight'
        var swiperWrapEl = this.$refs.swiperWrap
        var duplicateFirstChild = swiperWrapEl.firstElementChild.cloneNode(true)
        var duplicateLastChild = swiperWrapEl.lastElementChild.cloneNode(true)
        swiperWrapEl.insertBefore(duplicateLastChild, swiperWrapEl.firstElementChild)
        swiperWrapEl.appendChild(duplicateFirstChild)
        this.translateOffset = -duplicateLastChild[propName]
      }
    }
  }
</script>
<style lang="less">
  .swiper {
    position: relative;
    overflow: hidden;
  }
    .swiper-wrap {
      display: flex;
      width: 100%;
      height: 100%;
      transition: all 0ms ease;

      > div {
        overflow: hidden;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
      }
    }

    &.horizontal .swiper-wrap {
      flex-direction: row;
    }

    &.vertical .swiper-wrap {
      flex-direction: column;
    }

    .swiper-pagination {
      position: absolute;

      .swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #000000;
        opacity: .2;
        transition: all .5s ease;
      }

      .swiper-pagination-bullet.active {
        background: #007aff;
        opacity: 1;
      }
    }

    &.vertical .swiper-pagination {
      right: 10px;
      top: 50%;
      transform: translate3d(0, -50%, 0);

      .swiper-pagination-bullet {
        display: block;
        margin: 6px 0;
      }
    }

    &.horizontal .swiper-pagination {
      bottom: 10px;
      width: 100%;
      text-align: center;

      .swiper-pagination-bullet {
        display: inline-block;
        margin: 0 3px;
      }
      .current{
        background: #3bd1ca;
        opacity: 1;
      }
    }
  .swiper-prev,.swiper-next{
    position: absolute;
    /*z-index: 99;*/
    z-index: 0;
    width: 22px;
    height: 35px;
    top: 50%;
    margin-top: -12.5px;

  }
  .swiper-prev{
    left: 10px;
  }
  .swiper-next{
    right: 10px;
  }
</style>
