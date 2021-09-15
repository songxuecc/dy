import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.productSourceSyncPage
  }),
  {
    namespaced: true,
    state: () => ({
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
