import transferService from 'transferService'
let btnData

export default {
  methods: {
    // 处理出借按钮和详情页 pdetail请求共有的逻辑
    parseInvestBtnData (d) {
      btnData = {
        isSDT: d.prj_type == 'H',
        // 待开标  且  不是预售标
        isStartWarn: d.bid_status == 1 && d.is_pre_sale != 1,
        // 预售出借 待开标 可预售标  没结束
        isPresell: d.bid_status == 1 && d.is_pre_sale == 1 && d.rest_remaind_amount,
        // 是否够出借
        is_balance_less: d.is_balance_less,
        is_pre_sale: d.is_pre_sale,
        collectTime: Math.min(d.fundraise_day_num, d.fundraise_day_left_num),
        qixi_day: d.qixi_day,
        first_repay_days: d.first_repay_days,
        last_repay_days: d.last_repay_days,
        is_new: d.is_new ? parseInt(d.is_new) : 0,
        is_newbie: d.is_newbie ? parseInt(d.is_newbie) : 0,
        is_jjs: d.is_jjs ? parseInt(d.is_jjs) : 0,
        prj_type_display: d.prj_type_display,
        prj_name: d.prj_name,
        base_rate: d.base_rate,
        rate: d.rate,
        prj_business_type_name: d.prj_business_type_name,
        reward_money_rate: parseFloat(d.reward_money_rate) ? d.reward_money_rate : undefined,
        time_limit: d.time_limit,
        time_limit_unit: d.time_limit_unit,
        year_rate: d.year_rate,
        is_biding: d.bid_status == 2,
        bid_status: d.bid_status,
        prj_id: d.prj_id,
        protocol_name: d.protocol_name,
        is_trusteeship: d.is_trusteeship,
        protocol_id: d.protocol_id,
        repay_time: d.repay_time,
        riskStatus: d.risk_assess ? d.risk_assess.alertType : '',
        isCompel: d.risk_assess ? d.risk_assess.assess_switch_compel : '',
        proCompel: d.risk_assess ? d.risk_assess.risk_protocol_compel : '',
        is_have_biding_incoming: d.is_have_biding_incoming,
        is_deposit: d.is_deposit,
        zs_close_invest_code: d.zs_close_invest_code,
        is_early_repay: parseInt(d.is_early_repay),
        projectRating: d.projectRating,
        demand_amount: d.demand_amount,
        schedule: d.schedule,
        repay_way_code: d.repay_way_code
      }
      transferService.set('investBtn', btnData)
      return btnData
    },
    saveInvestBtn (props) {
      Object.assign(btnData, props)
      transferService.set('investBtn', btnData)
    },
    calculateReward: function (recommand_reward) {
      let rewardTypeMap = {
        0: {
          k: 'no_use',
          v: '未使用奖励'
        },
        1: {
          k: 'hongbao',
          v: '红包'
        },
        2: {
          k: 'manian',
          v: '满减券'
        },
        3: {
          k: 'jiaxi',
          v: '加息券'
        }
      }
      let award = ''
      if (recommand_reward.amount) {
        let recomTicketDisplay = recommand_reward.reward_type == 3 ? recommand_reward.reward_name : recommand_reward.amount + '元'
        let bagType = recommand_reward.reward_type
        award = '已使用' + recomTicketDisplay + rewardTypeMap[bagType].v
      } else if (recommand_reward.multiple) {
        award = '已使用' + recommand_reward.multiple + '倍积分翻倍卡'
      }
      return award
    }
  }
}
