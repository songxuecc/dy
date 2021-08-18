import tableSyncRecord from './tableSyncRecord'
import drawerSyncDetail from './drawerSyncDetail'

const modules = {
  productsSync: {
    namespaced: true,
    modules: {
      tableSyncRecord,
      drawerSyncDetail
    }
  }
}
export default modules
