import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableDataRecord = listModel('productSkuExcel')
const tableDataDetail = listModel('skuExcelDetail')
const model = assign(tableDataRecord, tableDataDetail, {
  namespaced: true,
  state: () => ({
    filtersRecord: {
      file_type: 1
    },
    parentRowData: {}
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
      console.log(state, 'state')
    }
  },
  actions: {
    async fetchRecord ({commit, state, dispatch}, payload) {
      await dispatch('productSkuExcelFetch', {
        apiName: 'getProductSkuExcelPage',
        ...payload
      })
      this.dispatch('productManagement/skuImport/getperprogress')
    },
    async fetchDetail ({commit, state, dispatch}, payload) {
      await dispatch('skuExcelDetailFetch', {
        apiName: 'getProductSkuExcelDetailPage',
        ...payload
      })
      const skuExcelDetailTableData = state.skuExcelDetailTableData.map(item => {
        if (item.ext_json && item.ext_json.new_goods_name) {
          item.new_goods_name = item.ext_json.new_goods_name
          item.old_goods_name = item.ext_json.old_goods_name
          item.goods_id = item.ext_json.goods_id
        }
        return item
      })
      commit('save', {skuExcelDetailTableData})
    },
    async getperprogress ({commit, state}) {
      const runingsIds = state.productSkuExcelTableData.filter(item => item.status === 'running').map(item => item.id)
      if (!runingsIds.length) return false
      const progressData = await Api.hhgjAPIs.getProductSkuExcelProgressQuery({
        id_list: JSON.stringify(runingsIds)
      })
      const productSkuExcelTableData = state.productSkuExcelTableData.map(originItem => {
        const progressItem = progressData.find(progressItem => progressItem.id === originItem.id)
        if (progressItem) {
          return {...originItem, ...progressItem}
        } else {
          return originItem
        }
      })
      commit('save', {
        productSkuExcelTableData
      })
      setTimeout(() => {
        this.dispatch('productManagement/skuImport/getperprogress')
      }, 1000)
    }
  },
  getters: {
    isMainShops: state => state.data.filter(item => item.is_main) || []
  }
})

export default model
