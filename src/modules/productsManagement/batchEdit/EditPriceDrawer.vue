<template>
  <div class="drawer-container">
    <el-row class="drawer-title pt-10">
      <el-col :span="8">
        <span >批量设置(不支持SKU维度的筛选) (价格小于 0 设为 0)</span>
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
     <el-radio v-model="priceHandler.radio" label="1" style="margin-left:15px;">
          <span style="display:inline-block; width:80px">统一价格为</span>
          <el-input v-model="priceHandler.textPrice" size="mini" style="width:100px;"
                    @focus="priceHandler.radio='1'"
          ></el-input>
          <span style="display:inline-block;">元</span>
      </el-radio>
      <el-radio v-model="priceHandler.radio" label="2">
          <span style="display:inline-block; width:100px">每个SKU价格加</span>
          <el-input v-model="priceHandler.textPriceAdd" size="mini" style="width:100px"
                    @focus="priceHandler.radio='2'"
          ></el-input>
          <span style="display:inline-block;">元</span>
      </el-radio>
      <el-radio v-model="priceHandler.radio" label="3">
          <span style="display:inline-block; width:100px">每个SKU价格减</span>
          <el-input v-model="priceHandler.textPriceSub" size="mini" style="width:100px"
                    @focus="priceHandler.radio='3'"
          ></el-input>
          <span style="display:inline-block;">元</span>
      </el-radio>
      <el-radio v-model="priceHandler.radio" label="4">
          <span style="display:inline-block; width:100px">每个SKU价格加</span>
          <el-input v-model="priceHandler.textPricePercentAdd" size="mini" style="width:100px"
                    @focus="priceHandler.radio='4'"
          ></el-input>
          <span style="display:inline-block;">%</span>
      </el-radio>
      <el-radio v-model="priceHandler.radio" label="5">
          <span style="display:inline-block; width:100px">每个SKU价格减</span>
          <el-input v-model="priceHandler.textPricePercentSub" size="mini" style="width:100px"
                    @focus="priceHandler.radio='5'"
          ></el-input>
          <span style="display:inline-block;">%</span>
      </el-radio>
      <el-button type="primary" size="small" @click="batchEditPrice">应用</el-button>
    </div>
  </div>
</template>

<script>
import common from '@/common/common.js'
import { PriceHandler } from '@/common/batchEditHandler'
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
      priceHandler: new PriceHandler()
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
    batchEditPrice () {
      let products = []
      for (let key in this.selectProductDict) {
        products.push(this.selectProductDict[key].model)
      }
      this.priceHandler.handleProducts(products)
    },
    confirmChange () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
