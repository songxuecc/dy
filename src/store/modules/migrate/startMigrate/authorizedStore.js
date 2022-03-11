import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import services from '@services'

const model = modelExtend(
  createBaseModel({
    fetch: services.userBindCloudGoodsPage
  }),
  {
    namespaced: true,
    state: () => ({
      pagination: {
        page_size: 10,
        page_index: 1
      },
      tableData: []
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        const data = await dispatch('query', { ...payload })
        console.log(data, 'data')
        const tableData = ((data && data.tableData) || []).map(item => ({...item, ...item.ext_json}))
        console.log(tableData)
        // const tableData = []
        // const tableData = [
        //   {
        //     shop_name: 'shop_name',
        //     shop_platform: 'shop_platform',
        //     name: 'name',
        //     create_time: 'create_time'
        //   }
        // ]
        commit('save', {
          tableData
        })
      }
    },
    getters: {
    }
  })

export default model
