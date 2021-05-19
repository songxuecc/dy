// import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableDataDetail = listModel('productList')

const model = assign(tableDataDetail, {
  namespaced: true,
  state: () => ({
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
      console.log(state, 'state')
    }
  },
  actions: {
    async fetchProductList ({commit, state}, payload) {
      console.log('0000')
      await this.dispatch('productManagement/batchEdit/productListFetch', {
        apiName: 'getProductList',
        ...payload
      })
    }
  },
  getters: {
  }
})

console.log(model)
export default model
