import * as types from './types'
import Api from '@/api/apis'
// const api = hhgjAPIs.hhgjAPIs
import FormModel from '@/common/formModel'

export default {
  namespaced: 'migrateShopsBand',
  state: () => ({
    captureIdList: [],
    tpProductList: [],
    count: 0
  }),
  mutations: {
    [ types.SET_CAPTURE_ID_LIST ] (state, captureIdList) {
      state.captureIdList = captureIdList
      localStorage.setItem('captureIdList', captureIdList)
    },
    save (state, payload) {
      Object.assign(state, payload)
    },
    increment (state) {
      state.count++
    }
  },
  actions: {
    setCaptureIdList ({commit, state}, captureIdList) {
      commit(types.SET_CAPTURE_ID_LIST, captureIdList)
    },
    async getTPProductByIds ({commit, state}, {payload}) {
      const {items} = await Api.hhgjAPIs.getTPProductByIds(payload)
      const tpProductList = items.map(tpProduct => {
        tpProduct.market_price_obj = new FormModel()
        tpProduct.discount_price_obj = new FormModel()
        tpProduct.group_price_range = '-'
        tpProduct.focus = false
        tpProduct.mouseInside = false
        tpProduct.focus2 = false
        tpProduct.mouseInside2 = false
        tpProduct.singlePriceError = ''
        tpProduct.groupPriceError = ''
        tpProduct.marketPriceError = ''
        tpProduct.discountPriceError = ''
        tpProduct.maxSkuOriginPriceFen = 0
        return tpProduct
      })
      commit({ type: 'save', tpProductList })
    },
    increment (context) {
      console.log('77777')
      context.commit('increment')
    }
  },
  getters: {
    getCaptureIdList: state => {
      if (state.captureIdList.length === 0) {
        let list = localStorage.getItem('captureIdList')
        if (list) {
          state.captureIdList = list.split(',')
        }
      }
      return state.captureIdList
    }
  }
}
