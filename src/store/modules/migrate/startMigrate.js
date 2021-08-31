import Api from '@/api/apis'

import assign from '../../commonModels/assign'
import listModel from '../../commonModels/listModel'

const tableData = listModel()

// 店铺绑定
export default assign(tableData, {
  namespaced: true,
  state: () => ({
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async fetchDetail ({commit, state, dispatch}, payload) {
      await dispatch('fetch', {
        apiName: 'captureShopPage',
        ...payload
      })
    },
    async deleteCaptureId ({commit, state, dispatch}, payload) {
      try {
        await Api.hhgjAPIs.captureShopPageDelete(payload)
        this._vm.$message.success(`删除成功`)
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
    },
    async getCaptureShopCompleteList ({commit, state, dispatch}, payload) {
      try {
        const data = await Api.hhgjAPIs.getCaptureShopCompleteList()
        if (data.length) {
          let msg = ''
          data.forEach(item => {
            msg += `<div>恭喜，【${item.tp_name}】平台【${item.shop_name}】店铺已全部抓取完毕，您可以前往进行下一步操作</div>`
          })
          this._vm.$message({
            type: 'success',
            dangerouslyUseHTMLString: true,
            message: msg
          })
        } else {
          const timer = setTimeout(() => {
            clearTimeout(state.timer)
            commit('save', {timer: null})
            dispatch('getCaptureShopCompleteList')
          }, 10000)
          commit('save', {timer})
        }
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
})
