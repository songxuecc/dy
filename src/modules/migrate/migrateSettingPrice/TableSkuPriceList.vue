<!--  -->
<template>
  <div class="TableSkuPriceList">
    <div class="left mb-10">
      <el-radio-group v-model="float" size="small" @change="toFixFloat">
        <el-radio :label="1" >保留整数(四舍五入)</el-radio>
        <el-radio :label="10" >保留一位小数(四舍五入)</el-radio>
        <el-radio :label="100" >保留两位小数(四舍五入)</el-radio>
        <el-radio :label="-1" >统一设置小数部分为
          <el-tooltip content="请填写大于0小于1的数。如填写0.8，则原价9元的商品将变为9.8元" placement="top-start">
            <span class="relative">
              <el-input v-model="every_decimal"  @input="handleEveryDecimal" :debounce="500" controls-position="right" @focus="focus" size="mini" :precision="2" :step="0.01" :max="0.99" :min="0.01" placeholder="请填写数字" style="width:110px" class="numberInput"/>
              <span class="tipNumber" v-if="tipNumberShow">请填写大于0小于1的数字。</span>
            </span>
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <span class="click mr-20 pointer ml-20" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/tl4g0a'"><hh-icon type="icontishi-dengpao" ></hh-icon>如何设置价格？</span>
    </div>
    <el-table :data="tableData" style="width: 100%;min-height:270px">
      <el-table-empty slot="empty" />
      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <span class="primary" @click="handleDelete(scope.row)">删除</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="98" align="center">
        <template slot-scope="scope">
          <HhImage :src="scope.row.thumbnail" style="height:50px;max-width:65px" class="mr-10 border-2"/>
        </template>
      </el-table-column>
      <el-table-column label="标题" width="380">
        <div slot-scope="scope" class="left">
          <el-link
            :href="scope.row.url"
            target="_blank"
            :underline="false"
            class="font-13"
            >{{ scope.row.title }}</el-link
          >
          <div class="font-12" v-if="scope.row.tp_outer_iid">
            商家编码: {{ scope.row.tp_outer_iid }}
          </div>
        </div>
      </el-table-column>

      <el-table-column align="center"  class-name="custom-column">
        <template slot="header" slot-scope="scope">
          <span class="font-14 mb-10">sku价格=
            <el-tooltip content="SKU价格公式输入必须为数字" v-if="templateError.group_price_rate" placement="top">
              <hh-icon type="iconjinggao1" style="font-size:14px"></hh-icon>
            </el-tooltip>
          </span>
          <span>
            <span> (&nbsp;原价 - </span>
            <el-tooltip content="一般填0，若源商品含运费则可以加上运费后再设置百分比。比如源商品运费是10元，则填-10" placement="top">
              <el-input
                :class="[templateError.origin_price_diff ? 'warn':'']"
                :debounce="500"
                style="width: 55px"
                :value="template.model.origin_price_diff"
                @input="handleSkuPriceChange($event,'origin_price_diff')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>)
            <span> x </span>
            <el-tooltip content="乘以百分比，比如填120，则是原价*120%，赚取20%的利润。保持不变请填100" placement="top">
              <el-input
                :class="[templateError.group_price_rate ? 'warn':'']"
                :debounce="500"
                style="width: 55px"
                :value="template.model.group_price_rate"
                @input="handleSkuPriceChange($event,'group_price_rate')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>
            <span class="th-title-text"> % - </span>
            <el-tooltip content="可以为负数，若要加价50元，则填-50" placement="top">
              <el-input
                :class="[templateError.group_price_diff ? 'warn':'']"
                :debounce="500"
                style="width: 55px"
                :value="template.model.group_price_diff"
                @input="handleSkuPriceChange($event,'group_price_diff')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>
          </span>
        </template>
        <template slot-scope="scope">
          <span class="price">{{getGroupPriceRange(scope.row)}}</span>
          <hh-icon
            type="iconbianji"
            style="font-size: 12px"
            class="pointer"
            @click="showSkuPrice(scope.row)"
            :class="[tableDataErrorMsg[scope.$index].group_price_range_error ? 'warn':'']"
          />
          <span class="info tutorials" v-if="getSelectInfo(scope.row)">{{getSelectInfo(scope.row)}}</span>
          <span class="fail absolute" v-if="tableDataErrorMsg[scope.$index].group_price_range_error">{{tableDataErrorMsg[scope.$index].group_price_range_error}}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      center
      append-to-body
      title="批量修改单商品sku价格"
      :visible.sync="dialogSkuPriceVisible"
      width="900px"
      :close-on-click-modal="false"
      :show-close="false"
      ref="dialog"
      style="margin-top:-80px;"
    >
    <ModalSingleSkuList
      ref="modalSingleSkuList"
      v-if="dialogSkuPriceVisible"
      :skuData="selectTpProductSkuJson"
      :unit="unit"
      @handleCancelBatchEdit="closeSkuPriceListView"
      @handleSureBatchEdut="handleSureBatchEdut"
      :skuPriceStting="selectTpProductSkuPriceStting"
      :marketPrice="marketPrice" />
    </el-dialog>

    <el-dialog
      title="价格示例"
      :visible.sync="isShowSample"
      width="30%"
      :append-to-body="true"
    >
       <el-image src="https://sf1-ttcdn-tos.pstatp.com/obj/ecom-luban-cdn/shopfxg3/images/Z9gCP.png">
        <div slot="placeholder" class="image-slot">
          <hh-icon type="iconwuzhaopian" style="font-size:390px"></hh-icon>
          <div class="info mt-20">加载中...</div>
        </div>
      </el-image>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowSample = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import ModalSingleSkuList from './ModalSingleSkuList'
import utils from '@/common/utils'
import debounce from 'lodash/debounce'

export default {
  name: 'TableSkuPriceList',
  props: {
    msg: String
  },
  components: {
    ModalSingleSkuList
  },
  data () {
    return {
      isShowSample: false,
      dialogSkuPriceVisible: false,
      selectTpProductSkuJson: undefined,
      selectTpProductSkuId: undefined,
      selectTpProductSkuPriceStting: undefined,
      marketPrice: undefined,
      float: '',
      tipNumberShow: false
    }
  },
  async activated () {
    this.getTPProductByIds()
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'unit', 'every_decimal']),
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices' // 本地价格设置
    }),
    templateError () {
      const keys = [
        {property: 'group_price_rate'},
        {property: 'price_rate'}
      ]
      let obj = {}
      keys.map(key => {
        obj[key.property] = !utils.isNumber(this.template.model[key.property])
      })
      this.$emit('templateError', obj)
      return obj
    }
  },
  watch: {
    unit: {
      handler: function (newVal) {
        this.float = newVal
      },
      deep: true
    },
    every_decimal: {
      handler: function (newVal) {
        // this.every_decimal = newVal
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('migrate/migrateSettingPrice', [
      'getTPProductByIds',
      'unitChange',
      'marketCustomeChange',
      'skuPriceCustomeChange',
      'discountChange',
      'discountCustomeChange',
      'clearMarketPrice',
      'clearDiscountPrice',
      'parsetIntFloat',
      'skuPriceChange',
      'deleteRow',
      'everyDecimalChange'
    ]),
    ...mapActions('migrate/migrateSettingTemplate', [
      'requestTemplate',
      'saveTempTemplate'
    ]),
    toFixFloat: debounce(function (unit) {
      let value = this.every_decimal

      if (unit === -1) {
        if (value && utils.isNumber(value) && value > 0 && value < 1) {
          this.unitChange({
            unit,
            everyDecimal: Math.floor(value * 100) / 100,
            change: true
          })
        } else {
          this.unitChange({
            unit,
            everyDecimal: value,
            change: false
          })
          this.$message.warning('请输入0-1的数字')
        }
      } else {
        this.unitChange({
          unit,
          everyDecimal: value,
          change: false
        })
      }
    },
    300,
    {
      leading: true
    }),
    // 设置划线价
    handleMarketPrice (price, id, oldValue) {
      this.marketCustomeChange({
        price,
        id
      })
    },
    handleClearMarketPrice (id) {
      this.clearMarketPrice({
        id
      })
    },
    // 设置售卖价高低
    setSalePrice () {
      this.salePriceChange({
        tableData: this.tableData,
        isSalePriceShowMax: this.template.model.is_sale_price_show_max
      })
    },
    // 设置售卖价
    handleDiscountPrice (price, id) {
      this.discountCustomeChange({
        price,
        id
      })
    },
    handleClearDiscountPrice (id) {
      this.clearDiscountPrice({
        id
      })
    },
    toggleIsShowSample () {
      this.isShowSample = true
    },
    closeSkuPriceListView () {
      this.dialogSkuPriceVisible = false
    },
    showSkuPrice (selectTpProduct) {
      this.selectTpProductSkuJson = selectTpProduct.sku_json
      this.selectTpProductSkuId = selectTpProduct.tp_product_id
      this.marketPrice = selectTpProduct.market_price
      if (selectTpProduct.custom_setting_unit) {
        this.selectTpProductSkuPriceStting = {
          ...selectTpProduct.custom_setting_unit,
          unit: this.unit,
          every_decimal: this.template.model.ext_json.every_decimal
        }
      } else {
        this.selectTpProductSkuPriceStting = {
          subtraction1: this.template.model.origin_price_diff,
          subtraction2: this.template.model.group_price_rate,
          subtraction3: this.template.model.group_price_diff,
          textPrice: '',
          radio: '1',
          unit: this.unit,
          every_decimal: this.template.model.ext_json.every_decimal
        }
      }
      this.dialogSkuPriceVisible = true
    },
    handleSureBatchEdut (arithmetic, skuData) {
      this.closeSkuPriceListView()
      this.skuPriceCustomeChange({
        id: this.selectTpProductSkuId,
        arithmetic,
        skuData
      })
    },
    handleSkuPriceChange (value, key) {
      this.template.model[key] = value
      this.$nextTick(() => {
        this.skuPriceChange({
          template: this.template,
          key
        })
      })
    },
    getGroupPriceRange (row) {
      const skuMap = row.sku_json.sku_map
      const skuPricesValues = Object.values(skuMap)
        .map(sku => sku.sku_price)
        .sort((a, b) => a - b)
      const minSkuPrices = skuPricesValues[0]
      const maxSkuPrices = skuPricesValues[skuPricesValues.length - 1]
      return minSkuPrices === maxSkuPrices ? maxSkuPrices : `${minSkuPrices}~${maxSkuPrices}`
    },
    getSelectInfo (row) {
      let msg = ''
      const skuMap = row.sku_json.sku_map
      const showMsg = Object.values(skuMap).map(sku => sku.editType).some(item => item !== 0)
      if (showMsg) {
        msg = '已编辑'
      }
      return msg
    },
    // 删除
    handleDelete (row) {
      this.$confirm('确认删除该商品?', '', {
        showClose: false,
        confirmButtonText: '确认，删除',
        cancelButtonText: '点错了',
        type: 'warning',
        cancelButtonClass: 'TableSkuPriceList-cancelButtonClass',
        confirmButtonClass: 'TableSkuPriceList-confirmButtonClass',
        customClass: 'TableSkuPriceList-customClass'
      }).then(() => {
        this.deleteRow(row)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    },
    focus () {
      this.float = -1
      this.toFixFloat(-1)
    },
    handleEveryDecimal (value) {
      let unit = this.float
      if (unit === -1) {
        if (value && utils.isNumber(value) && value > 0 && value < 1) {
          if (value >= 1) {
            value = 0.99
          }

          if (value <= 0) {
            value = 0.01
          }
          value = Math.floor(value * 100) / 100
          this.unitChange({
            unit,
            everyDecimal: value,
            change: true
          })
          this.tipNumberShow = false
        } else {
          this.unitChange({
            unit,
            everyDecimal: value,
            change: false
          })
          this.tipNumberShow = true
        }
      } else {
        this.unitChange({
          unit,
          everyDecimal: value,
          change: false
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>

.TableSkuPriceList {
  /deep/ .el-input {
    width: 110px;
  }

  .price-sku-input {
    /deep/ .el-input__inner {
      padding: 2px;
      width: 44px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #1d8fff;
      font-weight: bold;
    }
  }
  .price-sale-input {
    /deep/ .el-input__inner {
      padding: 5px;
      width: 110px;
      height: 38px;
      border-radius: 4px;
      border: 1px solid #ebebeb;
      font-size: 18px;
      font-family: MicrosoftYaHei;
      color: #4e4e4e;
      line-height: 24px;
      font-weight: bold;
    }
  }

  .price {
    width: 103px;
    height: 24px;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #4e4e4e;
    line-height: 24px;
    font-weight: bold;
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
    bottom: 0;
  }

  .tutorials {
    transform: scale(0.7);
  }
  .numberInput {
    // /deep/ .el-input-number__decrease{
    //   display: none;
    // }
    // /deep/ .el-input-number__increase {
    //   display: none;
    // }
    /deep/ .el-input__inner{
      // padding-left: 10px;
      // padding-right: 10px;
      // text-align: left;
    }
  }
}

.tipNumber {
  position: absolute;
  bottom:-22px;
  left: 0;
  color:red;
}

</style>

<style lang="less">
.TableSkuPriceList-cancelButtonClass{
    padding: 10px;
    font-size: 12px;
    margin-right: 10px;
    width: 100px;

}

.TableSkuPriceList-confirmButtonClass{
    padding: 10px;
    font-size: 12px;
    width: 100px;
}

.TableSkuPriceList-customClass {
  padding-bottom: 25px;
  .el-message-box__btns {
    text-align: center;
  }
  .el-message-box__content {
    .el-message-box__message {
      padding-left: 0;
    }
    p {
      font-size: 18px;
      margin: 15px 0 10px;
      text-align: center;
    }
    .el-icon-warning {
      display: none;
    }
  }
}

</style>
