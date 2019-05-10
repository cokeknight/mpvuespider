<style lang="less">
  .header-wrap {
    display: flex;
    align-items: center;

    .header-l {
      width: 40px;
      height: 40px;
      border-radius: 50%;

    }

    .header-m {
      margin-left: 10px;
      flex: 1;

      .headTitle {
        font-size: 14px;
        color: #0B2928;

        .headSpan {
          font-size: 10px;
          color: #FFFFFF;
          background: #3BD1CA;
          border-radius: 8px;
          margin-left: 5px;
          padding: 2px 5px;
        }
      }

      .headTime {
        font-size: 10px;
        color: #000000;
      }
    }

    .header-r {
      .head-btn {
        background: #3BD1CA;
        border-radius: 24px;
        border: 1px solid #3BD1CA;
        font-size: 12px;
        color: #fff;
        padding: 2px 5px;
        min-width: 50px;
      }
    }
  }
</style>
<template>
  <div class="header-wrap">
    <img
      class="header-l"
      :src="url"
    >
    <div class="header-m">
      <h4 class="headTitle">
        {{ headTitle }} <span v-if="titleTips" class="headSpan">{{ titleTipsName }}</span>
      </h4>
      <p class="headTime">
        {{ time }}
      </p>
    </div>
    <div v-if="stick" class="header-r">
      <button class="head-btn" @click="clickEvent">
        关注
      </button>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    url: String,
    headTitle: String,
    time: String,
    stick: [String, Boolean],
    titleTips: [String, Boolean],
    titleTipsName: String
  },
  methods: {
    clickEvent() {
      this.$emit('on-click');
    }
  }
};
</script>
