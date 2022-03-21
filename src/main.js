// // The Vue build version to load with the `import` command
// // (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/store'
import utils from '@/common/utils'
import VueClipboard from 'vue-clipboard2'
import {registerComponent, registerDirectives, requireAll} from '@/common/register'
import MdUi from 'vue-midou-icon'
import 'vue-midou-icon/lib/midou.css'

const IconFont = MdUi.createFromIconfontCN({
  scriptUrl: [
    '//at.alicdn.com/t/font_2290850_j2tqdbvidci.js'
  ],
  name: 'hh-icon'
})
Vue.use(IconFont)
Vue.use(VueClipboard)
Vue.config.productionTip = false
Vue.use(VueAxios, axios)
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
// 挂载稿定设计的实例
const gaodingEditor = window.gaoding.createImageEditor({
  appId: 'LHCXOH948273',
  container: '.edit-gaoding-container'
})
gaodingEditor.on('load', () => {
  console.log('load')
})
gaodingEditor.on('save', () => {
})
Vue.prototype.$gaodingEditor = gaodingEditor

const req = require.context('@/assets/icon', true, /\.svg$/)
requireAll(req)
