import Api from '@/api/apis'
import common from '@/common/common'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'

import { accSub, accDiv, accMul, accAdd } from '@/common/evalFloat.js'

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
      // 添加默认模版值
      if (!utils.isNumber(template.model.origin_price_diff)) {
        template.model.origin_price_diff = 0
      }
      if (!utils.isNumber(template.model.group_price_diff)) {
        template.model.group_price_diff = 0
      }
      if (!utils.isNumber(template.model.price_diff)) {
        template.model.price_diff = 0
      }
      const originPriceDiff = template.model.origin_price_diff
      const groupPriceRate = template.model.group_price_rate
      const groupPriceDiff = template.model.group_price_diff
      const priceRate = template.model.price_rate
      const priceDiff = template.model.price_diff
      const isSalePriceShowMax = Number(template.model.is_sale_price_show_max)
      const everyDcimal = template.model.ext_json.every_decimal
      console.log(everyDcimal, template.model, 'everyDcimal')
      // sku价格计算公式
      let evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff)
      // 划线价计算公式
      const evalMarketPrice = x => ((x * priceRate) / 100 - priceDiff)
      // 抹角 抹分
      const evalPrice = financial(unit, everyDcimal)
      const nextTableData = (tableData || []).map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        console.log(skuMap, 'skuMap')
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          if (!value.sku_price) {
            let promoPrice = utils.fenToYuan(value.promo_price)
            // 显示的sku价格
            value.sku_price = evalPrice(evalGroupPriceRange(promoPrice))
            value.origin_sku_price = evalGroupPriceRange(promoPrice)
            value.market_price = evalPrice(value.price / 100)
            value.initial_market_price = evalPrice(value.price / 100)
            value.origin_price = value.promo_price / 100
            // 初始化价格设置 分转元
            value.origin_promo_price = utils.fenToYuan(value.promo_price)
            // 自定义编辑sku价格
            value.custom_setting_sku_price = false
          }
          // editType 0 公式 1 内部编辑公式 2 自定义编辑
          value.editType = 0
          nextSkuMap[key] = value
        })

        let skuPricesValues = Object.values(nextSkuMap).map(sku => sku.sku_price).sort((a, b) => a - b)
        const minSkuPrices = skuPricesValues[0]
        const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
        // 划线价 价格范围
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.initial_market_price)
        const maxMarketPrices = evalPrice(evalMarketPrice(Math.max(...marketPrices)))
        // sku价
        item.sku_json.sku_map = nextSkuMap
        // 售卖价
        item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices) : evalPrice(minSkuPrices)
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = maxMarketPrices
        // 售卖价格没计算过的价格
        item.origin_market_price_no_eval = Math.max(...marketPrices)
        if (item.tp_id === common.TpType.dy) {
          item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
          item.origin_market_price_no_eval = item.min_price / 100
        }
        // 自定义编辑价格单位
        item.custom_setting_unit = false
        // 自定义编辑划线价
        item.custom_setting_market_price = false
        item.origin_market_price = item.market_price
        // 自定义编辑售卖
        item.custom_setting_discount_price = false
        item.origin_discount_price = isSalePriceShowMax ? maxSkuPrices : minSkuPrices
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
      // 添加默认模版值
      if (!utils.isNumber(template.model.origin_price_diff)) {
        template.model.origin_price_diff = 0
      }
      if (!utils.isNumber(template.model.group_price_diff)) {
        template.model.group_price_diff = 0
      }
      if (!utils.isNumber(template.model.price_diff)) {
        template.model.price_diff = 0
      }
      const originPriceDiff = template.model.origin_price_diff
      const groupPriceRate = template.model.group_price_rate
      const groupPriceDiff = template.model.group_price_diff
      const priceRate = template.model.price_rate
      const priceDiff = template.model.price_diff
      const isSalePriceShowMax = Number(template.model.is_sale_price_show_max)
      const everyDcimal = template.model.ext_json.every_decimal
      // sku价格计算公式
      let evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff)
      // 划线价计算公式
      const evalMarketPrice = x => ((x * priceRate) / 100 - priceDiff)
      // 抹角 抹分
      const evalPrice = financial(unit, everyDcimal)

      const nextTableData = tableData.map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          let promoPrice = utils.fenToYuan(value.promo_price)
          // 显示的sku价格
          value.sku_price = evalPrice(evalGroupPriceRange(promoPrice))
          value.origin_sku_price = evalGroupPriceRange(promoPrice)
          value.market_price = evalPrice(value.price / 100)
          value.initial_market_price = evalPrice(value.price / 100)
          // 初始化价格设置 分转元
          value.origin_promo_price = utils.fenToYuan(value.promo_price)
          // 自定义编辑sku价格
          value.custom_setting_sku_price = false
          // editType 0 公式 1 内部编辑公式 2 自定义编辑 3统一设置
          value.editType = 0
          nextSkuMap[key] = value
        })

        let skuPricesValues = Object.values(nextSkuMap).map(sku => sku.sku_price).sort((a, b) => a - b)
        const minSkuPrices = skuPricesValues[0]
        const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
        // 划线价 价格范围
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.initial_market_price)
        const maxMarketPrices = evalPrice(evalMarketPrice(Math.max(...marketPrices)))
        // sku价
        item.sku_json.sku_map = nextSkuMap
        // 售卖价
        item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices) : evalPrice(minSkuPrices)
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = maxMarketPrices
        // 售卖价格没计算过的价格
        item.origin_market_price_no_eval = Math.max(...marketPrices)
        if (item.tp_id === common.TpType.dy) {
          item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
          item.origin_market_price_no_eval = item.min_price / 100
        }
        // 自定义编辑价格单位
        item.custom_setting_unit = false
        // 自定义编辑划线价
        item.custom_setting_market_price = false
        item.origin_market_price = evalMarketPrice(Math.max(...marketPrices))
        // 自定义编辑售卖
        item.custom_setting_discount_price = false
        item.origin_discount_price = isSalePriceShowMax ? maxSkuPrices : minSkuPrices
        return cloneDeep(item)
      })
      commit('save', {tableData: cloneDeep(nextTableData), template})
    },
    // 划线价格公式改变
    marketPriceChange  ({commit, state}, payload) {
      const tableData = state.tableData
      const template = payload.template
      const unit = state.unit
      const priceRate = template.model.price_rate
      const priceDiff = template.model.price_diff
      const evalMarketPrice = x => ((x * priceRate) / 100 - priceDiff)
      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        const maxMarketPrices = evalPrice(evalMarketPrice(item.origin_market_price_no_eval))
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = maxMarketPrices
        return cloneDeep(item)
      })
      commit('save', {tableData: cloneDeep(nextTableData), template})
    },
    // 售卖价格公示改变
    discountChange ({commit, state}, payload) {
      const tableData = state.tableData
      const template = payload.template
      const unit = state.unit
      const isSalePriceShowMax = Number(template.model.is_sale_price_show_max)
      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let skuPricesValues = Object.values(skuMap).map(sku => sku.sku_price).sort((a, b) => a - b)
        const minSkuPrices = skuPricesValues[0]
        const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
        // 售卖价
        item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices) : evalPrice(minSkuPrices)
        return cloneDeep(item)
      })
      commit('save', {tableData: cloneDeep(nextTableData), template})
    },
    // unit 整数位改变
    unitChange ({commit, state}, payload) {
      // 保留自定义编辑后再取整
      const unit = payload.unit
      const everyDcimal = payload.everyDcimal
      const tableData = state.tableData
      const evalPrice = financial(unit, everyDcimal)
      const template = state.template
      const isSalePriceShowMax = Number(template.model.is_sale_price_show_max)

      const nextTableData = (tableData || []).map(item => {
        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          if (!value.custom_setting_sku_price) {
            value.sku_price = evalPrice(value.origin_sku_price)
          }
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        if (item.custom_setting_discount_price) {
          item.discount_price = evalPrice(item.custom_setting_discount_price)
        } else {
          const skuMap = cloneDeep(item.sku_json.sku_map)
          let skuPricesValues = Object.values(skuMap).map(sku => sku.sku_price).sort((a, b) => a - b)
          const minSkuPrices = skuPricesValues[0]
          const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
          item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices) : evalPrice(minSkuPrices)
        }

        if (item.custom_setting_market_price) {
          item.market_price = evalPrice(item.custom_setting_market_price)
        } else {
          item.market_price = evalPrice(item.origin_market_price)
        }
        return cloneDeep(item)
      })
      template.model.unit = unit
      commit('save', {tableData: cloneDeep(nextTableData), unit, template})
    },
    // 自定义售卖价
    discountCustomeChange ({commit, state}, payload) {
      const tableData = state.tableData
      const {id, price} = payload
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          // 自定义价格设置 记录旧的价格 如果和旧的价格 相当于还原自定义价格 则去除自定义价格标志

          const skuMap = item.sku_json.sku_map
          const skuPricesValues = Object.values(skuMap)
            .map(sku => sku.sku_price)
            .sort((a, b) => a - b)
          const minSkuPrices = skuPricesValues[0]
          const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
          // 自定义价格设置 记录旧的价格 如果和旧的价格 相当于还原自定义价格 则去除自定义价格标志
          if ((price === minSkuPrices) || (price === maxSkuPrices)) {
            item.custom_setting_discount_price = false
            item.discount_price = price
          } else {
            item.custom_setting_discount_price = price
            item.discount_price = price
          }
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 自定义化纤价
    marketCustomeChange ({commit, state}, payload) {
      const tableData = state.tableData
      const {id, price} = payload
      const unit = state.unit
      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          // 自定义价格设置 记录旧的价格 如果和旧的价格 相当于还原自定义价格 则去除自定义价格标志
          if (price !== evalPrice(item.origin_market_price)) {
            item.custom_setting_market_price = price
            item.market_price = price
          } else {
            item.custom_setting_market_price = false
            item.market_price = price
          }
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 自定义sku价格修改
    skuPriceCustomeChange ({commit, state}, payload) {
      const {id, arithmetic, skuData} = payload
      const skuPricesValues = skuData
        .map(sku => sku.sku_price)
        .sort((a, b) => a - b)
      const model = state.template.model
      const tableData = state.tableData
      const unit = state.unit
      const evalPrice = financial(unit)

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
      const isSalePriceShowMax = Number(model.is_sale_price_show_max)
      // 获取最低价最高价 划线价格
      const minSkuPrices = skuPricesValues[0]
      const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id !== id) return item
        item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices) : evalPrice(minSkuPrices)
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
    everyDecimalChange ({commit, state}, payload) {
      const {everyDecimal, change} = payload
      commit('save', {every_decimal: everyDecimal})
      if (!change) return false
      const tableData = state.tableData
      const model = state.template.model
      const template = state.template
      const unit = state.unit
      const evalPrice = financial(unit)
      const priceRate = model.price_rate
      const priceDiff = model.price_diff
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
      const isSalePriceShowMax = Number(model.is_sale_price_show_max)
      // 获取最低价最高价 划线价格

      const nextTableData = tableData.map(item => {
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          value.sku_price = evalPrice(value.sku_price, everyDecimal)
          // 统一设置
          value.editType = 3
          nextSkuMap[key] = value
        })
        let skuPricesValues = Object.values(nextSkuMap).map(sku => sku.sku_price).sort((a, b) => a - b)
        const minSkuPrices = skuPricesValues[0]
        const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
        // 划线价 价格范围
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.initial_market_price)
        const evalMarketPrice = x => ((x * priceRate) / 100 - priceDiff)
        const maxMarketPrices = evalPrice(evalMarketPrice(Math.max(...marketPrices)), everyDecimal)
        // sku价
        item.sku_json.sku_map = nextSkuMap
        // 售卖价
        item.discount_price = isSalePriceShowMax ? evalPrice(maxSkuPrices, everyDecimal) : evalPrice(minSkuPrices, everyDecimal)
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = maxMarketPrices
        // 售卖价格没计算过的价格
        item.origin_market_price_no_eval = Math.max(...marketPrices)
        if (item.tp_id === common.TpType.dy) {
          item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
          item.origin_market_price_no_eval = item.min_price / 100
        }
        // 自定义编辑价格单位
        item.custom_setting_unit = false
        // 自定义编辑划线价
        item.custom_setting_market_price = false
        item.origin_market_price = evalMarketPrice(Math.max(...marketPrices))
        // 自定义编辑售卖
        item.custom_setting_discount_price = false
        item.origin_discount_price = isSalePriceShowMax ? maxSkuPrices : minSkuPrices
        return cloneDeep(item)
      })
      template.model.ext_json.every_decimal = everyDecimal
      template.model.unit = -1
      commit('save', {tableData: cloneDeep(nextTableData), template})
    },
    // 清除划线价
    clearMarketPrice ({commit, state}, payload) {
      const tableData = state.tableData
      const template = state.template
      const unit = state.unit
      const {id} = payload
      const evalMarketPrice = x => accSub(accDiv(accMul(x, template.model.price_rate), 100), template.model.price_diff)
      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.market_price = evalPrice(evalMarketPrice(item.maxMarketPrices))
          delete item.custome_market_price
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 清除售卖价
    clearDiscountPrice ({commit, state}, payload) {
      const {id} = payload
      const tableData = state.tableData
      const template = state.template
      const unit = state.unit

      // 添加默认模版值
      if (!utils.isNumber(template.model.origin_price_diff)) {
        template.model.origin_price_diff = 0
      }
      if (!utils.isNumber(template.model.group_price_diff)) {
        template.model.group_price_diff = 0
      }
      if (!utils.isNumber(template.model.price_diff)) {
        template.model.price_diff = 0
      }

      let evalGroupPriceRange = x => accSub(accDiv(accMul(accSub(x, template.model.origin_price_diff), template.model.group_price_rate), 100), template.model.group_price_diff)
      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          const minSkuPrices = evalPrice(evalGroupPriceRange(item.minSkuPrices))
          const maxSkuPrices = evalPrice(evalGroupPriceRange(item.maxSkuPrices))
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          delete item.custome_discount_price
        }
        return item
      })
      commit('save', {tableData: nextTableData})
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
        售卖价：在sku价格范围内
        划线价：sku规格最高价≤划线价≤9999999.99
       */
      const nextTableDataErrorMsg = tableData.map(item => {
        let error = {}
        let discountPriceError = ''
        let marketPriceError = ''
        let groupPriceRangeError = ''
        const skuMap = item.sku_json.sku_map
        const skuPricesValues = Object.values(skuMap)
          .map(sku => sku.sku_price)
          .sort((a, b) => a - b)
        const minPrice = skuPricesValues[0]
        const maxPrice = skuPricesValues[skuPricesValues.length - 1]
        if (!utils.isNumber(item.discount_price)) {
          discountPriceError = '请输入数字'
        } else if (item.discount_price < 0.01 || item.discount_price > 9999999.99) {
          discountPriceError = '价格范围：0.01-9999999.99'
        }
        if (Number(item.discount_price) > maxPrice || Number(item.discount_price) < minPrice) {
          discountPriceError = `售卖价必须在sku价格范围内`
        }

        if (!utils.isNumber(item.market_price)) {
          marketPriceError = '请输入数字'
        } else if (Number(item.market_price) < 0.01 || Number(item.market_price) > 9999999.99) {
          marketPriceError = '价格范围：0.01-9999999.99'
        } else if (maxPrice > Number(item.market_price) || Number(item.market_price) > 9999999.99) {
          marketPriceError = `划线价需>=sku最高价`
        }

        if (!utils.isNumber(template.model.price_rate)) {
          marketPriceError = '划线价格公式输入错误'
        }

        if (minPrice < 0.01 || maxPrice > 9999999.99) {
          groupPriceRangeError = '价格范围：0.01-9999999.99'
        }
        if (!utils.isNumber(template.model.group_price_rate)) {
          groupPriceRangeError = 'SKU价格公式输入错误'
          discountPriceError = 'SKU价格公式输入错误'
        }

        if (discountPriceError) error.discount_price_error = discountPriceError
        if (marketPriceError) error.market_price_error = marketPriceError
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
