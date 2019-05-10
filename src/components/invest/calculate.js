// import moment from 'moment'

/**
 ** 加法函数，用来得到精确的加法结果
 ** 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
 ** 调用：accAdd(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accAdd (arg1, arg2) {
  var r1, r2, m, c
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  c = Math.abs(r1 - r2)
  m = Math.pow(10, Math.max(r1, r2))
  if (c > 0) {
    var cm = Math.pow(10, c)
    if (r1 > r2) {
      arg1 = Number(arg1.toString().replace('.', ''))
      arg2 = Number(arg2.toString().replace('.', '')) * cm
    } else {
      arg1 = Number(arg1.toString().replace('.', '')) * cm
      arg2 = Number(arg2.toString().replace('.', ''))
    }
  } else {
    arg1 = Number(arg1.toString().replace('.', ''))
    arg2 = Number(arg2.toString().replace('.', ''))
  }
  return (arg1 + arg2) / m
}

/**
 ** 减法函数，用来得到精确的减法结果
 ** 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
 ** 调用：accSub(arg1,arg2)
 ** 返回值：arg1加上arg2的精确结果
 **/
function accSub (arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2)) // last modify by deeka //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}
function isInteger (obj) {
  return obj % 1 === 0
}

export default {
  formatFloat: (numA, numB, numC) => {
    return parseFloat((numA + numB + numC).toFixed(2))
  },
  getZhengshu: (number) => {
    // 是整数时候 直接返回
    if (isInteger(+number)) return number
    number = number + ''
    return parseFloat(number.substring(0, number.lastIndexOf('.') + 3))
  },
  PMT: function (rate, nper, pv, fv, type) {
    if (!fv) fv = 0
    if (!type) type = 0
    if (rate == 0) return -(pv + fv) / nper
    var pvif = Math.pow(1 + rate, nper)
    var pmt = rate / (pvif - 1) * -(pv * pvif + fv)
    if (type == 1) {
      pmt /= (1 + rate)
    }
    return pmt
  },
  // 普通项目获得收益
  getIncomeNormal ({ mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney, is_have_biding_incoming }) {
    if (sourceMoney !== undefined) money = sourceMoney
    ykdays = parseInt(ykdays)
    mjdays = parseInt(mjdays)
    let yincome = this.getZhengshu(ykdays * year_rate * money / 365 / 1000)
    let extra = total_year_rate - year_rate
    let extraIncode = 0 // 额外利率的计算
    if (extra) {
      extraIncode = this.getZhengshu(ykdays * extra * money / 365 / 1000)
    }
    let income
    if (is_have_biding_incoming) { // 是否计算募集期收益
      let mincome = this.getZhengshu(mjdays * year_rate * money / 365 / 1000)
      income = this.formatFloat(mincome, yincome, extraIncode)
    } else {
      income = this.formatFloat(0, yincome, extraIncode)
    }
    income = income.toFixed(2)
    return income
  },
  // 积分计算不包括募集期
  getJifen ({ mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney }) {
    if (sourceMoney !== undefined) money = sourceMoney
    return Math.round(money * ykdays / 1000) + ''
  },
  // 鑫鑫三号
  getIncomeXX ({ mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney, time_limit, qixi_day, first_repay_days, last_repay_days }) {
    console.log(mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney, time_limit, qixi_day, first_repay_days, last_repay_days)
    if (sourceMoney !== undefined) money = sourceMoney
    // ykdays = parseInt(ykdays)
    // mjdays = parseInt(mjdays)
    time_limit = parseInt(time_limit)
    // let payDay = moment(qixi_day) //放款日期
    // let firstPayDay = moment(qixi_day).add(1, 'months').set('date', 20)//首个还款日
    let juliNext = first_repay_days // firstPayDay.diff(payDay, 'days')
    let monthRate = year_rate / 12 / 1000
    // if (time_limit != 36) {
    //   monthRate = year_rate / time_limit / 1000
    // }
    // console.log('首个还款日', qixi_day, firstPayDay.format('YYYY MM DD'))
    let normalPayMoney = this.getZhengshu(-this.PMT(monthRate, time_limit, money)) // this.getZhengshu(标准应还金额
    // console.log('标准应还金额', monthRate, time_limit, money, normalPayMoney)
    let benjinFirstMonth = accSub(normalPayMoney, this.getZhengshu(money * monthRate))// 首月应还本金
    // let lastPayDate = moment(qixi_day).add(time_limit, 'months') //最后一个还款日
    // let lastBaseOnPayDay = moment(firstPayDay).add(time_limit - 2, 'months')
    let lastDiff = last_repay_days // moment(lastPayDate).diff(lastBaseOnPayDay, 'days')//最后一期期限差
    console.log('最后一期期限差', lastDiff)
    // console.log('首月应还本金', this.getZhengshu(money * monthRate), benjinFirstMonth)
    // console.log('首个还款日', firstPayDay.format('YYYY MM DD'))
    console.log('每月应还金额', normalPayMoney)
    let incomeList = []
    // if (time_limit === 36) { //计算36期收益
    const firstIcome = () => { // 首页计算
      let income = this.getZhengshu(money * monthRate)
      let yingshouBenjin = benjinFirstMonth
      let remainAmount = money - yingshouBenjin// 剩余本金
      incomeList.push({
        income: income,
        yingshouBenjin: yingshouBenjin,
        remainAmount: remainAmount
      })
      console.log('首期', income, yingshouBenjin, remainAmount)
    }
    const middleIncome = () => {
      for (let i = 2; i <= (time_limit - 1); i++) {
        let remainAmountBefore = incomeList[i - 2]['remainAmount']
        let income_every_period = this.getZhengshu(remainAmountBefore * monthRate)
        let yingshouBenjin_every_period = accSub(normalPayMoney, income_every_period)
        let remain_amount_every_period = accSub(remainAmountBefore, yingshouBenjin_every_period)
        incomeList.push({ income: income_every_period,
          remainAmount: remain_amount_every_period,
          yingshouBenjin: yingshouBenjin_every_period })
        console.log('第' + i + '期', income_every_period, yingshouBenjin_every_period, remain_amount_every_period)
      }
    }
    const lastIcome = () => { // 末期计算
      let remainAmountBefore = incomeList[incomeList.length - 1]['remainAmount']
      let income = accSub(normalPayMoney, remainAmountBefore)
      let yingshouBenjin = remainAmountBefore
      let remainAmount = 0// 剩余本金
      incomeList.push({
        income: income,
        yingshouBenjin: yingshouBenjin,
        remainAmount: remainAmount
      })
      console.log('末期', income, yingshouBenjin, remainAmount)
    }

    firstIcome()
    middleIncome()
    lastIcome()

    let allIncome = incomeList.reduce((accumulator, currentValue) => {
      let newV = accumulator.income != undefined ? accumulator.income : accumulator
      return accAdd(newV, currentValue.income)
    })
    console.log('总收益', incomeList, allIncome)
    return allIncome + ''
  },
  // 等额本息
  getIncome ({ mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney, time_limit, qixi_day, first_repay_days, last_repay_days }) {
    console.log(mjdays, ykdays, total_year_rate, year_rate, money, sourceMoney, time_limit, qixi_day, first_repay_days, last_repay_days)
    if (sourceMoney !== undefined) money = sourceMoney
    // ykdays = parseInt(ykdays)
    // mjdays = parseInt(mjdays)
    time_limit = parseInt(time_limit)
    // let payDay = moment(qixi_day) //放款日期
    // let firstPayDay = moment(qixi_day).add(1, 'months').set('date', 20)//首个还款日
    let juliNext = first_repay_days // firstPayDay.diff(payDay, 'days')
    let monthRate = year_rate / 12 / 1000
    // if (time_limit != 36) {
    //   monthRate = year_rate / time_limit / 1000
    // }
    // console.log('首个还款日', qixi_day, firstPayDay.format('YYYY MM DD'))
    let normalPayMoney = this.getZhengshu(-this.PMT(monthRate, time_limit, money)) // this.getZhengshu(标准应还金额
    // console.log('标准应还金额', monthRate, time_limit, money, normalPayMoney)
    let benjinFirstMonth = accSub(normalPayMoney, this.getZhengshu(money * monthRate))// 首月应还本金
    // let lastPayDate = moment(qixi_day).add(time_limit, 'months') //最后一个还款日
    // let lastBaseOnPayDay = moment(firstPayDay).add(time_limit - 2, 'months')
    let lastDiff = last_repay_days // moment(lastPayDate).diff(lastBaseOnPayDay, 'days')//最后一期期限差
    console.log('最后一期期限差', lastDiff)
    // console.log('首月应还本金', this.getZhengshu(money * monthRate), benjinFirstMonth)
    // console.log('首个还款日', firstPayDay.format('YYYY MM DD'))
    console.log('距离下个还款日天数', juliNext)
    let incomeList = []
    // if (time_limit === 36) { //计算36期收益
    const firstIcome = () => { // 首页计算
      let income = this.getZhengshu(money * juliNext * year_rate / 365 / 1000)
      let yingshouBenjin = benjinFirstMonth
      let remainAmount = money - yingshouBenjin// 剩余本金
      incomeList.push({
        income: income,
        yingshouBenjin: yingshouBenjin,
        remainAmount: remainAmount
      })
      console.log('首期', income, yingshouBenjin, remainAmount)
    }
    const middleIncome = () => {
      for (let i = 2; i <= (time_limit - 1); i++) {
        let remainAmountBefore = incomeList[i - 2]['remainAmount']
        let income_every_period = this.getZhengshu(remainAmountBefore * monthRate)
        let yingshouBenjin_every_period = accSub(normalPayMoney, income_every_period)
        let remain_amount_every_period = accSub(remainAmountBefore, yingshouBenjin_every_period)
        incomeList.push({ income: income_every_period,
          remainAmount: remain_amount_every_period,
          yingshouBenjin: yingshouBenjin_every_period })
        console.log('第' + i + '期', income_every_period, yingshouBenjin_every_period, remain_amount_every_period)
      }
    }
    const lastIcome = () => { // 末期计算
      let remainAmountBefore = incomeList[incomeList.length - 1]['remainAmount']
      let income = this.getZhengshu(lastDiff * remainAmountBefore * year_rate / 365 / 1000)
      let yingshouBenjin = remainAmountBefore
      let remainAmount = 0// 剩余本金
      incomeList.push({
        income: income,
        yingshouBenjin: yingshouBenjin,
        remainAmount: remainAmount
      })
      console.log('末期', income, yingshouBenjin, remainAmount)
    }
    firstIcome()
    middleIncome()
    lastIcome()
    let allIncome = incomeList.reduce((accumulator, currentValue) => {
      let newV = accumulator.income != undefined ? accumulator.income : accumulator
      return accAdd(newV, currentValue.income)
    })
    console.log('总收益', incomeList, allIncome)
    return allIncome + ''
    // }
  },
  // 每月收入本金+利息 计算收益
  getPMT ($mpr, $np, $pv, $fv) { // 月利率;期数;出借本金;0
    if (!$fv) $fv = 0
    var $mypmt = ($mpr * (-$fv + Math.pow((1 + $mpr), $np) * $pv)) / (-1 + Math.pow((1 + $mpr), $np))
    return $mypmt
  },
  getEqualAmount ($mpr, $np, $pv) {
    var monthMoney = this.getPMT($mpr, $np, $pv, 0)
    // 每月收益*期数-本金=利息
    return monthMoney * $np - $pv
  }
}
