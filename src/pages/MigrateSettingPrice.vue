<template lang="html">
  <div v-loading="loadingCnt">
    <div style="text-align: left; margin-bottom: 10px">
      <el-steps :active="1" finish-status="success">
        <el-step title="选择商品"></el-step>
        <el-step title="编辑价格"></el-step>
        <el-step title="修改模板"></el-step>
      </el-steps>
    </div>
    <el-table ref="productListTable" :data="tpProductList" border style="width: 100%"
              :row-style="{height:'68px'}"
              :cell-style="{padding:0}"
              :header-cell-class-name="headCellClassName"
              :cell-class-name="cellClassName"
    >
      <el-table-column label="图片" width="100" align="center">
        <template slot-scope="scope">
          <img style="height:60px" :src="scope.row.thumbnail">
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center">
        <template slot-scope="scope">
          <el-link :href="scope.row.url" target="_blank"  type="primary" :underline="false">
            {{ scope.row.title }}
          </el-link><br>
          <label style="font-size:12px" v-if="scope.row.tp_outer_iid">商家编码: {{scope.row.tp_outer_iid}}</label>
        </template>
      </el-table-column>
      <!-- sku价格 start -->
      <el-table-column label="sku价格" width="240" align="center">
        <template slot="header" slot-scope="scope">
          <div class="setting-content">
            <div class="th-title-with-icon">
              <div class="th-title"> SKU 价格 = </div>
              <div class="th-icon">
                <el-tooltip v-if="(!template.checkNumber('group_price_rate') || !template.checkNumber('group_price_diff')) && isInitTemplate"
                            placement="top" content="请输入合法的数字"
                >
                  <span> <i class="el-icon-warning warn" style=""></i> </span>
                </el-tooltip>
              </div>
            </div>
            <div class="th-title-text">( 售价 - </div>
            <el-input v-model="template.model.origin_price_diff" size="medium"
                      :class="['input-m40', !template.checkNumber('origin_price_diff') && isInitTemplate ? 'warn' : '']"
                      @input="handleInputTemplateSkuPrice('promo_price')"
            ></el-input> ) x
            <el-input v-model="template.model.group_price_rate" size="medium"
                      :class="['input-m40', !template.checkNumber('group_price_rate') && isInitTemplate ? 'warn' : '']"
                      @input="handleInputTemplateSkuPrice('promo_price')"
            ></el-input>
            <div class="th-title-text"> % - </div>
            <el-tooltip content="差额可以为负数" :enterable="false">
              <el-input v-model="template.model.group_price_diff" size="medium"
                        :class="['input-m40', !template.checkNumber('group_price_diff') && isInitTemplate ? 'warn' : '']"
                        @input="handleInputTemplateSkuPrice('promo_price')"
              ></el-input>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light" :content="scope.row.group_tip" :enterable="false">
                        <span :class="['great', scope.row.groupPriceError !== '' ? 'warn' : '']">
                            {{ scope.row.group_price_range }}
                        </span>
          </el-tooltip>
          <el-tooltip placement="top" content="价格设置" :enterable="false">
            <el-button type="text" class="table-header-btn" @click="showSkuPrice(scope.row)">
              <i class="el-icon-edit"></i>
            </el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.groupPriceError !== ''" placement="top"
                      :content="scope.row.groupPriceError"
          >
                        <span style="display:inline-block; height:18px; line-height:18px; font-size: 18px;">
                            <i class="el-icon-warning warn" style=""></i>
                        </span>
          </el-tooltip>
          <span v-if="skuPriceListViewMap.get(scope.row.tp_product_id)">
            (售价-{{ skuPriceListViewMap.get(scope.row.tp_product_id).subtraction1}})
            -{{ skuPriceListViewMap.get(scope.row.tp_product_id).subtraction2}}
            %-{{ skuPriceListViewMap.get(scope.row.tp_product_id).subtraction3}}
          </span>
        </template>
      </el-table-column>
      <!-- sku价格 end -->
      <!-- 售卖价 start -->
      <el-table-column label="售卖价" width="240" align="center">
        <template slot="header" slot-scope="scope">
          <div class="setting-content" style="height: 100%;">
            <div class="th-title-with-icon">
              <div class="th-title"> 售卖价
                <el-tooltip manua="true" class="item" effect="dark" placement="top" >
                    <div slot="content">
                      <ul style="padding: 0; margin: 0;">基于抖音的规定，若有多个SKU价格，则售卖价在商品页面展示的是SKU价格范围。</ul>
                    </div>
                    <i class="el-icon-question"></i>
                </el-tooltip>
              </div>
            </div>
                <el-radio-group v-model="template.model.is_sale_price_show_max" size="mini" @change="getSalePrice">
                  <el-radio-button label="0">最低价</el-radio-button>
                  <el-radio-button label="1">最高价</el-radio-button>
                </el-radio-group>
          </div>
        </template>
        <template slot-scope="scope">
            <div style="display: flex">
              <div style="width: 182px; padding-left: 18px;">
                <el-input v-model="scope.row.discount_price_obj.model.price" size="medium"
                          :class="['input-great', discountPriceClass(scope.row)]"
                          @input="handleInputDiscountProduct(scope.row)"
                          @focus="scope.row.focus2=true"
                          @blur="scope.row.focus2=false"
                          @mouseenter.native="scope.row.mouseInside2=true"
                          @mouseleave.native="scope.row.mouseInside2=false"
                >
                  <i class="el-icon-error el-input__icon"
                     v-if="scope.row.discount_price_obj.isDiff()"
                     slot="suffix"
                     @click="handleCancelDiscountEdit(scope.row)">
                  </i>
                </el-input>
              </div>
              <div style="width: 18px; display:flex; align-items:center;">
                <el-tooltip v-if="scope.row.discountPriceError !== ''" placement="top"
                            :content="scope.row.discountPriceError"
                >
                                    <span style="display:inline-block; height:18px; line-height:18px; font-size: 18px;">
                                        <i class="el-icon-warning warn" style=""></i>
                                    </span>
                </el-tooltip>
              </div>
            </div>
        </template>
      </el-table-column>
      <!-- 售卖价 end -->
      <!-- 划线价 start -->
      <el-table-column label="划线价" width="240" align="center">
        <template slot="header" slot-scope="scope">
          <div class="setting-content">
            <div class="th-title-with-icon">
              <div class="th-title"> 划线价 = </div>
              <el-link target="_blank"  type="primary" :underline="false" style="margin-left: 10px;" @click="isShowSample = true">
                查看示例
              </el-link>
              <div class="th-icon">
                <el-tooltip v-if="(!template.checkNumber('price_rate') || !template.checkNumber('price_diff')) && isInitTemplate"
                            placement="top" content="请输入合法的数字"
                >
                  <span> <i class="el-icon-warning warn" style=""></i> </span>
                </el-tooltip>
              </div>
            </div>
            <div class="th-title-text"> 原划线价 x </div>
            <el-input v-model="template.model.price_rate" size="medium"
                      :class="['input-m40', !template.checkNumber('price_rate') && isInitTemplate ? 'warn' : '']"
                      @input="handleInputTemplate"
            ></el-input>
            <div class="th-title-text"> % - </div>
            <el-tooltip content="差额可以为负数" :enterable="false">
              <el-input v-model="template.model.price_diff" size="medium" style="width:60px;"
                        :class="['input-m40', !template.checkNumber('price_diff') && isInitTemplate ? 'warn' : '']"
                        @input="handleInputTemplate"
              ></el-input>
            </el-tooltip>
          </div>
        </template>
        <template slot-scope="scope">
          <el-tooltip :disabled="scope.row.market_price_obj.isDiff()" placement="top" effect="light" :enterable="false"
                      :content="scope.row.maxSkuOriginPriceFen / 100 + ' x ' + template.model.price_rate + '%'
                                           + (template.model.price_diff < 0 ? ' + ' : ' - ')
                                           + Math.abs(template.model.price_diff)"
          >
            <el-tooltip content="调整后的价格不再使用公式" :value="scope.row.focus && scope.row.mouseInside" :manual="true">
              <div style="display: flex">
                <div style="width: 182px; padding-left: 18px;">
                  <el-input v-model="scope.row.market_price_obj.model.price" size="medium"
                            :class="['input-great', marketPriceClass(scope.row)]"
                            @input="handleInputProduct(scope.row)"
                            @focus="scope.row.focus=true"
                            @blur="scope.row.focus=false"
                            @mouseenter.native="scope.row.mouseInside=true"
                            @mouseleave.native="scope.row.mouseInside=false"
                  >
                    <i class="el-icon-error el-input__icon"
                       v-if="scope.row.market_price_obj.isDiff()"
                       slot="suffix"
                       @click="handleCancelEdit(scope.row)">
                    </i>
                  </el-input>
                </div>
                <div style="width: 18px; display:flex; align-items:center;">
                  <el-tooltip v-if="scope.row.marketPriceError !== ''" placement="top"
                              :content="scope.row.marketPriceError"
                  >
                                      <span style="display:inline-block; height:18px; line-height:18px; font-size: 18px;">
                                          <i class="el-icon-warning warn" style=""></i>
                                      </span>
                  </el-tooltip>
                </div>
              </div>
            </el-tooltip>
          </el-tooltip>
        </template>
      </el-table-column>
      <!-- 划线价 end -->
    </el-table>
    <br>
    <div class="common-bottom">
      <el-button style="margin-right: 15px" @click="goback">返回</el-button>
      <el-tooltip placement="top" :disabled="msgError === ''" :content="msgError">
                <span>
                    <el-button type="primary" :disabled="msgError !== ''" @click="toSetTemplate">下一步：修改模板</el-button>
                </span>
      </el-tooltip>
    </div>
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
      <sku-price-list-view
        ref="skuPriceListView"
        :defaultValue="skuPriceListViewMapActive"
        :template="template"
        @closeSkuPriceListView="closeSkuPriceListView"
        :tpProduct="selectTpProduct" />
    </el-dialog>
    <el-dialog
      title="价格示例"
      :visible.sync="isShowSample"
      width="30%"
      :append-to-body="true">
      <el-image src="https://sf1-ttcdn-tos.pstatp.com/obj/ecom-luban-cdn/shopfxg3/images/Z9gCP.png"></el-image>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowSample = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/mixins/request.js'
import skuPriceListView from '@/components/SkuPriceListView.vue'
import DyTips from '@/components/DyTips.vue'
import FormModel from '@/common/formModel'
import utils from '@/common/utils'
import common from '@/common/common'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [request],
  components: {
    DyTips,
    skuPriceListView
  },
  data () {
    return {
      dialogSkuPriceVisible: false,
      tpProductList: [],
      selectTpProduct: null,
      msgError: '',
      isInitTemplate: false,
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      isShowSample: false,
      isMounted: true,
      skuPriceListViewMap: new Map(),
      skuPriceListViewMapActive: undefined
    }
  },
  computed: {
    ...mapGetters({
      tpProductIdList: 'getSelectTPProductIdList',
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices'
    })
  },
  mounted () {
    // 重新请求template数据并加载到全局变量中
    this.reloadTemplate()
  },
  activated () {
    if (!this.isMounted) {
      // 如果是mounted时触发，则不继续请求,返回价格设置页面触发
      this.getTPProductList()
    }
    this.isMounted = false
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    this.tpProductList = []
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  methods: {
    ...mapActions([
      'setSelectTPProductIdList',
      'requestTemplate',
      'loadTempTemplate',
      'saveTempTemplate'
    ]),
    beforeunloadFn (e) {
      e = e || window.event
      if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    marketPriceClass (product) {
      if (product.marketPriceError !== '') {
        return 'warn'
      }
      if (product.market_price_obj.isDiff()) {
        return 'edited'
      }
      return ''
    },
    discountPriceClass (product) {
      if (product.discountPriceError !== '') {
        return 'warn'
      }
      if (product.discount_price_obj.isDiff()) {
        return 'edited'
      }
      return ''
    },
    reloadTemplate () {
      this.isInitTemplate = false
      this.requestTemplate().then(data => {
        this.isInitTemplate = true
        this.loadTempTemplate()
        // 拿到模板数据后再请求商品数据
        this.getTPProductList()
      })
    },
    /**
     * 请求搬家商品列表
     */
    getTPProductList () {
      let params = {
        tp_product_ids: this.tpProductIdList,
        need_sku: true
      }
      this.request('getTPProductByIds', params, data => {
        let tpProductList = data.items
        for (let i in tpProductList) {
          let tpProduct = tpProductList[i]
          tpProduct.market_price_obj = new FormModel()
          tpProduct.discount_price_obj = new FormModel()
          tpProduct.group_price_range = '-'
          tpProduct.focus = false
          tpProduct.mouseInside = false
          tpProduct.focus2 = false
          tpProduct.mouseInside2 = false
          tpProduct.singlePriceError = ''
          tpProduct.groupPriceError = ''
          tpProduct.marketPriceError = ''
          tpProduct.discountPriceError = ''
          tpProduct.maxSkuOriginPriceFen = 0
        }
        this.tpProductList = tpProductList
        if (Object.entries(this.template.model).length > 0) {
          // 如果存在模板数据，则刷新界面上的数据, sku价格范围, 售卖价, 划线价
          this.updateRelatePrices('promo_price')
          this.check()
        }
        // 恢复历史价格
        for (let tpProduct of this.tpProductList) {
          // 恢复历史售卖价
          if (this.dicCustomPrices[tpProduct.tp_product_id] && this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'] >= 0) {
            tpProduct.discount_price_obj.model.price = utils.fenToYuan(this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'])
          }
          // 恢复历史划线价
          if (this.dicCustomPrices[tpProduct.tp_product_id] && this.dicCustomPrices[tpProduct.tp_product_id]['price'] >= 0) {
            tpProduct.market_price_obj.model.price = utils.fenToYuan(this.dicCustomPrices[tpProduct.tp_product_id]['price'])
          }
        }
      })
    },
    /**
     * 公式变量发生变化时做价格范围、售卖价和划线价的联动
     * 调用点
     * 1. 查询商品列表之后
     * 2. 处理sku价格公式
     * 3. sku价格列表框关闭之后
     */
    updateRelatePrices (field) {
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        let minPriceFen = 1e9
        let maxPriceFen = 0
        let minOriginVal = 0
        let maxOriginVal = 0
        let minIsCustom = false
        let maxIsCustom = false
        // sku最大原价
        let maxSkuOriginPriceFen = 0
        if (tpProduct.sku_json && tpProduct.sku_json.sku_map) {
          for (let key in tpProduct.sku_json.sku_map) {
            let item = tpProduct.sku_json.sku_map[key]
            // 取sku自定义价格
            let priceFen = utils.getObjectValue(this.dicCustomPrices, [tpProduct.tp_product_id, 'sku', key, field])
            let originVal = 0
            let isCustom = false
            if (typeof priceFen !== 'undefined') { // 自定义价格的情况
              priceFen = parseInt(priceFen)
              originVal = priceFen / 100
              isCustom = true
            } else if (item.promo_price) {
              let basePrice = item.promo_price
              priceFen = utils.adjustPriceFen(
                basePrice,
                this.template.model['group_price_rate'],
                this.template.model['group_price_diff'] * 100,
                parseFloat(this.template.model.origin_price_diff) * 100
              )
              originVal = basePrice / 100
              isCustom = false
            }
            if (typeof priceFen !== 'undefined') {
              item['group_price'] = priceFen
              if (minPriceFen > priceFen) {
                minPriceFen = priceFen
                minOriginVal = originVal
                minIsCustom = isCustom
              }
              if (maxPriceFen < priceFen) {
                maxPriceFen = priceFen
                maxOriginVal = originVal
                maxIsCustom = isCustom
              }
            }
            if (item.price > maxSkuOriginPriceFen) {
              maxSkuOriginPriceFen = item.price
            }
          }
          // 刷新售卖价, 依据最高价和最低价设置
          if (parseInt(this.template.model.is_sale_price_show_max) === 0) {
            tpProduct.discount_price_obj.assign({
              price: minPriceFen / 100
            })
          } else {
            tpProduct.discount_price_obj.assign({
              price: maxPriceFen / 100
            })
          }
          // 如果是抖音商品，则取商品最小价格作为划线价
          if (tpProduct['tp_id'] === common.TpType.dy) {
            maxSkuOriginPriceFen = tpProduct['min_price']
          }
          // 刷新划线价，依据划线价上浮率和差值
          let marketPrice = utils.fenToYuan(utils.adjustPriceFen(maxSkuOriginPriceFen, this.template.model.price_rate, this.template.model.price_diff * 100))
          tpProduct.market_price_obj.assign({
            price: marketPrice
          })
          tpProduct.maxSkuOriginPriceFen = maxSkuOriginPriceFen
          // 刷新划线价公式提示
          tpProduct.max_price = maxPriceFen
          // 恢复历史售卖价
          if (this.dicCustomPrices[tpProduct.tp_product_id] && this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'] >= 0) {
            tpProduct.discount_price_obj.model.price = utils.fenToYuan(this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'])
          }
          // 恢复历史划线价
          if (this.dicCustomPrices[tpProduct.tp_product_id] && this.dicCustomPrices[tpProduct.tp_product_id]['price'] >= 0) {
            tpProduct.market_price_obj.model.price = utils.fenToYuan(this.dicCustomPrices[tpProduct.tp_product_id]['price'])
          }
          // 刷新价格范围
          let strFun = ' x ' + this.template.model['group_price_rate'] + '%' +
            (this.template.model['group_price_diff'] < 0 ? ' + ' : ' - ') +
            Math.abs(this.template.model['group_price_diff'])
          if (minPriceFen === maxPriceFen) {
            tpProduct['group_price_range'] = (minPriceFen / 100)
            if (minIsCustom || maxIsCustom) {
              tpProduct['group_tip'] = minOriginVal
            } else {
              tpProduct['group_tip'] = '( ' + minOriginVal +
                (this.template.model['origin_price_diff'] < 0 ? ' + ' : ' - ') +
                Math.abs(this.template.model['origin_price_diff']) + ' )' +
                strFun
            }
          } else {
            tpProduct['group_price_range'] = (minPriceFen / 100) + ' ~ ' + (maxPriceFen / 100)
            if (minIsCustom && maxIsCustom) {
              tpProduct['group_tip'] = minOriginVal + ' ~ ' + maxOriginVal
            } else if (minIsCustom && !maxIsCustom) {
              tpProduct['group_tip'] = minOriginVal + ' ~ ( (' + maxOriginVal +
                (this.template.model['origin_price_diff'] < 0 ? ' + ' : ' - ') +
                Math.abs(this.template.model['origin_price_diff']) + ' )' +
                strFun + ')'
            } else if (!minIsCustom && maxIsCustom) {
              tpProduct['group_tip'] = '( (' + minOriginVal +
                (this.template.model['origin_price_diff'] < 0 ? ' + ' : ' - ') +
                Math.abs(this.template.model['origin_price_diff']) + ' )' +
                strFun + ') ~ ' + maxOriginVal
            } else {
              tpProduct['group_tip'] = '( (' + minOriginVal +
                (this.template.model['origin_price_diff'] < 0 ? ' + ' : ' - ') +
                Math.abs(this.template.model['origin_price_diff']) + ' )' +
                ' ~ (' + maxOriginVal +
                (this.template.model['origin_price_diff'] < 0 ? ' + ' : ' - ') +
                Math.abs(this.template.model['origin_price_diff']) + ' )' +
                ')' + strFun
            }
          }
          this.addCustomPrices(tpProduct.tp_product_id, 'last_discount_price', Math.round(tpProduct.discount_price_obj.model.price * 100))
        }
      }
      // Object.keys(this.skuPriceListViewMap).forEach(key => {
      //   this.skuPriceListViewMap.set(key, {
      //     subtraction1: this.template.model.origin_price_diff,
      //     subtraction2: this.template.model.group_price_rate,
      //     subtraction3: this.template.model.group_price_diff
      //   })
      // })
    },
    /**
     * 更新划线价
     */
    updateMarketPrices () {
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        tpProduct.market_price_obj.assign({
          price: utils.fenToYuan(
            utils.adjustPriceFen(
              tpProduct.maxSkuOriginPriceFen,
              this.template.model.price_rate,
              this.template.model.price_diff * 100
            )
          )
        })
      }
    },
    updateDiscountPrices () {
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        tpProduct.discount_price_obj.assign({
          price: utils.fenToYuan(utils.adjustPriceFen(
            tpProduct.max_price, this.template.model.single_price_rate, this.template.model.single_price_diff * 100
          ))
        })
        if (this.dicCustomPrices[tpProduct.tp_product_id] && this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'] >= 0) {
          tpProduct.discount_price_obj.model.price = utils.fenToYuan(this.dicCustomPrices[tpProduct.tp_product_id]['discount_price'])
        }
      }
    },
    /**
     * 检查价格是否合法
     * sku价格 = (原价 - origin_price_diff) x group_price_rate% - group_price_diff
     * 划线价 = 最高价 x price_rate% - price_diff
     * 1. 划线价格不得小于售卖价
     * 2. 售卖价必须在sku价格范围内
     */
    check () {
      this.msgError = ''
      if (!this.template.checkNumber('price_rate') || !this.template.checkNumber('price_diff') ||
        !this.template.checkNumber('group_price_rate') || !this.template.checkNumber('group_price_diff') ||
        !this.template.checkNumber('origin_price_diff')
      ) {
        this.msgError = '请输入合法的数字'
      }
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        tpProduct.marketPriceError = ''
        if (!tpProduct.market_price_obj.checkNumber('price')) {
          let strError = '请输入合法的数字'
          tpProduct.marketPriceError = strError
          if (this.msgError === '') {
            this.msgError = strError
          }
        }
      }
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        tpProduct.discountPriceError = ''
        if (!tpProduct.discount_price_obj.checkNumber('price')) {
          let strError = '请输入合法的数字'
          tpProduct.discountPriceError = strError
          if (this.msgError === '') {
            this.msgError = strError
          }
        }
      }
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        let discountPriceFen = Math.round(tpProduct.discount_price_obj.model.price * 100)
        let marketPriceFen = Math.round(tpProduct.market_price_obj.model.price * 100)
        tpProduct.singlePriceError = ''
        tpProduct.groupPriceError = ''
        if (tpProduct.sku_json && tpProduct.sku_json.sku_map) {
          let maxGroupPriceFen = 0
          let minGroupPriceFen = 999999
          for (let key in tpProduct.sku_json.sku_map) {
            let item = tpProduct.sku_json.sku_map[key]
            // 团购价 = 原价 * group_price_rate - group_price_diff
            let groupPriceFen = utils.getObjectValue(this.dicCustomPrices, [tpProduct.tp_product_id, 'sku', key, 'promo_price'])
            if (typeof groupPriceFen !== 'undefined') {
              groupPriceFen = parseInt(groupPriceFen)
            } else if (item.promo_price) {
              groupPriceFen = utils.adjustPriceFen(
                item.promo_price,
                this.template.model['group_price_rate'],
                this.template.model['group_price_diff'] * 100
              )
            } else {
              groupPriceFen = 1
            }

            if (groupPriceFen > maxGroupPriceFen) {
              maxGroupPriceFen = groupPriceFen
            }

            if (groupPriceFen < minGroupPriceFen) {
              minGroupPriceFen = groupPriceFen
            }
          }
          if (discountPriceFen > marketPriceFen) {
            let strError = '划线价格不得小于售卖价'
            tpProduct.marketPriceError = strError
            if (this.msgError === '') {
              this.msgError = strError
            }
          }
          let priceRange = tpProduct.group_price_range.toString().split(' ~ ')
          let maxPrice = 0
          let minPrice = 0
          if (priceRange.length === 2) {
            minPrice = utils.yuanToFen(priceRange[0])
            maxPrice = utils.yuanToFen(priceRange[1])
          } else {
            minPrice = utils.yuanToFen(priceRange[0])
            maxPrice = utils.yuanToFen(priceRange[0])
          }
          if (discountPriceFen > maxPrice || discountPriceFen < minPrice) {
            let strError = '售卖价必须在sku价格范围内'
            tpProduct.discountPriceError = strError
            if (this.msgError === '') {
              this.msgError = strError
            }
          }
        }
      }
    },
    headCellClassName ({row, column, rowIndex, columnIndex}) {
      if ([2, 3, 4].includes(columnIndex)) {
        return 'th-with-input'
      }
      return ''
    },
    cellClassName ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 2) {
        return row.groupPriceError !== '' ? 'warn-view' : ''
      } else if (columnIndex === 3) {
        return row.discountPriceError !== '' ? 'warn-view' : ''
      } else if (columnIndex === 4) {
        return row.marketPriceError !== '' ? 'warn-view' : ''
      }
      return ''
    },
    /**
     * 处理sku价格公式, (原价 - a) x b% - c, 当a,b,c任意一个数发生变化时触发这个函数,重新计算商品价格范围、售卖价和划线价
     * @param field
     */
    handleInputTemplateSkuPrice (field) {
      this.updateRelatePrices(field)
      this.check()
    },
    /**
     * 划线价变化
     */
    handleInputTemplate () {
      this.updateMarketPrices()
      this.check()
    },
    handleInputDiscountTemplate () {
      this.updateDiscountPrices()
      this.check()
    },
    /**
     * 手工修改划线价触发
     */
    handleInputProduct (tpProduct) {
      if (tpProduct.market_price_obj.isDiff()) {
        this.addCustomPrices(tpProduct.tp_product_id, 'price', utils.yuanToFen(tpProduct.market_price_obj.model.price))
      } else {
        this.deleteCustomPrices(tpProduct.tp_product_id, 'price')
      }
      this.check()
    },
    /**
     * 手工修改售卖价触发
     * @param tpProduct
     */
    handleInputDiscountProduct (tpProduct) {
      if (tpProduct.discount_price_obj.isDiff()) {
        this.addCustomPrices(tpProduct.tp_product_id, 'discount_price', utils.yuanToFen(tpProduct.discount_price_obj.model.price))
      } else {
        this.deleteCustomPrices(tpProduct.tp_product_id, 'discount_price')
      }
      this.check()
    },
    handleCancelEdit (tpProduct) {
      tpProduct.market_price_obj.rollback()
      this.deleteCustomPrices(tpProduct.tp_product_id, 'price')
      this.check()
    },
    handleCancelDiscountEdit (tpProduct) {
      tpProduct.discount_price_obj.rollback()
      this.deleteCustomPrices(tpProduct.tp_product_id, 'discount_price')
      this.check()
    },
    handleSizeChange (val) {
      this.pagination.index = 1
      this.pagination.size = val
      this.getTPProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getTPProductList()
    },
    showSkuPrice (product) {
      this.selectTpProduct = product
      this.dialogSkuPriceVisible = true
    },
    /**
     * sku价格列表框打开时触发
     */
    dialogSkuPriceOpened () {
      let tpProductId = this.selectTpProduct.tp_product_id
      let skuCustomPrices = {}
      if (this.dicCustomPrices[tpProductId] && this.dicCustomPrices[tpProductId]['sku']) {
        skuCustomPrices = this.dicCustomPrices[tpProductId]['sku']
      }
      this.skuPriceListViewMapActive = this.skuPriceListViewMap.get(tpProductId)
      this.$refs.skuPriceListView.init(skuCustomPrices)
    },
    closeSkuPriceListView () {
      // this.dialogSkuPriceClose()
      this.dialogSkuPriceVisible = false
    },
    dialogSkuPriceClose () {
      const arithmetic = this.$refs.skuPriceListView.onSave()
      let tpProductId = this.selectTpProduct.tp_product_id
      if (arithmetic) {
        if (
          // 当前总编辑价格 和 单个sku编辑价格 完全相同 则不展示当前价格算法
          arithmetic.subtraction1 === this.template.model.origin_price_diff ||
          arithmetic.subtraction2 === this.template.model.group_price_rate ||
          arithmetic.subtraction3 === this.template.model.group_price_diff
        ) {
          this.skuPriceListViewMap.set(tpProductId, undefined)
        }
        if (
          // 当前总编辑价格和 单个sku编辑价格有不同
          arithmetic.subtraction1 !== this.template.model.origin_price_diff ||
          arithmetic.subtraction2 !== this.template.model.group_price_rate ||
          arithmetic.subtraction3 !== this.template.model.group_price_diff
        ) {
          this.skuPriceListViewMap.set(tpProductId, arithmetic)
        }
        // 当前单个sku价格和 单个sku编辑价格有不同
        // const oldArithmetic = this.skuPriceListViewMap.get(tpProductId)
        // if (
        //   arithmetic.subtraction1 !== oldArithmetic.subtraction1 ||
        //   arithmetic.subtraction2 !== oldArithmetic.subtraction2 ||
        //   arithmetic.subtraction3 !== oldArithmetic.subtraction3
        // ) {
        //   this.skuPriceListViewMap.set(tpProductId, arithmetic)
        // }
      }
      let skuCustomPrices = this.$refs.skuPriceListView.dicCustomPrices

      if (Object.entries(skuCustomPrices).length === 0) {
        this.deleteCustomPrices(tpProductId, 'sku')
      } else {
        this.addCustomPrices(tpProductId, 'sku', skuCustomPrices)
      }
      this.updateRelatePrices('promo_price')
      // this.updateRelatePrices('price')
      this.check()
    },
    toSetTemplate () {
      if (this.msgError !== '') {
        return
      }
      this.saveTempTemplate()
      this.$router.push({
        path: '/migrateSettingTemplate'
      })
    },
    addCustomPrices (tpProductId, field, value) {
      if (!this.dicCustomPrices[tpProductId]) {
        this.dicCustomPrices[tpProductId] = {}
      }
      this.dicCustomPrices[tpProductId][field] = value
    },
    deleteCustomPrices (tpProductId, field) {
      if (this.dicCustomPrices[tpProductId] && this.dicCustomPrices[tpProductId][field]) {
        delete this.dicCustomPrices[tpProductId][field]
        if (this.dicCustomPrices[tpProductId] && Object.entries(this.dicCustomPrices[tpProductId]).length === 0) {
          delete this.dicCustomPrices[tpProductId]
        }
      }
    },
    goback () {
      this.$router.push({
        name: 'ProductList',
        params: {
          keepStatus: true
        }
      })
    },
    /**
     * 售卖价显示最高价或者最低价
     * @param isMax
     */
    getSalePrice (isMax) {
      // group_price_range已经计算好了最高价和最低价，直接拿过来用即可
      isMax = parseInt(isMax)
      for (let product of this.tpProductList) {
        let priceRangeList = product.group_price_range.toString().split('~')
        let minPrice = 0
        let maxPrice = 0
        if (priceRangeList.length === 2) {
          minPrice = priceRangeList[0]
          maxPrice = priceRangeList[1]
        } else {
          minPrice = priceRangeList[0]
          maxPrice = priceRangeList[0]
        }
        if (isMax) {
          product.discount_price_obj.assign({
            price: maxPrice
          })
        } else {
          product.discount_price_obj.assign({
            price: minPrice
          })
        }
        // this.addCustomPrices(product.tp_product_id, 'discount_price', utils.yuanToFen(product.discount_price_obj.model.price))
      }
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/migratesetting.less';
</style>
