import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.getProductList
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 10,
        page_index: 1
      },
      tableDataMap: new Map()
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
      }
    },
    getters: {

    }
  })

export default model
