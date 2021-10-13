import createBaseModel from '@commonModels/createBaseModel.js'
import modelExtend from '@commonModels/modelExtend.js'
// import servises from '@servises'

const model = modelExtend(
  createBaseModel({
    // fetch: servises.getProductList
  }),
  {
    namespaced: true,
    state: () => ({
      bundle_list: []
    }),
    actions: {

    },
    getters: {
      categoryOptions: state => {
        const tableDatas = (state.bundle_list || []).reduce((target, item) => {
          return [...target, ...item.sku_list]
        }, [])
        return (tableDatas || []).map(tableData => {
          return ({
            category_leaf_id: tableData.category_leaf_id,
            category_show: tableData.category_show,
            product_id: tableData.tp_id
          })
        })
      }
    }
  })
export default model
