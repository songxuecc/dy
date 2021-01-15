import shopsBand from './shopsBand'
import migrateSettingTemplate from './migrateSettingTemplate'

const modules = {
  moving: {
    namespaced: true,
    modules: {
      shopsBand,
      migrateSettingTemplate
    }
  }
}
export default modules
