import migrateSetting from './migrateSetting'
import migrateSettingPrice from './migrateSettingPrice'
import migrateSettingTemplate from './migrateSettingTemplate'
import readyToMigrate from './readyToMigrate'
import startMigrate from './startMigrate'
import refershCategoryBtn from './refershCategoryBtn'
import migrateSettingAndStartCopy from './migrateSettingAndStartCopy'

const modules = {
  migrate: {
    namespaced: true,
    modules: {
      migrateSettingTemplate,
      readyToMigrate,
      migrateSetting,
      migrateSettingPrice,
      startMigrate,
      refershCategoryBtn,
      migrateSettingAndStartCopy
    }
  }
}
export default modules
