import modelExtend from '../../modelExtends'
import listModel from '../../commonModels/listModel'

const model2 = {
  namespaced: true,
  state: () => ({
    test2: '2222'
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    change ({commit, state}) {
      // commit('save', {
      //   test2: '2222-2'
      // })
    }
  },
  getters: {
  }
}

const tableData = listModel()
const tableData1 = listModel('table1')
const tableData2 = listModel('table2')
const model = modelExtend(tableData, tableData1, tableData2, model2)

console.log(model)
export default model
