import Api from '@/api/apis'
import FormModel from '@/common/formModel'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    template: new FormModel(),
    dicCustomPrices: {},
    costTemplateList: [],
    userBindList: []
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getMigrateSetting ({commit, state}, payload) {
      try {
        const setting = await Api.hhgjAPIs.getMigrateSetting()
        commit('save', {setting})
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
}
