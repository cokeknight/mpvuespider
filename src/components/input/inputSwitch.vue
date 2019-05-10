<template>
  <div class="checkbox">
    <i v-for="item in data" :key="item.id" :class="'checkbox-item ' + (value ===item.id ? 'selected' : '')" @click="handleSwitch(item.id)"> {{ item.name }} </i>
  </div>
</template>
<script>
export default {
  props: {
    data: Array,
    trackName: String,
    value: Number
  },
  data: function() {
    return {
      localvalue: this.value
    };
  },
  watch: {
    value: function(v) {
      this.localvalue = v;
    }
  },
  methods: {
    handleSwitch: function(id) {
      this.$emit('input', id);
    }
  }
};
</script>
