import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.getProductList
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 10,
        page_index: 1
      },
      selectParmas: undefined,
      form: undefined,
      originFilters: undefined,
      filters: undefined,
      task_id: undefined,
      multipleSelection: undefined,
      tableDataMap: undefined
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        const data = await dispatch('query', { ...payload })
        console.log(data, 'data')
      },
      clear ({commit, state, dispatch}, payload) {
        commit('save', {
          selectParmas: undefined,
          form: undefined,
          originFilters: undefined,
          filters: undefined,
          task_id: undefined,
          multipleSelection: undefined,
          tableDataMap: undefined
        })
      }
    },
    getters: {

    }
  })

export default model
