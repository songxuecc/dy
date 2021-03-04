import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    versionList: [],
    availablePddCaptureNums: 0,
    totalPddCaptureNums: 0,
    pagination: {
      index: 0,
      size: 10,
      total: 100
    }
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getUserAccountQuery ({commit, state}, payload) {
      try {
        const data = await Api.hhgjAPIs.userAccountQuery()
        const versionList = data.version_list
        const availablePddCaptureNums = data.available_pdd_capture_nums
        const totalPddCaptureNums = data.total_pdd_capture_nums
        commit('save', { versionList, availablePddCaptureNums, totalPddCaptureNums })
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    },
    async userAccountFlowList ({commit}, payload) {
      try {
        const pagination = payload.pagination
        const data = await Api.hhgjAPIs.userAccountFlowList({
          page_index: pagination.index,
          page_size: pagination.size
        })
        const tableData = (data.items || []).map(item => {
          item.amount = `${item.amount / 100} 元`
          return item
        })
        pagination.total = data.total
        commit('save', {tableData, pagination})
      } catch (err) {
        console.log(err)
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    }
  },
  getters: {
  }
}
