import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    fetch: servises.productAutoShelfPage
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
            task_id_list: JSON.stringify(runingsIds)
          })
          const tableData = state.tableData.map(originItem => {
            const progressItem = progressData.find(progressItem => progressItem.task_id === originItem.task_id)
            if (progressItem) {
              // 同步完成时间 替换 上一次同步完成时间
              progressItem.last_sync_time = progressItem.sync_complete_time
              return {...originItem, ...progressItem}
            } else {
              return originItem
            }
          })

          if (progressData.every(item => [2, 3].includes(item.status))) {
            clearTimeout(state.getperprogressTimer)
            commit('save', {
              getperprogressTimer: null
            })
            this._vm.$message({
              message: `全部检测完毕了！`,
              type: 'success'
            })
          } else {
            const getperprogressTimer = setTimeout(() => {
              dispatch('getperprogress')
            }, 2000)
            commit('save', {
              getperprogressTimer
            })
          }
          commit('save', {
            tableData
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

console.log(model, 'model')
export default model
