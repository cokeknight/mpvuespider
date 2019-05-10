<style lang="less">
  .user-list {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #dddddd;
    padding: 5px 0;

    .user-list-l {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-right: 10px;
    }

    .user-list-m {
      flex: 1;

      .user-name {
        font-size: 14px;
      }

      .user-work {
        font-size: 10px;
        color: #ddd;
      }
    }

    .user-list-r {
      .user-btn {
        background: #3BD1CA;
        border-radius: 24px;
        border: 1px solid #3BD1CA;
        font-size: 12px;
        color: #fff;
        padding: 2px 5px;
        min-width: 50px;
        min-height: 30px;
      }
    }
  }

</style>
<template>
  <div class="user-list">
    <img :src="url" class="user-list-l" />
    <div class="user-list-m">
      <h4 class="user-name">
        {{ name }}
      </h4>
      <p class="user-work">
        {{ work }}
      </p>
    </div>
    <div class="user-list-r">
      <button v-if="message==='关注'" class="user-btn" @click="tagAttention">
        {{ message }}
      </button>
      <button v-else class="user-btn" disabled>
        {{ message }}
      </button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    url: String,
    name: String,
    work: String,
    message: String
  },
  methods: {
    tagAttention() {
      this.$emit('on-attention');
    }
  }
};
</script>
