import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.userAccountFlowPage
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
        const tableData = (data.item_list || []).map(item => {
          item.amount = `${item.amount / 100} 元`
          return item
        })
        commit('save', {tableData})
      }
    },
    getters: {

    }
  })

export default model
