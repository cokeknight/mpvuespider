<template>
  <div class="input-box">
    <input
      v-track="{name:trackName}"
      :type="qtype"
      :placeholder="holdertext"
      :value="currentValue"
      class="login-input"
      @input="handleInput($event.target.value)"
    > <span
      v-show="value"
      v-track="{name:trackName+'_clean'}"
      class="clean input-clean"
      @click="clear"
    ><img
      src="../../assets/images/icons/cha.png"
      height="20"
      width="20"
      alt=""
    ></span>
  </div>
</template>
<style>
</style>
<script>
/*
   * API:
   * */
export default {
  props: {
    holdertext: {
      type: String,
      default: ''
    },
    qtype: {
      type: String,
      default: 'password'
    },
    value: [String, Number],
    trackName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentValue: this.value
    };
  },
  methods: {
    clear: function() {
      this.handleInput('');
    },
    handleInput(value) {
      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('input', value);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
    }
  }
};
</script>
