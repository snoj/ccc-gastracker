import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import DailyFees from './components/DailyFees.vue'
import DailyFeesTotal from './components/DailyFeesTotal.vue'
// import jQuery from 'jquery'

const routes = [
  { path: '/dailyfees', component: DailyFees },
  { path: '/dailyfees/day/:dayid', component: DailyFees },
  { path: '/dailyfees/from/:from', component: DailyFees },
  { path: '/dailyfeestotal', component: DailyFeesTotal }
]

createApp(App).use(createRouter({
  history: createWebHashHistory(),
  routes
})).mount('#app')
/*
.use({
  install: function (Vue, options) {
    Vue.prototype.$jQuery = jQuery // you'll have this.$jQuery anywhere in your vue project
  }
})
*/
