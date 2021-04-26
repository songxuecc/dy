import Api from '@/api/apis'
import utils from '@/common/utils'
import moment from 'moment'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    userVersion: undefined,
    versionType: undefined,
    versionTipType: undefined,
    migrateSetting: {},
    shopCaptureOptions: [],
    captureOptions: [],
    bindShopList: []
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getCaptureOptionList ({commit}, payload) {
      let captureOptions = [{ value: '-1', label: '全部' }]
      const data = await Api.hhgjAPIs.getCaptureOptionList();

      (data.items || []).forEach((capture, index) => {
        let label = moment(capture.create_time).calendar()
        if (index === 0) {
          label = '最近一次 (' + utils.calendarShort(capture.create_time) + ')'
        }
        captureOptions.push({
          value: capture.capture_id.toString(),
          label
        })
      })
      let shopCaptureOptions = [{ value: '-1', label: '全部' }];
      (data.shop_capture_items || []).forEach(capture => {
        shopCaptureOptions.push({
          value: capture.capture_id.toString(),
          label: `${capture.shop_name}`
        })
      })
      commit('save', {captureOptions, shopCaptureOptions})
      return captureOptions
    },
    async getBindShopList ({commit}, payload) {
      // 查询绑定店铺列表
      let bindShopList = [{ shop_name: '本店铺', user_id: 0 }]
      const data = await Api.hhgjAPIs.getUserBindList()
      let userDict = {}
      data.forEach((item) => {
        item.user_list.forEach((user) => {
          if (!user.is_self) {
            userDict[user.user_id] = user
          }
          userDict[user.shop_name] = `${user.shop_name}`
        })
      })
      for (let userId in userDict) {
        bindShopList.push(userDict[userId])
      }

      commit('save', {bindShopList})
    },
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
