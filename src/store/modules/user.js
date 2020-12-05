
import Api from '@/api/apis'
import * as types from '../types'
import moment from 'moment'

const state = {
  name: localStorage.getItem('owner_name') || '',
  ownerId: localStorage.getItem('owner_id') || '',
  shopName: localStorage.getItem('shop_name') || '',
  loginNum: localStorage.getItem('login_num') || 0,
  token: localStorage.getItem('token') || '',
  fakeToken: localStorage.getItem('fake_token') || false,
  isAuth: JSON.parse(localStorage.getItem('is_auth')) || false,
  exportFields: localStorage.getItem('export_fields'),
  syncStatus: {
    status: '',
    last_sync_time: ''
  },
  haveSyncedOrder: false,
  syncOrderStatus: {
    last_sync_order_time: ''
  },
  currentSubsc: {
    'is_subsc': false,
    'item_name': '',
    'item_level': 0,
    'deadline': '',
    'goods_assess_notify': {}
  },
  updateJobIdList: (localStorage.getItem('update_job_id_list') ? localStorage.getItem('update_job_id_list').split(',') : [])
}

const getters = {
  getName: state => state.name,
  getShopName: state => state.shopName,
  getToken: state => state.token,
  getTokenHeaders: state => {
    if (state.fakeToken) {
      return { 'token': state.token, 'fake-token': state.fakeToken }
    }
    if (state.token) {
      return { 'token': state.token }
    }
    return {}
  },
  getIsAuth: state => state.isAuth,
  getFakeToken: state => state.fakeToken,
  getSyncStatus: state => state.syncStatus,
  getSyncOrderStatus: state => state.syncOrderStatus,
  getCurrentSubsc: state => state.currentSubsc,
  getExportFields: state => state.exportFields,
  getUpdateJobIdList: state => state.updateJobIdList
}

const actions = {
  requestToken ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getAccessToken(params).then(data => {
        if (data !== null) {
          data.isAuth = true
          commit(types.SET_USER, data)
          resolve(data)
        } else {
          reject(new Error('接口数据出错'))
        }
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  fakeUser ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.fakeUser(params).then(data => {
        if (data !== null) {
          data.isAuth = true
          commit(types.SET_USER, data)
          resolve(data)
        } else {
          reject(new Error('接口数据出错'))
        }
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  logout ({commit, state}) {
    commit(types.LOGOUT)
  },
  requestUserInfo ({commit, state, dispatch}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getUserInfo(params).then(data => {
        if (data.user) {
          commit(types.SET_USER, data.user)
        }
        if (data.subscribe) {
          commit(types.SET_CURRENT_SUBSC, data.subscribe)
        }
        if (data.sync_status) {
          commit(types.SET_SYNC_STATUS, data.sync_status)
        }
        if (data.sync_order_status) {
          commit(types.SET_SYNC_ORDER_STATUS, data.sync_order_status)
          if (!state.haveSyncedOrder &&
            state.syncOrderStatus.last_sync_order_time < moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
          ) {
            state.haveSyncedOrder = true
            dispatch('requestSyncOrders', {})
          }
        }
        if (data) {
          resolve(data)
        }
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  requestSyncProducts ({commit, state, dispatch}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.syncProducts(params).then(data => {
        if (data !== null) {
          commit(types.SET_SYNC_STATUS, {
            status: 'ready',
            last_sync_time: state.syncStatus.last_sync_time
          })
          dispatch('updateSyncStatus', params)
        } else {
          reject(new Error('接口数据出错'))
        }
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  requestSyncOrders ({commit, state, dispatch}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.syncOrders(params).then(data => {
        if (data !== null) {
          commit(types.SET_SYNC_ORDER_STATUS, {
            last_sync_order_time: state.syncStatus.last_sync_order_time
          })
        } else {
          reject(new Error('接口数据出错'))
        }
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  updateSyncStatus ({commit, state}) {
    Api.hhgjAPIs.getSyncStatus({}).then(data => {
      commit(types.SET_SYNC_STATUS, data)
    })
  },
  setExportFields ({commit, state}, data) {
    commit(types.SET_EXPORT_FIELDS, data)
    localStorage.setItem('export_fields', state.exportFields)
  },
  requestOperate ({commit, state, dispatch}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.operate(params).then(data => {
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  },
  addUpdateJobId ({commit, state}, jobId) {
    state.updateJobIdList.push(jobId)
    localStorage.setItem('update_job_id_list', state.updateJobIdList)
  },
  deleteUpdateJobId ({commit, state}, jobId) {
    let index = -1
    for (let i = 0; i < state.updateJobIdList.length; ++i) {
      if (state.updateJobIdList[i] === jobId) {
        index = i
        break
      }
    }
    if (index >= 0) {
      state.updateJobIdList.splice(index, 1)
    }
    localStorage.setItem('update_job_id_list', state.updateJobIdList)
  }
}

const mutations = {
  [ types.SET_USER ] (state, data) {
    if (data.token) {
      localStorage.setItem('token', data.token)
      state.token = data.token
    }
    if (data.app_key) {
      localStorage.setItem('app_key', data.app_key)
      state.app_key = data.app_key
    }
    if (data.owner_name) {
      localStorage.setItem('owner_name', data.owner_name)
      state.name = data.owner_name
    }
    if (data.owner_id) {
      localStorage.setItem('owner_id', data.owner_id)
      state.ownerId = data.owner_id
    }
    if (data.shop_name) {
      localStorage.setItem('shop_name', data.shop_name)
      state.shopName = data.shop_name
    }
    if (data.login_num) {
      localStorage.setItem('login_num', data.login_num)
      state.loginNum = data.login_num
    }
    if (data.expire_time) {
      localStorage.setItem('expire_time', data.expire_time)
    }
    if (data.isAuth) {
      localStorage.setItem('is_auth', data.isAuth)
      state.isAuth = data.isAuth
    }
    if (data.fake_token) {
      localStorage.setItem('fake_token', data.fake_token)
      state.fakeToken = data.fake_token
    }
  },
  [ types.LOGOUT ] (state) {
    localStorage.removeItem('token')
    localStorage.removeItem('owner_name')
    localStorage.removeItem('owner_id')
    localStorage.removeItem('shop_name')
    localStorage.removeItem('login_num')
    localStorage.removeItem('expire_time')
    localStorage.removeItem('is_auth')
    localStorage.removeItem('fake_token')
    state.name = ''
    state.ownerId = ''
    state.shopName = ''
    state.loginNum = 0
    state.token = ''
    state.isAuth = false
    state.fake_token = ''
  },
  [ types.SET_CURRENT_SUBSC ] (state, data) {
    if (data.is_subsc) {
      state.currentSubsc = {
        'is_subsc': true,
        'item_name': data.item_name,
        'item_level': data.item_level,
        'deadline': data.deadline,
        'goods_assess_notify': data.goods_assess_notify
      }
    }
  },
  [ types.SET_SYNC_STATUS ] (state, data) {
    state.syncStatus = data
  },
  [ types.SET_SYNC_ORDER_STATUS ] (state, data) {
    state.syncOrderStatus = data
  },
  [ types.SET_EXPORT_FIELDS ] (state, data) {
    state.exportFields = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
