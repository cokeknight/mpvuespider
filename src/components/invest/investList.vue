<template>
  <div class="productList">
    <ul>
      <router-link
        v-for="(item, index) in lists"
        :key="item.id"
        v-track="{name: trackName + '_investDetails', pid:item.id}"
        v-zhuge="{name: '出借-列表页-点击项目详情', data: {'名称': item.prj_business_type_name, '是否新手项目': item.is_new == '1' ? '是' : '否', '项目类型': item.prj_business_type_name, '历史年化利率': +item.year_rate, '出借期限': +item.time_limit, '起投金额': 1000, '项目总金额': '', '募集进度': +item.schedule, '位置': index + 1 }}"
        tag="li"
        :to="{name: 'investDetails', params: {prj_id: item.id}}"
      >
        <div class="productList-head">
          <h2 class="productList-title">
            <div :class="'time_limit badge '+isOver(item)">
              {{ item.time_limit }}
              <small><span v-if="parseInt(item.time_limit_extend)">+{{ item.time_limit_extend }}</span>{{ item.time_limit_unit_view }}</small>
            </div>
            <div
              class="productList-prj-mess"
              :class="isOver(item)"
            >
              <span class="productList-type-name">{{ item.prj_business_type_name }}</span><br> <span class="productList-type-num">{{ item.prj_name }}</span>
            </div>
            <i
              v-if="item.prj_business_type == 'V'"
              :class="'redicon '+isOver(item)"
            >鑫产品</i> <em
              v-if="item.is_deposit == 1"
              :class="'badge '+isOver(item)"
            >银行存管</em> <em
              v-if="item.activity_id > 0"
              :class="'badge '+isOver(item)"
            >活动</em> <em
              v-if="item.is_xzd == 1"
              :class="'badge '+isOver(item)"
            >鑫整点</em> <em
              v-if="item.is_pre_sale == 1"
              :class="'badge '+isOver(item)"
            >预售</em> <i
              v-if="item.is_new == 1"
              :class="'badge '+isOver(item)"
            >新手专享</i>
          </h2>
          <div
            v-if="item.bid_status == 1 && item.start_bid_time_diff && !item.countDownFinish"
            class="productList-time"
          >
            <span class="julikaishi">距离开始</span>
            <count-down
              :item="{index: index}"
              class=" investlist"
              type="investList"
              :timestamp="parseInt(item.start_bid_time_diff)"
              @finish="contdownFinish"
            />
          </div>
        </div>
        <section class="productList-body">
          <article class="productList-main">
            <dl>
              <dt>历史年化利率</dt>
              <dd :class="isOver(item)">
                {{ item.rate_view || item.base_rate || item.year_rate }}
                <small>
                  <template v-if="item.reward_money_rate">+{{ item.reward_money_rate }}</template>
                  %
                </small>
              </dd>
            </dl>
          </article>
          <!-- 即将开标 -->
          <aside
            v-if="item.bid_status == 1 && !item.countDownFinish"
            class="productList-side jijiang"
          >
            <span class="btn">即将开标</span>
          </aside>
          <aside
            v-if="item.bid_status == 1 && item.countDownFinish"
            class="productList-side"
          >
            <p class="info">
              <span class="weak">剩余:</span>{{ item.demand_amount_view || item.remain_amount_view }}
            </p>
            <div class="wave">
              <div
                class="waveline"
                :style="'width: 100%'"
              />
              <!-- <wave-circle :show-font="false" :ratio='0'></wave-circle> -->
            </div>
          </aside>
          <!-- 开标中 且 有剩余额度 -->
          <aside
            v-if="item.bid_status == 2 && !item.countDownFinish"
            class="productList-side"
          >
            <p class="info">
              <span class="weak">剩余:</span><span class="remain_amount">{{ item.remaining_amount_view || item.remain_amount_view }}</span>
            </p>
            <div class="wave">
              <div
                v-if="item.schedule > 0"
                class="waveline"
                :style="'width: '+item.schedule+'%'"
              />
              <!-- <wave-circle :show-font="false" :ratio='item.schedule / 100'></wave-circle> -->
            </div>
          </aside>
          <aside
            v-if="item.bid_status == 2 && item.countDownFinish"
            class="productList-side"
          >
            <p class="info">
              出借结束
            </p>
            <div class="wave over" />
          </aside>
          <!-- 结束 -->
          <aside
            v-if="item.bid_status != 1 && item.bid_status != 2"
            class="productList-side"
          >
            <p class="info">
              已结束
            </p>
            <div class="wave over" />
          </aside>
        </section>
      </router-link>
    </ul>
  </div>
</template>

<script>
import CountDown from 'countdown';
import waveCircle from 'waveCircle';

export default {
  components: {
    CountDown,
    waveCircle
  },
  props: {
    lists: {
      type: Array,
      require: true
    },
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {};
  },
  methods: {
    isOver: function(item) {
      if (item.bid_status != 1 && item.bid_status != 2) {
        return 'over';
      } else if (item.bid_status == 2 && item.countDownFinish) {
        return 'over';
      } else {
        return '';
      }
    },
    contdownFinish: function(item) {
      var index = item.index;
      this.$set(this.lists[index], 'countDownFinish', true);
    }
  }
};
</script>
