import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.productRepeatGoodsGroupPage
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 10,
        page_index: 1
      }
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        const data = await dispatch('query', { ...payload })
        const tableData = data.tableData.map(item => {
          item.goods_list = item.goods_list.map((goods, index) => {
            goods.index = index
            goods.is_checked = Boolean(goods.is_checked)
            return goods
          })
          return item
        })
        console.log(data, 'data')
        commit('save', {tableData})
      }
    },
    getters: {

    }
  })

export default model
