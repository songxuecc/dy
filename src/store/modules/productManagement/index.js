import skuImport from './skuImport'
import batchEdit from './batchEdit'
import productsSync from './productsSync'
import combination from './combination'
import cycleProductsSelf from './cycleProductsSelf'
import productQualityScore from './productQualityScore'
import detectDuplicateProducts from './detectDuplicateProducts'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      batchEdit,
      ...productsSync,
      ...combination,
      ...cycleProductsSelf,
      ...productQualityScore,
      ...detectDuplicateProducts
    }
  }
}
export default modules
