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
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import HhIcon from '@/components/HhIcon'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.component('hh-icon', HhIcon)

// global components register
const requireComponent = require.context(
  './components/ui',
  false,
  /([\w\W]*)\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = upperFirst(
    camelCase(
      fileName
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(
    componentName,
    componentConfig.default || componentConfig
  )
})

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
