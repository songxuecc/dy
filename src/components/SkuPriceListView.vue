<template lang="html">
    <div v-loading="loadingCnt">
        <el-table ref="skuListTable" :data="skuRealShowList" row-key="tp_product_id" border style="width: 100%"
                  :cell-class-name="cellClassName"
        >
            <el-table-column v-for="(item, index) in skuPropertyList" :key="index+':'+item.id">
                <template slot="header" slot-scope="scope">
                    <span :style="{color: (item.filter ? '#409EFF' : '#909399')}">{{ item.name }}</span>
                    <el-dropdown v-if="skuPropertyValueMap[item.id] && Object.keys(skuPropertyValueMap[item.id]).length > 1"
                                 style="line-height:0px; padding-left: 0px; cursor:pointer; vertical-align: middle;"
                                 trigger="click" :hide-on-click="false"  placement="bottom"
                    >
                                <span class="el-dropdown-link">
                                  <i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                        <el-dropdown-menu slot="dropdown" style="max-height: 250px; overflow: auto; overflow-x:hidden;">
                            <el-dropdown-item v-for="(ele, vid) in skuPropertyValueMap[item.id]" :key="vid">
                                <div style="display:flex">
                                    <el-checkbox v-model="ele.checked" @change="onSkuFilter">{{ele.value}}</el-checkbox>
                                </div>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
                <template slot-scope="scope">
                    {{ scope.row.property_list[index].name }}
                </template>
            </el-table-column>
            <el-table-column key="3" width="200" align="center" v-if="false">
                <template slot="header" slot-scope="scope">
                    <span>团购价333</span>
                    <el-button type="text" class="table-header-btn" @click="dialogPromoPriceVisible=true"> <i class="el-icon-edit"></i> </el-button>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div style="width: 182px; padding-left: 18px;">
                            <el-input v-model="scope.row.promo_price" size="mini" @input="inputChange(scope.row)"
                                      :class="['input-medium', promoPriceClass(scope.row,scope.$index)]"
                            >
                                <i class="el-icon-error el-input__icon"
                                   v-if="isEdited(scope.row, 'promo_price')"
                                   slot="suffix"
                                   @click="handleCancelEdit(scope.row, 'promo_price')">
                                </i>
                            </el-input>
                        </div>
                        <div style="width: 18px; display:flex; align-items:center;">
                            <el-tooltip v-if="scope.row.msgGroupError !== ''" placement="top" :content="scope.row.msgGroupError">
                                <span style="display:inline-block; height:18px; line-height:18px; font-size: 18px;">
                                    <i class="el-icon-warning warn" style=""></i>
                                </span>
                            </el-tooltip>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column key="4" width="200" align="center">
                <template slot="header" slot-scope="scope">
                    <span>单买价</span>
                    <el-button type="text" class="table-header-btn" @click="dialogPriceVisible=true"> <i class="el-icon-edit"></i> </el-button>
                </template>
                <template slot-scope="scope">
                    <div style="display: flex">
                        <div style="width: 182px; padding-left: 18px;">
                            <el-input v-model="scope.row.price" size="mini" @input="inputChange(scope.row)"
                                      :class="['input-medium', priceClass(scope.row, scope.$index)]"
                            >
                                <i class="el-icon-error el-input__icon"
                                   v-if="isEdited(scope.row, 'price')"
                                   slot="suffix"
                                   @click="handleCancelEdit(scope.row, 'price')">
                                </i>
                            </el-input>
                        </div>
                        <div style="width: 18px; display:flex; align-items:center;">
                            <el-tooltip v-if="scope.row.msgSingleError !== ''" placement="top" :content="scope.row.msgSingleError">
                                <span style="display:inline-block; height:18px; line-height:18px; font-size: 18px;">
                                    <i class="el-icon-warning warn" style=""></i>
                                </span>
                            </el-tooltip>
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

        <el-dialog title="批量修改团购价" width="400px" :visible.sync="dialogPromoPriceVisible" append-to-body center>
            <div>
                <el-radio v-model="promoPriceHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一价格为</span>
                    <el-input v-model="promoPriceHandler.textPrice" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='1'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="promoPriceHandler.textPriceAdd" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="promoPriceHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="promoPriceHandler.textPriceSub" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="4">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="promoPriceHandler.textPricePercentAdd" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='4'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                </el-radio>
                <el-radio v-model="promoPriceHandler.radio" label="5">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="promoPriceHandler.textPricePercentSub" size="mini" style="width:100px"
                              @focus="promoPriceHandler.radio='5'"
                    ></el-input>
                    <span style="display:inline-block;">%</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button type="primary" @click="handleBatchPromoPrice">确定</el-button>
                    <el-button @click="dialogPromoPriceVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="批量修改单买价" width="400px" :visible.sync="dialogPriceVisible" append-to-body center>
            <div>
                <el-radio v-model="priceHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一价格为</span>
                    <el-input v-model="priceHandler.textPrice" size="mini" style="width:100px"
                              @focus="priceHandler.radio='1'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU价格加</span>
                    <el-input v-model="priceHandler.textPriceAdd" size="mini" style="width:100px"
                              @focus="priceHandler.radio='2'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                </el-radio><br>
                <el-radio v-model="priceHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU价格减</span>
                    <el-input v-model="priceHandler.textPriceSub" size="mini" style="width:100px"
                              @focus="priceHandler.radio='3'"
                    ></el-input>
                    <span style="display:inline-block;">元</span>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
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
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
                <div style="text-align: center; padding-top: 20px">
                    <el-button type="primary" @click="handleBatchPrice">确定</el-button>
                    <el-button @click="dialogPriceVisible = false">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import skuHandler from '@/mixins/skuHandler.js'
import FormModel from '@/common/formModel'
import utils from '@/common/utils'

export default {
  mixins: [request, skuHandler],
  components: {},
  props: {
    template: FormModel,
    tpProduct: null
  },
  data () {
    return {
      dialogPromoPriceVisible: false,
      dialogPriceVisible: false,
      warnMsg: '',
      dicCustomPrices: {}
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    promoPriceClass (sku, index) {
      sku.promo_price_obj.model.price = sku.promo_price
      if (index !== undefined) {
        if (this.skuShowList[index].msgGroupError !== '') {
          return 'warn'
        }
      }
      if (sku.promo_price_obj.isDiff()) {
        return 'edited'
      }
      return ''
    },
    priceClass (sku, index) {
      sku.price_obj.model.price = sku.price
      if (index !== undefined) {
        if (this.skuShowList[index].msgSingleError !== '') {
          return 'warn'
        }
      }
      if (sku.price_obj.isDiff()) {
        return 'edited'
      }
      return ''
    },
    isEdited (sku, field) {
      return sku[field + '_obj'].isDiff()
    },
    init (skuCustomPrices) {
      this.dicCustomPrices = skuCustomPrices
      this.getTPProductProperty()
    },
    cellClassName ({row, column, rowIndex, columnIndex}) {
      if ([1, 2].includes(columnIndex)) {
        return 'td-with-medium-input'
      }
      return ''
    },
    getTPProductProperty () {
      if (!this.tpProduct || !this.tpProduct.sku_json) {
        return
      }
      this.initSku(this.tpProduct.sku_json, this.tpProduct.tp_id)
      for (let i in this.skuShowList) {
        let skuShow = this.skuShowList[i]
        let promoPrice = skuShow.promo_price
        skuShow.original_promo_price = skuShow.promo_price
        skuShow.promo_price = utils.fenToYuan(utils.adjustPriceFen(
          utils.yuanToFen(promoPrice),
          this.template.model.group_price_rate,
          this.template.model.group_price_diff * 100
        ))
        skuShow.promo_price_obj = new FormModel()
        skuShow.promo_price_obj.assign({ price: skuShow.promo_price })

        skuShow.price = utils.fenToYuan(utils.adjustPriceFen(
          utils.yuanToFen(promoPrice),
          this.template.model.single_price_rate,
          this.template.model.single_price_diff * 100
        ))
        skuShow.price_obj = new FormModel()
        skuShow.price_obj.assign({ price: skuShow.price })
        skuShow.msgSingleError = ''
        skuShow.msgGroupError = ''

        if (this.dicCustomPrices[skuShow.property_key]) {
          if (this.dicCustomPrices[skuShow.property_key]['promo_price']) {
            skuShow.promo_price_obj.model.price =
              skuShow.promo_price = utils.fenToYuan(this.dicCustomPrices[skuShow.property_key]['promo_price'])
          }
          if (this.dicCustomPrices[skuShow.property_key]['price']) {
            skuShow.price_obj.model.price =
              skuShow.price = utils.fenToYuan(this.dicCustomPrices[skuShow.property_key]['price'])
          }
        }
      }
      this.checkSkuPrice()
    },
    handleBatchPromoPrice () {
      this.batchEditPromoPrice()
      this.dialogPromoPriceVisible = false
      this.checkSkuPrice()
    },
    handleBatchPrice () {
      this.batchEditPrice()
      this.dialogPriceVisible = false
      this.checkSkuPrice()
    },
    checkSkuPrice () {
      let msg = ''
      for (let i in this.skuShowList) {
        let skuShow = this.skuShowList[i]
        let maxAllowPrice = 1.08 * (skuShow.original_promo_price + this.tpProduct.postage / 100)
        skuShow.msgGroupError = ''
        skuShow.msgSingleError = ''
        if (!utils.isNumber(skuShow.promo_price)) {
          skuShow.msgGroupError = '请输入合法的数字'
          msg = skuShow.msgGroupError
        } else if (skuShow.promo_price > maxAllowPrice) {
          skuShow.msgGroupError = '团购价涨幅不能超过抓取价格+邮费的8%(' + maxAllowPrice.toFixed(2) + '元)，请重新设置'
          msg = skuShow.msgGroupError
        } else if (!utils.isNumber(skuShow.price)) {
          skuShow.msgSingleError = '请输入合法的数字'
          msg = skuShow.msgSingleError
        } else if (skuShow.promo_price > skuShow.price - 1) {
          skuShow.msgSingleError = 'sku的单买价必须至少比团购价高一元'
          msg = skuShow.msgSingleError
        }
      }
      this.warnMsg = msg
    },
    inputChange (sku) {
      this.checkSkuPrice()
    },
    handleCancelEdit (sku, field) {
      sku[field + '_obj'].rollback()
      sku[field] = sku[field + '_obj'].model.price
      this.deleteCustomPrices(sku.property_key, field)
      this.checkSkuPrice()
    },
    onSave () {
      for (let i in this.skuShowList) {
        let skuShow = this.skuShowList[i]
        skuShow.promo_price_obj.model.price = skuShow.promo_price
        if (this.promoPriceClass(skuShow, i) === 'warn') {
          skuShow.promo_price_obj.rollback()
        }
        if (skuShow.promo_price_obj.isDiff()) {
          this.addCustomPrices(skuShow.property_key, 'promo_price', utils.yuanToFen(skuShow.promo_price_obj.model.price))
        } else {
          this.deleteCustomPrices(skuShow.property_key, 'promo_price')
        }
        skuShow.price_obj.model.price = skuShow.price
        if (this.priceClass(skuShow, i) === 'warn') {
          skuShow.price_obj.rollback()
        }
        if (skuShow.price_obj.isDiff()) {
          this.addCustomPrices(skuShow.property_key, 'price', utils.yuanToFen(skuShow.price_obj.model.price))
        } else {
          this.deleteCustomPrices(skuShow.property_key, 'price')
        }
      }
    },
    addCustomPrices (key, field, value) {
      if (!this.dicCustomPrices[key]) {
        this.dicCustomPrices[key] = {}
      }
      this.dicCustomPrices[key][field] = value
    },
    deleteCustomPrices (key, field) {
      if (this.dicCustomPrices[key] && this.dicCustomPrices[key][field]) {
        delete this.dicCustomPrices[key][field]
        if (this.dicCustomPrices[key] && Object.entries(this.dicCustomPrices[key]).length === 0) {
          delete this.dicCustomPrices[key]
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/migratesetting.less';
</style>
