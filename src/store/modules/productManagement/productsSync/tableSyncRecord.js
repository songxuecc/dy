import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.productSourceSyncPage
  }),
  {
    namespaced: true,
    state: () => ({
      stopGetperprogress: false,
      getperprogressTimer: null
    }),
    actions: {
      async fetch ({commit, state, dispatch}, payload) {
        await dispatch('query', { ...payload })
        clearTimeout(state.getperprogressTimer)
        commit('save', {
          stopGetperprogress: false,
          getperprogressTimer: null
        })
        dispatch('getperprogress')
      },
      async getperprogress ({commit, state, dispatch}) {
        clearTimeout(state.getperprogressTimer)
        commit('save', {
          getperprogressTimer: null
        })
        const runingsIds = state.tableData.filter(item => item.status === 1).map(item => item.task_id).filter(item => item)
        if (!runingsIds.length || state.stopGetperprogress) return false
        try {
          const progressData = await servises.productSourceSyncProgressQuery({
            id_list: JSON.stringify(runingsIds)
          })
          const tableData = state.tableData.map(originItem => {
            const progressItem = progressData.find(progressItem => progressItem.id === originItem.task_id)
            if (progressItem) {
              return {...originItem, ...progressItem}
            } else {
              return originItem
            }
          })
          commit('save', {
            tableData
          })
          const getperprogressTimer = setTimeout(() => {
            dispatch('getperprogress')
          }, 2000)
          commit('save', {
            getperprogressTimer
          })
        } catch (err) {
          clearTimeout(state.getperprogressTimer)
          this._vm.$message({
            message: `${err}`,
            type: 'error'
          })
        }
      }
    },
    getters: {
    }
  })

export default model
