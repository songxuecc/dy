import Api from '@/api/apis'
import FormModel from '@/common/formModel'
import cloneDeep from 'lodash/cloneDeep'

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
    async getUserBindList ({commit, state}, payload) {
      try {
        const userBindList = await Api.hhgjAPIs.getUserBindList({
          need_cost_template: 1
        })
        commit('save', {userBindList})
      } catch (err) {
        console.log(err)
        this._vm.$message.error(`${err}`)
      }
    },
    async requestTemplate ({commit, state}, params) {
      try {
        const data = await Api.hhgjAPIs.getTemplate(params)
        const templateList = await this.dispatch('migrate/migrateSettingTemplate/getCostTemplateList')
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
        template.assign({...template.model, ...data})
        const defaultExtJson = {
          limit_per_buyer: '',
          maximum_per_order: '',
          minimum_per_order: ''
        }
        if (typeof template.model.ext_json === 'string') {
          template.model.ext_json = {
            ...defaultExtJson,
            ...JSON.parse(template.model.ext_json)
          }
        }
        // 设置默认 抹角抹分的数据
        if (!template.model.unit) {
          template.model.unit = 100
        }
        // 搬迁方式在首页前置 首页设置优先级最高
        const commitType = localStorage.getItem('migrate_productList_commit_type')
        template.model.commit_type = Number(commitType)
        console.log(commitType, template.model, 'commitType')
        commit('save', {template})
        // 先获取数据 再保存localstorege 最后合并两个数据 是为了保证再用户刷新数据的时候 可以保证用户操作记录还在
        // 在这里真正保存模版
        return this.dispatch('migrate/migrateSettingTemplate/loadTempTemplate', template)
      } catch (err) {
        console.log(err)
      }
    },
    saveTempTemplate ({state}) {
      let model = cloneDeep(state.template.model)
      delete model['template_list']
      localStorage.setItem('temp_template', JSON.stringify(model))
      // localStorage.setItem('custom_prices', JSON.stringify(state.dicCustomPrices))
    },
      /**
       * 载入模板，如果localStorage中有模板数据，则直接刷新
       * @param commit
       * @param state
       */
    loadTempTemplate ({commit, state}, payload) {
      let strTemplate = localStorage.getItem('temp_template') || ''
      // let strCustomPrices = localStorage.getItem('custom_prices') || ''
      let template = payload
      if (strTemplate) {
        template = cloneDeep(payload)
        Object.assign(template.model, JSON.parse(strTemplate))
        const defaultExtJson = {
          limit_per_buyer: '',
          maximum_per_order: '',
          minimum_per_order: ''
        }
        if (typeof template.model.ext_json === 'string') {
          template.model.ext_json = {
            ...defaultExtJson,
            ...JSON.parse(template.model.ext_json)
          }
        }
        commit('save', {template})
      }
      // if (strCustomPrices) {
      //   commit('save', {dicCustomPrices: JSON.parse(strCustomPrices)})
      // }
      this.dispatch('migrate/migrateSettingTemplate/saveTempTemplate')
      return {
        template
        // dicCustomPrices: strCustomPrices ? JSON.parse(strCustomPrices) : {}
      }
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
      const targetUserId = payload && payload.targetUserId
      const params = {name: '', page_index: 0, page_size: 100}
      if (targetUserId) {
        params.target_user_id = targetUserId
      }
      const data = await Api.hhgjAPIs.getCostTemplateList(params)
      commit('save', {costTemplateList: data.List})
      return data.List
    },
    async getCostTemplateListUserBandList ({commit, state}, payload) {
      const targetUserId = payload && payload.targetUserId
      const params = {name: '', page_index: 0, page_size: 100}
      if (targetUserId) {
        params.target_user_id = targetUserId
      }
      const data = await Api.hhgjAPIs.getCostTemplateList(params)

      let userBindList = cloneDeep(state.userBindList)

      userBindList.forEach(parent => {
        if (parent.user_id === targetUserId) {
          parent.cost_template_list = data.List
        }
        parent.user_list.forEach(child => {
          if (child.user_id === targetUserId) {
            parent.cost_template_list = data.List
          }
        })
      })
      commit('save', {userBindList})
      return data.List
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
}
