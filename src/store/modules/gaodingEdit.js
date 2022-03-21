
// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    visibleDrawingBoard: false,
    gaodingEditLoading: false
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {

  },
  getters: {
  }
}
