import migrateSettingTemplate from './migrateSettingTemplate'
import skuImport from './skuImport'
import readyToMigrate from './readyToMigrate'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      skuImport,
      readyToMigrate
    }
  }
}
export default modules
