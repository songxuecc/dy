import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    percentage: 0,
    refreshCategoryPercentage: 0,
    loadingPercent: false,
    timer: null
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async handleSyncCategory ({commit, state}, data) {
      try {
        commit('save', {
          loadingPercent: true
        })
        await Api.hhgjAPIs.realSyncDyUserCategory()
        const fn = async () => {
          const data = await Api.hhgjAPIs.getSyncDyUserCategory()
          commit('save', {
            refreshCategoryPercentage: data.percent
          })
          if (data.status !== 'complete') {
            const timer = setTimeout(() => {
              fn()
              clearTimeout(state.timer)
              commit('save', {
                timer: null
              })
            }, 2000)
            commit('save', {
              timer: timer
            })
          } else {
            this._vm.$message.success('刷新类目成功！')
            commit('save', {
              loadingPercent: false
            })
          }
        }
        fn()
      } catch (err) {
        this._vm.$message.error(`${err}`)
      }
    }
  },
  getters: {
  }
}
