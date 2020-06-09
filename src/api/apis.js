import api from './index'

const hhgjAPIs = {
  getRegister: (params) => {
    return api.actionCreatorPost('/api/account/register', params)
  },
  getLogin: (params) => {
    return api.actionCreatorPost('/api/account/login', params)
  },
  getUserInfo: (params) => {
    return api.actionCreatorPost('/api/account/getUserInfo', params)
  },
  getBindApp: (params) => {
    return api.actionCreatorPost('/api/account/bindApp', params)
  },
  getAccessToken: (params) => {
    return api.actionCreatorPost('/api/getAccessToken', params)
  },
  getNotification: (params) => {
    return api.actionCreatorPost('/api/getNotification', params)
  },
  fakeUser: (params) => {
    return api.actionCreatorPost('/api/fakeUser', params)
  },
  getCategoryList: (params) => {
    return api.actionCreatorPost('/api/getCategoryList', params)
  },
  searchCategory: (params) => {
    return api.actionCreatorPost('/api/searchCategory', params)
  },
  getCategoryDetail: (params) => {
    return api.actionCreatorPost('/api/getCategoryDetail', params)
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
  migrate: (params) => {
    return api.actionCreatorPost('/api/migrate', params)
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
    return api.actionCreatorPost('/api/genProductExcel', params)
  },
  getProductExcelProgress: (params) => {
    return api.actionCreatorPost('/api/getProductExcelProgress', params)
  },
  getExcelDownloadUrl: (params) => {
    return api.actionCreatorPost('/api/getExcelDownloadUrl', params)
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
  getWaterMarkActivityList: (params) => {
    return api.actionCreatorPost('/api/getWaterMarkActivityList', params)
  },
  getWMActivityProductList: (params) => {
    return api.actionCreatorPost('/api/getWMActivityProductList', params)
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
  }
}

export default {
  hhgjAPIs
}
