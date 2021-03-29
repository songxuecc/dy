import Api from '@/api/apis'
export default {
  namespaced: true,
  state: () => ({
    tableData: []
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getTPProductByIds ({commit, state, rootGetters}, payload) {
    //   const {paginationRecord, filtersRecord} = payload || {}
      try {
        // const nextPaginationRecord = {
        //   ...state.paginationRecord,
        //   ...paginationRecord
        // }
        // const nextFiltersRecord = {
        //   ...state.filtersRecord,
        //   ...filtersRecord
        // }
        // const parmas = {
        //   ...nextPaginationRecord,
        //   ...nextFiltersRecord
        // }

        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        console.log(data.items)
        commit('save', {
          tableData: data.items
        //   paginationRecord: nextPaginationRecord,
        //   filtersRecord: nextFiltersRecord,
        //   tableDataRecord: data.item_list,
        //   totalRecord: data.total
        })

        this.dispatch('migrate/skuImport/getperprogress')
      } catch (err) {
        console.log(err)
      }
    }

  },
  getters: {
  }
}
