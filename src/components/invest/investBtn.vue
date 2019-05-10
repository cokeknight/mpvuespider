<template>
  <div class="investBtnWrap">
    <div
      v-if="isShow"
      class="investBtn"
      :class="{gray: btnIsGray}"
      @click="goInvest()"
    >
      <span
        v-if="isCalc"
        v-track="{name: trackName+'goCalc'}"
        class="investBtn-handle"
        @click.stop="goCalc"
      >
        <icon
          href="calculatorBtn"
          class="icon-goback"
          size="48"
        />
      </span>
      <h4
        v-zhuge="btnFont.zhuge"
        class="investBtn-text"
      >
        {{ btnFont.btn }}
      </h4>
    </div>
    <sheet
      ref="investSheet"
      v-model="isShowPop"
      title="输入金额"
      icon-type="close"
      :track-name="trackName"
    >
      <div>
        <div
          class="details-box popup-bottom"
          style="position:relative;-webkit-transform:none"
        >
          <section class="set-items wipe-pt wap-base">
            <list>
              <list-item side-class="black">
                <template slot="label">
                  {{ getBalanceText(item.is_deposit) }}
                </template>
                <template slot="side">
                  {{ item.amount | formatMoney }}
                </template>
              </list-item>
              <list-item side-class="black">
                <template slot="label">
                  模拟测算收益（元）
                </template>
                <template slot="side">
                  {{ item.income | formatMoney }}
                </template>
              </list-item>
              <list-item side-class="black">
                <template slot="label">
                  可获得积分
                </template>
                <template
                  v-if="item.multiple_credit && isBest"
                  slot="side"
                >
                  <span style="text-decoration:line-through">{{ item.jifen | formatMoney }}</span> <span style="color: #ff9b00;">{{ item.multiple_credit }}</span>
                </template>
                <template
                  v-else
                  slot="side"
                >
                  {{ item.jifen | formatMoney }}
                </template>
              </list-item>
              <list-item
                v-if="item.award && isBest"
                class="award"
              >
                <p>{{ item.award }}</p>
              </list-item>
              <list-item
                v-if="item.rewardInfo && item.rewardInfo.tips && item.rewardInfo.recommand_reward"
                class="award"
              >
                <p>{item.rewardInfo.recommand_reward.tips}</p>
              </list-item>
            </list>
            <simula-keyboard
              ref="simulaKeyboard"
              :value="form.money"
              :opts="opts"
              @hide="hide($event)"
              @best="best"
              @done="goInvestDeepDetails()"
              @input="handle"
            />
          </section>
        </div>
      </div>
    </sheet>
  </div>
</template>

<script>
import transfer from 'transferService';
import formService from 'formService';
import userService from 'userService';
import urlService from 'urlService';
import sheet from 'actionsheet';
import Conf from 'config';
import inputM from 'inputM';
import myInvestMixin from 'myInvestMixin';
import simulaKeyboard from './simulaKeyboard';
import calculate from './calculate';
import Api from 'api';
import { addTrackNormal } from 'track';
import { zhuge } from 'zhuge';

export default {
  components: {
    sheet,
    inputM,
    simulaKeyboard
  },
  mixins: [
    myInvestMixin
  ],
  props: {
    isCalc: {
      type: Boolean,
      default: true
    },
    reset: {
      type: Boolean,
      default: false
    },
    trackName: String, // 默认
    trackNameInvest: String, // 出借
    trackNameLogin: String, // 登录
    trackNameRecharge: String, // 充值
    trackNameOpen: String, // 存管
    investData: Object
  },
  data() {
    return {
      open_all_cg: Conf.open_all_cg,
      isLogin: Conf.isLogin,
      isShowPop: false,
      isShow: true, // 跳到计算器页用不用保存到localstorage
      opts: {},
      form: {
        money: ''
      },
      item: {
        amount: 0,
        income: '0.00',
        jifen: '0',
        award: ''
      },
      bestInvestItem: {},
      userInfo: userService.user,
      moneyHandle: 0
    };
  },
  computed: {
    btnIsGray: function() {
      var state = false;
      if (this.needReisterDeposit) {
        state = false;
      }
      // 待开标且已登录是灰色
      if ((this.opts.isStartWarn || this.opts.isPresell) && this.isLogin) state = true;
      if (this.opts.is_new && !this.opts.is_newbie) state = true;
      // 已结束置灰 除非未登录
      if (this.opts.bid_status != 1 && this.opts.bid_status != 2 && this.isLogin) state = true;
      // 全面存管，提示开通存管
      if (Conf.show_cg_tip) state = false;
      // 开通全存管 且 不是存管标要变灰
      if (Conf.open_all_cg && !this.opts.is_deposit) state = true;
      // 不能出借
      return state;
    },
    btnFont: function() {
      var ref = {
        btn: '立即出借',
        zhuge: {
          name: '出借-详情页-点击立即出借',
          data: {
            '名称': this.opts.prj_business_type_name + this.opts.prj_name,
            '是否新手项目': this.opts.is_new == '1' ? '是' : '否',
            '项目类型': this.opts.prj_business_type_name,
            '历史年化利率': +this.opts.year_rate,
            '出借期限': +this.opts.time_limit,
            '起投金额': 1000,
            '项目总金额': +this.opts.demand_amount,
            '募集进度': +this.opts.schedule
          }
        }
      };
      if (parseInt(this.opts.is_balance_less)) {
        // ref = '立即充值'
        ref = { btn: '立即充值', zhuge: { name: '充值-项目详情页-点击立即充值', data: { '项目类型': this.opts.prj_business_type_name } } };
      }
      if (this.needReisterDeposit) {
        // ref = '立即开通浙商银行存管账户'
        ref = { btn: '立即开通浙商银行存管账户', zhuge: { name: '开户-项目详情页-点击开通银行存管', data: { '项目类型': this.opts.prj_business_type_name } } };
      }
      if (this.opts.isStartWarn) {
        // ref = '即将开标'
        ref = { btn: '即将开标', zhuge: {} };
      }
      if (this.opts.isPresell) {
        // ref = '预售出借'
        ref = { btn: '预售出借', zhuge: {} };
      }
      if (this.opts.is_new && !this.opts.is_newbie) { // 新客标针对老客显示新客专享
        // ref = '新客专享'
        ref = { btn: '新客专享', zhuge: {} };
      }
      // 已结束项目
      if (this.opts.bid_status != 1 && this.opts.bid_status != 2) {
        // ref = '立即出借'
        ref = { btn: '立即出借', zhuge: {} };
      }
      if (!this.isLogin) {
        ref = { btn: '立即登录', zhuge: { name: '登录-项目详情页-点击登录', data: { '项目类型': this.opts.prj_business_type_name } } };
      }
      // 全面存管，提示开通存管
      if (Conf.show_cg_tip) {
        // ref = '立即开通浙商银行存管账户'
        ref = { btn: '立即开通浙商银行存管账户', zhuge: { name: '开户-项目详情页-点击开通银行存管', data: { '项目类型': this.opts.prj_business_type_name } } };
      }
      // 开通全存管 且 不是存管标要显示立即出借
      if (Conf.open_all_cg && !this.opts.is_deposit) {
        // ref = '立即出借'
        ref = { btn: '立即出借', zhuge: {} };
      }
      return ref;
    },
    // 需要注册存管
    needReisterDeposit: function() {
      return this.userInfo.is_zs == 0 && this.opts.is_deposit == 1;
    }
  },
  watch: {
    reset: function(v) {
      if (v) {
        this.render();
      }
    },
    // 模拟键盘对外输出的value
    'form.money': function(value) {
      this.reCalculate(value); // 计算对应的收益 积分
    }
  },
  created: function() {
    this.isSetPayPwd = userService.getAttr('is_paypwd_mobile_set') == 1;
    this.render();
  },
  methods: {
    getBalanceText: function(is_deposit) {
      let text = '';
      if (this.open_all_cg) {
        text = '账户可用余额（元）';
      } else {
        text = is_deposit ? '存管账户余额（元）' : '普通账户余额（元）';
      }
      return text;
    },
    render: function() {
      var prj_id = this.$route.params.prj_id;
      var localData = transfer.get('investBtn');
      if (localData && localData.prj_id == prj_id) {
        this.opts = localData;
        this.isShow = true;
        this.$emit('done');
      } else {
        Api.pdetail.call(this, {
          data: this.$route.params,
          resolve: function(d) {
            if (d.boolen) {
              d = d.data;
              if (d.redirect && parseInt(d.redirect) === 1) {
                this.$router.replace({
                  name: 'invest'
                });
                return;
              }
              this.opts = this.parseInvestBtnData(d);
              this.isShow = true;
              this.$emit('done');
            }
          }
        });
      }
    },
    // 回显的操作 应该需要把源数据原封不动的保存 再进行赋值
    recover() {
      let data = transfer.get('pbuyCheck');
      this.isShowPop = true;
      this.$nextTick(() => {
        this.bestInvestItem = data;
        this.form.money = data.inputMoney;
        this.reCalculate(this.form.money);
        this.setDisplayAmount();
        this.item.award = data.award;
      });
    },
    // 调用计算器
    goCalc: function(e) {
      transfer.remove('investMoney');
      this.$router.push({ name: 'investCalculator', parmas: { prj_id: this.opts.prj_id } });
    },
    goInvestPop: function() {
      this.isBest = false;
      Api.getMaxInvestMoney.call(this, {
        data: this.$route.params,
        resolve: function(d) {
          if (d.boolen) {
            this.bestInvestItem = d.data;
            this.item.is_deposit = this.bestInvestItem.is_deposit = parseInt(this.bestInvestItem.is_deposit, 10);
            this.setDisplayAmount();
            this.form.money = '';
            this.isShowPop = true;
          }
        }
      });
    },
    // 进入出借页面
    goInvest: function() {
      this.$emit('investCli');
      // let isAlert = (this.opts.riskStatus == 2 && this.opts.isCompel) || (this.opts.riskStatus == 1 && this.opts.proCompel)
      // 不可点的就什么也不作
      // if (this.btnIsGray || isAlert) return
      if (this.btnIsGray) return;
      // 全面存管，提示开通存管
      if (Conf.show_cg_tip) {
        addTrackNormal(this.trackNameOpen);
        this.$router.push({
          name: 'depositoryRegister'
        });
        return;
      }
      // 登录的时候 为解决数据不一致的需要 删除investBtn的数据
      if (!this.isLogin) {
        transfer.remove('investBtn');
        addTrackNormal(this.trackNameLogin);
        urlService.goLogin();
        return;
      }
      // 存管标，但是本帐户未开通存管帐户
      if (this.needReisterDeposit) {
        let isCanOpen = this.userInfo.if_white_name;
        addTrackNormal(this.trackNameOpen);
        this.$router.push({
          name: isCanOpen ? 'depositoryRegister' : 'depository'
        });
        return;
      }
      if (!this.checkPayPwd()) {
        addTrackNormal(this.trackNameInvest);
        return;
      }
      if (this.opts.is_balance_less == 1) {
        // 存管标 || 已绑卡
        let isGoRecharge = this.opts.is_deposit == 1 || this.userInfo.is_binding_bank;
        var indexTab = parseInt(this.opts.is_deposit);
        addTrackNormal(this.trackNameRecharge);
        // 去绑卡
        if (!isGoRecharge) {
          this.$router.push({
            name: 'addBank',
            query: { fromRecharge: 1 }
          });
        } else {
          // 去充值
          this.$router.push({
            name: 'newRecharge',
            query: { index: indexTab, isBack: 1 }
          });
        }
        return;
      }
      addTrackNormal(this.trackNameInvest);
      // 清空详情页数据
      formService.clearForm('investForm');
      // 跳到出借页
      this.goInvestPop();
    },
    alertErrorTip: function(msgArray, btnText) {
      let msg = '';
      msgArray.forEach(v => {
        msg = msg + v + '<br/>';
      });
      this.$Alert({
        msg: msg,
        text: btnText
      });
    },
    confirmErrorTip: function(msgArray) {
      let msg = '';
      msgArray.forEach(v => {
        msg = msg + v + '<br/>';
      });
      this.$Confirm({
        msg: msg,
        confirmText: '重新评估',
        cancelText: '取消',
        onConfirm: function() {
          this.$router.push({ name: 'riskSurvey' });
        },
        onCancel: function() {
        }
      });
    },
    checkRiskPop(data) {
      if (data.risk_evaluation_pop == 1) {
        let buttonType = data.risk_evaluation_button_type;
        if (buttonType == 1) {
          this.confirmErrorTip(data.risk_evaluation_message);
        } else if (buttonType == 2) {
          this.alertErrorTip(data.risk_evaluation_message, '确认');
        } else if (buttonType == 3) {
          this.alertErrorTip(data.risk_evaluation_message, '取消');
        }
        return false;
      }
      return true;
    },
    pbuyCheck(callback) {
      let localData = transfer.get('investBtn');
      let is_pre_sale = localData.is_pre_sale;
      let investForm = {};
      Api.pbuyCheck.call(this, {
        resolve: function(d) {
          if (d.boolen) {
            // 验证风险评估
            let isPassRisk = this.checkRiskPop(d.data);
            if (!isPassRisk) return;
            let output = Object.assign({}, this.bestInvestItem, d.data);
            output.inputMoney = this.form.money;
            output.jifen = this.item.jifen;
            output.award = this.item.award;
            if (d.data.reward_info) output.multiple_credit = d.data.reward_info.multiple_credit;
            transfer.set('pbuyCheck', output);
            callback();
          }
        },
        data: {
          prjid: this.opts.prj_id,
          money: this.form.money,
          is_pre_buy: is_pre_sale == 1
        }
      });
    },
    // 进入出借确认页面
    goInvestDeepDetails() {
      addTrackNormal('pageInvestment_btnImmediateInvestment');
      this.pbuyCheck(() => {
        this.$router.push({
          name: 'deepDetails',
          params: { prj_id: this.opts.prj_id }
        });
      });
    },
    clean(tag) {
      Object.assign(this[tag], this.$options.data()[tag]);
    },
    /* 最优方案 */
    best: function() {
      addTrackNormal('pageInvestment_best');
      this.item.award = this.calculateReward(this.bestInvestItem.rewardInfo.recommand_reward);
      this.item.multiple_credit = this.bestInvestItem.rewardInfo.recommand_reward.multiple_credit;
      this.form.money = this.bestInvestItem.money;
      this.isBest = true;
      this.setDisplayAmount();
    },
    setDisplayAmount() {
      if (this.item.is_deposit) {
        this.item.amount = this.bestInvestItem.deposit_amount;
      } else {
        this.item.amount = this.bestInvestItem.top_amount_view;
      }
    },
    // 金额 天数  利率
    reCalculate(sourceMoney) {
      let investBtn = transfer.get('investBtn');
      let income;
      if (this.opts.repay_way_code === 'permonth') {
        let newParam = Object.assign({
          sourceMoney: sourceMoney,
          time_limit: investBtn.time_limit,
          first_repay_days: investBtn.first_repay_days,
          last_repay_days: investBtn.last_repay_days,
          qixi_day: investBtn.qixi_day
        }, this.bestInvestItem);
        income = calculate.getIncomeXX(newParam);
        let jifen = calculate.getJifen(Object.assign({ sourceMoney }, this.bestInvestItem));
        this.$set(this.item, 'jifen', jifen);
      } else if (this.bestInvestItem.isPermonth == 0) { // 不是等额本息
        income = calculate.getIncomeNormal(Object.assign({ sourceMoney: sourceMoney, is_have_biding_incoming: investBtn.is_have_biding_incoming }, this.bestInvestItem));
        let jifen = calculate.getJifen(Object.assign({ sourceMoney }, this.bestInvestItem));
        this.$set(this.item, 'jifen', jifen);
      } else {
        let newParam = Object.assign({
          sourceMoney: sourceMoney,
          time_limit: investBtn.time_limit,
          first_repay_days: investBtn.first_repay_days,
          last_repay_days: investBtn.last_repay_days,
          qixi_day: investBtn.qixi_day
        }, this.bestInvestItem);
        income = calculate.getIncome(newParam);
        let jifen = calculate.getJifen(Object.assign({ sourceMoney }, this.bestInvestItem));
        this.$set(this.item, 'jifen', jifen);
      }
      let yieldAmount = this.bestInvestItem.rewardInfo.recommand_reward.yield;
      if (this.isBest && yieldAmount) {
        this.$set(this.item, 'income', this.bestInvestItem.rewardInfo.recommand_reward.yield);
      } else {
        this.$set(this.item, 'income', income);
      }
    },
    hide() {
      this.$refs.investSheet.close();
    },
    handle(val) {
      this.isBest = false;
      this.form.money = val;
      this.item.award = '';
      addTrackNormal('pageInvestment_textInputMoney');
      if (!this.moneyHandle) {
        this.moneyHandle = 1;
        zhuge.setTrack('出借-输入金额-输入金额', { '项目类型': this.opts.prj_business_type_name });
      }
    },
    // 检查有没有设置支付密码
    checkPayPwd: function() {
      if (!this.isSetPayPwd) {
        this.$Alert({
          msg: '<p class="font16">6位手机支付密码是您在出借<br />或提现时必须要输入的</p>',
          text: '马上设置',
          onConfirm: function() {
            this.$router.push({ name: 'setpaypwd', query: { from: this.item.prj_id } });
          }
        });
      }
      return this.isSetPayPwd;
    }
  }
};
</script>
