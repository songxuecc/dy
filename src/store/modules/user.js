
import Api from '@/api/apis'
import * as types from '../types'
import moment from 'moment'

const state = {
  name: localStorage.getItem('owner_name') || '',
  phone: localStorage.getItem('owner_phone') || '',
  ownerId: localStorage.getItem('owner_id') || '',
  mallName: localStorage.getItem('mall_name') || '',
  loginNum: localStorage.getItem('login_num') || 0,
  token: localStorage.getItem('token') || '',
  fakeToken: localStorage.getItem('fake_token') || false,
  isAuth: JSON.parse(localStorage.getItem('is_auth')) || false,
  isBind: JSON.parse(localStorage.getItem('is_bind')) || false,
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
    'deadline': ''
  }
}

const getters = {
  getName: state => state.name,
  getPhone: state => state.phone,
  getOwnerId: state => state.ownerId,
  getMallName: state => state.mallName,
  getLoginNum: state => state.loginNum,
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
  getIsBind: state => state.isBind,
  getFakeToken: state => state.fakeToken,
  getSyncStatus: state => state.syncStatus,
  getSyncOrderStatus: state => state.syncOrderStatus,
  getCurrentSubsc: state => state.currentSubsc,
  getExportFields: state => state.exportFields
}

const actions = {
  requestRegister ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getRegister(params).then(data => {
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
  requestSendCaptcha ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getSendCaptcha(params).then(data => {
        if (data !== null) {
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
  requestLogin ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getLogin(params).then(data => {
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
        if (data) {
          commit(types.SET_USER, data)
          resolve(data)
        }
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
  requestBindApp ({commit, state, dispatch}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getBindApp(params).then(data => {
        if (data) {
          data.isBind = true
          commit(types.SET_USER, data)
          resolve(data)
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
      if (data.app_key !== 0) {
        data.isBind = true
        localStorage.setItem('is_bind', true)
      }
    }
    if (data.owner_name) {
      localStorage.setItem('owner_name', data.owner_name)
      state.name = data.owner_name
    }
    if (data.phone) {
      localStorage.setItem('owner_phone', data.phone)
      state.phone = data.phone
    }
    if (data.owner_id) {
      localStorage.setItem('owner_id', data.owner_id)
      state.ownerId = data.owner_id
    }
    if (data.mall_name) {
      localStorage.setItem('mall_name', data.mall_name)
      state.mallName = data.mall_name
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
    if (data.isBind) {
      localStorage.setItem('is_bind', data.isBind)
      state.isBind = data.isBind
    }
    if (data.fake_token) {
      localStorage.setItem('fake_token', data.fake_token)
      state.fakeToken = data.fake_token
    }
  },
  [ types.LOGOUT ] (state) {
    localStorage.removeItem('token')
    localStorage.removeItem('owner_name')
    localStorage.removeItem('owner_phone')
    localStorage.removeItem('owner_id')
    localStorage.removeItem('mall_name')
    localStorage.removeItem('login_num')
    localStorage.removeItem('expire_time')
    localStorage.removeItem('is_auth')
    localStorage.removeItem('is_bind')
    localStorage.removeItem('fake_token')
    state.name = ''
    state.phone = ''
    state.ownerId = ''
    state.mallName = ''
    state.loginNum = 0
    state.token = ''
    state.isAuth = false
    state.isBind = false
    state.fake_token = ''
  },
  [ types.SET_CURRENT_SUBSC ] (state, data) {
    if (data.is_subsc) {
      state.currentSubsc = {
        'is_subsc': true,
        'item_name': data.item_name,
        'item_level': data.item_level,
        'deadline': data.deadline
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
