import migrateSetting from './migrateSetting'
import migrateSettingPrice from './migrateSettingPrice'
import migrateSettingTemplate from './migrateSettingTemplate'
import readyToMigrate from './readyToMigrate'
import startMigrate from './startMigrate'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      readyToMigrate,
      migrateSetting,
      migrateSettingPrice,
      startMigrate
    }
  }
}
export default modules
