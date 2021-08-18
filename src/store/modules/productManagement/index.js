import skuImport from './skuImport'
import batchEdit from './batchEdit'
import productsSync from './productsSync'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      batchEdit,
      ...productsSync
    }
  }
}
export default modules
