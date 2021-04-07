<!--  -->
<template>
  <div class="TableSkuPriceList">
    <div class="left mb-10">
      <el-radio-group v-model="float" size="small" @change="toFixFloat">
        <el-radio :label="1" >保留整数</el-radio>
        <el-radio :label="10" >保留一位小数</el-radio>
        <el-radio :label="100" >保持原价格</el-radio>
      </el-radio-group>
    </div>
    <el-table :data="tableData" style="width: 100%;min-height:270px">
      <el-table-empty slot="empty" />
      <el-table-column label="图片" width="78" align="center">
        <template slot-scope="scope">
          <img
            style="height: 50px"
            :src="scope.row.thumbnail"
            class="border-2"
            v-if="scope.row.thumbnail"
          />
          <hh-icon v-else type="iconwuzhaopian" style="font-size:50px" />
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
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

      <el-table-column align="center" width="280">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">sku价格=
            <el-tooltip content="SKU价格公式输入必须为数字" v-if="templateError.origin_price_diff || templateError.group_price_rate || templateError.group_price_diff" placement="top">
              <hh-icon type="iconjinggao1" style="font-size:14px"></hh-icon>
            </el-tooltip>
          </p>
          <div>
            <span> (&nbsp;原价 - </span>
            <el-tooltip content="一般填0，若源商品含运费则可以加上运费后再设置百分比。比如源商品运费是10元，则填-10" placement="top">
              <el-input
                :debounce="500"
                style="width: 55px"
                :value="template.model.origin_price_diff"
                @input="handleSetTemplate($event,'origin_price_diff')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>
            <span> x </span>
            <el-tooltip content="乘以百分比，比如填120，则是原价*120%，赚取20%的利润。保持不变请填100" placement="top">
              <el-input
                :debounce="500"
                style="width: 55px"
                :value="template.model.group_price_rate"
                @input="handleSetTemplate($event,'group_price_rate')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>)
            <span class="th-title-text"> % - </span>
            <el-tooltip content="可以为负数，若要加价50元，则填-50" placement="top">
              <el-input
                :debounce="500"
                style="width: 55px"
                :value="template.model.group_price_diff"
                @input="handleSetTemplate($event,'group_price_diff')"
                size="mini"
                class="price-sku-input"
              />
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <div>
            <span class="price">{{ scope.row.group_price_range }}</span>
            <hh-icon
              type="iconbianji"
              style="font-size: 12px"
              class="pointer"
              @click="showSkuPrice(scope.row)"
              :class="[tableDataErrorMsg[scope.$index].group_price_range_error ? 'warn':'']"
            />
          </div>
          <p class="info" v-if="scope.row.selectPriceInfo">{{scope.row.selectPriceInfo}}</p>
          <p class="fail" v-if="tableDataErrorMsg[scope.$index].group_price_range_error">{{tableDataErrorMsg[scope.$index].group_price_range_error}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="180">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">售卖价</p>
          <el-radio-group
            class="font-14"
            v-model.number="template.model.is_sale_price_show_max"
            @change="handleSetTemplate($event,'is_sale_price_show_max')"
            size="mini"
          >
            <el-radio-button label="0">最低价</el-radio-button>
            <el-radio-button label="1">最高价</el-radio-button>
          </el-radio-group>
        </template>
        <template slot-scope="scope">
            <el-input
              :debounce="500"
              size="mini"
              class="price-sale-input"
              :value="scope.row.discount_price"
              @input="handleDiscountPrice($event,scope.row.tp_product_id)"
              @clear="handleClearDiscountPrice(scope.row.tp_product_id)"
              :class="[tableDataErrorMsg[scope.$index].discount_price_error ? 'warn':'']"
              clearable
            />
            <p class="fail" v-if="tableDataErrorMsg[scope.$index].discount_price_error">{{tableDataErrorMsg[scope.$index].discount_price_error}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="230">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">
            划线价=
            <span class="color-primary pointer" @click="toggleIsShowSample"
              >查看示例</span
            >
            <el-tooltip content="划线价公式输入必须为数字" v-if="templateError.price_rate || templateError.price_diff" placement="top">
              <hh-icon type="iconjinggao1" style="font-size:14px"></hh-icon>
            </el-tooltip>
          </p>
          <div>
            <span> 原划线价 x </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              :value="template.model.price_rate"
              @input="handleSetTemplate($event,'price_rate')"
              size="mini"
              class="price-sku-input"
            />
            <span class="th-title-text"> % - </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              :value="template.model.price_diff"
              @input="handleSetTemplate($event,'price_diff')"
              size="mini"
              class="price-sku-input"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-input
            :debounce="500"
            size="mini"
            class="price-sale-input"
            :value="scope.row.market_price"
            @input="handleMarketPrice($event,scope.row.tp_product_id)"
            @clear="handleClearMarketPrice(scope.row.tp_product_id)"
            :class="[tableDataErrorMsg[scope.$index].market_price_error ? 'warn':'']"
            clearable
          />
          <p class="fail" v-if="tableDataErrorMsg[scope.$index].market_price_error">{{tableDataErrorMsg[scope.$index].market_price_error}}</p>
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
import SkuPriceListView from './SkuPriceListView'
import utils from '@/common/utils'

export default {
  name: 'TableSkuPriceList',
  props: {
    msg: String
  },
  components: {
    ModalSingleSkuList,
    SkuPriceListView
  },
  data () {
    return {
      isShowSample: false,
      dialogSkuPriceVisible: false,
      selectTpProductSkuJson: undefined,
      selectTpProductSkuId: undefined,
      selectTpProductSkuPriceStting: undefined,
      marketPrice: undefined,
      float: 100
    }
  },
  async activated () {
    this.getTPProductByIds()
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'unit']),
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices' // 本地价格设置
    }),
    templateError () {
      const keys = [
        {property: 'origin_price_diff'},
        {property: 'group_price_rate'},
        {property: 'group_price_diff'},
        {property: 'price_rate'},
        {property: 'price_diff'}
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
    // template: {
    //   handler: function (template, oldTemplate) {
    //     if (Object.values(this.templateError).some(item => item)) {
    //       return false
    //     }

    //   },
    //   deep: true
    // }
  },
  methods: {
    ...mapActions('migrate/migrateSettingPrice', [
      'getTPProductByIds',
      'formatTableData',
      'marketPriceChange',
      'singleSkuPriceChange',
      'discountPriceChange',
      'clearMarketPrice',
      'clearDiscountPrice',
      'parsetIntFloat',
      'updateTemplate'
    ]),
    ...mapActions('migrate/migrateSettingTemplate', [
      'requestTemplate',
      'saveTempTemplate'
    ]),
    toFixFloat (unit) {
      this.formatTableData({
        tableData: this.tableData,
        template: this.template,
        unit
      })
    },
    // 设置划线价
    handleMarketPrice (price, id, oldValue) {
      this.marketPriceChange({
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
      this.discountPriceChange({
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
      console.log(this.$refs, 'this.$refs')
      this.$refs.modalSingleSkuList && this.$refs.modalSingleSkuList.toggleHasRender()
      if (selectTpProduct.selectPriceType) {
        this.selectTpProductSkuPriceStting = selectTpProduct.selectPriceArithmetic
      } else {
        this.selectTpProductSkuPriceStting = {
          subtraction1: this.template.model.origin_price_diff,
          subtraction2: this.template.model.group_price_rate,
          subtraction3: this.template.model.group_price_diff,
          textPrice: '',
          radio: '1',
          unit: this.unit
        }
      }
      this.dialogSkuPriceVisible = true
    },
    handleSureBatchEdut (arithmetic) {
      this.closeSkuPriceListView()
      console.log(arithmetic, 'arithmetic')
      this.singleSkuPriceChange({
        id: this.selectTpProductSkuId,
        arithmetic
      })
    },
    handleSetTemplate (value, key) {
      if (!utils.isNumber(value)) {
        return value
      }
      if (!value) {
        value = 0
      }
      this.template.model[key] = value

      this.updateTemplate({
        template: this.template,
        key
      })
    }
  }
}
</script>
<style lang="less" scoped>

.TableSkuPriceList {
  /deep/ .el-input {
    width: 150px;
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
      width: 150px;
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

}

</style>
