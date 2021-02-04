import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import category from './modules/category'
import capture from './modules/capture'
import tpProduct from './modules/tpProduct'
import subscrible from './modules/subscribe'
import notification from './modules/notification'
import picture from './modules/picture'
import controller from './modules/controller'

import migrate from './modules/migrate'
import productManagement from './modules/productManagement'

Vue.use(Vuex)
const modules = {
  user,
  category,
  capture,
  tpProduct,
  subscrible,
  notification,
  picture,
  controller,
  ...migrate,
  ...productManagement
}

export default new Vuex.Store({
  modules
})
