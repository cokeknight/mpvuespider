<template>
  <div class="input-code">
    <em
      v-if="label"
      class="label-width"
    >{{ label }}</em> <input
      v-track="{name:'dynamic-code'}"
      :disabled="disabled"
      class="input-width dynamic-code"
      type="text"
      :placeholder="placeholder"
      :name="name"
      :value="value"
      :readonly="readOnly"
      @input="updateValue($event.target.value)"
    >
    <dynamic-code
      track-name="trackName"
      :unit="unit"
      @click="clickDynamicCode"
    />
    <span
      v-if="close && value"
      class="clean cleannew"
      @click="clean"
    ><icon href="failure" /></span>
  </div>
</template>
<script>
import DynamicCode from 'DynamicCode';

export default {
  components: {
    DynamicCode
  },
  props: {
    close: Boolean,
    disabled: {
      type: Boolean
    },
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
    value: {
      type: String,
      required: false,
      default: ''
    },
    trackName: {
      type: String,
      default: ''
    },
    readOnly: Boolean,
    unit: {
      type: String,
      default: ''
    }
  },
  methods: {
    updateValue: function(value) {
      this.$emit('input', value);
    },
    clickDynamicCode: function(func) {
      this.$emit('click', func);
    },
    clean: function() {
      this.$emit('input', '');
    }
  }
};
</script>
