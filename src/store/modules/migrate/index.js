import shopsBand from './shopsBand'
import migrateSettingTemplate from './migrateSettingTemplate'
import skuImport from './skuImport'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      shopsBand,
      migrateSettingTemplate,
      skuImport
    }
  }
}
export default modules
