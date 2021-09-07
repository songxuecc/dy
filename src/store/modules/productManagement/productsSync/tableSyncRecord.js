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
        // console.log(state, 'data-tableSyncRecord')

        const data = {
          'msg': 'succ',
          'code': 0,
          'data': {
            'item_list': [
              {
                'task_id': 1,
                'task_title': '计划标题',
                'sync_type': 1,
                'total_nums': 20,
                'success_nums': 15,
                'fail_nums': 5,
                'status': 0,
                'last_sync_time': '2021-09-01 15:20:11'
              }

            ],
            'total': 1
          }
        }

        console.log(data.data, 'data.data')

        commit('save', {
          tableData: data.data.item_list
        })
      }
    },
    getters: {
    }
  })

export default model
