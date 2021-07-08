import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableData = listModel()

// 店铺绑定
export default assign(tableData, {
  namespaced: true,
  state: () => ({
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async fetchDetail ({commit, state, dispatch}, payload) {
      await dispatch('fetch', {
        apiName: 'captureShopPage',
        ...payload
      })
    },
    async deleteCaptureId ({commit, state, dispatch}, payload) {
      try {
        await Api.hhgjAPIs.captureShopPageDelete(payload)
        this._vm.$message.success(`删除成功`)
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
})
