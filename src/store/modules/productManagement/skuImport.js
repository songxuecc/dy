import Api from '@/api/apis'
export default {
  namespaced: true,
  state: () => ({
    sizes: [10, 20, 50, 100],
    totalRecord: 0,
    totalProductDetail: 0,
    paginationRecord: {
      page_size: 10,
      page_index: 1
    },
    filtersRecord: {
      file_type: 0
    },
    tableDataRecord: [],
    paginationProductDetail: {
      page_size: 10,
      page_index: 1
    },
    filtersProductDetail: {
      status_list: ''
    },
    tableDataProductDetail: [],
    parentRowData: {}
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getProductSkuExcelPage ({commit, state}, payload) {
      const {paginationRecord, filtersRecord} = payload || {}

      let loading = this._vm.$loading({
        target: '.TableUploadFileRecord'
      })
      try {
        const nextPaginationRecord = {
          ...state.paginationRecord,
          ...paginationRecord
        }
        const nextFiltersRecord = {
          ...state.filtersRecord,
          ...filtersRecord
        }
        const parmas = {
          ...nextPaginationRecord,
          ...nextFiltersRecord
        }
        const data = await Api.hhgjAPIs.getProductSkuExcelPage(parmas)
        commit('save', {
          paginationRecord: nextPaginationRecord,
          filtersRecord: nextFiltersRecord,
          tableDataRecord: data.item_list,
          totalRecord: data.total
        })

        this.dispatch('productManagement/skuImport/getperprogress')
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
      loading && loading.close()
    },
    async getperprogress ({commit, state}) {
      const runingsIds = state.tableDataRecord.filter(item => item.status === 'running').map(item => item.id)
      if (!runingsIds.length) return false
      const progressData = await Api.hhgjAPIs.getProductSkuExcelProgressQuery({
        id_list: JSON.stringify(runingsIds)
      })
      const tableDataRecord = state.tableDataRecord.map(originItem => {
        const progressItem = progressData.find(progressItem => progressItem.id === originItem.id)
        if (progressItem) {
          return {...originItem, ...progressItem}
        } else {
          return originItem
        }
      })
      commit('save', {
        tableDataRecord
      })
      setTimeout(() => {
        this.dispatch('productManagement/skuImport/getperprogress')
      }, 1000)
    },
    async getProductSkuExcelDetailPage ({commit, state}, payload) {
      const {paginationProductDetail, filtersProductDetail} = payload
      let loading = this._vm.$loading({
        target: '.TableProductDetail'
      })
      try {
        const nextPaginationProductDetail = {
          ...state.paginationProductDetail,
          ...paginationProductDetail
        }
        const nextFiltersProductDetail = {
          ...state.filtersProductDetail,
          ...filtersProductDetail
        }
        const parmas = {
          ...nextPaginationProductDetail,
          ...nextFiltersProductDetail
        }

        const data = await Api.hhgjAPIs.getProductSkuExcelDetailPage(parmas)
        commit('save', {
          paginationProductDetail: nextPaginationProductDetail,
          filtersProductDetail: nextFiltersProductDetail,
          tableDataProductDetail: data.item_list,
          totalProductDetail: data.total
        })
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
      loading && loading.close()
    }
  },
  getters: {
    isMainShops: state => state.data.filter(item => item.is_main) || []
  }
}
