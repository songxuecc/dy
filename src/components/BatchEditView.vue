<template lang="html">
    <div class="setting-content block-content" v-loading="loadingCnt">
        <span>修改商品数：{{ productList.length }}个</span>
        <el-row>
            <el-col :span="3">
                <el-checkbox v-model="checkedCate" :disabled="cat_id === 0">商品分类</el-checkbox>
            </el-col>
            <el-col :span="16">
                <span>{{ category_show }}</span>
                <el-button size="mini" @click="showSelectCateView">修改分类</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-checkbox v-model="titleHandler.checked" :disabled="titleHandler.isAllFalse()">商品标题</el-checkbox>
            </el-col>
            <el-col :span="21">
                <el-checkbox v-model="titleHandler.checkedPrefix">
                    <span style="display:inline-block; width:70px">加前缀</span>
                    <el-input v-model="titleHandler.textPrefix" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_TITLE_LIMIT }} 个字符则默认截取前 {{ PRODUCT_TITLE_LIMIT }} 字符</span>
                </el-checkbox><br>
                <el-checkbox v-model="titleHandler.checkedSuffix" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">加后缀</span>
                    <el-input v-model="titleHandler.textSuffix" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_TITLE_LIMIT }} 个字符则默认截取前 {{ PRODUCT_TITLE_LIMIT }} 字符</span>
                </el-checkbox><br>
                <el-checkbox v-model="titleHandler.checkedDelete" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">删除关键字</span>
                    <el-input v-model="titleHandler.textDelete" size="mini" style="width:150px"></el-input>
                </el-checkbox><br>
                <el-checkbox v-model="titleHandler.checkedReplace" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">替换关键字</span>
                    <el-input v-model="titleHandler.textReplace1" size="mini" style="width:150px"></el-input>
                    <span>替换为</span>
                    <el-input v-model="titleHandler.textReplace2" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_TITLE_LIMIT }} 个字符则默认截取前 {{ PRODUCT_TITLE_LIMIT }} 字符</span>
                </el-checkbox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-checkbox v-model="descHandler.checked" :disabled="descHandler.isAllFalse()">商品描述</el-checkbox>
            </el-col>
            <el-col :span="21">
                <el-checkbox v-model="descHandler.checkedPrefix">
                    <span style="display:inline-block; width:70px">加前缀</span>
                    <el-input v-model="descHandler.textPrefix" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_DESC_LIMIT }} 个字符则默认截取前 {{ PRODUCT_DESC_LIMIT }} 字符</span>
                </el-checkbox><br>
                <el-checkbox v-model="descHandler.checkedSuffix" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">加后缀</span>
                    <el-input v-model="descHandler.textSuffix" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_DESC_LIMIT }} 个字符则默认截取前 {{ PRODUCT_DESC_LIMIT }} 字符</span>
                </el-checkbox><br>
                <el-checkbox v-model="descHandler.checkedDelete" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">删除关键字</span>
                    <el-input v-model="descHandler.textDelete" size="mini" style="width:150px"></el-input>
                </el-checkbox><br>
                <el-checkbox v-model="descHandler.checkedReplace" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">替换关键字</span>
                    <el-input v-model="descHandler.textReplace1" size="mini" style="width:150px"></el-input>
                    <span>替换为</span>
                    <el-input v-model="descHandler.textReplace2" size="mini" style="width:150px"></el-input>
                    <span class="explain">&nbsp; 如超过 {{ PRODUCT_DESC_LIMIT }} 个字符则默认截取前 {{ PRODUCT_DESC_LIMIT }} 字符</span>
                </el-checkbox>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-checkbox v-model="stockHandler.checked">修改库存</el-checkbox>
            </el-col>
            <el-col :span="21">
                <el-radio v-model="stockHandler.radio" label="1">
                    <span style="display:inline-block; width:100px">统一库存为</span>
                    <el-input v-model="stockHandler.textStock" size="mini" style="width:100px"
                              @focus="stockHandler.radio='1'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockHandler.radio" label="2">
                    <span style="display:inline-block; width:100px">每个SKU库存加</span>
                    <el-input v-model="stockHandler.textStockAdd" size="mini" style="width:100px"
                              @focus="stockHandler.radio='2'"
                    ></el-input>
                </el-radio><br>
                <el-radio v-model="stockHandler.radio" label="3">
                    <span style="display:inline-block; width:100px">每个SKU库存减</span>
                    <el-input v-model="stockHandler.textStockSub" size="mini" style="width:100px"
                              @focus="stockHandler.radio='3'"
                    ></el-input>
                    <span class="explain">&nbsp; 小于 0 设为 0</span>
                </el-radio>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="3">
                <el-checkbox v-model="templateHandler.checked" :disabled="templateHandler.isAllFalse()">模板设置</el-checkbox>
            </el-col>
            <el-col :span="21">
                <el-checkbox v-model="templateHandler.checkedCarriage" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">运费模板</span>
                    <el-select v-model="templateHandler.template.cost_template_id" placeholder="请选择" size="mini">
                        <el-option v-for="item in templateHandler.template.template_list" :label="item.cost_template_name"
                                   :key="item.cost_template_id" :value="item.cost_template_id"
                        ></el-option>
                    </el-select>
                </el-checkbox><br>
                <el-checkbox v-model="templateHandler.checkedPreSale" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">是否预售</span>
                    <el-radio v-model="templateHandler.template.is_pre_sale" :label="1">预售</el-radio>
                    <el-radio v-model="templateHandler.template.is_pre_sale" :label="0">非预售</el-radio>
                </el-checkbox><br>
                <el-checkbox v-model="templateHandler.checkedShipment" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">发货时间</span>
                    <el-radio v-model="templateHandler.template.shipment_limit_second" :label="172800">48小时</el-radio>
                    <el-radio v-model="templateHandler.template.shipment_limit_second" :label="86400">24小时</el-radio>
                </el-checkbox><br>
                <el-checkbox v-model="templateHandler.checkedPromise" style="padding-top: 5px">
                    <span style="display:inline-block; width:70px">承诺服务</span>
                    <el-checkbox v-model="templateHandler.checkedRefundable">7天无理由退货</el-checkbox>
                    <el-checkbox v-model="templateHandler.checkedFolt">假一赔十</el-checkbox>
                </el-checkbox>
            </el-col>
        </el-row>
        <el-row class="block-last">
            <el-col :span="3">
                <el-checkbox v-model="checkedSale">上架</el-checkbox>
            </el-col>
            <!--<el-col :span="21">-->
                <!--<el-radio-group v-model="radioSale" @change="onChangeRadioSale">-->
                    <!--<el-radio label="1">上架</el-radio>-->
                    <!--<el-radio label="0">下架</el-radio>-->
                <!--</el-radio-group>-->
            <!--</el-col>-->
        </el-row>
        <div  class="common-bottom">
            <el-button type="primary" @click="onSave" :disabled="saveBtnDisabled"> 保存修改 </el-button>
        </div>
        <el-dialog class="dialog-tight" title="修改分类" width="800px" :visible.sync="dialogVisible" @opened="onOpenedCate" append-to-body center>
            <category-select-view ref="categorySelectView" @changeCate="onChangeCate">
            </category-select-view>
        </el-dialog>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import categorySelectView from '@/components/CategorySelectView'
import { TextHandler, StockHandler, TemplateHandler } from '@/common/batchEditHandler'
export default {
  mixins: [request],
  components: {
    categorySelectView
  },
  data () {
    return {
      checkedCate: false,
      titleHandler: new TextHandler(),
      descHandler: new TextHandler(),
      stockHandler: new StockHandler(),
      templateHandler: new TemplateHandler(),
      checkedSale: false,
      radioSale: '1',
      cat_id: 0,
      category_show: '',
      dialogVisible: false,
      productList: [],
      syncTimer: null,
      dicUpdateMessage: {}
    }
  },
  computed: {
    PRODUCT_TITLE_LIMIT () {
      return common.PRODUCT_TITLE_LIMIT
    },
    PRODUCT_DESC_LIMIT () {
      return common.PRODUCT_DESC_LIMIT
    },
    saveBtnDisabled () {
      return !this.checkedCate &&
        !this.titleHandler.checked &&
        !this.descHandler.checked &&
        !this.stockHandler.checked &&
        !this.templateHandler.checked &&
        !this.checkedSale
    }
  },
  mounted () {
    this.getTemplate()
  },
  methods: {
    getTemplate () {
      this.request('getTemplate', {}, data => {
        this.templateHandler.template = data
        if (this.templateHandler.template.cost_template_id.toString() === '0' &&
          this.templateHandler.template.template_list.length > 0
        ) {
          this.templateHandler.template.cost_template_id = this.templateHandler.template.template_list[0].cost_template_id
        }
      })
    },
    showSelectCateView () {
      this.dialogVisible = true
    },
    onOpenedCate () {
      this.$refs.categorySelectView.initCate(this.cat_id, this.category_show)
    },
    onChangeCate (data) {
      this.dialogVisible = false
      this.cat_id = data.id
      this.category_show = data.name
      this.checkedCate = true
    },
    setProductList (productList) {
      this.productList = productList
    },
    onClose () {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
    },
    onSave () {
      let productEditList = []
      for (let i in this.productList) {
        let product = this.productList[i]
        productEditList.push({
          goods_id: product.goods_id,
          is_onsale: 2
        })
      }
      if (this.checkedCate) {
        for (let i in productEditList) {
          let product = productEditList[i]
          product.cat_id = this.cat_id
        }
      }
      if (this.titleHandler.checked) {
        for (let i in this.productList) {
          let product = this.productList[i]
          productEditList[i]['goods_name'] = product.goods_name
        }
        this.titleHandler.handle(productEditList, 'goods_name')
        this.titleHandler.cutOffTitle(productEditList, 'goods_name', common.PRODUCT_TITLE_LIMIT)
      }
      if (this.descHandler.checked) {
        for (let i in this.productList) {
          let product = this.productList[i]
          productEditList[i]['goods_name'] = product.goods_name
        }
        this.descHandler.handle(productEditList, 'goods_desc')
        this.descHandler.cutOffText(productEditList, 'goods_desc', common.PRODUCT_DESC_LIMIT)
      }
      if (this.stockHandler.checked) {
        for (let i in this.productList) {
          let product = this.productList[i]
          productEditList[i]['sku_list'] = product.sku_list.map(sku => ({...sku})) // deep copy
        }
        this.stockHandler.handleProducts(productEditList)
      }
      if (this.templateHandler) {
        for (let i in this.productList) {
          let product = this.productList[i]
          productEditList[i]['cost_template_id'] = product.cost_template_id
          productEditList[i]['is_pre_sale'] = product.is_pre_sale
          productEditList[i]['shipment_limit_second'] = product.shipment_limit_second
          productEditList[i]['is_refundable'] = product.is_refundable
          productEditList[i]['is_folt'] = product.is_folt
        }
        this.templateHandler.handle(productEditList)
      }
      if (this.checkedSale) {
        for (let i in productEditList) {
          let product = productEditList[i]
//          product.is_onsale = this.radioSale
          product.is_onsale = 1
        }
      }
      let goodsList = []
      for (let i in productEditList) {
        goodsList.push(JSON.stringify(productEditList[i]))
      }

      this.loadingCnt++
      this.request('updateProduct', {goods: goodsList}, data => {
        this.dicUpdateMessage = {}
        this.checkUpdateStatus(data.job_id)
      }, () => {
        this.loadingCnt--
      })
    },
    checkUpdateStatus (jobId) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      this.request('getUpdateProductRes', {job_id: jobId}, data => {
        if (data.status !== 'complete') {
          let self = this
          this.syncTimer = setTimeout(function () {
            self.checkUpdateStatus(jobId)
          }, 500)
        } else {
          this.loadingCnt--
          this.$emit('saved')
        }
        for (let i in data.goods_list) {
          let item = data.goods_list[i]
          let key = item.goods_id
          if (!(key in this.dicUpdateMessage)) {
            this.dicUpdateMessage[key] = item
            if (parseInt(item.code) === 0) {
              this.$message({
                message: '商品' + key + ': ' + item.message,
                type: 'success'
              })
            } else {
              this.$message.error('商品' + key + ': ' + item.message)
            }
          }
        }
      })
    },
    onChangeRadioSale (val) {
      this.checkedSale = true
    }
  }
}
</script>
