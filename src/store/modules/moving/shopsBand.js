import Api from '@/api/apis'
const items = [
  {
    shop_name: '小虎跑得快',
    is_main: true,
    is_self: true,
    auth_status: 'auth',
    auth_deadline: '2020.10.28'
  },
  {
    shop_name: '小虎跑得快',
    is_main: false,
    is_self: false,
    auth_status: 'expire',
    auth_deadline: '2020.10.28'
  },
  {
    shop_name: '小虎跑得快',
    is_main: false,
    is_self: false,
    auth_status: 'auth',
    auth_deadline: '2020.10.28'
  }
]
const items2 = [{
  shop_name: '2016-05-02',
  is_main: true,
  is_self: false,
  auth_status: 'auth',
  auth_deadline: '2020.10.28'
},
{
  shop_name: '2016-05-02',
  is_main: false,
  is_self: true,
  auth_status: 'auth',
  auth_deadline: '2020.10.28'
},
{
  shop_name: '2016-05-02',
  is_main: false,
  is_self: false,
  auth_status: 'auth',
  auth_deadline: '2020.10.28'
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
    postLoading: false,
    postCodeLoading: false
  }),
  mutations: {
    save (state, payload) {
      console.log(payload)
      Object.assign(state, payload)
    }
  },
  actions: {
    changeShop () {
      console.log('888')
    },
    async getUserBindList ({commit, state}, payload) {
      // const {items} = await Api.hhgjAPIs.getProductList(payload)
      data = data.map((item, id) => ({...item, id}))
      commit('save', { data })
    },
    async postBindSuthCodeCreate ({commit, state}, payload) {
      let postCodeLoading = true
      commit('save', {
        postCodeLoading
      })
      // const {auth_code} = await Api.hhgjAPIs.postBindSuthCodeCreate(payload)
      setTimeout(() => {
        postCodeLoading = false
        commit('save', {
          postCodeLoading
        })
      }, 1000)
      return true
    },
    async postUserBindCreate ({commit, state}, payload) {
      let postSubmitLoading = true
      commit('save', {
        postSubmitLoading
      })
      setTimeout(() => {
        postSubmitLoading = false
        commit('save', {
          postSubmitLoading
        })
      }, 1000)
      // const {items} = await Api.hhgjAPIs.getProductList(payload)
    },
    // 切换
    change () {
      console.log('999')
    },
    // 续费
    renew () {
      console.log('999')
    },
    // 踢出
    kickOut () {
      console.log('999')
    },
    // 退出
    async exit ({commit, state}, {payload}) {
      // const {items} = await Api.hhgjAPIs.getProductList(payload)
    },
    changeActive  ({commit, state}, payload) {
      // const {items} = await Api.hhgjAPIs.getProductList(payload)
      commit('save', payload)
    }
  },
  getters: {
    isMainShops: state => state.data.filter(item => item.is_main) || [],
    tableData: state => {
        // 当前店铺是主店铺 可以踢人
      const items = data[state.active].user_list
      const canChangeShops = items.some(item => item.is_self && item.is_main)
      const tableData = items.map(item => {
        const editBtns = []
        if ((!item.is_main & !item.is_self & item.auth_status === 'auth') || (!item.is_self & !canChangeShops)) {
          editBtns.push({
            text: '切换成TA',
            handle: () => this.dispatch({type: 'moving/shopsBand/change'})
          })
        } else if (!item.is_main & item.auth_status === 'expire') {
          editBtns.push({
            text: '授权过期,点击续费',
            handle: this.changeShop
          })
        }
        if (!item.is_self & canChangeShops) {
          editBtns.push({
            text: '踢出多店铺管理',
            handle: this.changeShop
          })
        }
        if (item.is_self & !canChangeShops) {
          editBtns.push({
            text: '退出多店铺管理',
            handle: this.changeShop
          })
        }
        return {
          ...item,
          editBtns
        }
      })
      return tableData
    }
  }
}
