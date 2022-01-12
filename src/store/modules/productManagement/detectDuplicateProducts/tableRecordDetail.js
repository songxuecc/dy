import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.hhTaskProductPage
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
        const data = await dispatch('query', { ...payload })
        const tableData = data.tableData.map(item => {
          if (item.ext_json && item.ext_json.sku_list) {
            item.ext_json.sku_list = item.ext_json.sku_list.map((item, id) => ({
              ...item,
              id
            }))
          }
          return Object.assign(
            item,
            item.ext_json
          )
        })
        console.log(tableData, 'tableData')
        commit('save', { tableData })
      }
    },
    getters: {

    }
  })

export default model
