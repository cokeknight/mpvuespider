
import MP from 'MP'
let eventMap = {
  list: [],
  add: function (item, eventName, func) {
    this.list.push({
      item,
      func,
      eventName
    })
    item.addEventListener(eventName,func)
  },
  clear: function () {
    for (let i=0;i<this.list.length;i++){
      let child = this.list[i]
      child.item.removeEventListener(child.eventName,child.func)
      this.list.splice(i,1)
    }
  }
}
const blur = function () {
  setTimeout(function() {
    var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
    window.scrollTo(0, Math.max(scrollHeight - 1, 0));
  }, 100);
}
const globalRouter = []
export default{
  methods: {
    uploadFormId () {
      return false
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // let savePosition = Conf.savePosition[vm.$route.name]
      MP.wap.vm = vm
      let currentRoutename = MP.wap.currentRoutename = vm && vm.$route.name
      if (currentRoutename) {
        globalRouter.push(currentRoutename)
        if (globalRouter.length === 2) {
          MP.wap.preiviousRoutename = globalRouter[0]
          globalRouter.splice(0, 1)
        }
        console.log(globalRouter)
      }

      // 需要默认滚动的元素 且 来时的路由也对则默认滑动
      // todo 页面自动上滚
      // if (savePosition && (savePosition.from == from.name || savePosition.from.indexOf(from.name) > -1)) {
      //   // 手机里面有时候会有问题
      vm.$nextTick(() => {
        //修复微信里面键盘弹起不会恢复的bug
        const inputList = [].slice.call(document.getElementsByTagName('input'))
        inputList.forEach(function(item){
          eventMap.add(item,'blur',blur)
        })
        // Bus.$emit('IScroll:move', 0, savePosition.dis)
      })
      // }
    })
  },

  // mounted () {
  //   console.log('mounted')
  //   this.$nextTick(function(){
  //     console.log(document.getElementsByTagName('input'))
  //     // document.getElementsByTagName('input').forEach(function(){
  //     //   eventMap.add(item,'blur',blur)
  //     // })
  //   })
  // },
  beforeDestroy(){
    eventMap.clear()
  }
}
