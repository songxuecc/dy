import planList from './planList'
import chooseProducts from './chooseProducts'
import createPlan from './createPlan'
import planDetail from './planDetail'

const modules = {
  cycleProductsSelf: {
    namespaced: true,
    modules: {
      planList,
      chooseProducts,
      createPlan,
      planDetail
    },
    state: () => ({
    })
  }
}

export default modules
