import tableSyncRecord from './tableSyncRecord'
import drawerSyncDetail from './drawerSyncDetail'
import tableProductList from './TableProductList'

const modules = {
  productsSync: {
    namespaced: true,
    modules: {
      tableSyncRecord,
      drawerSyncDetail,
      tableProductList
    }
  }
}

export default modules
