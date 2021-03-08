import shopsBand from './shopsBand'
import paidRecharge from './paidRecharge'

const modules = {
  customerSetting: {
    namespaced: true,
    modules: {
      shopsBand,
      paidRecharge
    }
  }
}
export default modules
