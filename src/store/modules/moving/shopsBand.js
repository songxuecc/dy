import Api from '@/api/apis'
const items = [
  {
    shop_name: '小虎跑得快',
    is_main: true,
    is_self: true,
    auth_status: 'auth',
    auth_deadline: '2020.10.28',
    'user_id': 1111 },
  {
    shop_name: '小虎跑得快',
    is_main: false,
    is_self: false,
    auth_status: 'expire',
    auth_deadline: '2020.10.28',
    'user_id': 1111 },
  {
    shop_name: '小虎跑得快',
    is_main: false,
    is_self: false,
    auth_status: 'auth',
    auth_deadline: '2020.10.28',
    'user_id': 1111
  }
]
const items2 = [{
  shop_name: '2016-05-02',
  is_main: true,
  is_self: false,
  auth_status: 'auth',
  auth_deadline: '2020.10.28',
  'user_id': 1111 },
{
  shop_name: '2016-05-02',
  is_main: false,
  is_self: true,
  auth_status: 'auth',
  auth_deadline: '2020.10.28',
  'user_id': 1111 },
{
  shop_name: '2016-05-02',
  is_main: false,
  is_self: false,
  auth_status: 'auth',
  auth_deadline: '2020.10.28',
  'user_id': 1111
}]
let data = [
  {
    'user_id': 1111,
    'shop_name': '小虎跑得快a1',
    'auth_status': 'auth',
    'auth_deadline': '2021-01-01',
    'is_main': true,
    'is_self': false,
    'user_list': items
  },
  {
    'user_id': 1111,
    'shop_name': '小虎跑得快a2',
    'auth_status': 'auth',
    'auth_deadline': '2021-01-01',
    'is_main': true,
    'is_self': false,
    'user_list': items2
  },
  {
    'user_id': 1111,
    'shop_name': '小虎跑得快a1',
    'auth_status': 'auth',
    'auth_deadline': '2021-01-01',
    'is_main': true,
    'is_self': false,
    'user_list': items
  },
  {
    'user_id': 1111,
    'shop_name': '小虎跑得快a2',
    'auth_status': 'auth',
    'auth_deadline': '2021-01-01',
    'is_main': true,
    'is_self': false,
    'user_list': items
  }
]
// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    captureIdList: [],
    tableData: [],
    count: 0,
    active: 0,
    postSubmitLoading: false,
    postCodeLoading: false
  }),
  mutations: {
    save (state, payload) {
      console.log(payload)
      Object.assign(state, payload)
    }
  },
  actions: {
    async getUserBindList ({commit, state}, payload) {
      // const {items} = await Api.hhgjAPIs.getProductList(payload)
      data = data.map((item, id) => ({...item, id}))
      commit('save', { data })
      this.dispatch('moving/shopsBand/getTabData', data[state.active])
    },
    changeActive  ({commit, state}, payload) {
      commit('save', payload)
      this.dispatch('moving/shopsBand/getTabData', state.data[payload.active])
    },
    getTabData ({commit, state}, payload) {
        // 当前店铺是主店铺 可以踢人
      const items = payload.user_list
      const canChangeShops = items.some(item => item.is_self && item.is_main)
      const tableData = items.map(item => {
        const editBtns = []
        if ((!item.is_main & !item.is_self & item.auth_status === 'auth') || (!item.is_self & !canChangeShops)) {
          editBtns.push({
            text: '切换成TA',
            handle: () => this.dispatch('moving/shopsBand/changeShop', item)
          })
        }
        // else if (!item.is_main & item.auth_status === 'expire') {
        //   editBtns.push({
        //     text: '授权过期,点击续费',
        //     handle: () => this.dispatch('moving/shopsBand/renew', item)
        //   })
        // }
        // 如果is_self为0，则为父店铺user_id, 如果is_self为1，则为子店铺user_id
        if (!item.is_self & canChangeShops) {
          editBtns.push({
            text: '踢出多店铺管理',
            handle: () => this.dispatch('moving/shopsBand/kickOut', {
              is_self: 1,
              target_user_id: item.user_id
            })
          })
        }
        if (item.is_self & !canChangeShops) {
          editBtns.push({
            text: '退出多店铺管理',
            handle: () => this.dispatch('moving/shopsBand/kickOut', {
              is_self: 0,
              target_user_id: payload.user_id
            })
          })
        }
        return {
          ...item,
          editBtns
        }
      })
      commit('save', { data, tableData })
    },
    // 切换
    changeShop () {
      window.open('https://fuwu.jinritemai.com/detail?from=fuwu_market_home&service_id=42')
    },
    // 续费
    renew () {
      window.open('https://fuwu.jinritemai.com/detail?from=fuwu_market_home&service_id=42')
    },
    // 踢出
    async kickOut ({commit, state}, payload) {
      console.log(payload)
      await Api.hhgjAPIs.deleteUserBind(payload)
      this._vm.$message({
        message: '踢出成功',
        type: 'success'
      })
    }
  },
  getters: {
    isMainShops: state => state.data.filter(item => item.is_main) || []
  }
}
