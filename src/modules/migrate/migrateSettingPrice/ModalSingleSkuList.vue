<!--  -->
<template>
    <div class="ModalSingleSkuList">
      <div class="priceChange">
        <el-radio v-model="radio" label="1">
          <span>(原sku价-</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction1 "
            @focus="radio='1'"/>
          <span>) x</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction2"
            @focus="radio='1'"/>
          <span>% -</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction3"
            @focus="radio='1'"/>
        </el-radio>
        <el-radio v-model="radio" label="2">
          <span>统一价格为</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="textPrice"
            @focus="radio='2'" />
        </el-radio>
      </div>

      <div class="left">
        <span class="mr-10">抹角</span>
        <span >抹分</span>
      </div>

      <!-- sku价格表 -->
        <el-table
          ref="skuListTable"
          :data="tableData"
          row-key="tp_product_id"
          style="width: 100%"
          :cell-class-name="cellClassName">
            <el-table-empty slot="empty"/>
            <el-table-column v-for="(item, index) in skuPropertyList" :key="index+':'+item.id"
            :column-key="item.id"
            :prop="item.name"
            :filters="item.filters"
            :filter-method="filterHandler">
                <template slot="header" slot-scope="scope">
                    <span >{{ item.name }}</span>
                </template>
                <template slot-scope="scope">
                    {{ scope.row[item.name]}}
                </template>
            </el-table-column>
            <el-table-column key="3" width="150" align="center">
                <template slot="header" slot-scope="scope">
                    <span>sku价格</span>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div >
                            <el-input
                              v-model="scope.row.promo_price"
                              size="mini"
                            >
                            </el-input>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="3" width="250" align="center">
                <template slot="header" slot-scope="scope">
                    <span>原划线价</span>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div class="great" style="width: 100%; padding-left: 18px; font-size: 16px;">
                          {{scope.row.price}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="5" label="预览图" width="100" align="center" class-name="cell-tight">
                <template slot-scope="scope">
                    <img style="height:40px" :src="scope.row.img">
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
          <el-button style="width: 120px" @click="handleCancelBatchEdit">取消</el-button>
          <el-button style="width: 120px" type="primary" @click="handleSureBatchEdut">确定</el-button>
        </div>

    </div>
</template>

<script>
export default {
  name: 'ModalSingleSkuList',
  props: {
    data: Object
  },
  data () {
    return {
      radio: '1',
      subtraction1: 0,
      subtraction2: 1,
      subtraction3: 1,
      textPrice: 4,
      unit: 100
    }
  },
  computed: {
    skuPropertyList () {
      const skuPropertyList = Object.keys(this.data.sku_property_map).map(key => {
        const filters = Object.values(this.data.sku_property_value_map[key]).map(item => ({
          text: item.value,
          value: item.value
        }))
        return {...this.data.sku_property_map[key], filters}
      })
      return skuPropertyList
    },
    tableData () {
      const skuMap = this.data.sku_map
      const skuPropertyMap = this.data.sku_property_map
      const skuPropertyValueMap = this.data.sku_property_value_map
      const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
      //  nameid valueid name value
      const nextTableData = Object.keys(skuMap).map(key => {
        const properties = key.split(';')
        const currentColumnData = skuMap[key]
        currentColumnData.price = evalDiscountPrice(currentColumnData.price)
        currentColumnData.promo_price = evalDiscountPrice(currentColumnData.promo_price)
        const column = {}
        properties.forEach(item => {
          const [propertyKey, propertyValueKey] = item.split(':')
          const nextProperty = skuPropertyValueMap[propertyKey][propertyValueKey]
          // const nameId = skuPropertyMap[propertyKey].id
          // const valueId = propertyValueKey
          const name = skuPropertyMap[propertyKey].name
          const value = nextProperty.value
          column[name] = value
        })
        return {
          ...currentColumnData,
          ...column
        }
      })
      return nextTableData
    }
  },
  methods: {
    handleCancelBatchEdit () {
      this.$emit('handleCancelBatchEdit')
    },
    handleSureBatchEdut () {
      this.$emit('handleCancelBatchEdit')
    },
    filterHandler (value, row, column) {
      const property = column['property']
      return row[property] === value
    }
  }
}
</script>
<style lang="less" scoped>

.ModalSingleSkuList {
  /deep/ .el-table td, .el-table th{
    padding: 2px 0 !important;
  }
  .priceChange{
    display: flex;
    justify-content: space-around;
    align-items: center;
    background: #F3F9FF;
    border: 1px dashed #1D8FFF;
    margin-bottom: 20px;
    padding-bottom: 20px;
    padding-top: 20px;
    margin-top: 20px;
    span {
      font-size: 12px;
      color: #4E4E4E;
    }
    /deep/ .el-input__inner{
      font-size:18px;
      color:#1D8FFF;
    }

  }
  .btns{
    margin-top: 20px ;
    display: flex;
    justify-content: center;
  }
}

</style>
