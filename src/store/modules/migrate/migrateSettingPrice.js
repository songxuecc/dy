import Api from '@/api/apis'
import common from '@/common/common'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'

import { accSub, accDiv, accMul } from '@/common/evalFloat.js'

function financial (unit) {
  const fix = unit === 100 ? 2 : unit === 10 ? 1 : 0
  return (x) => Number.parseFloat(accDiv(Math.round(accMul(x, unit)), unit)).toFixed(fix)
}

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    unit: undefined,
    template: undefined,
    dicCustomPrices: {},
    origin: false
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
        commit('save', {unit: template.model.unit})
        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        const tableData = data.items
        this.dispatch('migrate/migrateSettingPrice/formatTableData', {
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
    formatTableData ({commit, state}, payload) {
      // 1. 获取公式
      // 2. 获取sku 价格
      // 3. 计算价格 设置值
      // 初始值100 抹角 10 抹分 1,
      // 如果修改模版 自定义设置不变
      // 修改unit 自定义设置数据改变
      const {
        template,
        tableData,
        unit,
        origin = state.origin,
        dicCustomPrices
      } = payload

      const oldUnit = state.unit
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

      // sku价格计算公式
      let evalGroupPriceRange = x => accSub(accDiv(accMul(accSub(x, template.model.origin_price_diff), template.model.group_price_rate), 100), template.model.group_price_diff)
      // 划线价计算公式
      const evalMarketPrice = x => accSub(accDiv(accMul(x, template.model.price_rate), 100), template.model.price_diff)
      // 抹角 抹分
      const evalPrice = financial(unit)

      const nextTableData = (tableData || []).map(item => {
        // 修改unit 自定义设置数据只改变单位
        if (oldUnit !== unit && item.selectPriceType) {
          // 抹角抹分时候 有自定义价格则按照自定价格计算 否则按照初始化价格计算
          const minSkuPrices = item.customMinSkuPrices ? evalPrice(item.customMinSkuPrices) : evalPrice(item.minSkuPrices)
          const maxSkuPrices = item.customMaxSkuPrices ? evalPrice(item.customMaxSkuPrices) : evalPrice(item.maxSkuPrices)
          item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          item.market_price = evalPrice(item.market_price)

          if (item.custome_discount_price) {
            item.discount_price = evalPrice(item.custome_discount_price)
          }
          if (item.custome_market_price) {
            item.market_price = evalPrice(item.custome_market_price)
          }
          return item
        }

        // 设置自定义 价格 则不改变数据
        if (item.selectPriceType) return item

        const id = item.tp_product_id
        let skuMap = cloneDeep(item.sku_json.sku_map)

        let hasRemarkedPromptPrice = false
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          if (!value.sku_price) {
            let promoPrice = value.promo_price
            // 恢复历史sku价格
            if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].sku && dicCustomPrices[id].sku[key] && dicCustomPrices[id].sku[key].promo_price) {
              hasRemarkedPromptPrice = true
            }
            value.sku_price = evalPrice(evalGroupPriceRange(promoPrice / 100))
            value.origin_price = evalPrice(value.promo_price / 100)
            value.market_price = evalPrice(value.price / 100)
            value.initial_market_price = evalPrice(value.price / 100)
            value.custome_key = key
          }
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 获取价格范围
        // 有历史价格设置 则不设置计算
        let skuPrices = Object.values(nextSkuMap).map(sku => sku.origin_price)

        let minSkuPrices = evalPrice(evalGroupPriceRange(Math.min(...skuPrices)))
        let maxSkuPrices = evalPrice(evalGroupPriceRange(Math.max(...skuPrices)))

        // 划线价 价格范围
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.initial_market_price)
        // const minMarketPrices = evalPrice(evalGroupPriceRange(Math.min(...marketPrices)))
        const marketPrice = evalPrice(evalMarketPrice(Math.max(...marketPrices)))
        // 设置价格公式
        item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices

        item.minSkuPrices = Math.min(...skuPrices)
        item.maxSkuPrices = Math.max(...skuPrices)
        item.maxMarketPrices = marketPrice
        item.origin_market_price = marketPrice
        item.origin_discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices

        // 有历史记录
        if (origin && hasRemarkedPromptPrice) {
          let nextSkuMaphasRemark = {}
          // 自定义价格设置回显
          if (!isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].selectPriceArithmetic) {
            item.selectPriceArithmetic = dicCustomPrices[id].selectPriceArithmetic
            item.selectPriceType = item.selectPriceArithmetic.radio
          }
          Object.keys(skuMap).forEach(key => {
            const value = skuMap[key]
            let promoPrice = value.promo_price
            let marketPrice = value.price
            // 恢复历史sku价格
            if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].sku && dicCustomPrices[id].sku[key] && dicCustomPrices[id].sku[key].promo_price) {
              promoPrice = dicCustomPrices[id].sku[key].promo_price
              hasRemarkedPromptPrice = true
              value.custom_price = evalPrice(promoPrice / 100)
            }
            value.sku_price = evalPrice(promoPrice / 100)
            value.origin_price = evalPrice(value.promo_price / 100)
            value.market_price = evalPrice(marketPrice / 100)
            value.custome_key = key
            nextSkuMaphasRemark[key] = value
          })
          item.sku_json.sku_map = nextSkuMaphasRemark
          let skuPricesRemark = Object.values(nextSkuMaphasRemark).map(sku => sku.sku_price)
          item.selectPriceInfo = '已编辑'
          item.selectPriceType = 3
          const minSkuPrices = evalPrice(Math.min(...skuPricesRemark))
          const maxSkuPrices = evalPrice(Math.max(...skuPricesRemark))
          item.customMinSkuPrices = minSkuPrices
          item.customMaxSkuPrices = maxSkuPrices
          item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          item.origin_discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
        }

        // 恢复历史售卖价
        // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].last_discount_price) {
        //   item.discount_price = evalPrice(dicCustomPrices[id].last_discount_price / 100)
        // }

        if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].discount_price) {
          item.discount_price = evalPrice(dicCustomPrices[id].discount_price / 100)
          item.custome_discount_price = evalPrice(dicCustomPrices[id].discount_price / 100)
        }

        // 设置划线价
        item.market_price = marketPrice
        // 如果是抖音商品，则取商品最小价格作为划线价
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
        }
        // 恢复历史划线价
        if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id] && dicCustomPrices[id].price) {
          item.market_price = evalPrice(dicCustomPrices[id].price / 100)
          item.custome_market_price = evalPrice(dicCustomPrices[id].price / 100)
        }

        // 自定义价格设置
        if (item.custome_discount_price && oldUnit !== unit) {
          item.discount_price = evalPrice(item.custome_discount_price)
        }
        if (item.custome_market_price && oldUnit !== unit) {
          item.market_price = evalPrice(item.custome_market_price)
        }
        return cloneDeep(item)
      })
      // 更新模版的unit 后期比较tempkate可以更新用户模版

      template.model.unit = unit
      commit('save', {tableData: cloneDeep(nextTableData), unit, template})
    },
    // 修改划线价
    marketPriceChange ({commit, state}, payload) {
      const tableData = state.tableData
      const {id, price} = payload
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          // 自定义价格设置 记录旧的价格 如果和旧的价格 相当于还原自定义价格 则去除自定义价格标志
          if (item.origin_market_price) {
            if (item.origin_market_price === price) {
              delete item.custome_market_price
              delete item.origin_market_price
            } else {
              item.custome_market_price = price
            }
          } else {
            item.origin_market_price = item.market_price
            item.custome_market_price = price
          }
          item.market_price = price
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 修改售卖价
    discountPriceChange  ({commit, state}, payload) {
      const {id, price} = payload
      const tableData = state.tableData
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          // 自定义价格设置 记录旧的价格 如果和旧的价格 相当于还原自定义价格 则去除自定义价格标志
          if (item.origin_discount_price) {
            if (item.origin_discount_price === price) {
              delete item.custome_discount_price
              delete item.origin_discount_price
            } else {
              item.custome_discount_price = price
            }
          } else {
            item.origin_discount_price = item.discount_price
            item.custome_discount_price = price
          }
          item.discount_price = price
        }
        return item
      })
      commit('save', {tableData: nextTableData})
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
    // 单个sku价格的修改
    singleSkuPriceChange ({commit, state}, payload) {
      const {id, arithmetic} = payload
      const singleTableDataData = arithmetic.tableData
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

      const evalPrice = financial(unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id !== id) return item

        // 删除自定义价格 修改模版的时候 覆盖自定义价格
        delete item.customMinSkuPrices
        delete item.customMaxSkuPrices

        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        let hasCustomPrice = false
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          const data = singleTableDataData.find(item => value.sku_id === item.sku_id)
          value.sku_price = data.sku_price
          // 自定义价格设置
          if (data.custom_price) {
            value.custom_price = evalPrice(data.custom_price)
            hasCustomPrice = true
          } else {
            delete value.custom_price
          }
          value.sku_price = data.sku_price
          nextSkuMap[key] = value
        })

        item.sku_json.sku_map = nextSkuMap
        const prices = Object.values(skuMap).map(sku => sku.sku_price)
        const minSkuPrices = evalPrice(Math.min(...prices))
        const maxSkuPrices = evalPrice(Math.max(...prices))
        item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices

        // 记录自定义价格
        item.customMinSkuPrices = Math.min(...prices)
        item.customMaxSkuPrices = Math.max(...prices)

        if (Number(arithmetic.radio) === 2) {
          item.selectPriceInfo = `已编辑`
          item.selectPriceType = arithmetic.radio
        } else if (
          Number(arithmetic.radio) === 1 &&
          (
            arithmetic.subtraction1 !== template.model.origin_price_diff ||
            arithmetic.subtraction2 !== template.model.group_price_rate ||
            arithmetic.subtraction3 !== template.model.group_price_diff
          )
        ) {
          // 只有设置的公式和统一设置的公式不一致时 需要重设并显示提示文案
          item.selectPriceInfo = `已编辑`
          item.selectPriceType = arithmetic.radio
          // 公式和全局的相同 && 有设置自定义价格
        } else if (Number(arithmetic.radio) === 1 && hasCustomPrice) {
          item.selectPriceInfo = '已编辑'
          item.selectPriceType = 3
        }

        // 公式和全局的相同 && 没有设置自定义价格 则只修改数据 删除自定义标签
        if (Number(arithmetic.radio) === 1 && !hasCustomPrice &&
          arithmetic.subtraction1 === template.model.origin_price_diff &&
            arithmetic.subtraction2 === template.model.group_price_rate &&
            arithmetic.subtraction3 === template.model.group_price_diff
        ) {
          delete item.selectPriceType
          delete item.selectPriceInfo
        }

        item.selectPriceArithmetic = arithmetic
        // 自定义价格设置 修改单个sku 价格设置不变
        if (item.custome_discount_price) {
          item.discount_price = evalPrice(item.custome_discount_price)
        }
        if (item.custome_market_price) {
          item.market_price = evalPrice(item.custome_market_price)
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 修改模版
    updateTemplate ({commit, state}, payload) {
      const tableData = state.tableData
      const updateTemplateKey = payload.key
      const template = payload.template
      const unit = state.unit

      let groupPriceRate = template.model.group_price_rate
      let priceRate = template.model.price_rate

      let originPriceDiff = template.model.origin_price_diff
      let groupPriceDiff = template.model.group_price_diff
      let priceDiff = template.model.price_diff

      // 添加默认模版值
      if (!utils.isNumber(template.model.group_price_rate)) {
        groupPriceRate = 0
      }
      if (!utils.isNumber(template.model.price_rate)) {
        priceRate = 0
      }
      if (!utils.isNumber(template.model.origin_price_diff)) {
        originPriceDiff = 0
      }
      if (!utils.isNumber(template.model.group_price_diff)) {
        groupPriceDiff = 0
      }
      if (!utils.isNumber(template.model.price_diff)) {
        priceDiff = 0
      }
      const nextTableData = tableData.map(item => {
        // 修改模版的时候 删除自定义价格设置
        let oldItem = cloneDeep(item)
        // if (item.selectPriceType && ['origin_price_diff', 'group_price_rate', 'group_price_diff'].includes(key)) return item
        let evalGroupPriceRange = x => accSub(accDiv(accMul(accSub(x, originPriceDiff), groupPriceRate), 100), groupPriceDiff)
        const evalMarketPrice = x => accSub(accDiv(accMul(x, priceRate), 100), priceDiff)
        const evalPrice = financial(unit)

        let skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          let promoPrice = value.promo_price
          let marketPrice = value.price
          value.sku_price = evalPrice(evalGroupPriceRange(promoPrice / 100))
          value.origin_price = evalPrice(value.promo_price / 100)
          value.market_price = evalPrice(marketPrice / 100)
          // value.origin_market_price = evalPrice(value.price / 100)
          value.custome_key = key
          if (['origin_price_diff', 'group_price_rate', 'group_price_diff'].includes(updateTemplateKey)) {
            delete value.custom_price
          }
          nextSkuMap[key] = value
        })

        let skuPrices = Object.values(nextSkuMap).map(sku => sku.origin_price)
        const minSkuPrices = evalPrice(evalGroupPriceRange(Math.min(...skuPrices)))
        const maxSkuPrices = evalPrice(evalGroupPriceRange(Math.max(...skuPrices)))
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.initial_market_price)
        const maxMarketPrices = evalPrice(evalMarketPrice(Math.max(...marketPrices)))

        // sku价格
        if (['origin_price_diff', 'group_price_rate', 'group_price_diff'].includes(updateTemplateKey)) {
          item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          delete item.selectPriceType
          delete item.selectPriceInfo
          delete item.customMinSkuPrices
          delete item.customMaxSkuPrices

          item.sku_json.sku_map = nextSkuMap
          item.minSkuPrices = minSkuPrices
          item.maxSkuPrices = maxSkuPrices
        // 售卖价
        } else if (['is_sale_price_show_max'].includes(updateTemplateKey)) {
          // 自定义价格
          if (oldItem.selectPriceType) {
            item.discount_price = !Number(template.model.is_sale_price_show_max) ? evalPrice(oldItem.customMinSkuPrices) : evalPrice(oldItem.customMaxSkuPrices)
          } else {
            item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          }
          delete item.custome_discount_price
        // 划线价
        } else if (['price_rate', 'price_diff'].includes(updateTemplateKey)) {
          item.market_price = maxMarketPrices
          // 如果是抖音商品，则取商品最小价格作为划线价
          delete item.custome_market_price
          if (item.tp_id === common.TpType.dy) {
            item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
          }
        }

        // 自定义价格设置
        if (item.custome_discount_price) {
          item.discount_price = evalPrice(item.custome_discount_price)
        }
        if (item.custome_market_price) {
          item.market_price = evalPrice(item.custome_market_price)
        }

        return item
      })
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
        const hasRangeSkuPrice = item.group_price_range.toString().includes('~')
        const minPrice = Number(hasRangeSkuPrice ? item.group_price_range.split('~')[0] : item.group_price_range)
        const maxPrice = Number(hasRangeSkuPrice ? item.group_price_range.split('~')[1] : item.group_price_range)

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
      let dicCustomPrices = {}
      state.tableData.forEach((item, index) => {
        const id = item.tp_product_id
        if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
        if (item.discount_price) dicCustomPrices[id].last_discount_price = utils.yuanToFen(item.discount_price)
        if (item.custome_discount_price && item.discount_price) {
          dicCustomPrices[id].discount_price = utils.yuanToFen(item.discount_price)
        }
        if (item.selectPriceType) {
          if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
          const skuMap = item.sku_json.sku_map
          const skuDiffObj = {}
          Object.keys(skuMap).forEach(key => {
            const skuValue = skuMap[key]
            if (!skuDiffObj[key]) skuDiffObj[key] = {}
            skuDiffObj[key].promo_price = utils.yuanToFen(skuValue.sku_price)
          })
          dicCustomPrices[id].sku = skuDiffObj
          // 保存用户的自定义价格设置
          dicCustomPrices[id].selectPriceArithmetic = item.selectPriceArithmetic
        }
        if (item.custome_market_price && item.market_price) {
          if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
          dicCustomPrices[id].price = utils.yuanToFen(item.market_price)
        }
      })
      return dicCustomPrices
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
      return dicCustomPrices
    }
  }
}
