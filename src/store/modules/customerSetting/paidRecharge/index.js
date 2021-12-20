import consumptionRecord from './consumptionRecord'
import Api from '@/api/apis'

const modules = {
  paidRecharge: {
    namespaced: true,
    modules: {
      consumptionRecord
    },
    state: () => ({
      tableData: [],
      versionList: [],
      availablePddCaptureNums: 0,
      totalPddCaptureNums: 0,
      pagination: {
        index: 1,
        size: 10,
        total: 100
      },
      userVersion: {}
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
        let loading = this._vm.$loading({
          target: '.TableRecharge'
        })
        try {
          const pagination = payload.pagination

          const data = await Api.hhgjAPIs.userAccountFlowPage({
            page_index: pagination.index,
            page_size: pagination.size
          })
          const tableData = (data.item_list || []).map(item => {
            item.amount = `${item.amount / 100} 元`
            return item
          })
          pagination.total = data.total
          commit('save', {tableData, pagination})
          loading && loading.close()
        } catch (err) {
          console.log(err)
          loading && loading.close()
          this._vm.$message({
            message: `${err}`,
            type: 'error'
          })
        }
      },
      async userVersionQuery ({commit}, payload) {
        try {
          const userVersion = await Api.hhgjAPIs.userVersionQuery()
          userVersion.left_cnt = 10 - (userVersion.today_cnt || 0) < 0 ? 0 : 10 - (userVersion.today_cnt || 0)
          commit('save', {userVersion})
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
}

export default modules
