// // The Vue build version to load with the `import` command
// // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/store'
import utils from '@/common/utils'
import HhIcon from '@/components/HhIcon'
import VueClipboard from 'vue-clipboard2'
import {registerComponent, registerDirectives, requireAll} from '@/common/register'

Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component('hh-icon', HhIcon)
registerComponent()
registerDirectives()

// Vue.use(ELEMENT)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    utils.initMoment()
  }
})

const req = require.context('@/assets/icon', true, /\.svg$/)
requireAll(req)

console.log('9999')
