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

      const {editData, ...rest} = payload
      await this.dispatch('productManagement/batchEdit/productListFetch', {
        apiName: 'getProductList',
        ...rest
      })

      console.log(state.productListTableData)

      if (editData.editType === 0) {
        const productListTableData = state.productListTableData.map(item => {
          const isOnSalePrevious = item.status ? '上架' : '下架'
          const isOnSale = editData.isOnSale
          const isOnSaleCurrent = editData.isOnSale ? '上架' : '下架'
          return {...item, isOnSalePrevious, isOnSaleCurrent, isOnSale}
        })
        commit('save', {
          productListTableData
        })
      }
    }
  },
  getters: {
  }
})

console.log(model)
export default model
