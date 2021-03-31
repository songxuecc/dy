import Api from '@/api/apis'
import common from '@/common/common'

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
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
        const template = await this.dispatch('migrate/migrateSettingTemplate/requestTemplate')
        const params = {
          tp_product_ids: rootGetters.getSelectTPProductIdList,
          need_sku: true
        }
        const data = await Api.hhgjAPIs.getTPProductByIds(params)
        const tableData = data.items
        this.dispatch('migrate/migrateSettingPrice/formatTableData', {
          template,
          tableData
        })
      } catch (err) {
        console.log(err)
      }
    },
    formatTableData ({commit}, payload) {
      const {
        template,
        tableData,
        unit = 100 // 抹角 10 抹分 1,
      } = payload

      // sku价格计算公式
      let evalGroupPriceRange = x => (Math.floor(((x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff) * unit) / unit)
      // 划线价计算公式
      const evalMarketPrice = x => (Math.floor((x * template.model.price_rate / 100 - template.model.price_diff) * unit) / unit)

      const nextTableData = (tableData || []).map(item => {
        const skuMap = item.sku_json.sku_map
        const prices = Object.values(skuMap).map(sku => sku.price)
        // const promoPrices = Object.values(skuMap).map(sku => sku.promo_price)
        // const minPromoPrices = Math.min(...promoPrices) / 100
        // const maxPromoPrices = Math.max(...promoPrices) / 100
        const minPrices = Math.min(...prices) / 100
        const maxPrices = Math.max(...prices) / 100
        // sku 价格 遍历 shu-json price的最小最大
        // 售卖价格 sku -json的promo_price的最低和最高
        // 划线价  sku-json price的最高值

        // 设置单个商品自定义自选价格的公式
        if (item.selectPriceType === 1) {
          console.log(item.selectPriceType, item.selectPriceArithmetic, 'item.selectPriceType')
          const arithmetic = item.selectPriceArithmetic
          evalGroupPriceRange = x => (Math.floor(((x - arithmetic.subtraction1) * arithmetic.subtraction2 / 100 - arithmetic.subtraction3) * unit) / unit)
        }

        // 设置价格公式
        item.group_price_range = minPrices !== maxPrices ? evalGroupPriceRange(minPrices) + '~' + evalGroupPriceRange(maxPrices) : evalGroupPriceRange(maxPrices)
        item.discount_price = !Number(template.model.is_sale_price_show_max) ? evalGroupPriceRange(minPrices) : evalGroupPriceRange(maxPrices)
          // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = evalMarketPrice(maxPrices)

        // 设置单个商品自定义价格公式
        if (item.selectPriceType === 2) {
          const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
          const arithmetic = item.selectPriceArithmetic
          // 如果是抖音商品，则取商品最小价格作为划线价
          const price = evalDiscountPrice(arithmetic.textPrice)
          item.group_price_range = price
          item.discount_price = price
        }

        // 设置单个商品自定义价格
        if (item.selectPriceType === 3) {
          const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
          const arithmetic = item.selectPriceArithmetic
          const tableData = arithmetic.tableData
          const prices = tableData.map(sku => sku.sku_price)
          const minPrices = evalDiscountPrice(Math.min(...prices))
          const maxPrices = evalDiscountPrice(Math.max(...prices))
          const singleGroupPriceRange = minPrices !== maxPrices ? minPrices + ' ~ ' + maxPrices : minPrices
          item.group_price_range = singleGroupPriceRange
          item.discount_price = !Number(template.model.is_sale_price_show_max) ? minPrices : maxPrices
        }

        // 抖音商品 取真实划线价
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalMarketPrice(minPrices)
        }

        return item
      })
      commit('save', {tableData: nextTableData, unit, template})
    },
    // 修改划线价
    marketPriceChange ({commit, state, rootGetters}, payload) {
      const tableData = state.tableData
      const unit = state.unit
      const {id, price} = payload
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.market_price = evalDiscountPrice(price)
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 修改售卖价
    discountPriceChange  ({commit, state}, payload) {
      const {id, price} = payload
      const tableData = state.tableData
      const unit = state.unit
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.discount_price = evalDiscountPrice(price)
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 单个sku价格的修改
    singleSkuPriceChange ({commit, state}, payload) {
      const {id, arithmetic} = payload
      console.log(arithmetic, 'arithmetic')
      const tableData = state.tableData
      const unit = state.unit
      const model = state.template.model
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit)
      const nextTableData = tableData.map(item => {
        const skuMap = item.sku_json.sku_map
        const prices = Object.values(skuMap).map(sku => sku.price)
        const minPrices = Math.min(...prices) / 100
        const maxPrices = Math.max(...prices) / 100
        item.selectPriceArithmetic = arithmetic
        // 修改单个商品sku 选择统一价格
        if (item.tp_product_id === id && Number(arithmetic.radio) === 2) {
            // 重设sku价格后 需要重新设置售卖价的范围
          const price = evalDiscountPrice(arithmetic.textPrice)
          item.group_price_range = price
          item.selectPriceInfo = `统一价格为 ${price}`
          item.selectPriceType = 2
          item.discount_price = price
        // 修改单个商品sku 选择价格公式
        } else if (item.tp_product_id === id && Number(arithmetic.radio) === 1) {
          const evalSingleSkuGroupPriceRange = x => (Math.floor(((x - arithmetic.subtraction1) * arithmetic.subtraction2 / 100 - arithmetic.subtraction3) * unit) / unit)
          const singleGroupPriceRange = minPrices !== maxPrices ? evalSingleSkuGroupPriceRange(minPrices) + ' ~ ' + evalSingleSkuGroupPriceRange(maxPrices) : evalSingleSkuGroupPriceRange(minPrices)
          if (item.group_price_range !== singleGroupPriceRange) {
            item.group_price_range = singleGroupPriceRange
            // 重设sku价格后 需要重新设置售卖价的范围
            item.discount_price = !Number(model.is_sale_price_show_max) ? evalSingleSkuGroupPriceRange(minPrices) : evalSingleSkuGroupPriceRange(maxPrices)
          }
          // 只有设置的公式和统一设置的公式不一致时 需要重设并显示提示文案
          if (
            arithmetic.subtraction1 !== model.origin_price_diff &&
            arithmetic.subtraction2 !== model.group_price_rate &&
            arithmetic.subtraction3 !== model.group_price_diff
          ) {
            item.selectPriceInfo = `(原价-${arithmetic.subtraction1})x${arithmetic.subtraction2}%-${arithmetic.subtraction3}`
            item.selectPriceType = 1
          } else {
            item.selectPriceInfo = ''
          }
        }

        // 修改单个商品sku价格
        if (item.tp_product_id === id && !arithmetic.changeSingleSku) {
          const tableData = arithmetic.tableData
          const prices = tableData.map(sku => sku.sku_price)
          const minPrices = evalDiscountPrice(Math.min(...prices))
          const maxPrices = evalDiscountPrice(Math.max(...prices))
          const singleGroupPriceRange = minPrices !== maxPrices ? minPrices + ' ~ ' + maxPrices : minPrices
          item.group_price_range = singleGroupPriceRange
          item.discount_price = !Number(model.is_sale_price_show_max) ? minPrices : maxPrices
          item.selectPriceType = 3
        }

        return item
      })
      commit('save', {tableData: nextTableData})
    }
  },
  getters: {
  }
}
