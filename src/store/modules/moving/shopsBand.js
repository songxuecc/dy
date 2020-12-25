import Api from '@/api/apis'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    captureIdList: [],
    tpProductList: [],
    count: 0,
    tableData: [{
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }, {
      date: '2016-05-04',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1517 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-01',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1519 弄'
    }, {
      date: '2016-05-03',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1516 弄'
    }]
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    },
    increment (state) {
      state.count++
    }
  },
  actions: {
    async getTPProductByIds ({commit, state}, {payload}) {
      const {items} = await Api.hhgjAPIs.getProductList(payload)
      console.log('getTPProductByIds')
      console.log(items)
      commit({ type: 'save', items })
      return items
    }
  },
  getters: {
    getCaptureIdList: state => {
      if (state.captureIdList.length === 0) {
        let list = localStorage.getItem('captureIdList')
        if (list) {
          state.captureIdList = list.split(',')
        }
      }
      return state.captureIdList
    }
  }
}
