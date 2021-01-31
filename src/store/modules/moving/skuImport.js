import Api from '@/api/apis'

// function sleep (time) {
//   return new Promise((resolve) => setTimeout(resolve, time))
// }
// const mockData = [ {
//   'id': 1,
//   'is_delete': 0,
//   'success_nums': 0,
//   'status': 'running',
//   'total_nums': 0,
//   'fail_nums': 0,
//   'create_time': '2021-01-27 12:15:35'
// },
// {
//   'id': 2,
//   'is_delete': 0,
//   'success_nums': 0,
//   'status': 'stop',
//   'total_nums': 0,
//   'fail_nums': 0,
//   'create_time': '2021-01-27 12:15:35'
// },
// {
//   'id': 3,
//   'is_delete': 0,
//   'success_nums': 0,
//   'status': 'complete',
//   'total_nums': 0,
//   'fail_nums': 0,
//   'create_time': '2021-01-27 12:15:35'
// }]
// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    paginationRecord: {
      sizes: [10, 20, 50, 100],
      page_size: 10,
      page_index: 1
    },
    filtersRecord: {
      status: ''
    },
    tableDataRecord: [],
    paginationProductDetail: {
      sizes: [10, 20, 50, 100],
      page_size: 10,
      page_index: 1
    },
    filtersProductDetail: {
      status: ''
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
      const {paginationRecord, filtersRecord} = payload
      let loading = this._vm.$loading({
        target: '.TableUploadFileRecord'
      })
      try {
        const parmas = {
          page_size: paginationRecord.page_size,
          page_index: paginationRecord.page_index,
          ...filtersRecord
        }
        const data = await Api.hhgjAPIs.getProductSkuExcelPage(parmas)
        console.log(data)
        paginationRecord.total = data.total
        commit('save', {
          paginationRecord,
          filtersRecord,
          tableDataRecord: data.item_list
        })

        this.dispatch('moving/skuImport/getperprogress', data.item_list)
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
      loading && loading.close()
    },
    async getperprogress ({commit, state}, payload) {
      const runingsIds = payload.filter(item => item.status === 'running').map(item => item.id)
      if (!runingsIds.length) return false
      const progressData = await Api.hhgjAPIs.getProductSkuExcelProgressQuery({
        id_list: JSON.stringify(runingsIds)
      })
      const tableDataRecord = state.tableDataRecord.map(originItem => {
        const progressItem = progressData.find(progressItem => progressItem.id === originItem.id)
        if (!progressItem) return originItem
        return Object.assign(originItem, progressItem)
      })
      commit('save', {
        progressData,
        tableDataRecord
      })
      setTimeout(() => {
        this.dispatch('moving/skuImport/getperprogress', progressData)
      }, 1000)
    },
    async getProductSkuExcelDetailPage ({commit, state}, payload) {
      const {paginationProductDetail, filtersProductDetail} = payload
      console.log(payload)
      let loading = this._vm.$loading({
        target: '.TableProductDetail'
      })
      const parmas = {
        page_size: paginationProductDetail.page_size,
        page_index: paginationProductDetail.page_index,
        ...filtersProductDetail
      }
      try {
        const data = await Api.hhgjAPIs.getProductSkuExcelDetailPage(parmas)
        paginationProductDetail.total = data.total
        commit('save', {
          paginationProductDetail,
          filtersProductDetail,
          tableDataProductDetail: data.item_list
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
