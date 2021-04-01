import Api from '@/api/apis'
import common from '@/common/common'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    originTableData: [],
    unit: 100,
    template: undefined
  }),
  mutations: {
    save (state, payload) {
      Object.assign(state, payload)
    }
  },
  actions: {
    async getTPProductByIds ({commit, state, rootGetters}, payload) {
      try {
        const unit = state.unit
        const template = await this.dispatch('migrate/migrateSettingTemplate/requestTemplate')
        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        const tableData = data.items
        this.dispatch('migrate/migrateSettingPrice/formatTableData', {
          template,
          tableData,
          unit
        })
      } catch (err) {
        console.log(err)
      }
    },
    formatTableData ({commit}, payload) {
      // 1. 获取公式
      // 2. 获取sku 价格
      // 3. 计算价格 设置值
      // 初始值100 抹角 10 抹分 1,
      const {
        template,
        tableData,
        unit = 100
      } = payload

      // sku价格计算公式
      let evalGroupPriceRange = x => (x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff
      // 划线价计算公式
      const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
      // 抹角 抹分
      const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)

      const nextTableData = (tableData || []).map(item => {
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          console.log(key, 'key')
          const value = skuMap[key]
          if (!value.sku_price) {
            value.sku_price = evalPrice(value.promo_price / 100)
            value.origin_price = evalPrice(value.promo_price / 100)
            value.custome_key = key
          }
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 获取价格范围
        const prices = Object.values(nextSkuMap).map(sku => sku.sku_price)
        const minPrices = evalPrice(evalGroupPriceRange(Math.min(...prices)))
        const maxPrices = evalPrice(evalGroupPriceRange(Math.max(...prices)))
        const marketPrice = evalPrice(evalMarketPrice(maxPrices))
        // 设置价格公式
        item.group_price_range = minPrices !== maxPrices ? minPrices + '~' + maxPrices : maxPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minPrices : maxPrices
        item.market_price = marketPrice
        // 如果是抖音商品，则取商品最小价格作为划线价
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalMarketPrice(minPrices)
        }
        return cloneDeep(item)
      })

      commit('save', {tableData: cloneDeep(nextTableData), unit, template})
    },
    // 修改划线价
    marketPriceChange ({commit, state}, payload) {
      const tableData = state.tableData
      const {id, price} = payload
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
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
          item.discount_price = price
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },

    // 清除划线价
    clearMarketPrice ({commit, state}, payload) {
      // const tableData = state.tableData
      // const template = state.template
      // const unit = state.unit
      // const {id} = payload
      // const evalMarketPrice = x => (Math.floor((x * template.model.price_rate / 100 - template.model.price_diff) * unit) / unit)
      // const nextTableData = tableData.map(item => {
      //   if (item.tp_product_id === id) {
      //     const skuMap = item.sku_json.sku_map
      //     const prices = Object.values(skuMap).map(sku => sku.promo_price)
      //     const maxPrices = Math.max(...prices) / 100
      //     item.market_price = evalMarketPrice(maxPrices)
      //   }
      //   return item
      // })
      // commit('save', {tableData: nextTableData, originTableData: nextTableData})
    },
    // 清除售卖价
    clearDiscountPrice ({commit, state}, payload) {
      // const tableData = state.tableData
      // const template = state.template
      // const unit = state.unit
      // const {id} = payload
      // const nextTableData = tableData.map(item => {
      //   if (item.tp_product_id === id) {
      //     const skuMap = item.sku_json.sku_map
      //     const prices = Object.values(skuMap).map(sku => sku.promo_price)
      //     const minPrices = Math.min(...prices) / 100
      //     const maxPrices = Math.max(...prices) / 100

      //     let evalGroupPriceRange = x => (Math.floor(((x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff) * unit) / unit)
      //     if (item.selectPriceType === 1) {
      //       const arithmetic = item.selectPriceArithmetic
      //       evalGroupPriceRange = x => (Math.floor(((x - arithmetic.subtraction1) * arithmetic.subtraction2 / 100 - arithmetic.subtraction3) * unit) / unit)
      //     }
      //     item.discount_price = !Number(template.model.is_sale_price_show_max) ? evalGroupPriceRange(minPrices) : evalGroupPriceRange(maxPrices)
      //     if (item.selectPriceType === 2) {
      //       const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
      //       const arithmetic = item.selectPriceArithmetic
      //       // 如果是抖音商品，则取商品最小价格作为划线价
      //       const price = evalDiscountPrice(arithmetic.textPrice)
      //       item.discount_price = price
      //     }
      //     // 设置单个商品自定义价格
      //     if (item.selectPriceType === 3) {
      //       const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
      //       const arithmetic = item.selectPriceArithmetic
      //       const tableData = arithmetic.tableData
      //       const prices = tableData.map(sku => sku.sku_price)
      //       const minPrices = evalDiscountPrice(Math.min(...prices))
      //       const maxPrices = evalDiscountPrice(Math.max(...prices))
      //       item.discount_price = !Number(template.model.is_sale_price_show_max) ? minPrices : maxPrices
      //     }
      //   }
      //   return item
      // })
      // commit('save', {tableData: nextTableData, originTableData: nextTableData})
    },

    // 单个sku价格的修改
    singleSkuPriceChange ({commit, state}, payload) {
      const {id, arithmetic} = payload
      const singleTableDataData = arithmetic.tableData
      const tableData = state.tableData
      const template = state.template
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id !== id) return item
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          const data = singleTableDataData.find(item => value.sku_id === item.sku_id)
          value.sku_price = data.sku_price
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 划线价计算公式
        const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
        const prices = Object.values(skuMap).map(sku => sku.sku_price)
        const minPrices = Math.min(...prices)
        const maxPrices = Math.max(...prices)
        const marketPrice = evalMarketPrice(maxPrices)
        item.group_price_range = minPrices !== maxPrices ? minPrices + '~' + maxPrices : maxPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minPrices : maxPrices
        item.market_price = marketPrice
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalMarketPrice(minPrices)
        }
        if (Number(arithmetic.radio) === 2) {
          item.selectPriceInfo = `统一价格为 ${arithmetic.textPrice}`
        } else if (
          Number(arithmetic.radio) === 1 &&
          (
            arithmetic.subtraction1 !== template.model.origin_price_diff ||
            arithmetic.subtraction2 !== template.model.group_price_rate ||
            arithmetic.subtraction3 !== template.model.group_price_diff
          )
        ) {
          // 只有设置的公式和统一设置的公式不一致时 需要重设并显示提示文案
          item.selectPriceInfo = `(原价-${arithmetic.subtraction1})x${arithmetic.subtraction2}%-${arithmetic.subtraction3}`
        }
        item.selectPriceType = arithmetic.radio
        item.selectPriceArithmetic = arithmetic
        return item
      })
      commit('save', {tableData: nextTableData})
    }
  },
  getters: {
    tableDataErrorMsg: state => {
      const tableData = state.tableData
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

        if (
          !utils.isNumber(item.discount_price)
        ) {
          discountPriceError = '售卖价请输入数字，最多保留两位小数点'
        } else if (item.discount_price < 0.01 || item.discount_price > 9999999.99) {
          discountPriceError = '售卖价设置范围为：0.01-9999999.99'
        }

        if (
          !utils.isNumber(item.market_price)
        ) {
          marketPriceError = '划线价请输入数字，最多保留两位小数点'
        } else if (Number(item.market_price) < 0.01 || Number(item.market_price) > 9999999.99) {
          marketPriceError = '划线价设置范围为：0.01-9999999.99'
        } else if (maxPrice > Number(item.market_price) || Number(item.market_price) > 9999999.99) {
          marketPriceError = `划线价设置范围为：sku价格最大(${maxPrice})-9999999.99`
        }

        if (Number(item.discount_price) > maxPrice || Number(item.discount_price) < minPrice) {
          discountPriceError = `售卖价设置范围为：sku价格最小(${minPrice})-sku价格最大(${maxPrice})`
        }

        if (minPrice < 0.01 || maxPrice > 9999999.99) {
          groupPriceRangeError = 'SKU价设置范围为：0.01-9999999.99'
        }

        error = Object.assign(
          discountPriceError && {discount_price_error: discountPriceError},
          marketPriceError && {market_price_error: marketPriceError},
          groupPriceRangeError && {group_price_range_error: groupPriceRangeError}
        )
        return error
      })
      return nextTableDataErrorMsg
    }
  }
}
