import skuImport from './skuImport'
import test from './test'

const modules = {
  productManagement: {
    namespaced: true,
    modules: {
      skuImport,
      test
    }
  }
}
export default modules
