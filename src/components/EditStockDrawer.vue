<template>
  <div class="drawer-container">
    <el-row class="drawer-title">
      <el-col :span="8">
        <span>批量设置(不支持SKU维度的筛选)</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <el-button type="info" size="small" @click="rollbackChange">全部重置</el-button>
        <div v-if="Object.keys(selectProductDict).length === 0" style="display: inline-block; margin-left: 10px;">
          <el-tooltip class="item" effect="dark" placement="top" content="请选择需要修改的商品">
            <span class="button-wrapper">
              <el-button type="primary" size="small" disabled>全部保存</el-button>
            </span>
          </el-tooltip>
        </div>
        <el-button v-else type="primary" size="small" @click="confirmChange">全部保存</el-button>
      </el-col>
    </el-row>
    <div class="drawer-content">
      <el-radio v-model="stockHandler.radio" label="1" style="margin-left:15px;">
          <span style="display:inline-block; width:100px">统一现货库存为</span>
          <el-input v-model="stockHandler.textStock" size="mini" style="width:80px"
                    @focus="stockHandler.radio='1'"
          ></el-input>
      </el-radio>
      <el-radio v-model="stockHandler.radio" label="2">
          <span style="display:inline-block; width:120px">每个SKU现货库存加</span>
          <el-input v-model="stockHandler.textStockAdd" size="mini" style="width:80px"
                    @focus="stockHandler.radio='2'"
          ></el-input>
      </el-radio>
      <el-radio v-model="stockHandler.radio" label="3">
          <span style="display:inline-block; width:120px">每个SKU现货库存减</span>
          <el-input v-model="stockHandler.textStockSub" size="mini" style="width:80px"
                    @focus="stockHandler.radio='3'"
          ></el-input>
          <span class="explain">&nbsp; 小于 0 设为 0</span>
      </el-radio><br>
     <el-radio v-model="stepStockHandler.radio" label="1" style="margin-left:15px;">
          <span style="display:inline-block; width:100px">统一阶梯库存为</span>
          <el-input v-model="stepStockHandler.textStock" size="mini" style="width:80px"
                    @focus="stepStockHandler.radio='1'"
          ></el-input>
      </el-radio>
      <el-radio v-model="stepStockHandler.radio" label="2">
          <span style="display:inline-block; width:120px">每个SKU阶梯库存加</span>
          <el-input v-model="stepStockHandler.textStockAdd" size="mini" style="width:80px"
                    @focus="stepStockHandler.radio='2'"
          ></el-input>
      </el-radio>
      <el-radio v-model="stepStockHandler.radio" label="3">
          <span style="display:inline-block; width:120px">每个SKU阶梯库存减</span>
          <el-input v-model="stepStockHandler.textStockSub" size="mini" style="width:80px"
                    @focus="stepStockHandler.radio='3'"
          ></el-input>
          <span class="explain">&nbsp; 小于 0 设为 0</span>
      </el-radio>
      <el-button type="primary" size="mini" @click="batchEditStock">应用</el-button>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js'
import { StockHandler } from '@/common/batchEditHandler'
export default {
  components: {},
  props: {
    field: String,
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      beyondWordsOptType: 0,
      stockHandler: new StockHandler(),
      stepStockHandler: new StockHandler('step_quantity')
    }
  },
  computed: {
    PRODUCT_TITLE_LIMIT () {
      return common.PRODUCT_TITLE_LIMIT
    }
  },
  mounted () {
  },
  methods: {
    rollbackChange () {
      this.$emit('rollback')
    },
    batchEditStock () {
      let products = []
      let productsWithStep = []
      for (let key in this.selectProductDict) {
        products.push(this.selectProductDict[key].model)
        if (this.selectProductDict[key].model.presell_type === 2) {
          productsWithStep.push(this.selectProductDict[key].model)
        }
      }
      this.stockHandler.handleProducts(products)
      this.stepStockHandler.handleProducts(productsWithStep)
    },
    confirmChange () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
