import detectProductList from './detectProductList'
import tableRecordDetail from './tableRecordDetail'
import tableRecord from './tableRecord'

const modules = {
  detectDuplicateProducts: {
    namespaced: true,
    modules: {
      detectProductList,
      tableRecordDetail,
      tableRecord
    }
  }
}

export default modules
