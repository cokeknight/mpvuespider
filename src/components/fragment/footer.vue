<template>
  <div
    class="footerbox"
    :class="{dn: !show}"
  >
    <ul>
      <li
        v-for="item in map"
        :key="item.name"
        v-track="{name:'caidan_'+item.name}"
        :class="item.name == $route.name ? 'active' : ''"
        @click="go({name: item.name})"
      >
        <!-- 注释：选中icon是id名字后面加一个-selected 如：#icon-invest-selected -->
        <Icon :name="item.name" custom-class="iconClass" />
        <p>{{ item.text }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
const map = [
  {
    name: 'launch',
    class: 'launch',
    text: '随心购'
  },
  {
    name: 'message',
    class: 'message',
    text: '消息'
  },
  {
    name: 'account',
    class: 'account',
    text: '我的'
  }
];
export default {
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      map: []
    };
  },
  created() {
    this.map = map;
  },
  methods: {
    go: function(router) {
      this.$router.push(router);
    },
    iconClass: function(item) {
      var suffix = '';
      if (item.name == this.$route.name) {
        suffix = '-selected';
      }
      return item.class + suffix;
    }
  }
};
</script>
