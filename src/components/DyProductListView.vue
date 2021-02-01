<template lang="html">
    <div>
        <div v-if="updateInfo.length>0">
            <el-alert :title=updateInfo type="success" :closable="false" center></el-alert>
        </div>
        <div class="text-left" style="padding: 10px 0">
            <el-row>
                <el-col :span="16">
                    商品列表&nbsp;&nbsp;
                    <slot name="upperLeft"></slot>
                    <el-button plain size='mini' v-if="isSelectMultiPage" @click="showSelectProduct">已选择商品({{selectAllProductList.length}})</el-button>
                </el-col>
                <el-col :span="8" style="text-align: right;" v-if="isProductEnableEdit">
                    <slot name="upperRight"></slot>
                </el-col>
            </el-row>
        </div>
        <el-table ref="dyProductListTable" :data="dyProductList" row-key="goods_id" border style="width: 100%"
                  :row-style="{height:'68px'}" :cell-style="{padding:0}"
        >
        <el-table-empty slot="empty"/>
<!--            <el-table-column type="selection" :reserve-selection="true" :selectable="this.$parent.isSelectionEnable ===undefined ? function(){return true}:this.$parent.isSelectionEnable">-->
<!--            </el-table-column>-->
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="scope">
                    <img style="height:60px;max-width:79px;" :src="scope.row.image_url">
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                        {{ scope.row.goods_name }}
                    </el-link><br>
                    <div>
                      <label style="font-size:12px">{{ scope.row.goods_id }}</label>
                    </div>
<!--                    <div>-->
<!--                        <label style="font-size:12px" v-if="scope.row.outer_goods_id">商家编码: {{scope.row.outer_goods_id}}</label>-->
<!--                        <el-tooltip class="item" effect="light" placement="right" v-if="isProductEnableEdit">-->
<!--                            <div slot="content">-->
<!--                                <div>-->
<!--                                    <span style="font-size: 14px">商品信息完整度</span>-->
<!--                                    <el-rate style="display: inline;" disabled v-model="scope.row.score" show-score score-template="{value}分"></el-rate>-->
<!--                                </div>-->
<!--                                <div v-for="(item, index) in scope.row.score_tips" :key="index" style="padding-top: 10px">-->
<!--                                    <span style="display:inline-block; width:100px">{{ item[0] }}</span>-->
<!--                                    <span>{{ item[1] }}</span>-->
<!--                                </div>-->
<!--                                <div style="text-align: center; padding-top: 10px;">-->
<!--                                    <el-button size="small" @click="optimizeProduct(scope.row)">去优化</el-button>-->
<!--                                </div>-->
<!--                                &lt;!&ndash;<div style="padding-top: 10px; color: gray"> * 同步或更新后的商品分数将于1小时内更新 </div>&ndash;&gt;-->
<!--                            </div>-->
<!--                            <div :class="['score', (scope.row.score >= 4 ? 'good-score' : 'bad-score')]">-->
<!--                                {{ scope.row.score > 0 ? scope.row.score + '分' : '尚未评分' }}-->
<!--                            </div>-->
<!--                        </el-tooltip>-->
<!--                    </div>-->
                </template>
            </el-table-column>
            <el-table-column label="类目" width="120">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" placement="top" :content="scope.row.category_show">
                        <span> {{ getLastCategory(scope.row.category_show) }} </span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="售卖价" width="80">
                <template slot-scope="scope">
                    {{ scope.row.min_price / 100 }}
                    {{ scope.row.min_price === scope.row.max_price ? '' : ' ~' }}
                    <br/>
                    {{ scope.row.min_price === scope.row.max_price ? '' : scope.row.max_price / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="市场价" width="80">
                <template slot-scope="scope">
                    {{ scope.row.market_price / 100 }}
                </template>
            </el-table-column>
            <el-table-column prop="goods_quantity" label="库存" width="80">
            </el-table-column>
            <el-table-column label="销售状态" width="80">
                <template slot-scope="scope">
                    <el-link type="primary" :underline="false" :href="dyGoodsLink(scope.row.goods_id_str)" target="view_window">{{ dyProductStatusMap[scope.row.status + '-' + scope.row.check_status] }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="80" v-if="isProductEnableEdit">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="productEdit(scope.row)" :disabled="!checkProductEnableEdit(scope.row)">修改</el-button>
<!--                    <el-button type="primary" size="small" @click="setSaleStatus(scope.row)">-->
<!--                        {{ getOptText(scope.row) }}-->
<!--                    </el-button>-->
                </template>
            </el-table-column>
        </el-table>

        <el-dialog title="商品编辑" class="product-dialog" :visible.sync="dialogEditVisible" @opened="dialogEditOpened" @close="dialogEditClose"  :before-close="dialogBeforeClose">
            <dy-product-edit-view ref="productEditView" @changeProduct="onChangeProduct" @closeDialog="onCloseDialogEdit"></dy-product-edit-view>
        </el-dialog>
        <el-dialog title="商品优化" class="product-dialog" :visible.sync="dialogOptimizeVisible" @opened="dialogOptimizeOpened" @close="dialogOptimizeClose">
            <product-optimize-view ref="productOptimizeView" @changeProduct="onChangeProduct"></product-optimize-view>
        </el-dialog>

        <el-dialog title="选中商品" class="product-dialog" :visible.sync="dialogSelectProductListVisible">
          <el-table :data="selectAllProductList" row-key="goods_id" border style="width: 100%" height="450"
                  :row-style="{height:'68px'}" :cell-style="{padding:0}"
          >
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="scope">
                    <img style="height:60px;max-width:79px;" :src="scope.row.image_url">
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <a :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                        {{ scope.row.goods_name }}
                    </a><br>
                    <div>
                        <label style="font-size:12px" v-if="scope.row.outer_goods_id">商家编码: {{scope.row.outer_goods_id}}</label>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="类目" width="110">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" placement="top" :content="scope.row.category_show">
                        <span> {{ getLastCategory(scope.row.category_show) }} </span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="团购价" width="80">
                <template slot-scope="scope">
                    {{
                        scope.row.min_multi_price === scope.row.max_multi_price ? scope.row.max_multi_price / 100
                        : scope.row.min_multi_price / 100 + ' ~'
                    }}
                    <br/>
                    {{
                        scope.row.min_multi_price === scope.row.max_multi_price ? ''
                        : scope.row.max_multi_price / 100
                    }}
                </template>
            </el-table-column>
            <el-table-column label="单购价" width="80">
                <template slot-scope="scope">
                    {{
                    scope.row.min_price === scope.row.max_price ? scope.row.max_price / 100
                    : scope.row.min_price / 100 + ' ~'
                    }}
                    <br/>
                    {{
                        scope.row.min_price === scope.row.max_price ? ''
                        : scope.row.max_price / 100
                    }}
                </template>
            </el-table-column>
            <el-table-column prop="goods_quantity" label="库存" width="80">
            </el-table-column>
            <el-table-column label="销售状态" width="80">
                <template slot-scope="scope">
                  <el-link type="primary" :underline="false" :href="dyGoodsLink(scope.row.goods_id_str)" target="view_window">{{ dyProductStatusMap[scope.row.status + '-' + scope.row.check_status] }}</el-link>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="90">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="cancelSelect(scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-dialog>
    </div>
</template>
<script>
import dyProductEditView from '@/components/DyProductEditView.vue'
import productOptimizeView from '@/components/ProductOptimizeView.vue'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import utils from '@/common/utils.js'

export default {
  mixins: [request],
  props: {
    dyProductList: Array,
    isProductEnableEdit: {
      type: Boolean,
      default: true
    },
    isSelectMultiPage: {
      type: Boolean,
      default: false
    }, // 是否显示跨页选择结果
    selectAllProductList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    dyProductList: function (newVal, oldVal) {
      this.setSelectRow()
    }
  },
  components: {
    dyProductEditView,
    productOptimizeView
  },
  data () {
    return {
      dialogEditVisible: false,
      dialogOptimizeVisible: false,
      dialogSelectProductListVisible: false,
      curProduct: {},
      selectProductList: []
      // selectAllProductList: [], // 包含所有页的筛选
    }
  },
  activated () {
    this.selectProductList = []
  },
  mounted () {
  },
  computed: {
    dyProductStatusMap () {
      return common.dyProductStatusMap
    },
    updateInfo () {
//      return '正在修改商品'
      return ''
    }
  },
  methods: {
    dyGoodsLink (dyGoodsId) {
      return 'https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + dyGoodsId
    },
    checkProductEnableEdit (product) {
      if (!this.isProductEnableEdit) {
        return false
      }
      if (product) {
        if ((product.status === 0 && product.check_status === 1) || // 草稿箱
          (product.status === 1 && product.check_status === 5) // 封禁中
        ) {
          return false
        }
      }
      return true
    },
    getLastCategory (category) {
      return utils.getLastCategory(category)
    },
    handleSelectionChange (selection) {
      this.selectProductList = selection
      this.changeSelectAllData()
    },
    setSelectRow () {
      let selectAllIds = []
      this.selectAllProductList.forEach(row => {
        selectAllIds.push(row['goods_id'])
      })
      this.$refs.dyProductListTable.clearSelection()
      for (var i = 0; i < this.dyProductList.length; i++) {
        if (selectAllIds.indexOf(this.dyProductList[i]['goods_id']) >= 0) {
          this.$refs.dyProductListTable.toggleRowSelection(this.dyProductList[i], true)
        }
      }
    },
    changeSelectAllData () {
      // if (this.selectAllProductList.length <= 0) {
      //   this.selectAllProductList = this.selectProductList
      // }
      let selectAllIds = []
      this.selectAllProductList.forEach(row => {
        selectAllIds.push(row['goods_id'])
      })
      let self = this
      let selectIds = []
      this.selectProductList.forEach(row => {
        selectIds.push(row['goods_id'])
        if (selectAllIds.indexOf(row['goods_id']) < 0) {
          self.selectAllProductList.push(row)
        }
      })
      let noSelectIds = []
      this.dyProductList.forEach(row => {
        if (selectIds.indexOf(row['goods_id']) < 0) {
          noSelectIds.push(row['goods_id'])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < self.selectAllProductList.length; i++) {
            if (self.selectAllProductList[i]['goods_id'] === id) {
              self.selectAllProductList.splice(i, 1)
              break
            }
          }
        }
      })
      this.$emit('selectProductList', this.selectAllProductList)
    },
    showSelectProduct () {
      this.dialogSelectProductListVisible = true
    },
    cancelSelect (row) {
      for (let i = 0; i < this.selectAllProductList.length; i++) {
        if (this.selectAllProductList[i]['goods_id'] === row['goods_id']) {
          this.selectAllProductList.splice(i, 1)
          break
        }
      }
      // for (let i = 0; i < this.selectProductList.length; i++) {
      //   if (this.selectProductList[i]['goods_id'] === row['goods_id']) {
      //     this.selectProductList.splice(i, 1)
      //     break
      //   }
      // }

      this.setSelectRow()
    },
    productEdit (product) {
      this.curProduct = product
      this.dialogEditVisible = true
    },
    getOptText (product) {
      if (product.status === 1) {
        return '上架'
      } else {
        return '下架'
      }
    },
    setSaleStatus (product) {
      let params = {
        goods_id: product.goods_id,
        is_onsale: (product.status === 1 ? 0 : 1)
      }
      this.request('setGoodsSaleStatus', params, data => {
        let msg = '商品' + this.getOptText(product)
        if (data.is_success) {
          this.$message(msg + '成功')
          if (product.status === 1) {
            product.status = 2
          } else {
            product.status = 1
          }
        } else {
          this.$message(msg + '失败')
        }
      })
    },
    dialogEditOpened () {
      if (this.curProduct.goods_id) {
        this.$refs.productEditView.setProduct(this.curProduct)
      }
    },
    dialogEditClose () {
      this.$refs.productEditView.onClose()
    },
    onCloseDialogEdit () {
      this.dialogEditVisible = false
    },
    dialogBeforeClose (done) {
      let self = this
      if (this.$refs.productEditView.isProductChange()) {
        this.$confirm('有未保存的修改，是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存'
        }).then(_ => {
          self.$refs.productEditView.onSaveProduct()
          done()
        }).catch(_ => { done() })
      } else {
        done()
      }
    },
    optimizeProduct (product) {
      this.curProduct = product
      this.dialogOptimizeVisible = true
    },
    dialogOptimizeOpened () {
      if (this.curProduct.goods_id) {
        this.$refs.productOptimizeView.setProduct(this.curProduct)
      }
    },
    dialogOptimizeClose () {
      this.$refs.productOptimizeView.onClose()
    },
    onChangeProduct (data) {
      let dicKeys = {
        outer_id: 'outer_goods_id',
        price: 'market_price',
        title: 'goods_name',
        cat_id: 'cat_id',
        category_show: 'category_show',
        description: 'goods_desc',
        cost_template_id: 'cost_template_id',
        is_pre_sale: 'is_pre_sale',
        shipment_limit_second: 'shipment_limit_second',
        is_refundable: 'is_refundable',
        is_folt: 'is_folt',
        status: 'status'
      }
      for (let key in data) {
        if (!data.hasOwnProperty(key)) continue
        if (key in dicKeys) {
          this.curProduct[ dicKeys[key] ] = data[key]
        }
      }
      if (data.sku_list) {
        let dicSku = {}
        for (let i in data.sku_list) {
          let sku = data.sku_list[i]
          dicSku[sku.sku_id] = sku
        }
        let quantity = 0
        let minPrice = 1e8
        let maxPrice = 0
        let minMultiPrice = 1e8
        let maxMultiPrice = 0
        for (let i = this.curProduct.sku_list.length - 1; i >= 0; --i) {
          let sku = this.curProduct.sku_list[i]
          if (sku.sku_id in dicSku) {
            sku.quantity = dicSku[sku.sku_id].quantity
            sku.price = dicSku[sku.sku_id].price
            sku.multi_price = dicSku[sku.sku_id].multi_price
            // sku.is_onsale = dicSku[sku.sku_id].is_onsale
            // sku.limit_quantity = dicSku[sku.sku_id].limit_quantity
            quantity += parseInt(sku.quantity)
            minPrice = Math.min(minPrice, sku.price)
            maxPrice = Math.max(maxPrice, sku.price)
            minMultiPrice = Math.min(minMultiPrice, sku.multi_price)
            maxMultiPrice = Math.max(maxMultiPrice, sku.multi_price)
          } else {
            this.curProduct.sku_list.splice(i, 1)
          }
        }
        this.curProduct.goods_quantity = quantity
        this.curProduct.min_price = minPrice
        this.curProduct.max_price = maxPrice
        this.curProduct.min_multi_price = minMultiPrice
        this.curProduct.max_multi_price = maxMultiPrice
      }
    }
  }
}
</script>
