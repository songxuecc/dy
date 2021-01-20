import Api from '@/api/apis'
import FormModel from '@/common/formModel'
import cloneDeep from 'lodash/cloneDeep'

// 店铺绑定
export default {
  namespaced: true,
  state: () => ({
    template: new FormModel(),
    dicCustomPrices: {},
    costTemplateList: []
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async requestTemplate ({commit, state}, params) {
      try {
        const data = await Api.hhgjAPIs.getTemplate(params)
        const templateList = await this.dispatch('moving/migrateSettingTemplate/getCostTemplateList')
        // 运费模版id
        if (data.cost_template_id.toString() === '0' && templateList.length > 0) {
          data.cost_template_id = templateList[0].template.id
        }
        const template = cloneDeep(state.template)
        // 保存结束时间
        data.presell_end_time = localStorage.getItem('presell_end_time')
        // 设置默认发货时间
        if (!data.delivery_delay_day) {
          data.delivery_delay_day = 2
        }
        Object.assign(template.model, data)
        commit('save', {template})
        // 先获取数据 再保存localstorege 最后合并两个数据 是为了保证再用户刷新数据的时候 可以保证用户操作记录还在
        this.dispatch('moving/migrateSettingTemplate/loadTempTemplate', template)
        return true
      } catch (err) {
        console.log(err)
      }
    },
    saveTempTemplate ({state}) {
      let model = cloneDeep(state.template.model)
      delete model['template_list']
      localStorage.setItem('temp_template', JSON.stringify(model))
      localStorage.setItem('custom_prices', JSON.stringify(state.dicCustomPrices))
    },
      /**
       * 载入模板，如果localStorage中有模板数据，则直接刷新
       * @param commit
       * @param state
       */
    loadTempTemplate ({commit, state}, payload) {
      let strTemplate = localStorage.getItem('temp_template') || ''
      let strCustomPrices = localStorage.getItem('custom_prices') || ''
      if (strTemplate) {
        const template = cloneDeep(payload)
        Object.assign(template.model, JSON.parse(strTemplate))
        commit('save', {template})
      }
      if (strCustomPrices) {
        commit('save', {dicCustomPrices: JSON.parse(strCustomPrices)})
      }
      this.dispatch('moving/migrateSettingTemplate/saveTempTemplate')
    },
    removeTempTemplate () {
      localStorage.removeItem('temp_template')
      localStorage.removeItem('custom_prices')
    },
    removeDicCustomPrices ({commit}) {
      commit('save', {dicCustomPrices: {}})
    },
    setPresellEndTime ({commit, state}, payload) {
      localStorage.setItem('presell_end_time', payload || '')
    },
    async getCostTemplateList ({commit, state}, payload) {
      const params = {name: '', page_index: 0, page_size: 100}
      const data = await Api.hhgjAPIs.getCostTemplateList(params)
      commit('save', {costTemplateList: data.List})
      return data.List
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
}
