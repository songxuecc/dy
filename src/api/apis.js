import api from './index'

// const mock = (url) => { // 接口调用mock数据
//   console.log('mock: ' + url)
//   return new Promise(function (resolve, reject) {
//     let response = require(`../mock/${url}`)
//     resolve(response.data)
//   })
// }

const hhgjAPIs = {
  getAccessToken: (params) => {
    return api.actionCreatorPost('/api/account/authorize', params)
  },
  getUserInfo: (params) => {
    return api.actionCreatorPost('/api/account/getUserInfo', params)
  },
  saveChannelInfo: (params) => {
    return api.actionCreatorPost('/api/saveChannelInfo', params)
  },
  getCategoryList: (params) => {
    return api.actionCreatorPost('/api/category/list', params)
  },
  getCategoryDetail: (params) => {
    return api.actionCreatorPost('/api/category/detail', params)
  },
  searchCategory: (params) => {
    return api.actionCreatorPost('/api/category/search', params)
  },
  getNotification: (params) => {
    return api.actionCreatorPost('/api/getNotification', params)
  },
  setNotificationStatus: (params) => {
    return api.actionCreatorPost('/api/setNotificationStatus', params)
  },
  fakeUser: (params) => {
    return api.actionCreatorPost('/api/fakeUser', params)
  },
  getTemplate: (params) => {
    return api.actionCreatorPost('/api/getTemplate', params)
  },
  updateTemplate: (params) => {
    return api.actionCreatorJsonPost('/api/updateTemplate', params)
  },
  getPddLogisticsTemplate: (params) => {
    return api.actionCreatorJsonPost('/api/getPddLogisticsTemplate', params)
  },
  capture: (params) => {
    return api.actionCreatorPost('/api/capture', params)
  },
  triggerShopCapture: (params) => {
    return api.actionCreatorPost('/api/triggerShopCapture', params)
  },
  getCaptureTPProductList: (params) => {
    return api.actionCreatorPost('/api/getCaptureTPProductList', params)
  },
  getCapture: (params) => {
    return api.actionCreatorPost('/api/getCapture', params)
  },
  getCaptureOptionList: (params) => {
    return api.actionCreatorPost('/api/getCaptureOptionList', params)
  },
  getCaptureList: (params) => {
    return api.actionCreatorPost('/api/getCaptureList', params)
  },
  getCaptureValidTPProductIdList: (params) => {
    return api.actionCreatorPost('/api/getCaptureValidTPProductIdList', params)
  },
  getTPProductList: (params) => {
    return api.actionCreatorPost('/api/getTPProductList', params)
  },
  getTPProductProperty: (params) => {
    return api.actionCreatorPost('/api/getTPProductProperty', params)
  },
  deleteTPProduct: (params) => {
    return api.actionCreatorPost('/api/deleteTPProduct', params)
  },
  updateTPProductProperty: (params) => {
    return api.actionCreatorPost('/api/updateTPProductProperty', params)
  },
  updateTPProductPicture: (params) => {
    return api.actionCreatorPost('/api/updateTPProductPicture', params)
  },
  updateTPProduct: (params) => {
    return api.actionCreatorPost('/api/updateTPProduct', params)
  },
  batchUpdateTPProduct: (params) => {
    return api.actionCreatorPost('/api/batchUpdateTPProduct', params)
  },
  batchUpdateCategory: (params) => {
    return api.actionCreatorPost('/api/batchUpdateCategory', params)
  },
  getShopBrandList: (params) => {
    return api.actionCreatorPost('/api/getShopBrandList', params)
  },
  migrate: (params) => {
    return api.actionCreatorPost('/api/migrate', params)
  },
  is_new_migrate: (params) => {
    return api.actionCreateGet('/api/migrate/is_new', params)
  },
  getTPProductByIds: (params) => {
    return api.actionCreatorPost('/api/getTPProductByIds', params)
  },
  getMigrateStatusStatistics: (params) => {
    return api.actionCreatorPost('/api/getMigrateStatusStatistics', params)
  },
  syncProducts: (params) => {
    return api.actionCreatorPost('/api/syncProducts', params)
  },
  getSyncStatus: (params) => {
    return api.actionCreatorPost('/api/getSyncStatus', params)
  },
  getProductList: (params) => {
    return api.actionCreatorPost('/api/getProductList', params)
  },
  getOnShelfStatus: (params) => {
    return api.actionCreateGet('/api/product/shelf/query', params)
  },
  setGoodsSaleStatus: (params) => {
    return api.actionCreatorPost('/api/setGoodsSaleStatus', params)
  },
  updateProduct: (params) => {
    return api.actionCreatorPost('/api/updateProduct', params)
  },
  getProductProperty: (params) => {
    return api.actionCreatorPost('/api/getProductProperty', params)
  },
  getUpdateProductRes: (params) => {
    return api.actionCreatorPost('/api/getUpdateProductRes', params)
  },
  getSubscItems: (params) => {
    return api.actionCreatorPost('/api/getSubscItems', params)
  },
  createOrder: (params) => {
    return api.actionCreatorPost('/api/createOrder', params)
  },
  getOrderInfo: (params) => {
    return api.actionCreatorPost('/api/getOrderInfo', params)
  },
  getMySubscOrder: (params) => {
    return api.actionCreatorPost('/api/getMySubscOrder', params)
  },
  payOrder: (params) => {
    return api.actionCreatorPost('/api/payOrder', params)
  },
  closeOrder: (params) => {
    return api.actionCreatorPost('/api/closeOrder', params)
  },
  selectFilter: (params) => {
    return api.actionCreatorPost('/api/selectFilter', params)
  },
  checkTitle: (params) => {
    return api.actionCreatorPost('/api/checkTitle', params)
  },
  startMatting: (params) => {
    return api.actionCreatorPost('/api/startMatting', params)
  },
  asynStartMatting: (params) => {
    return api.actionCreatorPost('/api/asynStartMatting', params)
  },
  startProductMatting: (params) => {
    return api.actionCreatorPost('/api/startProductMatting', params)
  },
  getWhiteBgProductList: (params) => {
    return api.actionCreatorPost('/api/getWhiteBgProductList', params)
  },
  saveProductWhiteBg: (params) => {
    return api.actionCreatorPost('/api/saveProductWhiteBg', params)
  },
  getMattingStatus: (params) => {
    return api.actionCreatorPost('/api/getMattingStatus', params)
  },
  furtherMatting: (params) => {
    return api.actionCreatorPost('/api/furtherMatting', params)
  },
  uploadBase64Image: (params) => {
    return api.actionCreatorPost('/api/uploadBase64Image', params)
  },
  uploadImage: (params) => {
    return api.actionCreatorPost('/api/uploadImage', params)
  },
  syncOrders: (params) => {
    return api.actionCreatorPost('/api/syncOrders', params)
  },
  getUnsalableProductList: (params) => {
    return api.actionCreatorPost('/api/getUnsalableProductList', params)
  },
  exportProductExcel: (params) => {
    return api.actionCreatorDownload('/api/exportProductExcel', params)
  },
  genProductExcel: (params) => {
    return api.actionCreatorPost('/api/product/excel/create', params)
  },
  getProductExcelProgress: (params) => {
    return api.actionCreatorPost('/api/getProductExcelProgress', params)
  },
  getExcelDownloadUrl: (params) => {
    return api.actionCreateGet('/api/product/excel/url/query', params)
  },
  getExcelFile: (params) => {
    return api.actionCreateGet('/api/product/excel/query', params)
  },
  syncProductOne: (params) => {
    return api.actionCreatorPost('/api/product/sync/create', params)
  },
  downloadExcel: (params) => {
    return api.actionCreatorDownload('/api/downloadExcel', params)
  },
  saveWaterMark: (params) => {
    return api.actionCreatorJsonPost('/api/saveWaterMark', params)
  },
  getWaterMarkList: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkList', params)
  },
  getWaterMark: (params) => {
    return api.actionCreatorPost('/api/getWaterMark', params)
  },
  getWaterMarkActivityList: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkActivityList', params)
  },
  getWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkActivity', params)
  },
  getWMActivityProductList: (params) => {
    return api.actionCreatorPost('/api/getWMActivityProductList', params)
  },
  addWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/addWaterMarkActivity', params)
  },
  updateWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/updateWaterMarkActivity', params)
  },
  deleteWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/deleteWaterMarkActivity', params)
  },
  stopWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/stopWaterMarkActivity', params)
  },
  copyWaterMarkActivity: (params) => {
    return api.actionCreatorPost('/api/copyWaterMarkActivity', params)
  },
  getUserWaterMarkImage: (params) => {
    return api.actionCreatorPost('/api/getUserWaterMarkImage', params)
  },
  deleteUserWaterMarkImage: (params) => {
    return api.actionCreatorPost('/api/deleteUserWaterMarkImage', params)
  },
  getWaterMarkMaterialList: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkMaterialList', params)
  },
  getWaterMarkProductList: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkProductList', params)
  },
  saveWaterMarkTemplate: (params) => {
    return api.actionCreatorJsonPost('/api/saveWaterMarkTemplate', params)
  },
  syncWaterMarkActivityStatus: (params) => {
    return api.actionCreatorPost('/api/syncWaterMarkActivityStatus', params)
  },
  deleteWaterMark: (params) => {
    return api.actionCreatorPost('/api/deleteWaterMark', params)
  },
  getProductsWithCaptured: (params) => {
    return api.actionCreatorPost('/api/getProductsWithCaptured', params)
  },
  setSourceSync: (params) => {
    return api.actionCreatorPost('/api/setSourceSync', params)
  },
  syncProductsBySource: (params) => {
    return api.actionCreatorPost('/api/syncProductsBySource', params)
  },
  getSyncSourceStatus: (params) => {
    return api.actionCreatorPost('/api/getSyncSourceStatus', params)
  },
  cancelSourceSync: (params) => {
    return api.actionCreatorPost('/api/cancelSourceSync', params)
  },
  operate: (params) => {
    return api.actionCreatorPost('/api/operate', params)
  },
  getMigrateSetting: (params) => {
    return api.actionCreateGet('/api/getMigrateSetting', params)
  },
  updateMigrateSetting: (params) => {
    return api.actionCreatorPost('/api/updateMigrateSetting', params)
  },
  createStatisticsEvent: (params) => {
    return api.actionCreatorPost('/api/statisticsEvent/create', params)
  },
  postBindSuthCodeCreate: (params) => {
    return api.actionCreatorPost('/api/user/bind/authCode/create', params)
  },
  postUserBindCreate: (params) => {
    return api.actionCreatorPost('/api/user/bind/create', params)
  },
  deleteUserBind: (params) => {
    return api.actionCreatorPost('/api/user/bind/delete', params)
  },
  getUserBindList: (params) => {
    return api.actionCreateGet('/api/user/bind/list', params)
  },
  postUserBindChange: (params) => {
    return api.actionCreatorPost('/api/user/bind/change', params)
  },
  getMigrateMultiShopProductList: (params) => {
    return api.actionCreateGet('/api/migrate/multiShop/product/list', params)
  },
  productListCheck: (params) => {
    return api.actionCreatorPost('/api/product/list/check', params)
  },
  syncDyUserCategory: (params) => {
    return api.actionCreatorPost('/api/category/sync/create', params)
  },
  realSyncDyUserCategory: (params) => {
    return api.actionCreatorPost('/api/category/real_sync/create', params)
  },
  getSyncDyUserCategory: (params) => {
    return api.actionCreateGet('/api/product/newCategory/sync/query', params)
  },
  getCostTemplateList: (params) => {
    return api.actionCreateGet('/api/product/costTemplate/list', params)
  },
  updateTpproductBrand: (params) => {
    return api.actionCreatorPost('/api/tpproduct/brand/update', params)
  },
  getProductSkuExcelPage: (params) => {
    return api.actionCreateGet('/api/product/sku/excel/page', params)
  },
  deleteProductSkuExcelPage: (params) => {
    return api.actionCreatorPost('/api/product/sku/excel/delete', params)
  },
  getProductSkuExcelProgressQuery: (params) => {
    return api.actionCreateGet('/api/product/sku/excel/progress/query', params)
  },
  getProductSkuExcelDetailPage: (params) => {
    return api.actionCreateGet('/api/product/sku/excel/detail/page', params)
  },
  getBlackWordList: (params) => {
    return api.actionCreateGet('/api/black_word/list', params)
  },
  createBlackWords: (params) => {
    return api.actionCreatorPost('/api/black_word/create', params)
  },
  deleteBlackWords: (params) => {
    return api.actionCreatorPost('/api/black_word/delete', params)
  },
  userAccountFlowCreate: (params) => {
    return api.actionCreatorPost('/api/user/account/flow/create', params)
  },
  thirdpartPayCreate: (params) => {
    return api.actionCreatorPost('/api/thirdpart/pay/create', params)
  },
  userAccountQuery: (params) => {
    return api.actionCreateGet('/api/user/account/query', params)
  },
  userAccountFlowQuery: (params) => {
    return api.actionCreateGet('/api/user/account/flow/query', params)
  },
  userAccountFlowList: (params) => {
    return api.actionCreateGet('/api/user/account/flow/list', params)
  },
  userAccountFlowPage: (params) => {
    return api.actionCreateGet('/api/user/account/flow/page', params)
  },
  userVersionQuery: (params) => {
    return api.actionCreateGet('/api/user/version/query', params)
  },
  userSettingQuery: (params) => {
    return api.actionCreateGet('/api/user/setting/query', params)
  },
  userSettingUpdate: (params) => {
    return api.actionCreatorPost('/api/user/setting/update', params)
  }
}

export default {
  hhgjAPIs
}
