import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'
const model = modelExtend(
  createBaseModel({
    fetch: servises.productSourceSyncDetailPage
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
        await dispatch('query', payload)
        console.log(state.tableData)
      }
    },
    getters: {
    }
  })

export default model
