// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
// import ELEMENT from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/store'
import utils from '@/common/utils'

import IconSvg from '@/components/icon-svg'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component('icon-svg', IconSvg)

// Vue.use(ELEMENT)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  created () {
    utils.initMoment()
  }
})

const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('@/assets/icon/icons', true, /\.svg$/)
requireAll(req)
