import baseModel from '@commonModels/baseModel.js'
import assign from '@commonModels/assign.js'
import servises from '@servises'

const model = assign(baseModel({
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
      const data = await dispatch('query', { ...payload })
      console.log(data, 'data-tableSyncRecord')
    }
  },
  getters: {
  }
})

export default model
