import Api from '@/api/apis'

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
const mockData = [ {
  'id': 1,
  'is_delete': 0,
  'success_nums': 0,
  'status': 'running',
  'total_nums': 0,
  'fail_nums': 0,
  'create_time': '2021-01-27 12:15:35'
},
{
  'id': 2,
  'is_delete': 0,
  'success_nums': 0,
  'status': 'stop',
  'total_nums': 0,
  'fail_nums': 0,
  'create_time': '2021-01-27 12:15:35'
},
{
  'id': 3,
  'is_delete': 0,
  'success_nums': 0,
  'status': 'complete',
  'total_nums': 0,
  'fail_nums': 0,
  'create_time': '2021-01-27 12:15:35'
}]
// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    paginationRecord: {
      sizes: [10, 20, 50, 100],
      page_size: 10,
      page_index: 1
    },
    filtersRecord: {
      status: ''
    },
    tableDataRecord: [],
    paginationProductDetail: {
      sizes: [10, 20, 50, 100],
      page_size: 10,
      page_index: 1
    },
    filtersProductDetail: {
      status: ''
    },
    tableDataProductDetail: [],
    parentRowData: {}
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getProductSkuExcelPage ({commit, state}, payload) {
      const {paginationRecord, filtersRecord} = payload
      let loading = this._vm.$loading({
        target: '.TableUploadFileRecord'
      })
      const data = {
        'total': 1,
        'item_list': mockData
      }
      await sleep(500)
      paginationRecord.total = data.total
      commit('save', {
        paginationRecord,
        filtersRecord,
        tableDataRecord: data.item_list
      })
      loading && loading.close()
      this.dispatch('moving/skuImport/getperprogress', data.item_list)
    },
    async getperprogress ({commit, state}, payload) {
      const runingsIds = payload.filter(item => item.status === 'running').map(item => item.id)
      if (!runingsIds.length) return false
      console.log(runingsIds)
      // const progressIds = await Api.hhgjAPIs.getProductSkuExcelProgressQuery({
      //   id_list: runingsIds
      // })
      await sleep(500)
      const progressData = [{
        'id': 1,
        'status': 'running',
        'success_nums': 10,
        'fail_nums': 5,
        'percent': 36
      }]
      const tableDataRecord = state.tableDataRecord.map(originItem => {
        const progressItem = progressData.find(progressItem => progressItem.id === originItem.id)
        if (!progressItem) return originItem
        return Object.assign(originItem, progressItem)
      })
      console.log(tableDataRecord)
      commit('save', {
        progressData,
        tableDataRecord
      })
      // setTimeout(() => {
      //   this.dispatch('moving/skuImport/getperprogress', progressData)
      // }, 500)
    },
    async getProductSkuExcelDetailPage ({commit, state}, payload) {
      const {paginationProductDetail, filtersProductDetail} = payload
      console.log(payload)
      let loading = this._vm.$loading({
        target: '.TableProductDetail'
      })
      const data = {
        'total': 1,
        'item_list': [
          {
            'sku_img_url': 'https://cbu01.alicdn.com/img/ibank/2020/007/991/23243199700_1272321945.jpg',
            'goods_name': '商品名',
            'sku_spec_names': '黄色,大',
            'sku_code': '111',
            'fail_reason': '商品未找到',
            'status': 'running',
            'dy_product_id': '123124234'
          }
        ]
      }
      console.log(data)
      await sleep(500)
      paginationProductDetail.total = data.total
      commit('save', {
        paginationProductDetail,
        filtersProductDetail,
        tableDataProductDetail: data.item_list
      })
      loading && loading.close()
    },

    changeActive  ({commit, state}, payload) {
      commit('save', payload)
      this.dispatch('moving/shopsBand/getTabData', state.mapData[payload.active])
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
