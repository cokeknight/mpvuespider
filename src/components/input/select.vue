<template>
  <div class="x-select">
    <select v-model="selectVal">
      <options
        v-for="item in selectArr"
        :value="item"
      />
    </select>
  </div>
</template>
<script>
export default {
  data() {
    return {
      selectVal: ''
    };
  }
};
</script>