import skuImport from './skuImport'
import batchEdit from './batchEdit'
import productsSync from './productsSync'
import combination from './combination'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      batchEdit,
      ...productsSync,
      ...combination
    }
  }
}
export default modules
