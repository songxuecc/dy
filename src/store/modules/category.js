import * as types from '../types'
import apis from '../../api/apis'

const state = {
  recentCatId: localStorage.getItem('cat_id') || 0,
  recentCatName: localStorage.getItem('cat_id') || ''
}

const getters = {
  getRecentCatId: state => state.recentCatId,
  getRecentCatName: state => state.recentCatName,
  getFirstCategoryList: state => state.firstCategoryList
}

const actions = {
  setRecentCat ({commit, state}, data) {
    commit(types.SET_RECENT_CAT, data)
    localStorage.setItem('cat_id', state.recentCatId)
    localStorage.setItem('cat_name', state.recentCatName)
  },
  setShopFirstCategory ({commit, state}) {
    apis.hhgjAPIs.getCategoryList(
      {
        parent_id: 0
      }
    ).then(data => {
      commit(types.SET_SHOP_FIRST_CATEGORY, data)
    })
  }
}

const mutations = {
  [ types.SET_RECENT_CAT ] (state, data) {
    state.recentCatId = data.id
    state.recentCatName = data.name
  },
  [ types.SET_SHOP_FIRST_CATEGORY ] (state, data) {
    state.firstCategoryList = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
