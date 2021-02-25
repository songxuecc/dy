import migrateSettingTemplate from './migrateSettingTemplate'
import skuImport from './skuImport'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      skuImport
    }
  }
}
export default modules
