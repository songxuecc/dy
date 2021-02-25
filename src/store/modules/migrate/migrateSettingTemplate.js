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
        // const userBindList = await Api.hhgjAPIs.getUserBindList({
        //   need_cost_template: 1
        // })
        const a = {'code': 0, 'data': [{'shop_name': '\u670d\u52a1\u5546\u6d4b\u8bd5\u5e97\u94fa', 'token': '304edf8b33136a6a54dfb80cc9306813', 'is_self': true, 'is_main': true, 'user_list': [{'is_self': true, 'token': '304edf8b33136a6a54dfb80cc9306813', 'is_main': true, 'auth_deadline': '2022-12-25 13:36:06', 'auth_status': 'auth', 'shop_name': '\u670d\u52a1\u5546\u6d4b\u8bd5\u5e97\u94fa', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}, {'template': {'template_name': 'xxx', 'id': 795955}}, {'template': {'template_name': '\u6c5f\u6d59\u6caa', 'id': 692009}}, {'template': {'template_name': '\u80e1\u6653\u6d4b\u8bd5', 'id': 796365}}], 'user_id': 5009091}, {'shop_name': '\u4e00\u767b\u5c0f\u5e97', 'token': '6d30fb96f13393759cce321620d63d39', 'is_self': false, 'is_main': false, 'auth_deadline': '2022-02-22 10:28:01', 'auth_status': 'un_login', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}], 'user_id': 6018583}], 'auth_deadline': '2022-12-25 13:36:06', 'auth_status': 'auth', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}, {'template': {'template_name': 'xxx', 'id': 795955}}, {'template': {'template_name': '\u6c5f\u6d59\u6caa', 'id': 692009}}, {'template': {'template_name': '\u80e1\u6653\u6d4b\u8bd5', 'id': 796365}}], 'user_id': 5009091}, {'shop_name': '\u6211\u6253', 'token': '122b3a1475ecf6cfb18e2e94860e83c9', 'is_self': false, 'is_main': true, 'user_list': [{'is_self': false, 'token': '122b3a1475ecf6cfb18e2e94860e83c9', 'is_main': true, 'auth_deadline': '2022-02-22 10:28:01', 'auth_status': 'auth', 'shop_name': '\u6211\u6253', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}], 'user_id': 1035625}, {'shop_name': '\u670d\u52a1\u5546\u6d4b\u8bd5\u5e97\u94fa', 'token': '304edf8b33136a6a54dfb80cc9306813', 'is_self': true, 'is_main': false, 'auth_deadline': '2022-12-25 13:36:06', 'auth_status': 'auth', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}, {'template': {'template_name': 'xxx', 'id': 795955}}, {'template': {'template_name': '\u6c5f\u6d59\u6caa', 'id': 692009}}, {'template': {'template_name': '\u80e1\u6653\u6d4b\u8bd5', 'id': 796365}}], 'user_id': 5009091}, {'shop_name': '\u4e00\u767b\u5c0f\u5e97', 'token': '6d30fb96f13393759cce321620d63d39', 'is_self': false, 'is_main': false, 'auth_deadline': '2022-02-22 10:28:01', 'auth_status': 'un_login', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}], 'user_id': 6018583}], 'auth_deadline': '2022-02-22 10:28:01', 'auth_status': 'auth', 'cost_template_list': [{'template': {'template_name': '\u5305\u90ae', 'id': 0}}], 'user_id': 1035625}], 'msg': 'succ'}
        const userBindList = a.data
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
        commit('save', {template})
        // 先获取数据 再保存localstorege 最后合并两个数据 是为了保证再用户刷新数据的时候 可以保证用户操作记录还在
        this.dispatch('migrate/migrateSettingTemplate/loadTempTemplate', template)
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
      this.dispatch('migrate/migrateSettingTemplate/saveTempTemplate')
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
    }
  },
  getters: {
    getTemplate: state => state.template,
    getDicCustomPrices: state => state.dicCustomPrices
  }
}
