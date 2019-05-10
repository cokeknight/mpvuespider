<template>
  <Layout title="欢迎来到">
    <Collapse title="表单">
      <div>
        <ListItem show-arr>
          标题文字
          <template slot="side">
            15168325036
          </template>
        </ListItem>
        <Btn custom-class="btn-primary" @click="success">
          订购
        </Btn>
      </div>
    </Collapse>
    <div class="listitem">
      <ListItem :key="99">
        <Btn custom-class="btn-primary" @click="Loading">
          Loading
        </Btn>
        <Btn custom-class="btn-primary" @click="hideLoading">
          hide Loading
        </Btn>
      </ListItem>
      <ListItem :key="1">
        <Btn custom-class="btn-primary" @click="tip">
          tip
        </Btn>
      </ListItem>
      <ListItem :key="2">
        <Btn custom-class="btn-primary" @click="confirm">
          Confirm
        </Btn>
      </ListItem>
      <ListItem :key="3">
        <Btn custom-class="btn-primary" @click="alert">
          Alert
        </Btn>
      </ListItem>
      <ListItem :key="4">
        <Btn custom-class="btn-primary" @click="popbox">
          popbox
        </Btn>
      </ListItem>
      <ListItem :key="5">
        <Btn custom-class="btn-primary" @click="success">
          成功 微信
        </Btn>
      </ListItem>
    </div>
    <Feedback />
  </Layout>
</template>

<script>
// Use Vuex
import Layout from 'layout'
import ListItem  from 'src/cssModules/lists/list-item'
import Collapse from 'src/cssModules/collapse/index'
import Btn from 'src/cssModules/public/btn'
import MP from 'MP'

export default {
  // computed: {
  //   count () {
  //     return store.state.count
  //   }
  // },
  components: {
    Layout,
    // List,
    ListItem,
    Collapse,
    Btn
  },
  data () {
    return {
      showConfirm: true,
      showPopbox: false,
      formObj: {
        mobile: '',
        smscode: ''
      }
    }
  },
  methods:{
    hideLoading(){
      MP.Loading.hide()

    },
    Loading(){
      MP.Loading.show()
      setTimeout(function(){
        MP.Loading.hide()

      }, 1000)
    },
    tip () {
      MP.Tip({
        msg: '错误'
      })
    },
    confirm(){
      MP.Confirm({
        title: '错误',
        content: '你好',
        onConfirm: function(){
          console.log('xieixe')
          this.goRouter('/account/login')
        }
      })
    },
    alert(){
      MP.Alert({
        title: '错误'
      })
    },
    popbox(){
      MP.Popbox({
        context: '申请提交成功，我们将在7-10个工作日内为您处理退订订单',
        btnMsg: '确定',
        onConfirm: ()=>{
          console.log('xieixe')
          this.goRouter('/account/login')
        }
      })
    },
    success(){
      MP.success({
        title:"提交成功"
      })
    }
  }
}
</script>

<style>
.counter-warp {
  text-align: center;
  margin-top: 100px;
}
.home {
  display: inline-block;
  margin: 100px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
