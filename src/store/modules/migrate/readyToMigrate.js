import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    userVersion: undefined,
    versionType: undefined,
    versionTipType: undefined,
    migrateSetting: {}
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
            price: `${userVersion.unit_price / 100}元/天`,
            tip: '版本升级',
            left: '升级前',
            right: '升级后',
            btn: '去升级'
          },
          free_seven_days: {
            price: `${userVersion.unit_price / 100}元/天`,
            tip: '订购高级版',
            left: '订购前',
            right: '订购后',
            btn: '订购高级版'
          }
        }
        let versionType = {}
        let versionTipType = 0
        userVersion.left_cnt = 10 - (userVersion.today_cnt || 0) < 0 ? 0 : 10 - (userVersion.today_cnt || 0)
        if (userVersion && !userVersion.is_free_upgrate) {
          versionType = configs[userVersion.version_type]
          versionTipType = userVersion.version_type
        }
        commit('save', {userVersion, versionType, versionTipType})
        return userVersion
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
        return false
      }
    },

    async getMigrateSetting ({commit}, payload) {
      try {
        const migrateSetting = await Api.hhgjAPIs.getMigrateSetting({})
        commit('save', {migrateSetting})
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