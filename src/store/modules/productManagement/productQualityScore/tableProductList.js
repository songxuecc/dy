import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.productQualityScoreList
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
        console.log(payload, 'payload')
        await dispatch('query', { ...payload })
      }
    },
    getters: {

    }
  })

export default model
