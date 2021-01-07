import * as types from '../types'

const state = {
  recentCatId: localStorage.getItem('cat_id') || 0,
  recentCatName: localStorage.getItem('cat_id') || ''
}

const getters = {
  getRecentCatId: state => state.recentCatId,
  getRecentCatName: state => state.recentCatName
}

const actions = {
  setRecentCat ({commit, state}, data) {
    commit(types.SET_RECENT_CAT, data)
    localStorage.setItem('cat_id', state.recentCatId)
    localStorage.setItem('cat_name', state.recentCatName)
  }
}

const mutations = {
  [ types.SET_RECENT_CAT ] (state, data) {
    state.recentCatId = data.id
    state.recentCatName = data.name
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
