import migrateSettingTemplate from './migrateSettingTemplate'
import skuImport from './skuImport'
import readyToMigrate from './readyToMigrate'
import migrateSettingPrice from './migrateSettingPrice'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      skuImport,
      readyToMigrate,
      migrateSettingPrice
    }
  }
}
export default modules
