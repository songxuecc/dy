<!-- 我的页面 -->
<template>
  <div >
    <Title class="mt-5 mb-5" />
    <TableSkuPriceList ref="tableSkuPriceList" @templateError="handleTemplateError"
      v-loading="loadingGetTPProductByIds" />
    <div class="common-bottom flex justify-c">
      <el-button style="margin-right: 15px; width:120px" @click="goback" :disabled="loadingGetTPProductByIds" plain
        type="primary" :loading="loadingGetTPProductByIds">返回</el-button>
      <div>
        <el-button type="primary" :disabled="msgError || loadingGetTPProductByIds" @click="toSetTemplate"
          :loading="loadingGetTPProductByIds">下一步：修改模板</el-button>
        <NewComer type="下一步：修改模板" ref="newComer">
          <div class="left">
            <div style="width:180px" class="color-666 font-12">点击此处进行下一步操作</div>
            <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
          </div>
        </NewComer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import Title from './Title'
import TableSkuPriceList from './TableSkuPriceList'
import NewComer from '@/components/NewComer.vue'
import isEmpty from 'lodash/isEmpty'
import utils from '@/common/utils'

export default {
  data () {
    return {
      templateError: true
    }
  },
  components: {
    Title,
    TableSkuPriceList,
    NewComer
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'originTableData']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate'
      // dicCustomPrices: 'getDicCustomPrices' // 本地价格设置
    }),
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg']),
    ...mapState({
      loadingGetTPProductByIds: state => state['@@loading'].effects['migrate/migrateSettingPrice/getTPProductByIds']
    }),
    msgError () {
      return this.tableDataErrorMsg.some(item => !isEmpty(item)) || this.templateError
    }
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  methods: {
    ...mapActions('migrate/migrateSettingTemplate', [
      'saveTempTemplate'
    ]),
    ...mapMutations('migrate/migrateSettingTemplate', ['save']),
    beforeunloadFn (e) {
      // if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {

      e = e || window.event
      if (!this.template.isDiff()) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    handleTemplateError (value) {
      this.templateError = Object.values(value).some(item => item)
    },
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    },
    toSetTemplate () {
      console.log('toSetTemplate')
      // 1. 检查 列表的error和 model的error 是否为空
      // 检查sku价格模版是否有设置为空 空则自动添加数据
      // 检查模版是否更新 否则更新模版
      // 拼接sku 自定义价格的数据
      // 设置CustomerPrices 在回显的时候使用
      // 保存当前数据 如果再次进入 获取当前数据 再进行拼接
      // 比较originTableData 和 tableData 拼接成 CustomerPrices的值
      // 抹角 抹分 last_discount_price 手工修改划线价触发price
      // 手工修改售卖价触发 discount_price
      // sku 修改prompt_price
      if (this.msgError) return false
      let dicCustomPrices = {}
      this.tableData.forEach((item, index) => {
        const originTableData = this.originTableData
        const originItem = originTableData[index]
        const id = item.tp_product_id
        if (Number(item.discount_price) !== Number(originItem.discount_price)) {
          if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
          dicCustomPrices[id].discount_price = utils.yuanToFen(item.discount_price)
          dicCustomPrices[id].last_discount_price = utils.yuanToFen(item.discount_price)
        }
        if (item.selectPriceType) {
          console.log(item, 'item')
          if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
          const skuMap = item.sku_json.sku_map
          const skuDiffObj = {}
          Object.keys(skuMap).forEach(key => {
            const skuValue = skuMap[key]
            if (!skuDiffObj[key]) skuDiffObj[key] = {}
            skuDiffObj[key].promo_price = utils.yuanToFen(skuValue.sku_price)
          })
          dicCustomPrices[id].sku = skuDiffObj
        }
        if (Number(item.market_price) !== Number(originItem.market_price)) {
          if (!dicCustomPrices[id]) dicCustomPrices[id] = {}
          dicCustomPrices[id].price = utils.yuanToFen(item.market_price)
        }
      })
      console.log(dicCustomPrices, '自定义价格设置-dicCustomPrices')
      this.save({
        dicCustomPrices
      })
      this.saveTempTemplate()
      this.$router.push({
        path: '/migrateSettingTemplate'
      })
    },
    goback () {
      this.$router.push({
        name: 'ProductList',
        params: {
          keepStatus: true
        }
      })
    }

  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
