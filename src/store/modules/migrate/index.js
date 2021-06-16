import migrateSetting from './migrateSetting'
import migrateSettingPrice from './migrateSettingPrice'
import migrateSettingTemplate from './migrateSettingTemplate'
import readyToMigrate from './readyToMigrate'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      readyToMigrate,
      migrateSetting,
      migrateSettingPrice
    }
  }
}
export default modules
