import Api from '@/api/apis'
import common from '@/common/common'

export default {
  namespaced: true,
  state: () => ({
    tableData: []
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
        unit = 100 // 抹角 10 抹分 1
      } = payload

      // sku价格计算公式
      const evalGroupPriceRange = x => (Math.floor(((x - template.model.origin_price_diff) * template.model.group_price_rate / 100 - template.model.group_price_diff) * unit) / unit).toFixed(2)
      // 售卖价 计算公式
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
        item.discount_price = !template.model.is_sale_price_show_max ? minPromoPrices : maxPromoPrices
        // 如果是抖音商品，则取商品最小价格作为划线价
        item.market_price = evalMarketPrice(maxPrices)
        if (item['tp_id'] === common.TpType.dy) {
          item.market_price = evalMarketPrice(minPrices)
        }
        return item
      })
      commit('save', {tableData: nextTableData})
    }

  },
  getters: {
  }
}
