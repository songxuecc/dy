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
      selectParmas: undefined,
      form: undefined
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
      },
      clear ({commit, state, dispatch}, payload) {
        commit('save', {
          selectParmas: undefined,
          form: undefined,
          originFilters: undefined,
          filters: undefined
        })

        console.log(state, 'state')
      }
    },
    getters: {

    }
  })

export default model
