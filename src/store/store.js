import Vue from 'vue'
import Vuex from 'vuex'
import {setBaseModelConfig} from '@commonModels/baseModel.js'
import createLoadingPlugin from './plugins/createLoadingPlugin'
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
import customerSetting from './modules/customerSetting'

setBaseModelConfig({
  getList: (response) => {
    let tableData
    if (response.hasOwnProperty('items')) {
      tableData = response.items
    } else {
      tableData = response.item_list
    }
    return {
      tableData,
      total: response.total
    }
  },
  handleError: (err, self) => {
    self._vm.$message({
      message: `${err}`,
      type: 'error'
    })
  },
  pagination: {
    page_size: 10,
    page_index: 1
  }
})

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
  ...productManagement,
  ...customerSetting
}
export default new Vuex.Store({
  modules,
  plugins: [createLoadingPlugin({Vue})]
})
