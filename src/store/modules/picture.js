import * as types from '../types'

const state = {
  selectedPictureUrl: ''
}

const getters = {
  getSelectedPictureUrl: state => state.selectedPictureUrl
}

const actions = {
  setSelectedPictureUrl ({commit, state}, data) {
    commit(types.SET_SELECTED_PICTURE_URL, data)
  }
}

const mutations = {
  [ types.SET_SELECTED_PICTURE_URL ] (state, data) {
    state.selectedPictureUrl = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
