import Api from '@/api/apis'
import common from '@/common/common'
import utils from '@/common/utils'
import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    originTableData: [],
    unit: 100,
    template: undefined,
    dicCustomPrices: {}
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
        const unit = state.unit
        const {template, dicCustomPrices} = await this.dispatch('migrate/migrateSettingTemplate/requestTemplate')
        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        const tableData = data.items
        this.dispatch('migrate/migrateSettingPrice/formatTableData', {
          template,
          tableData,
          unit,
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
        unit = 100,
        origin = false,
        dicCustomPrices = state.dicCustomPrices
      } = payload

      const oldUnit = state.unit

      // todo 如果有dicCustomPrices 就使用历史价格dicCustomPrices
      // sku价格计算公式
      let evalGroupPriceRange = x => (x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff
      // 划线价计算公式
      const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
      // 抹角 抹分
      const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)

      const nextTableData = (tableData || []).map(item => {
        // 修改unit 自定义设置数据只改变单位
        if (oldUnit !== unit && item.selectPriceType) {
          const minSkuPrices = evalPrice(item.minSkuPrices)
          const maxSkuPrices = evalPrice(item.maxSkuPrices)
          item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
          item.market_price = evalPrice(item.market_price)
          return item
        }

        // 设置自定义 价格 则不改变数据
        if (item.selectPriceType) return item

        const id = item.tp_product_id
        let skuMap = cloneDeep(item.sku_json.sku_map)

        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          if (!value.sku_price) {
            let promoPrice = value.promo_price
            let marketPrice = value.price
            // 恢复历史sku价格
            // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id].sku && dicCustomPrices[id].sku[key]) {
            //   promoPrice = dicCustomPrices[id].sku[key].promo_price
            // }

            // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id].sku && dicCustomPrices[id].sku[key]) {
            //   marketPrice = dicCustomPrices[id].sku[key].price
            // }
            value.sku_price = evalPrice(promoPrice / 100)
            value.origin_price = evalPrice(promoPrice / 100)
            value.market_price = evalPrice(marketPrice / 100)
            value.origin_market_price = evalPrice(marketPrice / 100)
            value.custome_key = key
          }
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 获取价格范围
        const skuPrices = Object.values(nextSkuMap).map(sku => sku.sku_price)
        const minSkuPrices = evalPrice(evalGroupPriceRange(Math.min(...skuPrices)))
        const maxSkuPrices = evalPrice(evalGroupPriceRange(Math.max(...skuPrices)))

        // 划线价 价格范围
        const marketPrices = Object.values(nextSkuMap).map(sku => sku.market_price)
        // const minMarketPrices = evalPrice(evalGroupPriceRange(Math.min(...marketPrices)))
        const maxMarketPrices = evalGroupPriceRange(Math.max(...marketPrices))
        const marketPrice = evalPrice(evalMarketPrice(maxMarketPrices))
        // 设置价格公式
        item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices

        item.minSkuPrices = Math.min(...skuPrices)
        item.maxSkuPrices = Math.max(...skuPrices)
        item.maxMarketPrices = Math.max(...marketPrices)

        // 恢复历史售卖价
        // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id].discount_price) {
        //   item.discount_price = evalPrice(dicCustomPrices[id].discount_price / 100)
        // }
        // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id].last_discount_price) {
        //   item.discount_price = evalPrice(dicCustomPrices[id].last_discount_price / 100)
        // }

        // 设置划线价
        item.market_price = marketPrice
        // 如果是抖音商品，则取商品最小价格作为划线价
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
        }
        // 恢复历史划线价格
        // if (origin && !isEmpty(dicCustomPrices) && dicCustomPrices[id].price) {
        //   item.market_price = evalPrice(dicCustomPrices[id].price / 100)
        // }
        return cloneDeep(item)
      })

      commit('save', {tableData: cloneDeep(nextTableData), unit, template})
      // 保存初始化价格结果设置
      if (origin) {
        commit('save', {originTableData: cloneDeep(nextTableData)})
      }
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
      const tableData = state.tableData
      const template = state.template
      const unit = state.unit
      const {id} = payload
      const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
      const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.market_price = evalPrice(evalMarketPrice(item.maxMarketPrices))
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
      let evalGroupPriceRange = x => (x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff
      const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          const minSkuPrices = evalPrice(evalGroupPriceRange(item.minSkuPrices))
          const maxSkuPrices = evalPrice(evalGroupPriceRange(item.maxSkuPrices))
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
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
      const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id !== id) return item
        const skuMap = cloneDeep(item.sku_json.sku_map)
        let nextSkuMap = {}
        Object.keys(skuMap).forEach(key => {
          const value = skuMap[key]
          const data = singleTableDataData.find(item => value.sku_id === item.sku_id)
          value.sku_price = data.sku_price
          if (data.custom_price) {
            value.custom_price = data.custom_price
          }
          value.sku_price = data.sku_price
          nextSkuMap[key] = value
        })
        item.sku_json.sku_map = nextSkuMap
        // 划线价计算公式
        // const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
        const prices = Object.values(skuMap).map(sku => sku.sku_price)
        const minSkuPrices = evalPrice(Math.min(...prices))
        const maxSkuPrices = evalPrice(Math.max(...prices))
        // const marketPrice = evalMarketPrice(maxSkuPrices)
        item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
        item.minSkuPrices = Math.min(...prices)
        item.maxSkuPrices = Math.max(...prices)
        // item.market_price = marketPrice
        // if (item['tp_id'] === common.TpType.dy) {
        //   item.market_price = evalMarketPrice(minSkuPrices)
        // }
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
    },
    updateTemplate ({commit, state}, payload) {
      const tableData = state.tableData
      const key = payload.key
      const template = payload.template
      const unit = state.unit
      const nextTableData = tableData.map(item => {
        if (item.selectPriceInfo && ['origin_price_diff', 'group_price_rate', 'group_price_diff'].includes(key)) return item
        let evalGroupPriceRange = x => (x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff
        const evalMarketPrice = x => x * template.model.price_rate / 100 - template.model.price_diff
        const evalPrice = x => (Math.floor(x * unit) / unit).toFixed(2)

        const minSkuPrices = evalPrice(evalGroupPriceRange(item.minSkuPrices))
        const maxSkuPrices = evalPrice(evalGroupPriceRange(item.maxSkuPrices))
        const maxMarketPrices = evalPrice(evalMarketPrice(item.maxMarketPrices))
        // sku价格
        if (['origin_price_diff', 'group_price_rate', 'group_price_diff'].includes(key)) {
          item.group_price_range = minSkuPrices !== maxSkuPrices ? minSkuPrices + '~' + maxSkuPrices : maxSkuPrices
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
        // 售卖价
        } else if (['is_sale_price_show_max'].includes(key)) {
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minSkuPrices : maxSkuPrices
        // 划线价
        } else if (['price_rate', 'price_diff', 'group_price_diff'].includes(key)) {
          item.market_price = maxMarketPrices
          // 如果是抖音商品，则取商品最小价格作为划线价
          if (item.tp_id === common.TpType.dy) {
            item.market_price = evalPrice(evalMarketPrice(item.min_price / 100))
          }
        }
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
          marketPriceError = `划线价需大于等于sku最高价`
        }

        if (Number(item.discount_price) > maxPrice || Number(item.discount_price) < minPrice) {
          discountPriceError = `售卖价必须在sku价格范围内`
        }

        if (minPrice < 0.01 || maxPrice > 9999999.99) {
          groupPriceRangeError = 'SKU价设置范围为：0.01-9999999.99'
        }

        if (discountPriceError) error.discount_price_error = discountPriceError
        if (marketPriceError) error.market_price_error = marketPriceError
        if (groupPriceRangeError) error.group_price_range_error = groupPriceRangeError
        return error
      })
      return nextTableDataErrorMsg
    }
  }
}
