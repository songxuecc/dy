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
            @input="handleChange($event,'subtraction1')"
            @focus="radio='1'"/>
          <span>) x</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction2"
            @input="handleChange($event,'subtraction2')"
            @focus="radio='1'"/>
          <span>% -</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction3"
            @input="handleChange($event,'subtraction3')"
            @focus="radio='1'"/>
        </el-radio>
        <el-radio v-model="radio" label="2">
          <span>统一价格为</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="textPrice"
            @input="handleChange($event,'textPrice')"
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
                              v-model="scope.row.sku_price"
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
                    <img style="height:50px" :src="scope.row.img" class="border-2">
                </template>
            </el-table-column>
        </el-table>
        <div class="btns">
          <el-button style="width: 120px" @click="handleCancelBatchEdit" plain type="primary">取消</el-button>
          <el-button style="width: 120px" type="primary" @click="handleSureBatchEdut">确定</el-button>
        </div>

    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'ModalSingleSkuList',
  props: {
    skuData: Object,
    skuPriceStting: Object
  },
  data () {
    return {
      radio: '1',
      subtraction1: this.skuPriceStting.origin_price_diff,
      subtraction2: this.skuPriceStting.group_price_rate,
      subtraction3: this.skuPriceStting.group_price_diff,
      textPrice: '',
      unit: 100
    }
  },
  watch: {
    // subtraction1 (n) {
    //   console.log(n, 'n')
    // },
    // skuData (n) {
    //   console.log(n, 'skuData')
    // }
  },
  computed: {
    skuPropertyList () {
      const skuPropertyMap = this.skuData.sku_property_map
      if (isEmpty(skuPropertyMap)) {
        return [{
          id: 0,
          name: '规格',
          filters: [
            {
              text: '默认规格',
              value: '默认规格'
            }
          ]
        }]
      }
      const skuPropertyList = Object.keys(this.skuData.sku_property_map).map(key => {
        const filters = Object.values(this.skuData.sku_property_value_map[key]).map(item => ({
          text: item.value,
          value: item.value
        }))
        return {...this.skuData.sku_property_map[key], filters}
      })
      return skuPropertyList
    },
    tableData: {
      get: function () {
        console.log(this.skuData, 'this.skuData')
        const skuMap = this.skuData.sku_map
        const skuPropertyMap = this.skuData.sku_property_map
        const skuPropertyValueMap = this.skuData.sku_property_value_map
        const evalGroupPriceRange = x => (Math.floor(((x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3) * this.unit) / this.unit).toFixed(2)
        const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
        // const evalGroupPriceRange = x => (x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3
      //  nameid valueid name value
        const nextTableData = Object.keys(skuMap).map(key => {
          const properties = key.split(';')
          const currentColumnData = cloneDeep(skuMap[key])
          const promoPrice = evalGroupPriceRange(currentColumnData.promo_price / 100)
          currentColumnData.price = evalDiscountPrice(currentColumnData.price / 100)
          currentColumnData.sku_price = promoPrice
          const column = {}
        // 默认规格设置
          if (isEmpty(skuPropertyMap)) {
            return {...currentColumnData, '规格': '默认规格'}
          }
        // 有规格的设置
          properties.forEach(item => {
            const [propertyKey, propertyValueKey] = item.split(':')
            const nextProperty = skuPropertyValueMap[propertyKey][propertyValueKey]
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
      },
      set: function (newValue) {
        console.log(newValue, 'newValue')
      }
    }
  },
  methods: {
    handleCancelBatchEdit () {
      this.$emit('handleCancelBatchEdit')
    },
    handleSureBatchEdut () {
      this.$emit('handleSureBatchEdut', {
        radio: this.radio,
        subtraction1: this.subtraction1,
        subtraction2: this.subtraction2,
        subtraction3: this.subtraction3,
        textPrice: this.textPrice
      })
    },
    filterHandler (value, row, column) {
      const property = column.property
      return row[property] === value
    },
    handlePriceChange () {

    },
    handleChange (value, key) {
      if (Number(this.radio) === 1) {
        // sku价格计算公式

        const evalGroupPriceRange = x => (Math.floor(((x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3) * this.unit) / this.unit).toFixed(2)
        cloneDeep(this.tableData).forEach((item, index) => {
          this.$set(this.tableData, index, {
            ...item,
            sku_price: evalGroupPriceRange(item.promo_price / 100)
          })
        })
      } else {
        const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
        cloneDeep(this.tableData).forEach((item, index) => {
          this.$set(this.tableData, index, {
            ...item,
            sku_price: evalDiscountPrice(value)
          })
        })
      }
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
