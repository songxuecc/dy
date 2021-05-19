import skuImport from './skuImport'
import batchEdit from './batchEdit'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      batchEdit
    }
  }
}
export default modules
