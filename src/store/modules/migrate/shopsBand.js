import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    captureIdList: [],
    tableData: [],
    count: 0,
    data: [],
    active: undefined,
    postSubmitLoading: false,
    postCodeLoading: false
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getUserBindList ({commit, state}, payload) {
      let loading
      if (payload && payload.loading) {
        loading = this._vm.$loading({
          target: '.TableShopManagement'
        })
      }
      const result = await Api.hhgjAPIs.getUserBindList({})
      const data = (result || []).map((item, id) => ({...item, id}))
      const mapData = data.reduce((target, current) => {
        return {...target, [current.user_id]: current}
      }, {})
      loading && loading.close()
      const active = state.active
      // 如果切换的tab对应的user_id还存在 则切换当前tab
      if (mapData[active]) {
        this.dispatch('migrate/shopsBand/getTabData', mapData[active])
      } else if (!mapData[active] && data.length) {
        // 如果切换的tab对应的user_id不存在 取默认第一个
        this.dispatch('migrate/shopsBand/getTabData', data[0])
        commit('save', { active: data[0].user_id })
      } else {
        this.dispatch('migrate/shopsBand/getTabData', undefined)
        commit('save', { active: undefined })
      }
      commit('save', { data, mapData })
    },
    changeActive  ({commit, state}, payload) {
      commit('save', payload)
      this.dispatch('migrate/shopsBand/getTabData', state.mapData[payload.active])
    },
    getTabData ({commit, state}, payload) {
        // 当前店铺是主店铺 可以踢人
      if (!payload) {
        commit('save', { tableData: [] })
        return false
      }
      const items = payload.user_list
      const canChangeShops = items.some(item => item.is_self && item.is_main)
      const tableData = items.map(item => {
        const editBtns = []
        if (!item.is_self) {
          editBtns.push({
            text: '切换成TA',
            handle: item.auth_status !== 'auth' ? () => {} : () => this.dispatch('migrate/shopsBand/changeShop', item),
            diabled: item.auth_status !== 'auth'
          })
        }
        // 如果is_self为0，则为父店铺user_id, 如果is_self为1，则为子店铺user_id
        if (!item.is_self & canChangeShops) {
          editBtns.push({
            text: '踢出多店铺管理',
            handle: () => this.dispatch('migrate/shopsBand/kickOut', {
              is_self: 0,
              target_user_id: item.user_id
            })
          })
        }
        if (item.is_self & !canChangeShops) {
          editBtns.push({
            text: '退出多店铺管理',
            handle: () => this.dispatch('migrate/shopsBand/kickOut', {
              is_self: 1,
              target_user_id: payload.user_id
            })
          })
        }
        return {
          ...item,
          editBtns
        }
      })
      commit('save', { tableData })
    },
    // 切换
    async changeShop ({commit, state}, payload) {
      if (parseInt(payload) === 0) return false
      await Api.hhgjAPIs.postUserBindChange({
        target_user_id: payload.user_id
      })
      commit('SET_CHANGE_SHOP', {'change_shop_id': payload.user_id, 'type': 'change'}, { root: true })
      location.reload()
    },
    // 续费
    renew () {
      window.open('https://fuwu.jinritemai.com/detail?from=fuwu_market_home&service_id=42')
    },
    // 踢出
    async kickOut ({commit, state}, payload) {
      try {
        await Api.hhgjAPIs.deleteUserBind(payload)
        this.dispatch('migrate/shopsBand/getUserBindList', {
          loading: true
        })
        this._vm.$message({
          message: !payload.is_self ? '踢出成功' : '退出成功',
          type: 'success'
        })
      } catch (err) {
        this._vm.$message({
          message: err,
          type: 'error'
        })
      }
    }
  },
  getters: {
    isMainShops: state => state.data.filter(item => item.is_main) || []
  }
}
