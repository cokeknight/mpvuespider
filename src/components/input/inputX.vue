<template>
  <div class="input-com">
    <em class="label-width">{{ label }}</em> <input
      v-track="{name:trackName+'_insertinput'}"
      class="input-width"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :value="value"
      :readonly="readOnly"
      :maxlength="val_length"
      @keydown="go"
      @input="updateValue($event.target.value)"
      @blur="handleBlur"
    > <a
      v-if="temHide"
      v-show="value && !readOnly"
      href="javascript:;"
    >
      <span
        v-track="{name:trackName+'_clean'}"
        class="clean cleanNew"
        @click="clean"
      ><icon href="failure" /></span> </a> <span v-if="rightText">{{ rightText }}</span>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: false,
      default: ''
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    type: {
      type: String,
      required: false,
      default: 'text'
    },
    value: {
      // type: String, // value有时会有其它类型
      required: true,
      default: ''
    },
    readOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    valLength: {
      type: Number,
      required: false
    },
    temHide: {
      type: Boolean,
      required: false,
      default: true
    },
    rightText: {
      type: String,
      required: false
    },
    trackName: {
      type: String,
      default: ''
    }
  },
  methods: {
    go(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.$emit('enter');
      }
    },
    updateValue: function(value) {
      this.$emit('input', value);
    },
    clean: function() {
      this.$emit('input', '');
    },
    handleBlur(e) {
      this.$emit('blur', e);
    }
  }
};
</script>
