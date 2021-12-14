import tableProductList from './tableProductList'

const modules = {
  productQualityScore: {
    namespaced: true,
    modules: {
      tableProductList
    },
    state: () => ({
    }),
    actions: {
    //   async getOverview ({commit, state, dispatch}, payload) {
    //     const data = await servises.productQualityScoreOverview()
    //     commit({

    //     })
    //   }
    }
  }
}

export default modules
