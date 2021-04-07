<!--  -->
<template>
    <div class="ModalSingleSkuList">
      <div class="priceChange">
        <el-radio v-model="radio" label="1" >
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
        <el-radio v-model="radio" label="2" >
          <span>统一价格为</span>
          <el-input
            size="mini"
            style="width:150px;"
            v-model="textPrice"
            @focus="radio='2'" />
        </el-radio>
      </div>
      <span v-if="errorMsgModel" class="fail">{{errorMsgModel}}</span>

      <div class="left mb-10 mt-10">
        <el-radio-group v-model="unit" size="small" @change="toFixFloat">
          <el-tooltip placement="top" content="价格保留到整数">
            <el-radio-button :label="1" >抹角</el-radio-button>
          </el-tooltip>
          <el-tooltip placement="top" content="价格保留一位小数">
            <el-radio-button :label="10" >抹分</el-radio-button>
          </el-tooltip>
          <el-tooltip placement="top" content="价格还原到初始化">
            <el-radio-button :label="100" >还原</el-radio-button>
          </el-tooltip>
        </el-radio-group>
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
            <el-table-column key="3" width="150" align="center" type="index">
                <template slot="header" slot-scope="scope">
                    <span>sku价格</span>
                </template>
                <template slot-scope="scope">
                    <div>
                      <el-input
                        :debounce="500"
                        :class="[scope.row.errorMsg ? 'warn':'']"
                        clearable
                        :value="scope.row.sku_price"
                        @input="handleSkuChange($event,scope.$index,scope.row)"
                        @clear="handleClearSkuPrice(scope.$index,scope.row)"
                        size="mini"
                      >
                      </el-input>
                      <p class="fail left" v-if="errorMsg[scope.$index]">{{errorMsg[scope.$index]}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="3" width="250" align="center">
                <template slot="header" slot-scope="scope">
                    <span>原SKU价</span>
                </template>
                <template slot-scope="scope">
                    <div class="great" style="width: 100%; padding-left: 18px; font-size: 16px;">
                      {{scope.row.origin_price}}
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
          <el-button style="width: 120px" type="primary" @click="handleSureBatchEdut" :disabled="disabledBtn">确定</el-button>
        </div>
    </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty'
import cloneDeep from 'lodash/cloneDeep'
import utils from '@/common/utils'

export default {
  name: 'ModalSingleSkuList',
  props: {
    skuData: Object,
    skuPriceStting: Object,
    marketPrice: Number | String
  },
  data () {
    return {
      radio: this.skuPriceStting.radio,
      subtraction1: this.skuPriceStting.subtraction1,
      subtraction2: this.skuPriceStting.subtraction2,
      subtraction3: this.skuPriceStting.subtraction3,
      textPrice: this.skuPriceStting.textPrice || '',
      unit: this.skuPriceStting.unit || 100,
      errorMsg: []
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
    errorMsgModel () {
      if (Number(this.radio) === 1 && (!utils.isNumber(this.subtraction1) || !utils.isNumber(this.subtraction2) || !utils.isNumber(this.subtraction3))) {
        return 'sku价格公式设置 请输入数字，最多保留两位小数点'
      } else if (Number(this.radio) === 2 && !utils.isNumber(this.textPrice)) {
        return 'sku价格公式设置 请输入数字，最多保留两位小数点'
      } else if (Number(this.radio) === 2 && (this.textPrice < 0.01 || this.textPrice > 9999999.99)) {
        return '价格统一设置范围为：0.01-9999999.99'
      }
      return ''
    },
    disabledBtn () {
      return this.errorMsg.some(item => !isEmpty(item)) && this.errorMsgModel
    },
    tableData: {
      get: function () {
        const skuMap = this.skuData.sku_map
        const skuPropertyMap = this.skuData.sku_property_map
        const skuPropertyValueMap = this.skuData.sku_property_value_map
        const nextTableData = Object.keys(skuMap).map(key => {
          const properties = key.split(';')
          const currentColumnData = cloneDeep(skuMap[key])
          // 抹角 抹分
          const evalPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
          // 根据 自定义设置重设价格
          if (Number(this.radio) === 1 && utils.isNumber(this.subtraction1) && utils.isNumber(this.subtraction2) && utils.isNumber(this.subtraction3)) {
            const evalGroupPriceRange = x => (x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3
            currentColumnData.sku_price = evalPrice(evalGroupPriceRange(currentColumnData.sku_price))
          } else if (utils.isNumber(this.textPrice) && this.textPrice && Number(this.radio) === 2) {
            currentColumnData.sku_price = evalPrice(this.textPrice)
          }
          // 规格设置
          let column = {}
          // 默认规格设置
          if (isEmpty(skuPropertyMap)) {
            return {...currentColumnData, '规格': '默认规格'}
          }
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
      set: function (newVal) {
        function isInteger (obj) {
          return Math.floor(obj * 100) === obj * 100
        }
        console.log(newVal, 'newVal')
        this.errorMsg = newVal.map(item => {
          const price = item.sku_price
          let errorMsg = ''
          if (!utils.isNumber(price)) {
            errorMsg = 'SKU价格请输入数字'
          } else if (price < 0.01 || price > 9999999.99) {
            errorMsg = 'SKU价格设置范围为：0.01-9999999.99'
          } else if (!isInteger(price)) {
            errorMsg = '价格最多最多保留两位小数点'
          }
          return errorMsg
        })
      }
    }
  },
  methods: {
    handleCancelBatchEdit () {
      this.$emit('handleCancelBatchEdit')
    },
    filterHandler (value, row, column) {
      const property = column.property
      return row[property] === value
    },
    handleSkuChange (price, index, columnData) {
      const tableData = this.tableData.map((item, idx) => {
        if (idx !== index) return item
        this.$set(this.tableData, index, {
          ...columnData,
          sku_price: price
        })
        return {
          ...columnData,
          sku_price: price
        }
      })
      this.tableData = tableData
    },
    handleClearSkuPrice (index) {
      const column = cloneDeep(this.tableData[index])
      let price = column.promo_price / 100
      // 抹角 抹分
      const evalPrice = x => (Math.floor(x * this.unit) / this.unit).toFixed(2)
      // 根据 自定义设置重设价格
      if (Number(this.radio) === 1 && utils.isNumber(this.subtraction1) && utils.isNumber(this.subtraction2) && utils.isNumber(this.subtraction3)) {
        const evalGroupPriceRange = x => (x - this.subtraction1) * this.subtraction2 / 100 - this.subtraction3
        price = evalPrice(evalGroupPriceRange(price))
      } else if (utils.isNumber(this.textPrice) && this.textPrice && Number(this.radio) === 2) {
        price = evalPrice(this.textPrice)
      }
      column.sku_price = price

      const tableData = this.tableData.map((item, idx) => {
        if (idx !== index) return item
        this.$set(this.tableData, index, column)
        return {
          ...item,
          sku_price: price
        }
      })
      this.tableData = tableData
    },
    toFixFloat (unit) {
      this.unit = unit
    },
    // 点击确定
    handleSureBatchEdut () {
      this.$emit('handleSureBatchEdut', {
        radio: this.radio,
        subtraction1: this.subtraction1,
        subtraction2: this.subtraction2,
        subtraction3: this.subtraction3,
        textPrice: this.textPrice,
        tableData: this.tableData,
        unit: this.unit
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
    padding-bottom: 15px;
    padding-top: 15px;
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

  .warn {
    color: #E02020;

    /deep/ .el-input__inner {
      border: 1px solid #E02020;
      background-color: @background-color-danger;
    }
  }

}

</style>
