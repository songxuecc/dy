import migrateSetting from './migrateSetting'
import migrateSettingPrice from './migrateSettingPrice'
import migrateSettingTemplate from './migrateSettingTemplate'
import readyToMigrate from './readyToMigrate'
import startMigrate from './startMigrate/index'
import refershCategoryBtn from './refershCategoryBtn'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      readyToMigrate,
      migrateSetting,
      migrateSettingPrice,
      startMigrate,
      refershCategoryBtn
    }
  }
}
export default modules
