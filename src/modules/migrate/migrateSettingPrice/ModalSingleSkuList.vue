<!--  -->
<template>
    <div class="ModalSingleSkuList">
      <div class="priceChange">
        <el-radio v-model="radio" label="1" @change="handleChange">
          <span>(原sku价-</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model.number="subtraction1 "
            @input="handleChange"
            @focus="radio='1'"/>
          <span>) x</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model.number="subtraction2"
            @input="handleChange"
            @focus="radio='1'"/>
          <span>% -</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model.number="subtraction3"
            @input="handleChange"
            @focus="radio='1'"/>
        </el-radio>
        <el-radio v-model="radio" label="2" @change="handleChange">
          <span>统一价格为</span>
          <el-input
            size="mini"
            style="width:150px;"
            v-model.number="textPrice"
            @input="handleChange"
            @focus="radio='2'" />
        </el-radio>
      </div>

      <!-- <div class="left">
        <span class="mr-10">抹角</span>
        <span >抹分</span>
      </div> -->

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
            <el-table-column key="3" width="150" align="center" type="index">
                <template slot="header" slot-scope="scope">
                    <span>sku价格</span>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div >
                            <el-input
                              :debounce="500"
                              :value="scope.row.sku_price"
                              @input="handleSkuChange($event,scope.$index,scope.row)"
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
import isEqual from 'lodash/isEqual'

export default {
  name: 'ModalSingleSkuList',
  props: {
    skuData: Object,
    skuPriceStting: Object
  },
  data () {
    return {
      radio: this.skuPriceStting.radio,
      subtraction1: this.skuPriceStting.subtraction1,
      subtraction2: this.skuPriceStting.subtraction2,
      subtraction3: this.skuPriceStting.subtraction3,
      textPrice: this.skuPriceStting.textPrice || '',
      unit: 100
    }
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
        console.log(this.skuData, 'get')
        const skuMap = this.skuData.sku_map
        const skuPropertyMap = this.skuData.sku_property_map
        const skuPropertyValueMap = this.skuData.sku_property_value_map

        const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
        //  nameid valueid name value
        const nextTableData = Object.keys(skuMap).map(key => {
          const properties = key.split(';')
          const currentColumnData = cloneDeep(skuMap[key])
          let promoPrice = 0
          if (Number(this.radio) === 2 && this.textPrice) {
            promoPrice = evalDiscountPrice(this.textPrice)
          } else {
            const evalGroupPriceRange = x => (Math.floor(((x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3) * this.unit) / this.unit).toFixed(2)
            promoPrice = evalGroupPriceRange(currentColumnData.promo_price / 100)
          }

          currentColumnData.sku_price = promoPrice
          currentColumnData.price = evalDiscountPrice(currentColumnData.price / 100)
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
      set: function (n) {
        console.log(n)
      }
    },
    originTableData () {
      const skuMap = this.skuData.sku_map
      const skuPropertyMap = this.skuData.sku_property_map
      const skuPropertyValueMap = this.skuData.sku_property_value_map
      const evalGroupPriceRange = x => (Math.floor(((x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3) * this.unit) / this.unit).toFixed(2)
      const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
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
    }
  },
  methods: {
    handleCancelBatchEdit () {
      this.$emit('handleCancelBatchEdit')
    },
    // 点击确定
    handleSureBatchEdut () {
      const bool = isEqual(this.originTableData, this.tableData)
      console.log(bool)

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
    handleChange () {
      if (Number(this.radio) === 1) {
        // sku价格计算公式
        const evalGroupPriceRange = x => (Math.floor(((x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3) * this.unit) / this.unit).toFixed(2)
        cloneDeep(this.tableData).forEach((item, index) => {
          this.$set(this.tableData, index, {
            ...item,
            sku_price: evalGroupPriceRange(item.promo_price / 100)
          })
        })
      } else if (this.textPrice && Number(this.radio) === 2) {
        const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
        cloneDeep(this.tableData).forEach((item, index) => {
          this.$set(this.tableData, index, {
            ...item,
            sku_price: evalDiscountPrice(this.textPrice)
          })
        })
      }
    },
    handleSkuChange (value, index, columnData) {
      const evalDiscountPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
      this.$set(this.tableData, index, {
        ...columnData,
        sku_price: evalDiscountPrice(value)
      })
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
      padding: 5px;
    }

  }
  .btns{
    margin-top: 20px ;
    display: flex;
    justify-content: center;
  }
}

</style>
