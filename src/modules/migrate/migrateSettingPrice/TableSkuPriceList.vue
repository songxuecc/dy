<!--  -->
<template>
  <div>
    <div class="left">
      <span @click="toFixFloat(1)" class="mr-10">抹角</span>
      <span @click="toFixFloat(10)">抹分</span>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-empty slot="empty" />
      <el-table-column label="图片" width="86" align="center">
        <template slot-scope="scope">
          <img
            style="height: 50px"
            :src="scope.row.thumbnail"
            class="border-2"
          />
        </template>
      </el-table-column>

      <el-table-column label="标题" align="center" width="210">
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

      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">sku价格=</p>
          <div>
            <span> 原价 - </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              v-model="template.model.origin_price_diff"
              size="mini"
              class="price-sku-input"
            />
            <span> x </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              v-model="template.model.group_price_rate"
              size="mini"
              class="price-sku-input"
            />
            <span class="th-title-text"> % - </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              v-model="template.model.group_price_diff"
              size="mini"
              class="price-sku-input"
            />
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
            />
          </div>
          <p class="info" v-if="scope.row.selectPriceInfo">{{scope.row.selectPriceInfo}}</p>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">售卖价</p>
          <el-radio-group
            class="font-14"
            v-model="template.model.is_sale_price_show_max"
            size="mini"
            @change="getSalePrice"
          >
            <el-radio-button label="0">最低价</el-radio-button>
            <el-radio-button label="1">最高价</el-radio-button>
          </el-radio-group>
        </template>
        <template slot-scope="scope">
          <el-input
            :debounce="500"
            style="width: 55px"
            :value="scope.row.discount_price"
            @input="handleDiscountPrice($event,scope.row.tp_product_id)"
            size="mini"
            class="price-sale-input"
          />
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">
            划线价=
            <span class="color-primary pointer" @click="toggleIsShowSample"
              >查看示例</span
            >
          </p>
          <div>
            <span> 原划线价 x </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              v-model="template.model.price_rate"
              size="mini"
              class="price-sku-input"
            />
            <span class="th-title-text"> % - </span>
            <el-input
              :debounce="500"
              style="width: 55px"
              v-model="template.model.price_diff"
              size="mini"
              class="price-sku-input"
            />
          </div>
        </template>
        <template slot-scope="scope">
          <el-input
            :debounce="500"
            style="width: 55px"
            :value="scope.row.market_price"
            @input="handleMarketPrice($event,scope.row.tp_product_id)"
            size="mini"
            class="price-sale-input"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      center
      append-to-body
      title="批量修改单商品sku价格"
      :visible.sync="dialogSkuPriceVisible"
      width="900px"
      @opened="dialogSkuPriceOpened"
      @close="dialogSkuPriceClose"
      :close-on-click-modal="false"
      :show-close="false"
    >
    <ModalSingleSkuList
    ref="ModalSingleSkuList"
    :data="selectTpProduct"/>
      <!-- <sku-price-list-view
        ref="skuPriceListView"
        :defaultValue="skuPriceListViewMapActive"
        :template="template"
        @closeSkuPriceListView="closeSkuPriceListView"
        :tpProduct="selectTpProduct"
      /> -->
    </el-dialog>

    <el-dialog
      title="价格示例"
      :visible.sync="isShowSample"
      width="30%"
      :append-to-body="true"
    >
      <el-image
        src="https://sf1-ttcdn-tos.pstatp.com/obj/ecom-luban-cdn/shopfxg3/images/Z9gCP.png"
      ></el-image>
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
      skuPriceListViewMap: new Map(),
      skuPriceListViewMapActive: undefined
    }
  },
  async activated () {
    this.getTPProductByIds()
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'unit']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices' // 本地价格设置
    })
  },
  watch: {
    template: {
      handler: function (newval) {
        console.log(newval)
        this.formatTableData({
          tableData: this.tableData,
          template: newval,
          unit: this.unit
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('migrate/migrateSettingPrice', [
      'getTPProductByIds',
      'formatTableData',
      'marketPriceChange'
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
    handleMarketPrice (price, id) {
      console.log(price, id)
      this.marketPriceChange({
        price, id
      })
      // this.formatTableData({
      //   tableData: this.tableData,
      //   template: this.template,
      //   unit: this.unit,
      //   singleMarketPrice: {
      //     id,
      //     price
      //   }
      // })
    },
    handleDiscountPrice (price, id) {
      this.formatTableData({
        tableData: this.tableData,
        template: this.template,
        unit: this.unit,
        singleDiscountPrice: {
          id,
          price
        }
      })
    },
    toggleIsShowSample () {
      this.isShowSample = true
    },
    closeSkuPriceListView () {
      this.dialogSkuPriceVisible = false
    },
    showSkuPrice (product) {
      console.log(product, 'product')
      this.selectTpProduct = product
      this.dialogSkuPriceVisible = true
    },
    /**
     * sku价格列表框打开时触发
     */
    dialogSkuPriceOpened () {
    },
    dialogSkuPriceClose () {
      // const arithmetic = this.$refs.skuPriceListView.onSave()
      // console.log(arithmetic)
      // this.formatTableData({
      //   tableData: this.tableData,
      //   template: this.template,
      //   unit: this.unit,
      //   singleSkuPrice: {
      //     id: this.selectTpProduct.tp_product_id,
      //     arithmetic
      //   }
      // })
    }
  }
}
</script>
<style lang="less" scoped>
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
    width: 100px;
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
</style>
