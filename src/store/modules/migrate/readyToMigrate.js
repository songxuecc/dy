import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    userVersion: undefined,
    versionType: undefined
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async userVersionQuery ({commit}, payload) {
      try {
        const userVersion = await Api.hhgjAPIs.userVersionQuery()
        const configs = {
          free_three_months: {
            price: '0.3元/天',
            tip: '版本升级',
            left: '升级前',
            right: '升级后',
            btn: '去升级'
          },
          free_seven_days: {
            price: '15元/月',
            tip: '订购高级版',
            left: '订购前',
            right: '订购后',
            btn: '订购高级版'
          }
        }
        let versionType
        if (userVersion) {
          const isFreeUpgrate = userVersion.is_free_upgrate
          versionType = !isFreeUpgrate ? configs[userVersion.versionType] : {}
        // versionType = configs['free_seven_days']
          console.log(versionType, 'versionType')
        }
        commit('save', {userVersion, versionType})
        return userVersion
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
        return false
      }
    }
  },
  getters: {
  }
}
