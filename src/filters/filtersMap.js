// vue过滤器只直接 {{}}
// 所以别的情况下就用这个
var map = {}
// const PRJ_TYPE_A = 'A'; // 日益升
// const PRJ_TYPE_B = 'B'; // 年益升
// const PRJ_TYPE_E = 'E'; // 快益转
// const PRJ_TYPE_F = 'F'; // 月益升
// const PRJ_TYPE_G = 'G'; // 鑫湖一号
// const PRJ_TYPE_H = 'H'; // 速兑通
// const PRJ_TYPE_I = 'I'; // 鑫银票
// const PRJ_TYPE_J = 'J'; // 债权转让
map.prjColorType = function (type) {
  return {
    A: 'blue',
    F: 'orange',
    H: 'purple'
  }[type]
}

// '0,00' == > -- /flag
// '' == > -- /flag
map.noValToFlag = function (val, flag) {
  if (!val || parseFloat(val) == 0) {
    val = ''
  }
  return val || (flag || '--')
}

// 把字符串转化为数字
map.boolean = function (val) {
  return parseInt(val || '')
}

// 格式化金额  1000 => 1,000
map.formatMoney = function (val) {
  if (!val) return
  return val.toString().replace(/(\d)(?=(\d{3})+($|\.))/g, '$1,')
}

// 100,299 => 100299
map.moneyToNumber = function (val) {
  return parseFloat(val.replace(',', ''))
}
// 格式化金额  1000 => 1,000
// 充值状态
let rechargeStatus = {
  1: '处理中',
  2: '成功',
  3: '失败'
}
map.rechargeStatus = function (val) {
  return rechargeStatus[val] || ''
}

// 是否空字符串
map.empty = function (val) {
  return !val ? 0 : val
}

// 去掉url上的协议
map.removeIP = function (url) {
  url = url || ''
  return url.replace(/^http(s)?:/, '')
}
map.parseInt = function (strNumber) {
  return parseInt(strNumber, 10)
}
export default map
