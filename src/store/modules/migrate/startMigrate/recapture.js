import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.getTPProductList
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 100,
        page_index: 1
      }
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        const data = await dispatch('query', { ...payload })
        console.log(data, 'data')
      }
    },
    getters: {

    }
  })

export default model
