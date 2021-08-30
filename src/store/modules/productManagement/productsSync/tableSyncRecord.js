import {createBaseModel} from '@commonModels/baseModel.js'
import assign from '@commonModels/assign.js'
import servises from '@servises'

const model = assign(createBaseModel({
  fetch: servises.hhTaskPage,
  pagination: {
    page_size: 15,
    page_index: 1
  }
}), {
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
