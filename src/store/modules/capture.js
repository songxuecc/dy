import * as types from '../types'

const state = {
  captureIdList: []
}

const getters = {
  getCaptureIdList: state => {
    if (state.captureIdList.length === 0) {
      let list = localStorage.getItem('captureIdList')
      if (list) {
        state.captureIdList = list.split(',')
      }
    }
    return state.captureIdList
  }
}

const actions = {
  setCaptureIdList ({commit, state}, captureIdList) {
    commit(types.SET_CAPTURE_ID_LIST, captureIdList)
  }
}

const mutations = {
  [ types.SET_CAPTURE_ID_LIST ] (state, captureIdList) {
    state.captureIdList = captureIdList
    localStorage.setItem('captureIdList', captureIdList)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
