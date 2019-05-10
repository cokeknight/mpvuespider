let wechat = {
  'sendReward': 'Mobile2/Weixin/sendReward', // 向后台发送用户刮奖成功
  'sign': 'Mobile2/Weixin/sign', // 请求签到奖励
  'preSign': 'Mobile2/Weixin/sign_status', // 请求是否签到及是否刮奖
  'useropenid': 'Weixin/User/useropenid',
  'weixinSign': 'Mobile2/Index/getsingpack' // 微信签名
}
let lianxin = {
  'joinInSuccess': 'Mobile2/Lxq/joinInSuccess',
  'myLxqList': 'Mobile2/Lxq/myLxqList',
  'myLxqView': 'Mobile2/Lxq/myLxqView'
}
let track = {
  'tracklog': 'tracklog'
}
let auth = {
  'login': 'Mobile2/User/goLogin_6_7',
  'logout': 'Mobile2/Auth/logout',
  'sendSafeMobileCode': 'Mobile2/Auth/sendSafeMobileCode', // 短信安全验证--登陆页面，极验成功发送短信接口
  'checkSMS': 'Mobile2/Auth/loginVoneBySafeCode', // 短信安全验证--校验短信接口
  'isLogin': 'Mobile2/Auth/isLogin',
  'getMobileCodeRegister': 'Mobile2/Auth/getMobileCodeRegister',
  'sendRegisterMobileCode': 'Mobile2/Index/sendRegisterMobileCode_wap', // 常规发送短信
  'register_wap': 'Mobile2/Index/register_wap', // 推广注册接口
  'getCode': 'Mobile2/Public/getC', // 获取用户数 成交额
  'getBanner': 'Mobile2/Index/getBanner', // 渠道推广图片接口
  'registerVerify': 'Mobile2/Auth/VerifyingSMS', // 注册第一个验证手机 验证码
  'register': 'Mobile2/Auth/register',
  'StartCaptcha': 'Mobile2/Auth/StartCaptchaServlet',
  'IsNeedCode': 'Mobile2/Auth/isNeedCode',
  'isMobileRegister': 'Mobile2/Auth/isMobileRegister',
  'stats': 'Weixin/Index/stats',
  'isNewPwd': 'Mobile2/User/isNewPwd'
}
// 鑫拍档
let xinPartner = {
  getSuperXpdConfig: 'superxpd/getSuperXpdConfig', // 权益升级激活码有效期
  getSiteDomain: 'superxpd/getSiteDomain', // 获取活动站当前域名
  getSuperXpdTaskBanner: '/Mobile2/Banner/getSuperXpdTaskBanner', // 获取超级鑫拍档任务banner
  getAllSuperXpdConfig: '/superxpd/getAllSuperXpdConfig', // 到期问号弹框数据
  getSuperXpdBanner: '/Mobile2/Banner/getSuperXpdBanner', // 超级鑫拍档获取banner
  getSuperXpdTaskReward: '/task/doReward', // 超级鑫拍档奖领取任务奖励
  joinSuperXpdByCode: '/superxpd/joinSuperXpdByCode', // 超级鑫拍档奖非白名单升级
  getAwardDate: '/superxpd/datePicker', // 超级鑫拍档奖励日期
  getAwardDeatail: '/superxpd/getSuperXpdReward', // 超级鑫拍档奖励明细
  exchangeActiveCode: '/superxpd/exchangeActiveCode', // 超级鑫拍档激活码兑换
  getActiveCode: '/superxpd/getActiveCode', // 超级鑫拍档获取激活码列表
  getDuiBaProducts: '/superxpd/duiBaProducts', // 超级鑫拍档积分商城区
  getSuperXpdTasklist: '/superxpd/getSuperXpdTasklist', // 超级鑫拍档任务区
  getEndDateRule: '/Mobile2/superxpd/getEndDateRule', // 超级鑫拍档到期规则数据
  superxpdPageData: '/superxpd/getSuperXpdPageData', // 超级鑫拍档页面数据
  getSuperXpdCode: 'Mobile2/superxpd/getcode', // 申请超级鑫拍档的验证码
  getCommissionRecord: 'Mobile2/XinPartner/getCommissionRecord', // 佣金流水记录
  xinPartnerList: 'Mobile2/XinPartner/xinPartnerList', // 邀请记录
  xinPartnerSalary: 'Mobile2/XinPartner/xinPartnerSalary', // 鑫拍档
  joinXinPartner: 'Mobile2/XinPartner/joinXinPartner', // 判断鑫拍档资格
  // doJoinXpd: 'Mobile2/XinPartner3/doJoinXpd', //加入鑫拍档
  getRecomQrcode: '/Mobile2/XinPartner/getRecommendCode', // 获取鑫拍档二维码
  getLoginTag: '/Mobile2/XinPartner3/getLoginTag', // 是否提示抽奖活动
  giveFriendBonus: '/Mobile2/XinPartner/giveFriendBonus', // 发红包促出借
  isXpd: '/xpdshare/isXpd', // 是否加入鑫拍档
  xinPartnerInfo: '/xpdshare/xinPartnerInfo', // 鑫拍档首页统计数据
  getRemarkList: 'Mobile2/XinPartner/getBonusRemarkList', // 鑫拍档提示消息
  xpdBanner: '/xpdshare/bannerData', // 已加入鑫拍档banner
  xpdBonusList: '/xpdshare/bonusList', // 奖励列表
  useBonusList: '/xpdshare/useBonusList', // 已使用奖励列表
  doJoinXpd: '/xpdshare/doJoinXpd', // 加入鑫拍档
  joinSuperXpd: '/superxpd/joinSuperXpd', // 白名单加入鑫拍档
  shareQrUrl: '/xpdshare/shareQrUrl', // 鑫拍档二维码
  xpdAbout: '/xpdshare/about' // 鑫拍档常见问题
}
// 出借列表
let invest = {
  prjBaseInfoCSD: 'Mobile2/Invest/prjBaseInfoCSD', // 车商贷项目信息
  safetyControlCSD: 'Mobile2/Invest/safetyControlCSD', // 车商贷安全保障
  postLoanSituation: 'Mobile2/Invest/postLoanSituation', // 车商贷贷后情况
  plist: 'Mobile2/Invest/plist', // 列表页
  listClassify: 'Mobile2/Invest/listClassify',
  getPriFilter: 'Mobile2/Invest/getPrjListFilterItem', // 获取筛选项
  getSdtList: 'Mobile2/Invest/sdtList', // 获取筛选项
  pdetail: 'Mobile2/Invest/pdetail', // 详情页
  pbuyN: 'Mobile2/Invest/pbuyN', // 出借
  prjBaseInfo: 'Mobile2/Invest/prjBaseInfo', // 项目信息
  getGuarantor: 'Mobile2/Invest/getGuarantor', // 安全保障
  prj_replay_plan_new: 'Mobile2/Invest/prj_replay_plan', // 还款计划
  invest_history: 'Mobile2/Invest/invest_history', // 出借记录
  getPrjProcedure: 'Mobile2/Invest/getPrjProcedure', // 项目进度
  financePrjProcedure: 'Mobile2/FinancList/getPrjProcedure',
  calculator: 'Mobile2/Invest/calculator', // 计算收益
  payPrjDetail: 'Mobile2/Invest/payPrjDetail', // 出借页
  getInvestorStatus: 'Mobile2/Invest/getInvestorStatus', // 查询是否出借成功
  doSwitchAutoInvest: 'Mobile2/User/doSwitchAutoInvest', // 轮询是否出借前先关闭短信验证码
  sendSwitchAutoInvest: 'Mobile2/User/sendSwitchAutoInvest', // 存管短信
  pbuyCheck: 'Mobile2/Invest/pbuyCheck', // 奖券
  pbuyProtocol: 'Mobile2/Protocol/view', // 出借页协议
  getMaxInvestMoney: 'Mobile2/Invest/getMaxInvestMoney', // 出借页面:获取最大购买额
  getRiskInfo: 'Mobile2/Protocol/view2', // 获取出借人风险提示书
  signRiskPro: 'Mobile2/Invest/riskSign', // 出借项目详情已实名用户（有限制的用户）签署风险提示书
  getProView: 'Mobile2/Protocol/view2', // 获取出借人风险提示书
  getLatestEndList: 'Mobile2/Invest/getLatestEndList', // 加载已经结束的项目
  ilist: 'Mobile2/FinancList/ilist', // 理财记录
  cancelAutoBidAuthorize: 'Mobile2/XprjAutoBid/cancelAutoBidAuthorize', // 交易记录中自动投标取消授权
  getAutoBidOrderDetail: 'Mobile2/XprjAutoBid/getAutoBidOrderDetail', // 自己投标交易详情
  getInvestRecord: 'Mobile2/FinancList/getUserInvestRecord', // 7.1.4交易记录
  orderDetailList: 'Mobile2/FinancList/orderDetailFromList', // 7.1.4交易详情
  order_replay_plan: 'Mobile2/Invest/order_replay_plan', // 还款列表
  protocolView: 'Mobile2/FinancList/protocolView', // 查看合同
  getProtocolView: 'Mobile2/FinancList/getProtocolView',
  // pbuyCheck: 'Mobile2/Invest/pbuyCheck',
  // 司马小鑫
  getisInRedelivery: 'Mobile2/Xjh/getisInRedelivery', // 获取复投状态
  getMyXjhOrders: 'Mobile2/Xjh/getMyXjhOrders', // 理财记录
  xOrderServiceProtocol: 'Mobile2/Xjh/xOrderServiceProtocol', // 债权转让协议列表
  transferProtocol: 'Mobile2/Xjh/transferProtocol', // 明细里 --> 债权转让合同
  validateView: 'Mobile2/Protocol/validateView', // 明细里 --> 借款合同
  getMyOrderInXjh: 'Mobile2/Xjh/getMyOrderInXjh', // 明细
  getProtocolList: 'Mobile2/Xjh/getMyTransferProtocolList', // 债权转让合同列表
  quitIntroduction: 'Mobile2/Xjh/quitIntroduction', // 退出说明
  toAppointQuit: 'Mobile2/Xjh/toAppointQuit', // 退出页
  reInvest: 'Mobile2/Xjh/reInvest', // 开启关闭自动复投
  appointQuitCheck: 'Mobile2/Xjh/appointQuitCheck', // 跟appointQuit一样,提前校验
  appointQuit: 'Mobile2/Xjh/appointQuit', // 预约退出功能
  getAppointQuitData: 'Mobile2/Xjh/getAppointQuitData', // 退出结果查询
  cancelAppoint: 'Mobile2/Xjh/cancelAppoint' // 取消预约功能
}
// 账户
let userData = {
  assessResult: 'Mobile2/RiskAssess/assessResult', // 获取评估结果
  getriskinfo: 'Mobile2/RiskAssess/userInfoView', // 获取是否进行了合格出借人的问卷调查
  getoidmarks: 'Mobile2/BonusPoint/investPoint', // 获取出借后积分
  getallmarks: 'Mobile2/BonusPoint/myPoint', // 获取总积分
  userAccount: 'Mobile2/User/getAccount_6_7', // 获取账户信息
  getAccountEntries: 'Mobile2/User/getAccountEntries', // 获取账户分类入口
  setCornerRead: 'Mobile2/User/setCornerRead', // 账户入口点击修改角标
  userInfo: 'Mobile2/User/getUserInfo_6_7', // 获取用户信息
  uploadAva: 'Mobile2/User/uploadAva', // 上传头像
  uploadImg: 'Public/Upload/uploadImg', // 上传图片服务器
  editEmail1: 'Mobile2/User/editEmail1', // 修改邮箱-第一步
  editemail2: 'Mobile2/User/editemail2', // 修改邮箱-第二步
  authMail: 'Mobile2/Auth/authMail', // 邮箱认证
  mobileAuth: 'Mobile2/User/mobileAuth', // 手机认证
  sendMobileAuthCode: 'Mobile2/User/sendMobileAuthCode', // 手机认证-发送手机认证动态码
  editMobile1: 'Mobile2/User/editMobile1', // 修改手机号码-第一步
  editMobile2: 'Mobile2/User/editMobile2', // 修改手机号码-第二步
  sendCheckOldMobileCode: 'Mobile2/User/sendCheckOldMobileCode', // 修改手机号码-第一步-发送动态码
  sendEditMobileCode: 'Mobile2/User/sendEditMobileCode', // 修改手机号码-第二步-发送动态码
  updatePwd: 'Mobile2/User/updatePwd', // 修改密码
  getNextRepay: 'Mobile2/User/get_next_repay', // 下一个或上一个回款数据
  bankList: 'Mobile2/User/bank_list', // 获取开户行列表
  userBanks: 'Mobile2/User/user_banks', // 用户已绑定银行卡
  checkPwd: 'Mobile2/User/check_pwd', // 检查密码
  isSetSqa: 'Mobile2/User/is_set_sqa', // 安全保护问题: 检测是否设置过
  getSqaList: 'Mobile2/User/get_sqa_list', // 安全保护问题: 问题列表
  setSqa: 'Mobile2/User/set_sqa', // 安全保护问题: 设置
  setSqaCheck: 'Mobile2/User/set_sqa_check', // 安全保护问题: 检测安保问题
  myTyjBonus: 'Mobile2/User/my_tyj_bonus', // 体验金收益
  editUname: 'Mobile2/User/editUname', // 用户名修改接口
  passwdRecharge: 'Mobile2/Auth/passwdRecharge', // 修改是否使用支付密码充值
  getAssessTopic: 'Mobile2/RiskAssess/getAssessTopic', // 获取风险评估答题内容
  getAnswer: 'Mobile2/RiskAssess/answer' // 获取风险评估答题内容
}
// 统计专用
let stats = {
  a1: 'Mobile2/Stats/a1', // 新增用户（下载后首次打开客户端总数）
  a2: 'Mobile2/Stats/a2', // 活跃用户（当天打开客户端总数）
  a3: 'Mobile2/Stats/a3', // 累计用户（历史激活客户端总数）
  webLog: 'Mobile2/Public/web_log'
}
// 红包活动专区V2
let special = {
  getStats: 'Mobile2/Special/getStats', // 用户统计
  listSpecial: 'Mobile2/Special/listSpecial', // 活动专区列表
  listDetail: 'Mobile2/Special/listDetail', // 红包列表
  novice: 'Mobile2/Special/novice' // 新手专区列表
}
// 分享
let share = {
  getRandom: 'Mobile2/Share/getRandom', // 获取随机分享内容
  getShareNews: 'Mobile2/Share/getNews', // 获取公告分享内容
  qrCode: 'Mobile2/Share/qrCode', // 显示二维码
  getInvite: 'Mobile2/Share/getInvite', // 推荐分享
  shareSharkBonus: 'Mobile2/Share/shareSharkBonus', // 红包摇一摇分享
  getShareBehavior: 'Mobile2/Share/getShareBehavior'// 通用分享
}
// 摇一摇
let shake = {
  invest: 'Mobile2/Shake/invest', // 摇一摇理财
  investClear: 'Mobile2/Shake/invest_clear', // 重置服务器端摇一摇计数器
  getSharkBonusNum: 'Mobile2/Shake/getSharkBonusNum'// 摇一摇获取红包的数量, 和WEBVIEW的地址
}
// 推荐
let recommend = {
  index: 'Mobile2/Recommend/index', // 获取推荐消息
  recommendInvest: 'Mobile2/Invest/recommendInvest',
  recommendInvestNew: 'Mobile2/Invest/recommend',
  recommendLike: 'Mobile2/Invest/getDailyRecommendAndYouLike', // 猜你喜欢 今日推荐
  getRecommendInfo: 'Mobile2/Invest/getRecommendInfo' // 获取首页信息
}
// 推送
let pushMessage = {
  saveId: 'Mobile2/Push/saveId', // 保存百度云生成的 user_id,  channel_id, 如果没有则添加，  有则更新
  delId: 'Mobile2/Push/delId', // 删除绑定
  getPushMessage: 'Mobile2/Push/getPushMessage', // 获取推送消息列表V4
  readMessage: 'Mobile2/Push/readMessage'
}
// 公开的API(不用登录)
let publicAPI = {
  getaccesstojf: 'Mobile2/BonusPoint/getDuiBaLoginUrl', // 获取积分商城url
  verify: 'Mobile2/Public/verify', // 验证码,
  banner: 'Mobile2/Public/banner', // banner数据
  turn: 'Mobile2/Public/turn', // turn数据
  isNewPwd: 'Mobile2/User/isNewPwd', // 检测用户是否需要修改登录密码
  monthActivityBanner: 'Mobile2/Public/monthActivityBanner', // 每月活动banner
  exceptionLog: 'Mobile2/Public/exceptionLog', // 保存异常记录
  getNews: 'Mobile2/Public/getNews', // 公告动态列表
  getNewsContent: 'Mobile2/Public/getNewsContent', // 公告动态内容
  getHelpType: 'xhhadmin/javaApi/publicCallboard_getTypeForWap', // 常见问题类型
  helpQuestion: 'Mobile2/Public/helpQuestion', // 常见问题解答接口
  publicProtocol: 'Mobile2/Protocol/view', // 出借页面的协议展示
  helpAbout: 'Mobile2/Help/about',
  getRedirectAppData: 'xhh/app/page_param', // 获取短信链接重定向到app的数据
  getXxthProtocol: 'Mobile2/User/getAccountEntries',
  isDbPopBox: 'Mobile2/User/dbPopBox',
  getUserDbContract: 'Mobile2/ProtocolNew/getUserDbContract', // 获取担保公司内容
  askUserToSignDbContract: '/Mobile2/ProtocolNew/askUserToSignDbContract' // 让用户签署担保协议
}
// 手机支付密码
let payPassword = {
  getPayUserBank: 'Mobile2/PayPassword/getUserBank',
  setPayPassword: 'Mobile2/PayPassword/setPassword', // 设置/重置密码(通用)
  getPayMobileCode: 'Mobile2/PayPassword/getMobileCode', // 获取手机动态码(通用)
  checkMobileCode: 'Mobile2/PayPassword/checkMobileCode', // 验证手机动态码(通用)
  checkIdentity: 'Mobile2/PayPassword/checkIdentity', // 实名信息校验
  checkBankPayPwd: 'Mobile2/PayPassword/checkBank', // 银行卡信息校验
  checkSQAPay: 'Mobile2/PayPassword/checkSQA', // 安保问题校验
  checkPayPassword: 'Mobile2/PayPassword/checkPayPassword', // 验证用户支付密码
  getUserSqa: 'Mobile2/PayPassword/getUserSqa'// 获取用户设置的安保问题
}
// 收支，  提现,  银行卡绑定
let payAccount = {
  zsFirstEntry: 'Mobile2/User/zsFirstEntry', // 充值查询是否弹过提示存管帐户
  getMyAccountAndBankInfo: 'Mobile2/PayAccount/getMyAccountAndBankInfo', // 充值页集成了getMyRechargeBankList我存管账号信息
  changeRechargeRemind: 'Mobile2/PayAccount/rechargeRemind', // 充值页面修改弹框不在提示状态
  getMyRechargeBankList: 'Mobile2/PayAccount/getMyBankLimitMoney', // 充值页面的我的银行卡列表
  rechargeSubmit: 'Mobile2/PayAccount/msubmit', // 充值
  callBackFinish: '/Mobile2/PayAccount/callBackFinish', // 充值结束查看是否到账
  bankCardCheck: 'Mobile2/PayAccount/bankCardCheck', // 没有绑定易宝的 则验卡
  getLimitMoneyData: 'Mobile2/PayAccount/getLimitMoneyData', // 获取银行信息 限额
  toConfirmBank: 'Mobile2/PayAccount/toConfirmBank', // 验证银行
  bindBankCard: 'Mobile2/PayAccount/bindBankCard', // 银行卡验证页面 发送验证码
  confirmBindBankCard: 'Mobile2/PayAccount/confirmBindBankCard', // 确认绑卡
  getUserRechargeRecord: 'Mobile2/PayAccount/getUserRechargeRecord', // 用户的充值历史记录 V2
  getUserRechargeDetail: 'Mobile2/PayAccount/getUserRechargeDetail', // 用户的充值记录明细V2
  callbackReturnAjax: 'Mobile2/PayAccount/callbackReturnAjax', // 充值结果
  callBackFindOrder: 'Mobile2/PayAccount/callBackFindOrder',
  // 提现
  getMyBindBanks: 'Mobile2/PayAccount/getMyBindBanks', // 提现页获取绑定的银行卡列表
  getApplyCashout: 'Mobile2/PayAccount/getApplyCashout', // 提现申请初始化页面统计
  applyCashout: 'Mobile2/PayAccount/applyCashout', // 提现申请
  getUserCashoutRecord: 'Mobile2/PayAccount/getUserCashoutRecord', // 用户的提现申请记录 V2
  getUserCashoutDetail: 'Mobile2/PayAccount/getUserCashoutDetail', // 用户的提现记录详情信息 V2

  getSftCity: 'Mobile2/PayAccount/getSftCity', // 获取盛付通的省份信息
  getSftCitysById: 'Mobile2/PayAccount/getSftCitysById', // 根据盛付通省份id获取城市列表
  getBankListByKey: 'Mobile2/PayAccount/getBankListByKey', // 根据银行、省市、关键词搜索支行列表

  getFundAccount: 'Mobile2/PayAccount/getFundAccount', // 获取某个绑定的银行卡信息
  saveFundAccount: 'Mobile2/PayAccount/saveFundAccount', // 增/改三方账户信息
  sendDelFundAuthCode: 'Mobile2/PayAccount/sendDelFundAuthCode', // 手机认证-删除三方账户信息 认证动态码
  delFundAccount: 'Mobile2/PayAccount/delFundAccount', // 解除/删除银行卡信息
  getMyRecordList: 'Mobile2/PayAccount/getMyRecordList', // 收支记录
  getMyRecordInfo: 'Mobile2/PayAccount/getMyRecordInfo', // 资金记录详情
  getCashoutFee: 'Mobile2/PayAccount/getCashoutFee', // 获取提现资金管理费
  cancelCashout: 'Mobile2/PayAccount/cancelCashout', // 取消提现申请
  getMyCashoutList: 'Mobile2/PayAccount/getMyCashoutList', // 提现申请记录
  getMyXianxiaList: 'Mobile2/PayAccount/getMyXianxiaList', // 获取我的线下充值的列表
  paybanklist: 'Mobile2/PayAccount/paybanklist', // 获取可以充值的银行参数
  getCashoutFundList: 'Mobile2/PayAccount/getCashoutFundList', // 获取可以提现的银行卡和银行参数V4
  getCashoutFundAccountList: 'Mobile2/PayAccount/getCashoutFundAccountList', // 获取可以提现的银行卡和银行参数(2015.12.08新，  app版本5.4.1)
  zsGetApplyCashout: 'Mobile2/PayAccount/zsGetApplyCashout', // 获取存管账户余额和存管账户的可提现金额
  zsApplyCashout: 'Mobile2/PayAccount/zsApplyCashout',
  getWithdrawNotice: 'Mobile2/Lxq/getWithdrawNotice', // 提现页面获取连鑫积分数据
  getBankFundList: 'Mobile2/PayAccount/getBankFundList', // 获取可以充值的银行卡和银行参数V4
  mrechargePay2: 'Mobile2/PayAccount/mrechargePay2', // 新充值的wap页面1
  fundRecordIndex: 'Mobile2/PayAccount/fundRecordIndex', // 资金记录首页统计 V3
  submitFeedBack: 'Mobile2/PayAccount/submitFeedBack', // 提现原因提交
  addBank: 'Mobile2/PayAccount/addBank', // fzc
  addNormalBankCard: 'Mobile2/PayAccount/doubleAccountAddNormalBankCard' // 如果开通了存管但是普通账户没有绑卡的
}
// 流量包API(不用登录)忘记密码
let password = {
  setPassword: 'Mobile2/Password/setPassword', // 重置密码(通用)
  getMobileCode: 'Mobile2/Password/getMobileCode', // 获取手机动态码
  checkMobile: 'Mobile2/Password/checkMobile', // 手机确认(第一步)
  checkIdentity: 'Mobile2/Password/checkIdentity', // 实名信息校验
  checkBank: 'Mobile2/Password/checkBank', // 银行卡信息校验
  checkSQA: 'Mobile2/Password/checkSQA', // 安保问题校验
  getUserSqa: 'Mobile2/Password/getUserSqa'// 获取用户设置的安保问题
}
// 我的奖励
let myReward = {
  redCoupon: 'Mobile2/MyBonus/getMyBonus', // 红包/Mobile2/MyCoupons/getMyCoupons
  fullCoupon: 'Mobile2/MyCoupons/getMyCoupons', // 满减券
  fullCouponList: '/Mobile2/MyCoupons/getMyCouponsList', // 满减券列表
  rateCoupon: 'Mobile2/MyCoupons/getRateCoupons', // 加息券
  rateCouponList: 'Mobile2/MyCoupons/getRateCouponsList', // 加息券列表
  getMyEquityList: 'Mobile2/MyEquity/getMyEquityList', // 权益卡接口
  getMyEquity: 'Mobile2/MyEquity/getMyEquity', // 权益卡tab其他状态值获取
  getCouponsUsedRecord: '/Mobile2/MyCoupons/getCouponsUsedRecord', // 获取券使用记录
  getEquityUsedRecord: '/Mobile2/MyEquity/getEquityUsedRecord', // 获取权益卡使用记录
  getBonusUsedRecord: 'Mobile2/MyBonus/getBonusUsedRecord', // 红包使用记录
  getMyLcj: '/Mobile2/MyTyjBonus/getMyLcj', // 理财金金额
  getMyLcjList: '/Mobile2/MyTyjBonus/getMyLcjList', // 理财金列表
  getOneLcj: '/Mobile2/MyTyjBonus/getOneLcj', // 理财金详情数据
  getMyBonusList: 'Mobile2/MyTyjBonus/getMyBonusList', // 获取记录
  ReceiveLcj: 'Mobile2/MyTyjBonus/ReceiveLcj', // 提取
  getLcjUsedRecord: 'Mobile2/MyTyjBonus/getLcjUsedRecord', // 获取券使用记录
  buySuccessLcj: 'Mobile2/MyTyjBonus/buySuccessLcj'// 理财金出借成功
}

let fastcash = {
  FastCashListCount: 'Mobile2/FastCash/FastCashListCount', // 获取变现列表的数字统计
  FastCashList: 'Mobile2/FastCash/FastCashList', // 变现列表
  FastCashInfo: 'Mobile2/FastCash/addCashInfo',
  FastCashSetRate: 'Mobile2/FastCash/settingRate',
  FastCashAdd: 'Mobile2/FastCash/doAddCash',
  FastCashCancel: 'Mobile2/FastCash/complete'
}
// 鑫利宝
let xlb = {
  xlbIndex: 'Mobile2/XinLiBao/index', // 鑫利宝首页
  xlbWhiteUser: 'Mobile2/XinLiBao/isWhiteListUser', // 判断是否在白名单中
  xlbConfirmOpen: 'Mobile2/XinLiBao/confirmOpen', // 确认开通-第一步
  xlbImmediatelyOpen: 'Mobile2/XinLiBao/immediatelyOpen', // 确认开通-第二步
  xlbDoConfirmOpen: 'Mobile2/XinLiBao/doConfirmOpen', // 确认开通操作
  xlbDoConfirmClose: 'Mobile2/XinLiBao/doConfirmClose', // 确认解除操作
  xlbInfo: 'Mobile2/XinLiBao/myXinLiBaoInfo', // 我的鑫利宝基础信息页
  xlbList: 'Mobile2/XinLiBao/myXinLiBaoList', // 我的鑫利宝列表页
  xlbIntroduce: 'Mobile2/XinLiBao/productIntroduce', // 产品介绍页
  xlbPrjInfo: 'Mobile2/XinLiBao/prjInfo', // 项目详情页
  xlbApplication: 'Mobile2/XinLiBao/loanApplication', // 云贷通发送邮件
  xlbGrant: 'Mobile2/XinLiBao/XinLiBaoGrant', // 账户页，鑫利宝弹框同意 拒绝修改状态
  xlbProtocol: 'Mobile2/ProtocolNew/getProtocolTpl', // 鑫利宝产品服务账户开户及交易委托协议补充协议
  // 2.1
  wealDetail: 'Mobile2/XinLiBao/wealDetail', // 权益详情
  myWealData: 'Mobile2/XinLiBao/myWealData', // 我的鑫利宝
  receiveBonus: 'Mobile2/XinLiBao/receiveBonus' // 我的福利页 领取红包
}
// 存管
let deposit = {
  openSynAccountOne: 'Mobile2/User/openSynAccountOne',
  openSynAccountTwo: 'Mobile2/User/openSynAccountTwo',
  openSynAccountSubmit: 'Mobile2/User/openSynAccountSubmit', // 开户接口
  zsOpenSynSmsSend: 'Mobile2/User/zsOpenSynSmsSend', // 开户发送短信
  getZsBankAppList: 'Mobile2/PayAccount/getZsBankAppList', // 获取银行信息
  zscallbackReturn: 'Mobile2/PayAccount/zscallbackReturn', // 存管充值结果轮训
  zsSmsSend: 'Mobile2/PayAccount/zsSmsSend', // 存管充值短信
  zsCashOutSmsSend: 'Mobile2/PayAccount/zsCashOutSmsSend', // 存管提现短信
  zsRechargeResult: 'Mobile2/PayAccount/zsRechargeResult', // 充值结果
  getGuessYouLike: 'Mobile2/Invest/getGuessYouLike', // 充值结果页面获取连鑫积分数据
  zsNewRechargeSubmit: 'Mobile2/PayAccount/mSubmitNew', // 7.1.4加的充值充值接口
  assignUserCard: 'Mobile2/User/assignUserCard', // 存管开户第一部取数据
  zsOpenSynRansfer: 'Mobile2/User/zsOpenSynRansfer' // 转账展示数据
}
// 司马小鑫
let sima = {
  simaQuestion: 'Mobile2/Xjh/ajaxCommonQuestion', // 常见问题
  simaIntro: 'Mobile2/Xjh/ajaxProductIntroduction', // 产品介绍
  simaSafe: 'Mobile2/Xjh/safeProtect', // 安全保障
  simaServiceProtocol: 'Mobile2/Xjh/xServiceProtocol',
  biddingQuestions: 'Mobile2/Xjh/ajaxFinancingQuestion', // 自动投标常见问题
  biddingProtocolTpl: 'Mobile2/ProtocolNew/getProtocolTpl', // 自动投标协议
  biddingProtocol: 'Mobile2/ProtocolNew/getProtocol', // 自动投标协议(有订单id)
  getUserEntranceAuth: 'Mobile2/XprjAutoBid/getUserEntranceAuth', // 投标页面判断状态
  simaGetProtocolTpl: 'Mobile2/ProtocolNew/getProtocolTpl' // 节节高服务协议
}
// 会员体系
let vip = {
  vipIndex: 'Mobile2/Member/getMemberInfo', // 首页
  vipReceive: 'Mobile2/Member/receiveCashCoupon', // 领取提现券
  vipMarketReward: 'Mobile2/Member/receiveMarketReward', // 领取福袋
  vipCheckWelfare: 'Mobile2/Member/checkWelfare', // 是否有待领取福利
  vipHasBenefits: 'Mobile2/Member/hasBenefits', // 是否有待领取24提现券
  vipMettBanner: 'Mobile2/Member/getInvestMeet', // 出借人见面会banner
  vipReviewList: 'Mobile2/Member/getInvestMeetHistory', // 往期回顾
  vipBrowseRecord: 'Mobile2/ProjectBrowseRecord/addProjectBrowseRecord' // 专享项目角标修改
}
// 信息披露
let disclosure = {
  platIndex: 'Mobile2/Platform/index', // 平台数据
  platMore: 'api/more', // 文档列表
  platYears: '/api/reportYears', // 运营报告时间列表
  platDetails: 'api/details', // 文档详情
  platReport: 'api/report', // 财务审计报告
  platAdvantage: 'api/advantage', // 发展历程
  platHonor: 'api/honor', // 手机端的资质荣耀
  platLatestPromisePic: 'api/getLatestPromisePic', // 信披承诺接口
  product: 'api/product' // 信息披露 > 产品介绍
}
// 振鑫计划
let zhenxin = {
  getRemainMoney: 'Mobile2/ZhenXinJH/getRemainMoney', // 振鑫首页金额
  getDistributionPlanProgress: 'Mobile2/ZhenXinJH/getDistributionPlanProgress', // 缓释分配进度
  distributionCalculateExplain: 'Mobile2/ZhenXinJH/distributionCalculateExplain', // 缓释计算说明
  getUserInvestRecord: 'Mobile2/ZhenXinJH/getUserInvestRecord', // 交易明细
  isZhenXinUser: 'Mobile2/ZhenXinJH/isZhenXinUser', // 账号是否在振鑫计划中
  getIncomeList: 'Mobile2/ZhenXinJH/getIncomeList', // 资金记录
  getIncomeDetail: 'Mobile2/ZhenXinJH/getIncomeDetail', // 资金明细
  getZxjhAccount: 'Mobile2/ZhenXinJH/getZxjhAccount', // 振鑫计划账户余额
  getZxjhMode: 'Mobile2/ZhenXinJH/getZxjhMode', // 振鑫计划兑付方案模式
  startMovingZxjhAccount: 'Mobile2/ZhenXinJH/startMovingZxjhAccount', // 转入存管账户
  applyCashoutPlanB: '/Mobile2/PayAccount/applyCashoutPlanB', // 方案二请求提现接口
  getApplyCashoutPlanB: '/Mobile2/PayAccount/getApplyCashoutPlanB', // 方案二获取金额和银行卡信息
  getRecentNotice: 'Mobile2/ZhenXinJH/recentNotice', // 振鑫计划最新资讯
  getVoteEntrance: '/Mobile2/ZhenXinJH/showVoteEntrance' // 获取是否对该用户展示借款人委员会投票入口
}

let ApiMap = Object.assign(auth, wechat, track, xinPartner, invest, userData, stats, special, share, shake, recommend, pushMessage, publicAPI, payPassword, payAccount, password, fastcash, myReward, sima, xlb, deposit, vip, disclosure, lianxin, zhenxin)

export default ApiMap
