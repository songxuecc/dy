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
        // let data = [{'tp_name': '\u6296\u97f3', 'capture_id': '12461027', 'shop_name': '\u58f9\u53f7\u7403\u5bb6\u5c45\u4e13\u8425\u5e97'}, {'tp_name': '\u6296\u97f3', 'capture_id': '12461027', 'shop_name': '\u58f9\u53f7\u7403\u5bb6\u5c45\u4e13\u8425\u5e97'}, {'capture_id': '12482483', 'shop_name': '\u5357\u96c5\u96c6  \u539f\u521b', 'tp_name': '\u6dd8\u5b9d'}]
        if (data.length) {
          data.forEach(item => {
            const handleClick = (e, captureId) => {
              e.preventDefault()
              console.log(payload, 'payload')
              payload.push({
                path: '/migrate/productList',
                query: {
                  captureId
                }
              })
            }
            const h = this._vm.$createElement
            setTimeout(() => {
              const ref = this._vm.$notify({
                message: h('div', null, [
                  h('div', {
                    style: {'font-size': '12px'}
                  }, `恭喜，【${item.tp_name}】平台【${item.shop_name}】店铺已全部抓取完毕，您可以前往进行下一步操作`),
                  h('div', {
                    style: {
                      'margin-top': '5px'
                    }
                  }, [
                    h('el-button', {
                      props: {
                        type: 'primary',
                        plain: 'true',
                        size: 'small'
                      },
                      on: {
                        click: () => this._vm.$nextTick(() => {
                          ref && ref.close()
                        })
                      }
                    }, `我知道了`),
                    h('el-button', {
                      props: {
                        type: 'primary',
                        size: 'small'
                      },
                      on: {
                        click: (e) => handleClick(e, item.capture_id)
                      }
                    }, `前往操作`)
                  ])

                ]),
                type: 'success',
                duration: 0
              })
            }, 100)
          })
        } else {
          const timer = setTimeout(() => {
            clearTimeout(state.timer)
            commit('save', {timer: null})
            dispatch('getCaptureShopCompleteList', payload)
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
