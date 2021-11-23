<template>
    <div class="ModalSingleSkuList relative mt-20">
      <div class="center font-12" style="position:absolute;top:-25px;left:0;right:0;margin-auto">
        <span class="color-4e" v-if="unit === 1" >已选择&nbsp;-&nbsp;保留整数(四舍五入)</span>
        <span class="color-4e" v-if="unit === 10" >已选择&nbsp;-&nbsp;保留一位小数(四舍五入)</span>
        <span class="color-4e" v-if="unit === 100" >已选择&nbsp;-&nbsp;保留两位小数(四舍五入)</span>
      </div>
      <div class="priceChange">
        <el-radio v-model="radio" label="1">
          <span>(原sku价-</span>
          <el-input
            size="mini"
            style="width:100px;"
            v-model="subtraction1"
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
        <span>
          <el-radio v-model="radio" label="2" style="margin-right:5px">
            <span>统一价格为</span>
            <el-input
              size="mini"
              style="width:150px;"
              v-model="textPrice"
              @change="handleTextPriceChange"
              @focus="radio='2'" />
          </el-radio>

        </span>
      </div>
      <span v-if="errorMsgModel" class="fail">{{errorMsgModel}}</span>

      <div class="left mb-10 mt-10">

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
            <el-table-column key="3" width="150" align="center" type="index"   class-name="custom-column">
                <template slot="header" slot-scope="scope">
                    <span>sku价格</span>
                </template>
                <template slot-scope="scope">
                    <div>
                      <el-input
                        :debounce="500"
                        :class="[errorMsg[scope.$index] ? 'warn':'']"
                        :value="scope.row.sku_price"
                        @input="handleSkuChange($event,scope.$index,scope.row)"
                        @clear="handleClearSkuPrice(scope.$index,scope.row)"
                        size="mini"
                      >
                      </el-input>
                      <p class="fail absolute" v-if="errorMsg[scope.$index]">{{errorMsg[scope.$index]}}</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="3" width="250" align="center">
                <template slot="header" slot-scope="scope">
                    <span>原SKU价</span>
                </template>
                <template slot-scope="scope">
                    <div class="color-4e bold" style="width: 100%; padding-left: 18px; font-size: 16px;font-family: MicrosoftYaHei">
                      {{scope.row.origin_price}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="5" label="预览图" width="100" align="center" class-name="cell-tight">
                <template slot-scope="scope">
                  <el-popover
                    placement="left"
                    title=""
                    :value="scope.row.maskShow">
                    <img :src="scope.row.img" style="width: 250px;"/>
                    <el-upload
                        slot="reference"
                        class="el-upload el-upload--picture-card"
                        :show-file-list="false"
                        :on-success="(response, file, fileList) => handleUploadSuccess(response, file, fileList, scope.row)"
                        :on-error="handleUploadError"
                        :before-upload="handleBeforeUpload"
                        action="/api/image/create"
                        :headers="getTokenHeaders"
                        :data="{'belong_type': belongType}"
                        :multiple="false"
                        style="width:50px; height: 50px; line-height: 80px;overflow:hidden"
                    >
                        <img style="height:50px" :src="scope.row.img" class="border-2" v-on:mouseover="handlemouseover(scope.row)"  v-on:mouseleave="handlemouseleave(scope.row)">
                    </el-upload>
                  </el-popover>
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
import { accSub, accDiv, accMul } from '@/common/evalFloat.js'
import utils from '@/common/utils'
import isEqual from 'lodash/isEqual'

function financial (unit) {
  const fix = unit === 100 ? 2 : unit === 10 ? 1 : 0
  return (x) => Number.parseFloat(accDiv(Math.round(accMul(x, unit)), unit)).toFixed(fix)
}

export default {
  name: 'ModalSingleSkuList',
  props: {
    skuData: Object,
    skuPriceStting: Object,
    marketPrice: Number | String
  },
  data () {
    const unit = this.skuPriceStting.unit
    const evalPrice = financial(unit)
    return {
      radio: this.skuPriceStting.radio,
      subtraction1: this.skuPriceStting.subtraction1 || 0,
      subtraction2: this.skuPriceStting.subtraction2 || 100,
      subtraction3: this.skuPriceStting.subtraction3 || 0,
      textPrice: this.skuPriceStting.textPrice ? evalPrice(this.skuPriceStting.textPrice) : '',
      unit: this.skuPriceStting.unit || 100,
      hasRender: false,
      tableData: [],
      originSkuPriceStting: {}
    }
  },
  watch: {
    propsData: {
      handler: function (n) {
        const {skuData, unit, skuPriceStting} = n
        this.originSkuPriceStting = skuPriceStting
        const skuMap = skuData.sku_map
        const skuPropertyMap = skuData.sku_property_map
        const skuPropertyValueMap = skuData.sku_property_value_map
        console.log(skuMap, 'skuMap')

        const nextTableData = Object.keys(skuMap).map(key => {
          const properties = key.split(';')
          let currentColumnData = cloneDeep(skuMap[key])
          currentColumnData.custom_key = key
          const originPriceDiff = this.template.subtraction1
          const groupPriceRate = this.template.subtraction2
          const groupPriceDiff = this.template.subtraction3
          const textPrice = this.template.textPrice
          const evalPrice = financial(unit)
          // 数据回显
          if (
            Number(this.radio) === 1 &&
            currentColumnData.custom_setting_unit &&
            utils.isNumber(this.subtraction1) &&
            utils.isNumber(this.subtraction2) &&
            utils.isNumber(this.subtraction3)
          ) {
            const evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff).toFixed(2)
            console.log(currentColumnData.origin_promo_price, 'currentColumnData.origin_promo_price')
            currentColumnData.sku_price = evalPrice(evalGroupPriceRange(currentColumnData.origin_promo_price))
          }
          if (
            Number(this.radio) === 2 &&
            currentColumnData.custom_setting_unit &&
            utils.isNumber(textPrice) &&
            textPrice
          ) {
            currentColumnData.sku_price = evalPrice(textPrice)
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

        this.tableData = nextTableData
      },
      deep: true,
      immediate: true
    },
    template (n) {
      const unit = n.unit
      const evalPrice = financial(unit)
      let originPriceDiff = n.subtraction1
      let groupPriceRate = n.subtraction2
      let groupPriceDiff = n.subtraction3
      let textPrice = n.textPrice
      // 添加默认 sku公式值
      if (!utils.isNumber(n.subtraction1)) {
        originPriceDiff = 0
      }
      if (!utils.isNumber(n.subtraction2)) {
        groupPriceRate = 0
      }
      if (!utils.isNumber(n.subtraction3)) {
        groupPriceDiff = 0
      }
      console.log(isEqual(n, this.originSkuPriceStting))
      if (
        Number(n.radio) === 1 &&
         utils.isNumber(originPriceDiff) &&
         utils.isNumber(groupPriceRate) &&
         utils.isNumber(groupPriceDiff) &&
         !isEqual(n, this.originSkuPriceStting)
      ) {
        const evalGroupPriceRange = x => ((x - originPriceDiff) * groupPriceRate / 100 - groupPriceDiff).toFixed(2)
        const tableData = this.tableData.map((item, idx) => {
          const nextItem = cloneDeep(item)
          // item.custom_setting_unit = this.template
          // item.custom_setting_sku_price = false
          nextItem.editType = 1
          console.log(nextItem.origin_promo_price, 'nextItem.origin_promo_price')
          nextItem.sku_price = evalPrice(evalGroupPriceRange(nextItem.origin_promo_price))
          this.$set(this.tableData, idx, nextItem)
          return nextItem
        })
        this.custom_setting_unit = true
        this.tableData = tableData
      }
      if (
        Number(n.radio) === 2 &&
          utils.isNumber(textPrice) &&
          evalPrice(textPrice) > 0.01 &&
          evalPrice(textPrice) < 9999999.99 &&
          !isEqual(n, this.originSkuPriceStting)
      ) {
        const tableData = this.tableData.map((item, idx) => {
          const nextItem = cloneDeep(item)
          // item.custom_setting_unit = this.template
          // item.custom_setting_sku_price = false
          nextItem.editType = 1
          nextItem.sku_price = evalPrice(textPrice)
          this.$set(this.tableData, idx, nextItem)
          return nextItem
        })
        this.custom_setting_unit = true
        this.tableData = tableData
      }
      console.log(this.tableData, 'this.tableData')
    }
  },
  computed: {
    template () {
      return {
        radio: this.radio,
        subtraction1: this.subtraction1,
        subtraction2: this.subtraction2,
        subtraction3: this.subtraction3,
        textPrice: this.textPrice,
        unit: this.unit
      }
    },
    propsData () {
      const skuData = this.skuData
      const unit = this.skuPriceStting.unit
      const skuPriceStting = this.skuPriceStting
      console.log(this.skuPriceStting, 'this.skuPriceStting')
      return {skuData, unit, skuPriceStting}
    },
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
      if (Number(this.radio) === 1 && !utils.isNumber(this.subtraction2)) {
        return `sku价格 公式设置 请输入数字，最多${this.parseFloatText}`
      } else if (Number(this.radio) === 2 && !utils.isNumber(this.textPrice)) {
        return `sku价格 统一设置 请输入数字，最多${this.parseFloatText}`
      } else if (Number(this.radio) === 2 && (this.textPrice < 0.01 || this.textPrice > 9999999.99)) {
        return '价格范围：0.01-9999999.99'
      }
      return ''
    },
    disabledBtn () {
      return this.errorMsg.some(item => !isEmpty(item)) || Boolean(this.errorMsgModel)
    },
    errorMsg () {
      function isInteger (obj) {
        return Math.round(accMul(obj, 100)) === accMul(obj, 100)
      }
      return this.tableData.map(item => {
        const price = item.sku_price
        let errorMsg = ''
        if (!utils.isNumber(price)) {
          errorMsg = 'SKU价格请输入数字'
        } else if (price < 0.01 || price > 9999999.99) {
          errorMsg = '价格范围：0.01-9999999.99'
        } else if (!isInteger(price)) {
          errorMsg = `价格最多最多${this.parseFloatText}`
        }
        return errorMsg
      })
    },
    parseFloatText () {
      if (this.unit === 1) {
        return '保留整数(四舍五入)'
      }
      if (this.unit === 10) {
        return '保留一位小数(四舍五入)'
      }
      if (this.unit === 100) {
        return '保留两位小数(四舍五入)'
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
        const nextItem = {
          ...columnData,
          // custom_setting_sku_price: true,
          sku_price: price,
          editType: 2
        }
        this.$set(this.tableData, index, nextItem)
        return nextItem
      })
      this.custom_setting_unit = false
      this.tableData = tableData
    },
    handleClearSkuPrice (index) {
      // 添加默认 sku公式值
      if (!utils.isNumber(this.subtraction1)) {
        this.subtraction1 = 0
      }
      if (!utils.isNumber(this.subtraction3)) {
        this.subtraction3 = 0
      }

      const column = cloneDeep(this.tableData[index])
      let price = column.promo_price / 100
      // 抹角 抹分
      const unit = this.skuPriceStting.unit
      const evalPrice = financial(unit)
      // 根据 自定义设置重设价格
      if (Number(this.radio) === 1 && utils.isNumber(this.subtraction1) && utils.isNumber(this.subtraction2) && utils.isNumber(this.subtraction3)) {
        const evalGroupPriceRange = x => accSub(accDiv(accMul(accSub(x, this.subtraction1), this.subtraction2), 100), this.subtraction3)
        price = evalPrice(evalGroupPriceRange(price))
      } else if (utils.isNumber(this.textPrice) && this.textPrice && Number(this.radio) === 2) {
        price = evalPrice(this.textPrice)
      }
      column.sku_price = price
      // 自定义价格设置删除
      delete column.custom_price

      const tableData = this.tableData.map((item, idx) => {
        if (idx !== index) return item
        this.$set(this.tableData, index, column)
        delete item.custom_price
        return {
          ...item,
          sku_price: price
        }
      })
      this.tableData = tableData
    },
    // 点击确定
    handleSureBatchEdut () {
      // 添加默认 sku公式值
      if (!utils.isNumber(this.subtraction1)) {
        this.subtraction1 = 0
      }
      if (!utils.isNumber(this.subtraction3)) {
        this.subtraction3 = 0
      }
      console.log(this.tableData, 'this.tableData')
      this.$emit('handleSureBatchEdut',
        {
          radio: this.radio,
          subtraction1: this.subtraction1,
          subtraction2: this.subtraction2,
          subtraction3: this.subtraction3,
          textPrice: this.textPrice
        },
        this.tableData
      )
    },
    handleTextPrice (value) {
      if (!utils.isNumber(value)) {
        return value
      }
      this.textPrice = value
    },
    handleTextPriceChange (value) {
      const unit = this.skuPriceStting.unit
      const evalPrice = financial(unit)
      this.textPrice = evalPrice(value)
    },
    handlemouseover (item) {
      this.$set(item, 'maskShow', true)
    },
    handlemouseleave (item) {
      this.$set(item, 'maskShow', false)
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
    .primary {
      color: #1D8FFF;
    }
    /deep/ .el-input__inner{
      font-size:18px;
      color:#333;
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

  /deep/ .custom-column{
    padding:0;
    margin:12px 0;
    position:relative;
  }

  .absolute {
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
  }

}

</style>
