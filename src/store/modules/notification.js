import Api from '@/api/apis'
import * as types from '../types'

const state = {
  notificationList: [],
  unRead: 0,
  ignoreNotiList: (localStorage.getItem('ignore_noti_list') ? localStorage.getItem('ignore_noti_list').split(',') : [])
}

const getters = {
  getNotificationList: state => state.notificationList,
  getUnRead: state => state.unRead,
  getIgnoreNotiList: state => state.ignoreNotiList
}

const actions = {
  requestNotification ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getNotification(params).then(data => {
        resolve(data)
        commit(types.SET_NOTIFICATION_LIST, data)
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
  ignoreNotification ({state}, notificationId) {
    if (!state.ignoreNotiList.includes(notificationId)) {
      state.ignoreNotiList.push(notificationId)
    }
    if (state.ignoreNotiList.length > 100) {
      state.ignoreNotiList = state.ignoreNotiList.slice(-100)
    }
    localStorage.setItem('ignore_noti_list', state.ignoreNotiList)
  },
  setUnReadNum ({commit, state}, num) {
    commit(types.SET_UN_READ_NUM, num)
  },
  setLocalStorageNoticeFun ({commit, state}) {
    localStorage.setItem('ago_notice_list', state.newNoticeStr)
  }
}

const mutations = {
  [ types.SET_NOTIFICATION_LIST ] (state, data) {
    state.notificationList = data.list
    state.unRead = data.un_read
  },
  [ types.SET_UN_READ_NUM ] (state, num) {
    state.unRead = num
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
