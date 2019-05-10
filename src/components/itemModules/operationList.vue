<style lang="less">
  .operationList {
    display: block;

    .operationList-top {
      margin-top: 10px;

      .operationList-title {
        font-size: 16px;
        color: #0B2928;
      }

      .operationList-img {
        width: 100%;
      }
    }

    .operationList-footer {
      .operationList-footer-main {
        display: flex;
        height: 30px;

        .operationList-footer-r, .operationList-footer-l {
          display: flex;
          align-items: center;

          .operationList-svg {
            margin-right: 5px;
          }
        }

        .operationList-footer-l {
          flex: 1;
        }

        .operationList-footer-r {
          padding-left: 20px;
        }
      }
    }
  }

</style>
<template>
  <div class="operationList" @click="gotoPostDetails">
    <div class="operationList-top">
      <h4 class="operationList-title">
        {{ title }}
      </h4>
      <img class="operationList-img" :src="url">
    </div>
    <div class="operationList-footer">
      <dl class="operationList-footer-main">
        <dt class="operationList-footer-l">
          <Icon name="jia" custom-class="my-jia" />
          {{ look }}
        </dt>
        <dd class="operationList-footer-r">
          <Icon name="jia" custom-class="my-jia" />
        </dd>
        <dd class="operationList-footer-r">
          <Icon name="jia" custom-class="my-jia" />
          {{ message }}
        </dd>
        <dd class="operationList-footer-r">
          <Icon name="jia" custom-class="my-jia" />
          {{ star }}
        </dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  name: 'OperationList',
  props: {
    url: String,
    title: String,
    look: Number,
    message: Number,
    star: Number
  },
  methods: {
    gotoPostDetails() {
      if (mpvuePlatform === 'h5') {
        this.$router.push('/postDetails');
      } else {
        wx.navigateTo({
          url: '/pages/postDetails/index'
        });
      }
    }
  }
};
</script>
