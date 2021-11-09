import skuImport from './skuImport'
import batchEdit from './batchEdit'
import productsSync from './productsSync'
import combination from './combination'
import cycleProductsSelf from './cycleProductsSelf'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      batchEdit,
      ...productsSync,
      ...combination,
      ...cycleProductsSelf
    }
  }
}
export default modules
