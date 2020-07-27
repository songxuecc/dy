import * as types from '../types'

const state = {
  isShowFloatView: true
}

const getters = {
  isShowFloatView: state => state.isShowFloatView
}

const actions = {
  setIsShowFloatView ({commit, state}, value) {
    commit(types.SET_IS_SHOW_FLOAT_VIEW, value)
  }
}

const mutations = {
  [ types.SET_IS_SHOW_FLOAT_VIEW ] (state, value) {
    state.isShowFloatView = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
