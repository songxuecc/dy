import Api from '@/api/apis'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import { accDiv, accMul, accAdd } from '@/common/evalFloat.js'

function financial (unit, everyDecimal) {
  return (x) => {
    if (unit === -1 && everyDecimal) {
      return accAdd(parseInt(x), Number(everyDecimal))
    }
    const fix = unit === 100 ? 2 : unit === 10 ? 1 : 0
    return Number.parseFloat(accDiv(Math.round(accMul(x, unit)), unit)).toFixed(fix)
  }
}

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    unit: undefined,
    template: undefined,
    dicCustomPrices: {},
    origin: false,
    every_decimal: undefined
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getTPProductByIds ({commit, state, rootGetters}, payload) {
      try {
        commit('save', {tableData: []})
        const {template, dicCustomPrices} = await this.dispatch('migrate/migrateSettingTemplate/requestTemplate')
        commit('save', {unit: template.model.unit, every_decimal: template.model.ext_json.every_decimal})
        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        const tableData = data.items
        template.originModel.ext_json = JSON.parse(template.originModel.ext_json)
        this.dispatch('migrate/migrateSettingPrice/initTableData', {
          template,
          tableData,
          unit: template.model.unit || 100,
          origin: true,
          dicCustomPrices
        })
      } catch (err) {
        console.log(err)
      }
    },
    // 初始化价格 1. 再次进入数据回显示 2.首次进入价格初始化
    initTableData  ({commit, state}, payload) {
      const {
        template,
        tableData,
        unit,
        dicCustomPrices
      } = payload
      // 再次进入数据回显示
      if (!isEmpty(dicCustomPrices)) {
        console.log(dicCustomPrices, 'dicCustomPrices')
        return commit('save', dicCustomPrices)
      }
      let originPriceDiff = template.model.origin_price_diff
      let groupPriceRate = template.model.group_price_rate
      let groupPriceDiff = template.model.group_price_diff
      // 添加默认模版值
      if (!utils.isNumber(originPriceDiff)) {
        originPriceDiff = 0
      }
      if (!utils.isNumber(groupPriceRate)) {
        groupPriceRate = 100
      }
      if (!utils.isNumber(groupPriceDiff)) {
        groupPriceDiff = 0
      }

      const everyDcimal = template.model.ext_json.every_decimal
      // sku价格计算公式
      let evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff)
      // 抹角 抹分
      const evalPrice = financial(unit, everyDcimal)
      const nextTableData = (tableData || []).map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          if (!value.sku_price) {
            let promoPrice = utils.fenToYuan(value.promo_price)
            // 初始化价格设置 分转元
            value.origin_promo_price = utils.fenToYuan(value.promo_price)
            value.origin_price = utils.fenToYuan(value.promo_price)
            // 显示的sku价格
            value.sku_price = evalPrice(evalGroupPriceRange(promoPrice))
            value.origin_sku_price = evalGroupPriceRange(promoPrice)
          }
          // editType 0 公式 1 内部编辑公式 2 自定义编辑 3内部统一设置
          value.editType = 0
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        return cloneDeep(item)
      })
      template.model.unit = unit
      console.log(nextTableData, 'nextTableData')
      commit('save', {tableData: cloneDeep(nextTableData), unit, template})
    },
    // sku价格公式改变
    skuPriceChange ({commit, state}, payload) {
      // 把自定义设置全部去除
      const tableData = state.tableData
      const template = payload.template
      const unit = state.unit
      let originPriceDiff = template.model.origin_price_diff
      let groupPriceDiff = template.model.group_price_diff
      let groupPriceRate = template.model.group_price_rate

      // 添加默认模版值
      if (!utils.isNumber(originPriceDiff)) {
        originPriceDiff = 0
      }
      if (!utils.isNumber(groupPriceRate)) {
        groupPriceRate = 100
      }
      if (!utils.isNumber(groupPriceDiff)) {
        groupPriceDiff = 0
      }

      const everyDcimal = template.model.ext_json.every_decimal
      // sku价格计算公式
      let evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff)
      // 抹角 抹分
      const evalPrice = financial(unit, everyDcimal)
      const nextTableData = tableData.map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          let promoPrice = utils.fenToYuan(value.promo_price)
            // 初始化价格设置 分转元
          value.origin_promo_price = utils.fenToYuan(value.promo_price)
          value.origin_price = utils.fenToYuan(value.promo_price)
            // 显示的sku价格
          value.sku_price = evalPrice(evalGroupPriceRange(promoPrice))
          value.origin_sku_price = evalGroupPriceRange(promoPrice)
          // editType 0 公式 1 内部编辑公式 2 自定义编辑 3统一设置
          value.editType = 0
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        return cloneDeep(item)
      })
      commit('save', {tableData: cloneDeep(nextTableData), template})
    },
    // unit 整数位改变
    unitChange ({commit, state, dispatch}, payload) {
      const everyDecimal = payload.everyDecimal
      const change = payload.change
      const unit = payload.unit
      const template = state.template
      if (!template) return false
      // 保留小数点
      const tableData = state.tableData
      const evalPrice = unit === -1 && change ? financial(unit, everyDecimal) : financial(unit)

      let originPriceDiff = template.model.origin_price_diff
      let groupPriceRate = template.model.group_price_rate
      let groupPriceDiff = template.model.group_price_diff
      // 添加默认模版值
      if (!utils.isNumber(originPriceDiff)) {
        originPriceDiff = 0
      }
      if (!utils.isNumber(groupPriceRate)) {
        groupPriceRate = 100
      }
      if (!utils.isNumber(groupPriceDiff)) {
        groupPriceDiff = 0
      }
      let evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff)

      const nextTableData = (tableData || []).map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          const promoPrice = utils.fenToYuan(value.promo_price)
          if (value.editType === 0) {
            value.sku_price = evalPrice(evalGroupPriceRange(promoPrice))
          }
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        return cloneDeep(item)
      })
      template.model.unit = unit
      template.model.ext_json.every_decimal = everyDecimal
      commit('save', {tableData: cloneDeep(nextTableData), unit, template, every_decimal: everyDecimal})
    },
    // 自定义sku价格修改
    skuPriceCustomeChange ({commit, state}, payload) {
      const {id, arithmetic, skuData} = payload
      const model = state.template.model
      const tableData = state.tableData
      // 添加默认模版值
      if (!utils.isNumber(model.origin_price_diff)) {
        model.origin_price_diff = 0
      }
      if (!utils.isNumber(model.group_price_diff)) {
        model.group_price_diff = 0
      }
      if (!utils.isNumber(model.price_diff)) {
        model.price_diff = 0
      }
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id !== id) return item
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          const data = skuData.find(item => key === item.custom_key)
          value.sku_price = data.sku_price
          value.editType = data.editType
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 自定义公式编辑
        const globalTemplate = {
          subtraction1: model.origin_price_diff,
          subtraction2: model.group_price_rate,
          subtraction3: model.group_price_diff
        }
        const localTemplate = {
          subtraction1: arithmetic.subtraction1,
          subtraction2: arithmetic.subtraction2,
          subtraction3: arithmetic.subtraction3
        }
        if (Number(arithmetic.radio) === 1 && isEqual(globalTemplate, localTemplate)) {
          delete item.custom_setting_unit
        } else {
          item.custom_setting_unit = arithmetic
        }
        return cloneDeep(item)
      })
      commit('save', {tableData: cloneDeep(nextTableData)})
    },
    deleteRow ({commit, state, dispatch}, payload) {
      const nextTableData = state.tableData.filter(item => item.tp_product_id !== payload.tp_product_id)
      let list = localStorage.getItem('selectTPProductIdList')
      if (list) {
        list = list.split(',').filter(item => Number(item) !== Number(payload.tp_product_id))
        this.dispatch('setSelectTPProductIdList', list)
      }
      commit('save', {tableData: nextTableData})
    }
  },
  getters: {
    tableDataErrorMsg: state => {
      const tableData = state.tableData
      const template = state.template
      /**
       * Sku价格：0.01-9999999.99，最多保留两位小数
       */
      const nextTableDataErrorMsg = tableData.map(item => {
        let error = {}
        let groupPriceRangeError = ''
        const skuMap = item.sku_json.sku_map
        const skuPricesValues = Object.values(skuMap)
          .map(sku => sku.sku_price)
          .sort((a, b) => a - b)
        const minPrice = skuPricesValues[0]
        const maxPrice = skuPricesValues[skuPricesValues.length - 1]
        if (minPrice < 0.01 || maxPrice > 9999999.99) {
          groupPriceRangeError = '价格范围：0.01-9999999.99'
        }
        if (!utils.isNumber(template.model.group_price_rate)) {
          groupPriceRangeError = 'SKU价格公式输入错误'
        }
        if (groupPriceRangeError) error.group_price_range_error = groupPriceRangeError
        return error
      })
      return nextTableDataErrorMsg
    },
    // 历史价格设置配置
    dicCustomPrices: state => {
      return state
    },
    // 传给后端的价格设置
    customPrices: state => {
      let dicCustomPrices = {}
      state.tableData.forEach((item) => {
        const id = item.tp_product_id
        // 售卖价设置
        if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
        if (item.discount_price) dicCustomPrices[id].last_discount_price = utils.yuanToFen(item.discount_price)
        if (item.discount_price) dicCustomPrices[id].discount_price = utils.yuanToFen(item.discount_price)
        // sku价格设置
        if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
        const skuMap = item.sku_json.sku_map
        const skuDiffObj = {}
        Object.keys(skuMap).forEach(key => {
          const skuValue = skuMap[key]
          if (!skuDiffObj[key]) skuDiffObj[key] = {}
          skuDiffObj[key].promo_price = utils.yuanToFen(skuValue.sku_price)
        })
        dicCustomPrices[id].sku = skuDiffObj
        // 划线价设置
        if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
        if (item.market_price) dicCustomPrices[id].price = utils.yuanToFen(item.market_price)
      })
      console.log(dicCustomPrices, 'dicCustomPrices')
      return dicCustomPrices
    }
  }
}
