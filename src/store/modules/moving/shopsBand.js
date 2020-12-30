import Api from '@/api/apis'

// const items = [
//   {
//     shop_name: '小虎跑得快',
//     is_main: true,
//     is_self: true,
//     auth_status: 'auth',
//     auth_deadline: '2020.10.28',
//     'user_id': 1111 },
//   {
//     shop_name: '小虎跑得快',
//     is_main: false,
//     is_self: false,
//     auth_status: 'expire',
//     auth_deadline: '2020.10.28',
//     'user_id': 1111 },
//   {
//     shop_name: '小虎跑得快',
//     is_main: false,
//     is_self: false,
//     auth_status: 'auth',
//     auth_deadline: '2020.10.28',
//     'user_id': 1111
//   }
// ]
// const items2 = [{
//   shop_name: '2016-05-02',
//   is_main: true,
//   is_self: false,
//   auth_status: 'expire',
//   auth_deadline: '2020.10.28',
//   'user_id': 1111 },
// {
//   shop_name: '2016-05-02',
//   is_main: false,
//   is_self: true,
//   auth_status: 'auth',
//   auth_deadline: '2020.10.28',
//   'user_id': 1111 },
// {
//   shop_name: '2016-05-02',
//   is_main: false,
//   is_self: false,
//   auth_status: 'auth',
//   auth_deadline: '2020.10.28',
//   'user_id': 1111
// }]
// let ddd = [
//   {
//     'user_id': 1111,
//     'shop_name': '小虎跑得快a1',
//     'auth_status': 'auth',
//     'auth_deadline': '2021-01-01',
//     'is_main': true,
//     'is_self': false,
//     'user_list': items
//   },
//   {
//     'user_id': 1111,
//     'shop_name': '小虎跑得快a2',
//     'auth_status': 'auth',
//     'auth_deadline': '2021-01-01',
//     'is_main': true,
//     'is_self': false,
//     'user_list': items2
//   },
//   {
//     'user_id': 1111,
//     'shop_name': '小虎跑得快a1',
//     'auth_status': 'auth',
//     'auth_deadline': '2021-01-01',
//     'is_main': true,
//     'is_self': false,
//     'user_list': items
//   },
//   {
//     'user_id': 1111,
//     'shop_name': '小虎跑得快a2',
//     'auth_status': 'auth',
//     'auth_deadline': '2021-01-01',
//     'is_main': true,
//     'is_self': false,
//     'user_list': items
//   }
// ]

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    captureIdList: [],
    tableData: [],
    count: 0,
    data: [],
    active: 0,
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
      commit('save', { data })
      this.dispatch('moving/shopsBand/getTabData', data[state.active])
      loading && loading.close()
    },
    changeActive  ({commit, state}, payload) {
      commit('save', payload)
      this.dispatch('moving/shopsBand/getTabData', state.data[payload.active])
    },
    getTabData ({commit, state}, payload) {
        // 当前店铺是主店铺 可以踢人
      if (!payload) return false
      const items = payload.user_list
      const canChangeShops = items.some(item => item.is_self && item.is_main)
      const tableData = items.map(item => {
        const editBtns = []
        // if ((!item.is_main & !item.is_self & item.auth_status === 'auth') || (!item.is_self & !canChangeShops & item.auth_status === 'auth')) {
        //   editBtns.push({
        //     text: '切换成TA',
        //     handle: () => this.dispatch('moving/shopsBand/changeShop', item)
        //   })
        // }
        if (!item.is_self) {
          editBtns.push({
            text: '切换成TA',
            handle: item.auth_status !== 'auth' ? () => {} : () => this.dispatch('moving/shopsBand/changeShop', item),
            diabled: item.auth_status !== 'auth'
          })
        }
        // 如果is_self为0，则为父店铺user_id, 如果is_self为1，则为子店铺user_id
        if (!item.is_self & canChangeShops) {
          editBtns.push({
            text: '踢出多店铺管理',
            handle: () => this.dispatch('moving/shopsBand/kickOut', {
              is_self: 0,
              target_user_id: item.user_id
            })
          })
        }
        if (item.is_self & !canChangeShops) {
          editBtns.push({
            text: '退出多店铺管理',
            handle: () => this.dispatch('moving/shopsBand/kickOut', {
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
      console.log(payload)
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
        this.dispatch('moving/shopsBand/getUserBindList', {
          loading: true
        })
        this._vm.$message({
          message: payload.is_self ? '踢出成功' : '退出成功',
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
