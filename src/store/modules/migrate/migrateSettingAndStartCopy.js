
// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    captureCallBack: () => {}
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
