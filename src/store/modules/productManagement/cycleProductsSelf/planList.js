import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.productAutoShelfPage
  }),
  {
    namespaced: true,
    state: () => ({
      stopGetperprogress: false,
      getperprogressTimer: null,
      prevStep: -1
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
        clearTimeout(state.getperprogressTimer)
        commit('save', {
          stopGetperprogress: false,
          getperprogressTimer: null
        })
      }
    },
    getters: {
    }
  })

export default model
