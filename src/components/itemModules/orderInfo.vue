<template>
  <div class="orderInfo">
    {{ orderTitle }}
    <p class="orderInfo-nm">
      {{ info }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'OrderInfo',
  props: {
    orderTitle: String,
    info: [String, Number]
  }
};
</script>

<style lang="less">
  .orderInfo {
    border-bottom: 1px solid #EAEAEA;
    height: 20px;
    font-size: 14px;
    line-height: 20px;
    padding-top: 17px;
    padding-bottom: 13px;

    .orderInfo-no {
      float: left;
      color: #333333;
    }

    .orderInfo-nm {
      float: right;
      color: #979797;
    }
  }


</style>
