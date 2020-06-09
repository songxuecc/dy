import * as types from '../types'

const state = {
  selectTPProductIdList: []
}

const getters = {
  getSelectTPProductIdList: state => {
    if (state.selectTPProductIdList.length === 0) {
      let list = localStorage.getItem('selectTPProductIdList')
      if (list) {
        state.selectTPProductIdList = list.split(',')
      }
    }
    return state.selectTPProductIdList
  }
}

const actions = {
  setSelectTPProductIdList ({commit, state}, data) {
    commit(types.SET_SELECT_TPPRODUCT_ID_LIST, data)
  }
}

const mutations = {
  [ types.SET_SELECT_TPPRODUCT_ID_LIST ] (state, data) {
    state.selectTPProductIdList = data
    localStorage.setItem('selectTPProductIdList', data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
