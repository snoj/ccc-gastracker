<template>
  <div><a href="#/dailyfees">Gas Fees by Day/Batch</a> || <a href="#/dailyfeestotal">Gas Fees by Day</a></div>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    // batches: require('./constants/huntBatchPool.json'),
    // keys: require('./constants/keys.json')
  }),
  setup: () => {

  },
  components: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
