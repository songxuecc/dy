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
            <span class="price">{{scope.row.group_price_range}}</span>
            <hh-icon type="iconbianji" style="font-size: 12px" />
          </div>
          <p class="info">(售价--%-</p>
        </template>
      </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
            <p class="font-14 mb-10">售卖价</p>
            <el-radio-group class="font-14" v-model="template.model.is_sale_price_show_max" size="mini" @change="getSalePrice">
                <el-radio-button label="0">最低价</el-radio-button>
                <el-radio-button label="1">最高价</el-radio-button>
            </el-radio-group>
        </template>
        <template slot-scope="scope">
          <el-input
            :debounce="500"
              style="width: 55px"
              v-model="scope.row.discount_price"
              size="mini"
              class="price-sale-input"
            />
        </template>
        </el-table-column>
      <el-table-column align="center">
        <template slot="header" slot-scope="scope">
          <p class="font-14 mb-10">售卖价= <span class="color-primary">查看示例</span></p>
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
              v-model="scope.row.market_price"
              size="mini"
              class="price-sale-input"
            />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
export default {
  name: 'TableSkuPriceList',
  props: {
    msg: String
  },
  data () {
    return {
      totalPriceSet: '1',
      origin_price_diff: '',
      group_price_rate: '',
      group_price_diff: ''
    }
  },
  async activated () {
    this.getTPProductByIds()
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices'
    })
  },
  watch: {
    template: {
      handler: function (newval) {
        console.log(newval)
        this.formatTableData({
          tableData: this.tableData,
          template: newval
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('migrate/migrateSettingPrice', ['getTPProductByIds', 'formatTableData']),
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
    border: 1px solid #EBEBEB;
    font-size: 18px;
    font-family: MicrosoftYaHei;
    color: #4E4E4E;
    line-height: 24px;
    font-weight: bold;
  }
}

.price {
  width: 103px;
  height: 24px;
  font-size: 18px;
  font-family: MicrosoftYaHei;
  color: #4E4E4E;
  line-height: 24px;
  font-weight: bold;
}
</style>
