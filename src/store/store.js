import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import category from './modules/category'
import template from './modules/template'
import capture from './modules/capture'
import tpProduct from './modules/tpProduct'
import subscrible from './modules/subscribe'
import notification from './modules/notification'
import picture from './modules/picture'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    category,
    template,
    capture,
    tpProduct,
    subscrible,
    notification,
    picture
  }
})
