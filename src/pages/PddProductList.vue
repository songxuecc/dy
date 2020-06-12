<template lang="html">
    <div v-loading="loadingCnt">
        <el-tabs type="card" v-model="activeTabName" @tab-click="handleTabClick">
            <el-tab-pane label="全部商品" name="normal">
                <el-row>
                    <el-col :span="20">
                        <pdd-search-filter-view ref="pddSearchFilterView" @filterChange="onSearchChange"></pdd-search-filter-view>
                    </el-col>
                    <el-col :span="4" style="height:40px; display:flex; align-items:center;">
                        <el-button size="small" style="margin-left: auto;" @click="updateBatchProduct"
                                   :disabled="isDisableBatch"
                        >批量修改</el-button>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="在售滞销商品" name="unsalable">
                <pdd-unsalable-filter-view ref="pddUnsalableFilterView" @filterChange="onUnsalableChange"></pdd-unsalable-filter-view>
            </el-tab-pane>
        </el-tabs>
        <div v-if="activeTabName == 'normal'">
            <pdd-product-list-view ref="pddProductListView" :pddProductList="pddProductList" @selectProductList="onSelectChange">
                <template slot="upperLeft">
                    <el-button size="small" type="primary" @click="onSyncProducts" :disabled="isSyncing">
                      {{ syncButtonText }}
                    </el-button>&nbsp;&nbsp;
                    <span v-if="isShowLastSyncTime" style="font-size: 13px;">最近同步时间 {{ syncStatus.last_sync_time }}</span>
                </template>
                <template slot="upperRight">
                    <el-button size="small" @click="openDialogExport" class="nodim" style="right: 0px;">商品导出</el-button>
                </template>
            </pdd-product-list-view>
            <br>
            <el-pagination
                    v-show="loadingCnt == 0"
                    @size-change="handleSizeChange1"
                    @current-change="handleCurrentChange1"
                    :current-page="pagination1.index"
                    :page-size="pagination1.size"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination1.total">
            </el-pagination>
        </div>
        <div v-else-if="activeTabName == 'unsalable'">
            <pdd-product-list-view ref="pddUnsalableListView" :pddProductList="pddUnsalableList"></pdd-product-list-view>
            <br>
            <el-pagination
                    v-show="loadingCnt == 0"
                    @size-change="handleSizeChange2"
                    @current-change="handleCurrentChange2"
                    :current-page="pagination2.index"
                    :page-size="pagination2.size"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination2.total">
            </el-pagination>
        </div>
        <el-dialog title="批量修改属性" class="product-dialog" :visible.sync="dialogBatchEditVisible" @opened="dialogBatchOpened" @close="dialogBatchClose">
            <batch-edit-view ref="batchEditView" @saved="onBatchEditSaved"></batch-edit-view>
        </el-dialog>

        <el-dialog title="选择需要导出的字段" :visible.sync="dialogExportVisible" @opened="dialogExportOpened">
            <div v-loading="loadingCnt">
                <div>
                    <el-checkbox v-model="isAllFieldSelected" @change="changeAllFieldSelected">全选</el-checkbox>
                    <el-button type="text" @click="switchFieldSelect">反选</el-button>
                </div><br>
                <div style="text-align: left">
                    <el-checkbox v-for="item in exportFieldList" :key="item.field" v-model="item.value" @change="checkAllFieldSelected"
                                 style="padding-bottom: 15px; margin: 0 15px;"
                    >
                        {{ item.label }}
                    </el-checkbox>
                </div>
                <div v-if="recentProductExcelTime" class="download-file">
                  <div> {{ "最近生成时间：" + recentProductExcelTime }} </div>
                  <el-link v-for="(val, i) in recentProductExcelList" :key="val" type="primary" @click="onDownloadExcel(val, i)">
                    {{ '商品列表_' + (i + 1) + '.xlsx' }}
                  </el-link>
                </div><br>
                <div v-if="!isGenExcelComplete" style="text-align: center">
                  <div style="padding-bottom: 5px"> {{ genExcelText }} </div>
                  <el-progress :text-inside="true" :stroke-width="14" :percentage="excelPercent"
                               style="width: 300px; margin: auto;"
                  ></el-progress>
                </div>
                <div v-if="excelError" style="color: red"> {{ "生成Excel出错：" + excelError }} </div><br>
                <el-button v-if="isGenExcelComplete || excelStatus == ''" size="small" @click="onGenProductsExcel"
                           :disabled="!excelStatus || isSyncing"
                >
                  {{ isSyncing && excelStatus !== '' ? '正在同步商品，请稍后' : '同步最新数据，生成Excel' }}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import pddProductListView from '@/components/PddProductListView.vue'
import batchEditView from '@/components/BatchEditView.vue'
import pddSearchFilterView from '@/components/PddSearchFilterView.vue'
import pddUnsalableFilterView from '@/components/PddUnsalableFilterView.vue'
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
import common from '@/common/common.js'
import utils from '@/common/utils.js'

export default {
  mixins: [request],
  components: {
    pddProductListView,
    batchEditView,
    pddSearchFilterView,
    pddUnsalableFilterView
  },
  data () {
    return {
      dialogBatchEditVisible: false,
      dialogExportVisible: false,
      isSyncing: false,
      syncButtonText: '同步商品',
      activeTabName: 'normal',
      isDisableBatch: true,
      isUnsalableLoaded: false,
      pddProductList: [],
      pddUnsalableList: [],
      pagination1: {
        index: 1,
        size: 10,
        total: 0
      },
      pagination2: {
        index: 1,
        size: 10,
        total: 0
      },
      isAllFieldSelected: false,
      exportFieldList: [
        { value: false, field: 'sku', label: 'sku' },
        { value: false, field: 'outer_goods_id', label: '商品编码' },
        { value: false, field: 'category_show', label: '类目' },
        { value: false, field: 'market_price', label: '市场价' },
        { value: false, field: 'price', label: '单买价' },
        { value: false, field: 'multi_price', label: '团购价' },
        { value: false, field: 'quantity', label: '库存' },
        { value: false, field: 'status', label: '状态' },
        { value: false, field: 'source', label: '来源' },
        { value: false, field: 'month_trading_volume', label: '近一个月销量' }
      ],
      excelStatus: '',
      excelPercent: 0,
      excelRestTime: '',
      excelError: '',
      genExcelText: '准备生成Excel',
      syncTimer: null,
      recentProductExcelTime: '',
      recentProductExcelList: []
    }
  },
  computed: {
    ...mapGetters({
      syncStatus: 'getSyncStatus',
      exportFields: 'getExportFields'
    }),
    isShowLastSyncTime () {
      if (!this.syncStatus.last_sync_time || this.syncStatus.last_sync_time < '2019-01-01') {
        return false
      }
      return true
    },
    isGenExcelComplete () {
      return this.excelStatus === 'complete' || this.excelStatus === 'error' || this.excelStatus === ''
    }
  },
  watch: {
    syncStatus (val, oldVal) {
      if (['ready', 'running'].includes(oldVal.status) && val.status === 'complete') {
        this.getProductList(false)
      }
      this.isSyncing = (val.status !== 'complete' && val.status !== 'error')
      this.refreshSyncButtonText()
    }
  },
  mounted () {
  },
  activated () {
    if (this.activeTabName === 'normal') {
      this.getProductList(false)
    } else if (this.activeTabName === 'unsalable') {
      this.getUnsalableProductList(false)
    }
  },
  deactivated () {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
      this.syncTimer = null
    }
    if (this.$refs.pddProductListView) {
      this.$refs.pddProductListView.dialogOptimizeVisible = false
    }
    if (this.$refs.pddUnsalableListView) {
      this.$refs.pddUnsalableListView.dialogOptimizeVisible = false
    }
  },
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
      'setExportFields'
    ]),
    refreshSyncButtonText () {
      let val = this.syncStatus
      if (val.status === 'ready') {
        this.syncButtonText = '正在准备同步'
      } else if (val.status === 'running') {
        this.syncButtonText = '同步中...(' + val.cur + '/' + val.total + ')'
      } else {
        this.syncButtonText = '同步商品'
      }
    },
    onSyncProducts () {
      if (!this.isAuth) {
        return
      }
      if (this.isSyncing) {
        return
      }
      this.isSyncing = true
      this.syncButtonText = '正在准备同步'
      this.requestSyncProducts({
        sync_type: common.SyncType['all'],
        operation_type: 1
      })
    },
    getProductList (isResetIndex = true, isSilent = false) {
      if (this.$refs.pddProductListView) {
        this.$refs.pddProductListView.changeSelectAllData()
      }

      this.isLoadProduct = true
      if (isResetIndex) {
        this.pagination1.index = 1
      }

      let params = this.$refs.pddSearchFilterView.getParams()
      params['page_index'] = this.pagination1.index
      params['page_size'] = this.pagination1.size

      this.request('getProductList', params, data => {
        this.pddProductList = data.items
        this.pagination1.total = data.total

        if (this.$refs.pddProductListView) {
          this.$refs.pddProductListView.setSelectRow()
        }
      }, undefined, isSilent)
    },
    getUnsalableProductList (isResetIndex = true, isSilent = false) {
      if (this.$refs.pddUnsalableListView) {
        this.$refs.pddUnsalableListView.changeSelectAllData()
      }

      this.isLoadProduct = true
      if (isResetIndex) {
        this.pagination2.index = 1
      }

      let params = this.$refs.pddUnsalableFilterView.getParams()
      params['page_index'] = this.pagination2.index
      params['page_size'] = this.pagination2.size

      this.request('getUnsalableProductList', params, data => {
        this.pddUnsalableList = data.items
        this.pagination2.total = data.total

        if (this.$refs.pddUnsalableListView) {
          this.$refs.pddUnsalableListView.setSelectRow()
        }
      }, undefined, isSilent)
    },
    handleTabClick () {
      if (this.activeTabName === 'unsalable' && !this.isUnsalableLoaded) {
        this.isUnsalableLoaded = true
        this.getUnsalableProductList(false)
      }
    },
    onSearchChange () {
      this.getProductList()
    },
    onUnsalableChange () {
      this.getUnsalableProductList()
    },
    handleSizeChange1 (val) {
      this.pagination1.size = val
      this.getProductList()
    },
    handleCurrentChange1 (val) {
      this.pagination1.index = val
      this.getProductList(false)
    },
    handleSizeChange2 (val) {
      this.pagination2.size = val
      this.getUnsalableProductList()
    },
    handleCurrentChange2 (val) {
      this.pagination2.index = val
      this.getUnsalableProductList(false)
    },
    dialogBatchOpened () {
      this.$refs.batchEditView.setProductList(this.$refs.pddProductListView.selectProductList)
    },
    dialogBatchClose () {
      this.$refs.batchEditView.onClose()
    },
    updateBatchProduct () {
      this.dialogBatchEditVisible = true
    },
    onBatchEditSaved () {
      this.getProductList(false)
    },
    dialogExportOpened () {
      const arrField = this.exportFields.split(',')
      for (let i in this.exportFieldList) {
        let item = this.exportFieldList[i]
        item.value = arrField.includes(item.field)
      }
      this.checkAllFieldSelected()
    },
    changeAllFieldSelected (val) {
      for (let i in this.exportFieldList) {
        this.exportFieldList[i].value = this.isAllFieldSelected
      }
    },
    checkAllFieldSelected () {
      let isAllSelected = true
      for (let i in this.exportFieldList) {
        if (!this.exportFieldList[i].value) {
          isAllSelected = false
        }
      }
      this.isAllFieldSelected = isAllSelected
    },
    switchFieldSelect () {
      for (let i in this.exportFieldList) {
        this.exportFieldList[i].value = !this.exportFieldList[i].value
      }
      this.checkAllFieldSelected()
    },
    openDialogExport () {
      this.dialogExportVisible = true
      this.getProductExcelInfo()
    },
    onGenProductsExcel () {
      let fields = ''
      for (let i in this.exportFieldList) {
        const item = this.exportFieldList[i]
        if (item.value) {
          fields += item.field + ','
        }
      }
      this.setExportFields(fields)
      this.request('genProductExcel', {fields}, data => {
        this.excelStatus = 'ready'
        this.excelPercent = 0
        this.excelRestTime = ''
        this.excelError = ''
        this.delayProductExcelInfo()
      })
    },
    onSelectChange () {
      this.isDisableBatch = (this.$refs.pddProductListView.selectProductList.length === 0)
    },
    delayProductExcelInfo () {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      let self = this
      this.syncTimer = setTimeout(function () {
        self.getProductExcelInfo()
      }, 2000)
    },
    getProductExcelInfo () {
      this.request('getProductExcelProgress', {}, data => {
        this.excelStatus = data.status
        this.recentProductExcelTime = data.recent_data.gen_product_excel_time
        this.recentProductExcelList = data.recent_data.product_excels
        if (data.status === 'error') {
          this.excelError = data.message
        } else {
          this.excelError = ''
        }
        if (data.percent) {
          this.excelPercent = data.percent
          if (data.percent > 0) {
            this.updateSyncStatus()
          }
        }
        if (data.rest_time) {
          this.excelRestTime = data.rest_time
        }
        if (data.status === 'ready') {
          this.genExcelText = '准备生成Excel (关闭窗口不影响任务进行)'
          this.delayProductExcelInfo()
        } else if (data.status === 'running') {
          if (this.excelPercent === 0) {
            this.genExcelText = '准备更新数据'
          } else if (this.excelPercent < 90) {
            this.genExcelText = '正在更新数据'
          } else {
            this.genExcelText = '正在生成Excel'
          }

          if (this.excelRestTime !== '') {
            this.genExcelText += '，预计还需要' + this.excelRestTime
          }
          this.genExcelText += ' (关闭窗口不影响任务进行)'
          this.delayProductExcelInfo()
        }
      }, undefined, true)
    },
    onDownloadExcel (excel, index) {
      let params = {
        'excel': excel,
        'name': '商品列表_' + (index + 1) + '.xlsx'
      }
      this.request('getExcelDownloadUrl', params, data => {
        utils.downloadURL(data.url, '')
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/productlist.less';
</style>
