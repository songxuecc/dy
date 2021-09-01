import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.hhTaskPage
  }),
  {
    namespaced: true,
    state: () => ({
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
        console.log(state, 'data-tableSyncRecord')
      }
    },
    getters: {
    }
  })

export default model
