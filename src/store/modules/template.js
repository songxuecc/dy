import Api from '@/api/apis'
import * as types from '../types'
import FormModel from '@/common/formModel'

const state = {
  template: new FormModel(),
  dicCustomPrices: {}
}

const getters = {
  getTemplate: state => state.template,
  getDicCustomPrices: state => state.dicCustomPrices
}

const actions = {
  requestTemplate ({commit, state}, params) {
    let promise = new Promise(function (resolve, reject) {
      Api.hhgjAPIs.getTemplate(params).then(data => {
        resolve(data)
        commit(types.SET_TEMPLATE, data)
      }, err => {
        console.error(err)
        reject(err)
      }).catch(err => {
        console.error(err)
        reject(err)
      })
    })
    return promise
  }
}

const mutations = {
  [ types.SET_TEMPLATE ] (state, data) {
    if (data.cost_template_id.toString() === '0' && data.template_list.length > 0) {
      data.cost_template_id = data.template_list[0].cost_template_id
    }
    state.template.assign(data)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
