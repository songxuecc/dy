import Vue from 'vue'
import Vuex from 'vuex'
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
import {setBaseModelConfig} from '@commonModels/createBaseModel.js'

setBaseModelConfig({
  // 列表获取
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
  // 参数格式化
  formatParmas: (parmas) => {
    return {
      ...parmas.pagination,
      ...parmas.filters
    }
  },
  // 错误警告
  handleError: (err, self) => {
    self._vm.$message({
      message: `${err}`,
      type: 'error'
    })
  },
  // 分页配置
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

console.log(modules, 'modules')
export default new Vuex.Store({
  modules,
  plugins: [createLoadingPlugin({Vue})]
})
