<template>
  <div v-loading="loadingCnt">
    <dy-search-filter-view ref="dySearchFilterView" @filterChange="onSearchChange" :onlyEditable="true"></dy-search-filter-view>
    <el-alert v-if="updateJobIdList.length !== 0" type="success" :closable="false" center style="margin-bottom: 10px;"
              :title="'有' + updateJobIdList.length + '组商品修改提交正在后台处理...'"
    ></el-alert>
    <el-row class="multi-fun-tab">
<!--      <help-tips :helpLink="activeTabName" positionT="10" positionR="400"></help-tips>-->
      <el-col :span="14" style="text-align: left; padding-left: 10px;">
        <el-tabs v-model="activeTabName" @tab-click="handleTabClick" :before-leave="beforeLeaveTab">
<!--          <el-tab-pane label="上下架" name="saleStatus"></el-tab-pane>-->
          <el-tab-pane label="改标题" name="title"></el-tab-pane>
<!--          <el-tab-pane label="改描述" name="description"></el-tab-pane>-->
<!--          <el-tab-pane label="改类目" name="category"></el-tab-pane>-->
          <el-tab-pane name="stock">
            <div slot="label">
              <el-popover placement="bottom" width="200" :visible-arrow="false" trigger="hover" popper-class="noedge-popper">
                <div>
                  <ul class="el-scrollbar__view el-select-dropdown__list" style="text-align: center">
                    <li class="el-select-dropdown__item" v-for="option in presellTypeOption"
                        :key="option.value" @click="handleSelectStock(option.value)"
                        :style="{color: tabPresellType === option.value ? 'black' : 'gray'}"
                    >
                      {{ option.label }}
                    </li>
                  </ul>
                </div>
                <div slot="reference">{{ '改库存(' + (tabPresellType === 2 ? '阶梯' : '现货') + ')'}}<i class="el-icon-arrow-down"></i> </div>
              </el-popover>
            </div>
          </el-tab-pane>
          <el-tab-pane label="改价格" name="price"></el-tab-pane>
          <el-tab-pane label="改发货模式" name="presellType"></el-tab-pane>
<!--         <el-tab-pane label="轮播图" name="banner"></el-tab-pane>-->
<!--         <el-tab-pane label="改编码" name="outerSn"></el-tab-pane>-->
<!--          <el-tab-pane label="改模板" name="template"></el-tab-pane>-->
        </el-tabs>
      </el-col>
      <el-col :span="10" style="padding: 4px; text-align: right">
        <el-button v-if="Object.keys(selectProductDict).length !== 0 || isShowSelect" size="small" @click="toggleShowProductList">
          {{ isShowSelect ? '继续选择' : '查看已选'}}
        </el-button>
        <el-button size="small" @click="toggleShowDrawer">
          {{ isShowDrawer ? '隐藏编辑抽屉' : '显示编辑抽屉'}}
        </el-button>
        <div v-if="Object.keys(selectProductDict).length === 0" style="display: inline-block; margin-left: 10px;">
          <el-tooltip class="item" effect="dark" placement="top" content="请选择需要修改的商品">
            <span class="button-wrapper">
              <el-button type="primary" size="small" disabled>全部保存</el-button>
            </span>
          </el-tooltip>
        </div>
        <el-button v-else type="primary" size="small" @click="confirmChange">全部保存</el-button>
      </el-col>
    </el-row>
    <div>
      <div v-show="!isShowSelect" key="product">
        <edit-product-list-view ref="editProductListView" :activeTabName="activeTabName"
                                :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                                @selectionChange="handleSelectionChange" @saveCell="handleSaveCell"
        ></edit-product-list-view>
        <el-pagination
          v-show="loadingCnt == 0"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.index"
          :page-size="pagination.size"
          layout="total, prev, pager, next, jumper"
          :total="pagination.total">
        </el-pagination>
      </div>
      <div v-show="isShowSelect" key="productSelect">
        <edit-product-list-view ref="selectProductListView" :activeTabName="activeTabName" :canSelect="false"
                                :dyProductModelList="selectProductList" :selectProductDict="selectProductDict"
                                @selectionChange="handleSelectionChange" @saveCell="handleSaveCell"
        ></edit-product-list-view>
      </div>
    </div>
    <div v-if="isShowDrawer" :style="{height: drawerHeight}"></div>
    <el-drawer class="no-cover-bottom-drawer" :visible.sync="isShowDrawer" direction="btt" :modal="false"
               :wrapperClosable="false" :withHeader="false" :style="{height: drawerHeight}"
    >
      <edit-text-drawer v-if="activeTabName==='title'" ref="editTitleDrawer" field="goods_name"
                         :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                         @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-text-drawer>
      <edit-text-drawer v-else-if="activeTabName==='description'" ref="editDescDrawer" field="goods_desc"
                         :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                         @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-text-drawer>
      <edit-sale-status-drawer v-else-if="activeTabName==='saleStatus'"  ref="editSaleStatusDrawer"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-sale-status-drawer>
      <edit-banner-drawer v-else-if="activeTabName==='banner'"  ref="editBannerDrawer"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange">
      </edit-banner-drawer>
      <edit-stock-drawer v-else-if="activeTabName==='stock'"  ref="editStockDrawer" :useStepStock="tabPresellType==2"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-stock-drawer>
      <edit-price-drawer v-else-if="activeTabName==='price'"  ref="editPriceDrawer"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-price-drawer>
      <edit-outer-sn-drawer v-else-if="activeTabName==='outerSn'"  ref="editOuterSnDrawer"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange"

      ></edit-outer-sn-drawer>
      <edit-presell-drawer v-else-if="activeTabName==='presellType'"  ref="editPresellDrawer"
                               :dyProductModelList="dyProductModelList" :selectProductDict="selectProductDict"
                               @rollback="rollbackChange" @confirm="confirmChange"
      ></edit-presell-drawer>
    </el-drawer>
    <el-dialog title="修改提示" width="800px" :visible.sync="dialogEditVisible" @close="closeDialog" append-to-body center>
      <div v-if="Object.keys(auditingProductDict).length > 0">
        <div style="text-align: center; border-bottom: 1px solid rgb(228, 228, 228);">下列商品的修改正在拼多多后台审核</div>
        <el-table :data="Object.values(auditingProductDict)" row-key="goods_id" :show-header="false">
          <el-table-column label="图片" width="100" align="center">
              <template slot-scope="scope">
                  <img style="height:60px;max-width:79px;" :src="scope.row.image_url">
              </template>
          </el-table-column>
          <el-table-column prop="goods_name"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              {{ scope.row.message }}，
              <el-link type="primary" :underline="false" :href="'https://mms.pinduoduo.com/goods/goods_return_detail?id=' + scope.row.goods_commit_id" target="_blank" >
                查看详情
              </el-link>
            </template>
          </el-table-column>
        </el-table>
        <br>
      </div>
      <div v-if="Object.keys(errorProductDict).length > 0">
        <div style="text-align: center; border-bottom: 1px solid rgb(228, 228, 228);">下列商品修改失败，请调整后再试</div>
        <el-table :data="Object.values(errorProductDict)" row-key="goods_id" :show-header="false">
          <el-table-column label="图片" width="100" align="center">
              <template slot-scope="scope">
                  <img style="height:60px;max-width:79px;" :src="scope.row.image_url">
              </template>
          </el-table-column>
          <el-table-column prop="goods_name"></el-table-column>
          <el-table-column prop="message"></el-table-column>
        </el-table>
        <br>
      </div>
      <div style="padding-top: 20px; text-align: center;">
        <el-button type="info" size="small" @click="dialogEditVisible=false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dySearchFilterView from '@/components/DySearchFilterView.vue'
import editProductListView from '@/components/EditProductListView.vue'
import editTextDrawer from '@/components/EditTextDrawer.vue'
import editSaleStatusDrawer from '@/components/EditSaleStatusDrawer.vue'
import editBannerDrawer from '@/components/EditBannerDrawer.vue'
import editStockDrawer from '@/components/EditStockDrawer.vue'
import editPriceDrawer from '@/components/EditPriceDrawer.vue'
import editOuterSnDrawer from '@/components/EditOuterSnDrawer.vue'
import editPresellDrawer from '@/components/EditPresellDrawer.vue'
import helpTips from '@/components/HelpTips.vue'
import request from '@/mixins/request.js'
import utils from '@/common/utils'
import FormModel from '@/common/formModel'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [request],
  components: {
    dySearchFilterView,
    editProductListView,
    editTextDrawer,
    editSaleStatusDrawer,
    editBannerDrawer,
    editStockDrawer,
    editPriceDrawer,
    editOuterSnDrawer,
    editPresellDrawer,
    helpTips
  },
  data () {
    return {
      activeTabName: 'saleStatus',
      dyProductModelList: [],
      selectProductList: [],
      selectProductDict: {},
      updatingProductDict: {},
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      isInit: false,
      isShowSelect: false,
      isShowDrawer: false,
      updateStatusTimer: null,
      dialogEditVisible: false,
      auditingProductDict: {},
      errorProductDict: {},
      tabPresellType: 0,
      presellTypeOption: [{
        value: 0,
        label: '现货发货&全款预售发货'
      }, {
        value: 2,
        label: '阶梯发货模式'
      }]
    }
  },
  computed: {
    ...mapGetters({
      updateJobIdList: 'getUpdateJobIdList'
    }),
    drawerHeight () {
      if (this.activeTabName === 'price') {
        return '180px'
      } else if (this.activeTabName === 'presellType') {
        return '180px'
      } else if (this.activeTabName === 'stock') {
        return this.tabPresellType === 2 ? '180px' : '130px'
      }
      return '130px'
    }
  },
  watch: {
    // isShowDrawer (val, oldVal) {
    //   this.setIsShowFloatView(!val)
    // }
  },
  mounted () {
  },
  activated () {
    if (this.$route.params.tab) {
      if (this.haveEdit()) {
        this.$router.push({ path: this.activeTabName })
      } else {
        this.activeTabName = this.$route.params.tab
      }
    }
    this.getProductList(false)
    this.checkUpdateStatus()
    this.setIsShowFloatView(!this.isShowDrawer)
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    this.setIsShowFloatView(true)
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  methods: {
    ...mapActions([
      'setIsShowFloatView',
      'addUpdateJobId',
      'deleteUpdateJobId'
    ]),
    beforeunloadFn (e) {
      e = e || window.event
      if (!this.haveEdit()) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    getProductList (isResetIndex = true, isSilent = false) {
      if (isResetIndex) {
        this.pagination.index = 1
      }

      let params = this.$refs.dySearchFilterView.getParams()
      params['page_index'] = this.pagination.index
      params['page_size'] = this.pagination.size
      if (this.activeTabName === 'stock') {
        params['is_step_stock'] = (this.tabPresellType === 2 ? 1 : 0)
      }

      this.request('getProductList', params, data => {
        this.pagination.total = data.total
        this.dyProductModelList = []
        for (let i in data.items) {
          let product = new FormModel()
          if (data.items[i].goods_id in this.selectProductDict) {
            product = this.selectProductDict[data.items[i].goods_id]
          } else {
            // data.items[i].is_onsale = (data.items[i].status === 2 ? 0 : 1)
            for (let j in data.items[i].sku_list) {
              data.items[i].sku_list[j].price /= 100.0
            }
            product.assign(data.items[i])
          }
          this.dyProductModelList.push(product)
        }

        if (!this.isInit) {
          this.isInit = true
          this.isShowDrawer = true
        }
        this.changeDrawerInitSaleStatus()
      }, undefined, isSilent)
    },
    changeDrawerInitSaleStatus () {
      if (this.dyProductModelList.length === 0) {
        return
      }
      if (this.$refs.editSaleStatusDrawer) {
        this.$refs.editSaleStatusDrawer.isOnSale = this.dyProductModelList[0].model.is_onsale
      }
    },
    onSearchChange () {
      this.getProductList()
    },
    haveEdit () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        if (product.isDiff()) {
          return true
        }
      }
      return false
    },
    beforeLeaveTab (item) {
      if (!this.haveEdit()) {
        this.rollbackChange()
        return true
      }
      let self = this
      return this.$confirm('已修改的商品不会保存，确定切换？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '暂不切换'
      }).then(_ => {
        self.rollbackChange()
        this.$router.push({ path: item })
      }).catch(_ => {
        throw new Error('取消成功！')
      })
    },
    handleTabClick (tab, event) {
      if (!this.haveEdit()) {
        this.$router.push({ path: tab.name })
        this.getProductList()
      }
    },
    toggleShowProductList () {
      if (window._hmt) {
        let label = this.isShowSelect ? '继续选择' : '查看已选'
        window._hmt.push(['_trackEvent', '批量修改', '点击', label])
      }
      this.isShowSelect = !this.isShowSelect
    },
    toggleShowDrawer () {
      if (window._hmt) {
        let label = this.isShowDrawer ? '隐藏编辑抽屉' : '显示编辑抽屉'
        window._hmt.push(['_trackEvent', '批量修改', '点击', label])
      }
      this.isShowDrawer = !this.isShowDrawer
    },
    handleSelectStock (presellType) {
      this.tabPresellType = presellType
      if (!this.haveEdit()) {
        this.activeTabName = 'stock'
        this.$router.push({ path: 'stock' })
        this.getProductList()
      } else {
        let self = this
        return this.$confirm('已修改的商品不会保存，确定切换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '暂不切换'
        }).then(_ => {
          self.rollbackChange()
          self.activeTabName = 'stock'
          self.$router.push({ path: 'stock' })
          self.getProductList()
        }).catch(_ => {
          throw new Error('取消成功！')
        })
      }
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getProductList(false)
    },
    handleSelectionChange (selection) {
      this.selectProductList = selection
      this.selectProductDict = {}
      for (let i in selection) {
        let product = selection[i]
        this.selectProductDict[product.originModel.goods_id] = product
      }
    },
    handleSaveCell (row) {
      if (window._hmt) {
        let label = '保存 ' + this.activeTabName
        window._hmt.push(['_trackEvent', '批量修改', '修改', label])
      }
      if (!row.isDiff()) {
        this.$message('商品未改动')
        return
      }
      if (row.model.status === 1 && row.model.check_status === 1 && this.activeTabName === 'title') {
        // 下架商品单个保存
        row.model.commit = this.$refs['editTitleDrawer'].commitType
      }
      let productNew = this.genCommitProduct(row)
      let params = {goods: [JSON.stringify(productNew)], type: 1}
      this.request('updateProduct', params, data => {
        this.$message('商品修改已提交，正在后台处理中...')
        this.addUpdateJobId(data.job_id)
        this.updatingProductDict[row.model.goods_id] = row
        this.checkUpdateStatus()
      })
    },
    rollbackChange () {
      for (let i in this.dyProductModelList) {
        this.dyProductModelList[i].rollback()
      }
      for (let key in this.selectProductDict) {
        this.selectProductDict[key].rollback()
      }
    },
    genCommitProduct (product) {
      let productNew = {
        'goods_id': product.model.goods_id,
        'is_onsale': 2
      }
      let skuList = []
      if (product.model.sku_list) {
        skuList = JSON.parse(JSON.stringify(product.model.sku_list)) // deep copy
        skuList.forEach((sku) => {
          sku['price'] = Math.round(sku['price'] * 100)
        })
      }
      if (this.activeTabName === 'title') {
        if (utils.getDyStrRealLength(product.model.goods_name) > 30) {
          this.$alert('商品标题超过30个字，请重新设置', '提示')
          return null
        }
        productNew['goods_name'] = product.model.goods_name
      } else if (this.activeTabName === 'description') {
        productNew['goods_desc'] = product.model.goods_desc
      } else if (this.activeTabName === 'saleStatus') {
        productNew['is_onsale'] = product.model.is_onsale
      } else if (this.activeTabName === 'banner') {
        productNew['carousel_gallery_list'] = product.model.carousel_gallery_list
      } else if (this.activeTabName === 'stock') {
        productNew['sku_list'] = skuList
      } else if (this.activeTabName === 'price') {
        productNew['sku_list'] = skuList
      } else if (this.activeTabName === 'outerSn') {
        productNew['outer_goods_id'] = product.model.outer_goods_id
        productNew['sku_list'] = skuList
          // 跳过库存修改
        productNew['sku_list'].forEach((sku) => {
          sku['skip_update_stock'] = true
        })
      } else if (this.activeTabName === 'presellType') {
        productNew['presell_type'] = product.model.presell_type
        productNew['delivery_delay_day'] = product.model.delivery_delay_day
        if (product.model.presell_type > 0) {
          productNew['presell_delay'] = product.model.presell_delay
        }
        if (product.model.presell_type === 1) {
          productNew['pre_sale_date'] = product.model.presell_end_time
        }
      }
      if (product.model.status === 1 && product.model.check_status === 1 && product.model.commit) {
        // 下架商品设置commit字段的情况
        productNew['commit'] = product.model.commit
      }
      return productNew
    },
    confirmChange () {
      if (window._hmt) {
        let label = '全部保存 ' + this.activeTabName
        window._hmt.push(['_trackEvent', '批量修改', '修改', label])
      }
      let goodsList = []
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        if (!product.isDiff()) {
          continue
        }
        let productNew = this.genCommitProduct(product)
        if (!productNew) {
          return
        }
        goodsList.push(JSON.stringify(productNew))
      }
      if (goodsList.length === 0) {
        this.$message('没有商品改动')
        return
      }
      this.request('updateProduct', {goods: goodsList, type: 1}, data => {
        this.$message('商品修改已提交，正在后台处理中...')
        this.addUpdateJobId(data.job_id)
        for (let key in this.selectProductDict) {
          let product = this.selectProductDict[key]
          this.updatingProductDict[key] = product
        }
        this.$refs.editProductListView.clearSelection()
        this.isShowSelect = false
        this.checkUpdateStatus()
      })
    },
    checkUpdateStatus () {
      if (this.updateStatusTimer) {
        clearTimeout(this.updateStatusTimer)
        this.updateStatusTimer = null
      }
      if (this.updateJobIdList.length === 0) {
        return
      }
      this.request('getUpdateProductRes', { job_ids: this.updateJobIdList }, data => {
        for (let jobId in data) {
          let jobItem = data[jobId]
          this.handleJobItem(jobId, jobItem)
        }
        if (this.updateJobIdList.length > 0) {
          let self = this
          this.updateStatusTimer = setTimeout(function () {
            self.checkUpdateStatus()
          }, 500)
        }
      }, err => {
        this.$message.error(err.message)
      }, true)
    },
    handleJobItem (jobId, jobItem) {
      if (jobItem.status === 'complete') {
        let goodsIdDict = {}
        let errorProductDict = {}
        let auditingProductDict = {}
        for (let i in jobItem.goods_list) {
          let product = jobItem.goods_list[i]
          goodsIdDict[product.goods_id] = 1
          if (product.code === 0) {
            if (product.goods_commit_id) {
              auditingProductDict[product.goods_id] = {
                'message': '平台后台审核中',
                'goods_commit_id': product.goods_commit_id
              }
            }
            continue
          }
          errorProductDict[product.goods_id] = {
            'message': product.message
          }
        }
        for (let key in this.updatingProductDict) {
          let productModel = this.updatingProductDict[key]
          if (!(productModel.originModel.goods_id in goodsIdDict)) {
            continue
          }
          if (productModel.originModel.goods_id in errorProductDict) {
            errorProductDict[productModel.model.goods_id]['goods_id'] = productModel.originModel.goods_id
            errorProductDict[productModel.model.goods_id]['image_url'] = productModel.originModel.image_url
            errorProductDict[productModel.model.goods_id]['goods_name'] = productModel.originModel.goods_name
            productModel.rollback()
          } else if (productModel.originModel.goods_id in auditingProductDict) {
            auditingProductDict[productModel.model.goods_id]['goods_id'] = productModel.originModel.goods_id
            auditingProductDict[productModel.model.goods_id]['image_url'] = productModel.originModel.image_url
            auditingProductDict[productModel.model.goods_id]['goods_name'] = productModel.originModel.goods_name
            productModel.rollback()
          } else {
            productModel.originModel.goods_name = productModel.model.goods_name
            productModel.originModel.goods_desc = productModel.model.goods_desc
            productModel.originModel.is_onsale = productModel.model.is_onsale
            if (productModel.model.carousel_gallery_list) {
              productModel.originModel.carousel_gallery_list = Array.from(productModel.model.carousel_gallery_list)
            }
            productModel.originModel.sku_list = JSON.parse(JSON.stringify(productModel.model.sku_list))
            productModel.originModel.outer_goods_id = productModel.model.outer_goods_id
          }
          delete this.updatingProductDict[key]
        }
        if (Object.keys(errorProductDict).length === 0 && Object.keys(auditingProductDict).length === 0) {
          this.$message({
            message: '更新成功',
            type: 'success'
          })
        } else {
          Object.assign(this.errorProductDict, errorProductDict)
          Object.assign(this.auditingProductDict, auditingProductDict)
          this.dialogEditVisible = true
        }
        this.deleteUpdateJobId(jobId)
      } else if (jobItem.status === 'nojob') {
        this.deleteUpdateJobId(jobId)
      } else {
      }
    },
    closeDialog () {
      this.errorProductDict = {}
      this.auditingProductDict = {}
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
