import Api from '@/api/apis'
import common from '@/common/common'

export default {
  namespaced: true,
  state: () => ({
    tableData: [],
    unit: 100
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
    formatTableData ({commit, state, rootGetters}, payload) {
      const {
        template,
        tableData,
        unit = 100, // 抹角 10 抹分 1,
        singleSkuPrice
      } = payload

      // sku价格计算公式
      const evalGroupPriceRange = x => (Math.floor(((x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff) * unit) / unit).toFixed(2)
      // 售卖价 公式 和 抹角抹分格式化价格 都可用的公式
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      // 划线价计算公式
      const evalMarketPrice = x => (Math.floor((x * template.model.price_rate / 100 - template.model.price_diff) * unit) / unit).toFixed(2)

      const nextTableData = (tableData || []).map(item => {
        const skuMap = item.sku_json.sku_map
        const prices = Object.values(skuMap).map(sku => sku.price)
        const promoPrices = Object.values(skuMap).map(sku => sku.promo_price)
        const minPrices = Math.min(...prices) / 100
        const maxPrices = Math.max(...prices) / 100
        const minPromoPrices = Math.min(...promoPrices) / 100
        const maxPromoPrices = Math.max(...promoPrices) / 100
        // sku 价格 遍历 shu-json price的最小最大
        // 售卖价格 sku -json的promo_price的最低和最高
        // 划线价  sku-json price的最高值
        item.group_price_range = minPrices !== maxPrices ? evalGroupPriceRange(minPrices) + ' ~ ' + evalGroupPriceRange(maxPrices) : evalGroupPriceRange(minPrices)
        item.discount_price = evalDiscountPrice(!template.model.is_sale_price_show_max ? minPromoPrices : maxPromoPrices)
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = evalMarketPrice(maxPrices)
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalMarketPrice(minPrices)
        }

        // 修改单个sku商品
        if (singleSkuPrice) {
          const id = singleSkuPrice.id
          const arithmetic = singleSkuPrice.arithmetic
          if (item.tp_product_id === id && arithmetic.radio === '7') {
            item.group_price_range = arithmetic.textPrice
            item.selectPriceInfo = `统一价格为 ${arithmetic.textPrice}`
          } else if (item.tp_product_id === id && arithmetic.radio === '6') {
            const evalSingleSkuGroupPriceRange = x => (Math.floor(((x - arithmetic.subtraction1) * arithmetic.subtraction2 / 100 - arithmetic.subtraction3) * unit) / unit).toFixed(2)
            const singleGroupPriceRange = minPrices !== maxPrices ? evalSingleSkuGroupPriceRange(minPrices) + ' ~ ' + evalSingleSkuGroupPriceRange(maxPrices) : evalSingleSkuGroupPriceRange(minPrices)
            // 只有设置的公式和统一设置的公式不一致时 需要重设并显示提示文案
            if (singleGroupPriceRange !== item.group_price_range) {
              item.group_price_range = singleGroupPriceRange
              item.selectPriceInfo = `(原价-${arithmetic.subtraction1})x${arithmetic.subtraction2}%-${arithmetic.subtraction3}`
            } else {
              item.selectPriceInfo = ''
            }
          }
        }
        return item
      })
      commit('save', {tableData: nextTableData, unit})
    },
    // 修改划线价
    marketPriceChange ({commit, state, rootGetters}, payload) {
      const tableData = state.tableData
      const unit = state.unit
      const {id, price} = payload
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.market_price = evalDiscountPrice(price)
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    },
    // 修改售卖价
    discountPriceChange  ({commit, state, rootGetters}, payload) {
      const tableData = state.tableData
      const unit = state.unit
      const {id, price} = payload
      const evalDiscountPrice = x => (Math.floor(x * unit) / unit).toFixed(2)
      const nextTableData = tableData.map(item => {
        if (item.tp_product_id === id) {
          item.discount_price = evalDiscountPrice(price)
        }
        return item
      })
      console.log(nextTableData)
      commit('save', {tableData: nextTableData})
    }
  },
  getters: {
  }
}
