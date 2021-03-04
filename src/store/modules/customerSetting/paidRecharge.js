import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    versionList: [],
    availablePddCaptureNums: 0,
    totalPddCaptureNums: 0
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
    async userAccountFlowList ({commit, state}, payload) {
      try {
        const data = await Api.hhgjAPIs.userAccountFlowList()
        const tableData = data.map(item => {
          item.amount = `${item.amount / 100} 元`
          return item
        })
        commit('save', { tableData })
      } catch (err) {
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
