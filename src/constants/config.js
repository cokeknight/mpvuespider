/**
 * Created by xuxin on 16/3/22.
 */
const chinese = {
  title: '鑫合汇'
}

// window.DEVICE = 3

const config = {
  // 是否启用全存管, 如果app是7.1.0以下强制改为false
  open_all_cg: false,
  // 显示全存管提示（开启全存管 但 用户没开通存管帐户）
  show_cg_tip: false,
  // 旧的渠道
  oldRegisterPageRoute: '',
  host: 'https://xinhehui.com',
  proxyApi: '/Mobile2',
  isCanInteraction: false, // app是否加载完交互, ios8之前的是加载完才注入交互,其它设备不会改变这个值
  isLogin: false,
  firstInit: true, // 首次初始化, 用于判断是否是第一次路由
  chinese: chinese,
  fromAppName: null, // 从app过来访问的第一个网页name
  fromAppRouter: null, // 当前router
  appVersion: 0, // app的版本
  device: 4, // 设备来源
  isApp: false, // 记录是不是从app进来的
  platform: 'wap', // 当前是什么平台 wap（默认）/ios/android/Weixin, page里isApp里赋值
  resetRouter: false, // 老的路由切换成新的路由，切换时true,完成为false
  isFirstApp: false, // 是否第一次从app过来
  // 操作scrollTop组件
  scrollTopState: {
    bool: false
  },
  // 设置使用scrollTop的组件name
  scrollTopList: [], // 'membercenter'
  // 用于goToNative时与传入值对比，如果一致则要close关闭
  // 用于规避a->b(webview)>a ios报错,android会打开一个新的a
  fromPage: '',
  isGetCookie: false, // ios高级版本需要wap取app
  appIsStarted: false, // 网络是否已经启动,主要用于track，ios高版本需要js注入cookie会有时间差
  // 记录切换路由
  router: {
    from: null,
    top: null
  },
  // 是不是正式环境
  isProduction: process.env.NODE_ENV !== 'development',
  // 检查是否在线
  checkOnLine: function () {
    let onLine = window.navigator.onLine
    let routerTo = config.router.to
    let touterToName = routerTo.name
    // 如果在线，但是当前是离线页面， 后退到显示页
    if (onLine && touterToName == 'offLine') {
      window.history.go(-1)
    }

    // 如果离线，但当前不是离线页面，则跳到离线页
    if (!onLine && touterToName != 'offLine') {
      routerTo.go('{name: offLine}')
    }
    return onLine
  },
  redirectUrl: {
    name: '',
    params: {},
    query: {}
  },
  // 控制app.vue里router-view下一个视图出现的方向
  transition: {
    isBack: false
  },
  header: {
    title: chinese.XHH
  },
  headerCanSee: [],
  footerCanSee: {
    home: 1,
    invest: 1,
    account: 1,
    companyUs: 1,
    companyXindun: 1,
    depositInfo: 1,
    companyData: 1,
    companyMore: 1
  },
  footer: {
    show: false
  },
  loading: {
    show: false
  },
  prjType: {
    RYS: 1,
    YYS: 5,
    SDT: 8
  },
  // 发送web_log用, key是router name
  // logTypeArr: {
  //   'home': 1023,  // 首页
  //   'register': 1002, // 注册页
  //   'login': 1003,  // 登录页
  //   'invest': 1007, // 出借页
  //   'investDetails': 1008, // 项目详情页
  //   'investDeepDetails': 1009, // 出借确认页
  //   'investResult': 1010,  // 出借成功页
  //   'recharge': 1018,  // 充值页
  //   'helpUs': 1020, //简介页 - 关于我们
  //   'registerProtocol': 1022, //协议页
  //   // 网站暂时没，有的话别忘了改前面的key
  //   'actm.redsix': 1000,  // 火红6月活动页(Android、IOS)
  //   'index.step2': 1004,  // 完善用户资料页
  //   'index.step3': 1005,  // 实名认证页
  //   'act.redsix': 1011,  // 火红6月活动(微信、wap)
  //   'act.julypackage': 1012, // 7月认证活动
  //   'atm.julypackage': 1013, // 7月认证活动(Android、IOS)
  //   'act.registerAct': 1014,  // 8月注册活动
  //   'actm.registerAct': 1015,  // 8月注册活动(Android、IOS)
  //   'index.registerRed': 1016,  // 二维码到注册红包
  //   'index.registerRedNext': 1017,  // 二维码到注册红包成功页
  //   'yjzh.authtransition': 1019, //过渡页
  //   'yjzh.grantauth': 1021, //授权页
  //   'registerWay': 1024, // 注册页
  //   'registerWayTg': 1025, // 注册页
  //   'registerWayH5': 1026,
  //   'registerWay2': 1027,
  //   'registerWay2Tg1': 1028,
  //   'registerWay2Tg2': 1029
  // },
  // 常用的url
  url: {
    home: 'home',
    login: 'login',
    account: 'account',
    toConfirmBank: 'toConfirmBank'
  },
  // 登陆前的页面需要登陆后返回的,不用登陆也可以访问
  needBack: ['joinXpd', 'investDetails', 'investInfo', 'investInfoTab', 'investCalculator'],
  canNotGoAfterLogin: ['login', 'register', 'registerConfirm', 'findNewpassword', 'registerWay', 'registerWay2', 'registerWayTg', 'registerWayH5', 'registerWay2Tg1', 'registerWay2Tg2'],
  noNeedLogin: ['aboutXXTH', 'aboutXXTHDetail', 'publicProtocol', 'investProtocol', 'registerConfirm', 'marketing', 'findNewpassword', 'helpSecurity', 'helpSecurityOld', 'login', 'home', 'investTest', 'invest', 'investNewbie', 'register', 'publicProtocol', 'helpList', 'supervision', 'complain', 'helpNews', 'aboutNews', 'aboutNewsDetail', 'helpUs', 'findpassword', 'openapp', 'registerWay', 'registerWay2', 'registerWayTg', 'registerWayH5', 'hotActivity', 'joinXpd', 'registerWay2Tg1', 'registerWay2Tg2', 'simaQuestion', 'simaIntro', 'simaSafe', 'account', 'aboutFaq', 'faqDetail', 'investSdt', 'companySecurity', 'companyUs', 'companyXindun', 'depositInfo', 'companyData', 'companyReport', 'companyDevelop', 'companyHonor', 'companyTissue', 'companyMore', 'companyMarketing', 'companyFinance', 'companyLink', 'companyCompliance', 'investDetails', 'investInfo', 'investInfoTab', 'investCalculator', 'simaQuestion', 'simaIntro', 'simaSafe', 'redirectApp'],
  // ajax时不用显示loadding状态的接口或者路径
  // 项目详情相关页面
  investRouter: ['investDetails', 'investInfo', 'investInfoTab', 'investCalculator'],
  // 可以进入普通帐户提现页: 帐户余额, 存管开启结果页, 绑卡成功回跳页, 资费说明
  canGoDefaultWithdraw: ['accountBalance', 'depositoryResult', 'toConfirmBank', 'tollIntrl', 'addBank'],
  noLoading: [
    'getInvestorStatus',
    'pbuyN',
    'updatePwd',
    'isLogin',
    'account',
    'callBackFinish',
    'zscallbackReturn',
    'bindBankCard',
    'confirmBindBankCard',
    'rechargeSubmit',
    'tracklog',
    'useropenid',
    'webLog',
    'weixinSign',
    'setCornerRead',
    'changeRechargeRemind'
  ],
  // 需要调用同盾页面name
  needTD: ['register', 'login'],
  // ajax不显示tip提示的接口
  noTipAjax: [
    'isDbPopBox',
    'beSuperXpd',
    'zsSmsSend',
    'xlbDoConfirmClose',
    'xlbDoConfirmOpen',
    'getPushMessage',
    'rechargeSubmit',
    'zscallbackReturn',
    'checkPayPassword',
    'pbuyProtocol',
    'xOrderServiceProtocol',
    'transferProtocol',
    'validateView',
    'StartCaptcha',
    'bindBankCard',
    'isLogin',
    'userInfo',
    'getMyRechargeBankList',
    'applyCashout',
    'openSynAccountSubmit',
    'isNewPwd',
    'FastCashAdd',
    'setPayPassword',
    'appointQuit',
    'setCornerRead',
    'changeRechargeRemind',
    'applyCashoutPlanB',
    'getVoteEntrance',
    'addNormalBankCard'
  ],
  // ajax boolean=0时用alert弹出
  alertErrorMsg: [
    'appointQuitCheck',
    'reInvest'
  ],
  apiNoDirect: ['userInfo', 'isNewPwd'],
  // 老的渠道推广页url转跳
  // path: rounterName
  oldUrl: {
    '#ac=index.register': 'register',
    '#ac=index.registerWay': 'registerWay',
    '#ac=index.registerWay2': 'registerWay2',
    '#ac=index.registerWayH5': 'registerWayH5',
    '#ac=index.registerWayTg': 'registerWayTg'
  },
  // 保存当前router位置
  // from可以是字符串或者数组
  savePosition: {
    companyUs: {
      dis: 0,
      from: ['companyTissue', 'companyHonor', 'companyDevelop']
    }
  },
  // 不是振鑫计划人员输入网址进入，直接重定向到404页面
  stateRedirection: {
    'zhenxinPlan': '404',
    'zhenxinPlanSchedule': '404',
    'zhenxinPlanCalculation': '404',
    'zhenxinPlanTransaction': '404',
    'zhenxinPlanFund': '404',
    'zhenxinPlanFundDetail': '404'
  }
}

export default config
