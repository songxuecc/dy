import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableDataDetail = listModel('productList')
const tableHhTaskProductOverview = listModel('hhTaskProductOverview')
const tableHhTaskPage = listModel('hhTaskPage')
const tableHhTaskProductPage = listModel('hhTaskProductPage')

const model = assign(tableDataDetail, tableHhTaskPage, tableHhTaskProductPage, tableHhTaskProductOverview, {
  namespaced: true,
  state: () => ({
    jobs: [],
    poolingLoading: false,
    previewDeleteGoodsIds: [],
    stopGetperprogress: false,
    getperprogressTimer: null
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async fetchProductList ({commit, state, dispatch}, payload) {
      try {
        await dispatch('productListFetch', {
          apiName: 'getProductList',
          ...payload
        })
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    },
    async fetchHhTaskProductOverview ({commit, state, dispatch}, payload) {
      try {
        await dispatch('hhTaskProductOverviewFetch', {
          apiName: 'hhTaskProductOverview',
          ...payload
        })
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    },
    async setFilterHhTaskProductOverview ({commit, state, dispatch}, payload) {
      try {
        await dispatch('hhTaskProductOverviewSetFilter', {
          apiName: 'hhTaskProductOverview',
          ...payload
        })
      } catch (err) {
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    },
    async fetchHhTaskPage ({commit, state, dispatch}, payload) {
      await dispatch('hhTaskPageFetch', {
        apiName: 'hhTaskPage',
        ...payload
      })
      console.log('执行了111')
      clearTimeout(state.getperprogressTimer)
      commit('save', {
        stopGetperprogress: false,
        getperprogressTimer: null
      })
      dispatch('getperprogress')
    },
    async fetchHhTaskProductPage ({commit, state, dispatch}, payload) {
      await dispatch('hhTaskProductPageFetch', {
        apiName: 'hhTaskProductPage',
        ...payload
      })

      const hhTaskProductPageTableData = state.hhTaskProductPageTableData.map((item, id) => {
        if (item.ext_json && item.ext_json.sku_list) {
          item.ext_json.sku_list = item.ext_json.sku_list.map((item, id) => ({
            ...item,
            id
          }))
        }
        return Object.assign(
          item,
          item.ext_json
        )
      })

      commit('save', { hhTaskProductPageTableData })
    },
    saveDelete ({commit, state, dispatch}, payload) {
      const previewDeleteGoodsIds = [...state.previewDeleteGoodsIds, payload]
      const hhTaskProductOverviewTableData = state.hhTaskProductOverviewTableData.filter(item => !previewDeleteGoodsIds.includes(item.goods_id))
      commit('save', {
        previewDeleteGoodsIds,
        hhTaskProductOverviewTableData
      })
    },
    async updateProduct ({commit, state, dispatch}, payload) {
      try {
        const parmas = {...payload, delete_goods_id_list: JSON.stringify(state.previewDeleteGoodsIds)}
        await Api.hhgjAPIs.hhTaskCreate(parmas)
        this._vm.$message({
          message: `批量修改开始,请点击查看修改记录`,
          type: 'success'
        })
      } catch (err) {
        this._vm.$message({
          message: `批量失败`,
          type: 'error'
        })
      }
    },
    async getperprogress ({commit, state, dispatch}) {
      clearTimeout(state.getperprogressTimer)
      commit('save', {
        getperprogressTimer: null
      })
      const runingsIds = state.hhTaskPageTableData.filter(item => item.status === 1).map(item => item.task_id).filter(item => item)
      if (!runingsIds.length || state.stopGetperprogress) return false
      try {
        const progressData = await Api.hhgjAPIs.hhTaskProgressQuery({
          id_list: JSON.stringify(runingsIds)
        })
        const hhTaskPageTableData = state.hhTaskPageTableData.map(originItem => {
          const progressItem = progressData.find(progressItem => progressItem.id === originItem.task_id)
          if (progressItem) {
            return {...originItem, ...progressItem}
          } else {
            return originItem
          }
        })
        commit('save', {
          hhTaskPageTableData
        })
        const getperprogressTimer = setTimeout(() => {
          dispatch('getperprogress')
        }, 2000)
        commit('save', {
          getperprogressTimer
        })
      } catch (err) {
        clearTimeout(state.getperprogressTimer)
        this._vm.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    }
  },
  getters: {
  }
})

export default model
