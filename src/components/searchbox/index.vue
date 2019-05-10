<template>
  <section
    class="searchbox"
    :class="{ active: hasFocus }"
  >
    <div class="searchbox-inner">
      <form
        action
        @submit.prevent="formSubmit"
      >
        <div
          v-track="{name:trackName+'searchbox'}"
          class="searchbox-region"
          @click="addFocus()"
        >
          <i class="searchbox-zoom" /> <input
            ref="input"
            v-model="searchVal"
            class="searchbox-input"
            type="search"
            :placeholder="placeholder"
          >
        </div>
        <a
          v-track="{name:trackName+'searchboxcancle'}"
          class="searchbox-cancel"
          href="javascript:;"
          @click="cancel()"
        >取消</a>
      </form>
    </div>
  </section>
</template>
<script>
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索'
    },
    // 出借列表页，速兑通，搜索输入文字确认后自动还原
    autoCancel: {
      type: Boolean,
      default: false
    },
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      hasFocus: false,
      searchVal: ''
    };
  },
  watch: {
    isReset: function(v) {
      if (v) {
        this.cancel();
      }
    }
  },
  methods: {
    formSubmit: function() {
      if (this.searchVal) {
        this.$emit('search', this.searchVal);
        if (this.autoCancel) {
          this.cancel(true);
        }
      }
    },
    // 搜索框获取交点
    addFocus: function() {
      this.hasFocus = true;
      this.$refs.input.focus();
    },
    // 取消搜索
    cancel: function(preventEvent) {
      this.hasFocus = false;
      this.searchVal = '';
      this.$nextTick(function() {
        this.$refs.input.blur();
      });
      if (!preventEvent) {
        this.$emit('cancel', this.searchVal);
      }
    }
  }
};
</script>
