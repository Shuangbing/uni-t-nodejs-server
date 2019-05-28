import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
import moment from 'moment'

Vue.config.productionTip = false

import http from './http'

Vue.prototype.$http = http

Vue.filter('dateformat', function(date){
  return moment(date).format('YYYY-MM-DD HH:mm:ss')
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
