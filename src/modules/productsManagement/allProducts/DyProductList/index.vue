<template lang="html">
  <div v-loading="loadingCnt">
    <el-row>
      <el-col>
        <dy-search-filter-view ref="dySearchFilterView" @filterChange="onSearchChange"></dy-search-filter-view>
      </el-col>
    </el-row>
    <div v-if="activeTabName == 'normal'">
      <dy-product-list-view ref="dyProductListView" :dyProductList="dyProductList" @selectProductList="onSelectChange">
        <template slot="upperRight">
          <el-button size="small" style="right: 0px;" @click="downloadExcel">sku模板下载</el-button>
          <!-- 商品sku编码导入 upload组件 start -->
          <!-- <el-upload
            class="sku-excel-import-btn"
            action="/api/product/sku/excel/create"
            :multiple="false"
            :show-file-list="false"
            ref="upload"
            :limit=1
            :headers="getTokenHeaders"
            :on-success="skuExcelImportSuccess"
            :on-progress="skuExcelImporting"
            :on-error="skuExcelImportError"
          >
            <el-tooltip class="item" effect="dark" content="每次最多修改500条，预计一个sku需要1秒，请耐心等待"
                        placement="top">
              <el-button size="small" class="nodim" style="right: 0px;" :diabled="isSkuImporting"
                         @click="recordSkuExcelImportBtnClick">
                <span>商品sku编码导入</span>
                <i v-if="isSkuImporting" class="el-icon-loading"></i>
              </el-button>
            </el-tooltip>
          </el-upload> -->
          <!-- 商品sku编码导入 upload组件 end -->
          <el-button size="small" @click="openDialogExport" class="nodim" style="right: 0px;">商品导出</el-button>
        </template>
      </dy-product-list-view>
      <br>
      <el-pagination
        v-show="loadingCnt == 0"
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="pagination1.index"
        :page-size="pagination1.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination1.total">
      </el-pagination>
    </div>
    <div v-else-if="activeTabName == 'unsalable'">
      <dy-product-list-view ref="dyUnsalableListView" :dyProductList="dyUnsalableList"></dy-product-list-view>
      <br>
      <el-pagination
        v-show="loadingCnt == 0"
        @size-change="handleSizeChange2"
        @current-change="handleCurrentChange2"
        :current-page="pagination2.index"
        :page-size="pagination2.size"
        :page-sizes="[10, 20, 50, 100]"
        layout="sizes, prev, pager, next, jumper"
        :total="pagination2.total">
      </el-pagination>
    </div>
    <el-dialog title="批量修改属性" class="product-dialog" :visible.sync="dialogBatchEditVisible" @opened="dialogBatchOpened"
               @close="dialogBatchClose">
      <batch-edit-view ref="batchEditView" @saved="onBatchEditSaved"></batch-edit-view>
    </el-dialog>

    <el-dialog title="选择需要导出的字段" :visible.sync="dialogExportVisible" @opened="dialogExportOpened" v-hh-modal>
      <div v-loading="loadingCnt">
        <div>
          <el-checkbox v-model="isAllFieldSelected" @change="changeAllFieldSelected">全选</el-checkbox>
          <el-button type="text" @click="switchFieldSelect">反选</el-button>
        </div>
        <br>
        <div style="text-align: left">
          <el-checkbox v-for="item in exportFieldList" :key="item.field" v-model="item.value"
                       @change="checkAllFieldSelected"
                       style="padding-bottom: 15px; margin: 0 15px;"
          >
            {{ item.label }}
          </el-checkbox>
        </div>
        <div v-if="showDownloadFile" class="download-file">
          <div> {{ '最近生成时间：' + recentProductExcelTime }}</div>
          <el-link :key="val" type="primary" @click="onDownloadExcel()">
            {{ '商品列表.xlsx' }}
          </el-link>
        </div>
        <br>
        <div v-if="showProcess" style="text-align: center">
          <el-progress :text-inside="true" :stroke-width="14" :percentage="excelPercent"
                       style="width: 300px; margin: auto;"
          ></el-progress>
        </div>
        <el-button v-else size="small" @click="onGenProductsExcel"
        >
          生成Excel
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="sku编码更新结果" :visible.sync="skuExcelImportDialogVisible" width="80%">
      <div style="text-align: left">
        <div style="text-align: center;font-size: 16px;">成功: <span style="color: #4ca916">{{skuExcelImportSuccessNums}}</span></div>
        <div v-for="(error, index) in errorList" :key="index">
          {{ error }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dySearchFilterView from '@/components/DySearchFilterView.vue'
import batchEditView from '@productsManagement/allProducts/BatchEditView.vue'
import dyUnsalableFilterView from '@productsManagement/allProducts/DyUnsalableFilterView.vue'
import dyProductListView from '@productsManagement/allProducts/DyProductListView.vue'
import request from '@/mixins/request.js'
import {mapGetters, mapActions} from 'vuex'
import utils from '@/common/utils.js'

export default {
  mixins: [request],
  components: {
    dyProductListView,
    batchEditView,
    dySearchFilterView,
    dyUnsalableFilterView
  },
  data () {
    return {
      isSkuImporting: false,
      errorList: [],
      skuExcelImportDialogVisible: false,
      skuExcelImportSuccessNums: 0,
      isNew: 0,
      showDownloadFile: false,
      showProcess: false,
      dialogBatchEditVisible: false,
      dialogExportVisible: false,
      activeTabName: 'normal',
      isDisableBatch: true,
      isUnsalableLoaded: false,
      dyProductList: [],
      dyUnsalableList: [],
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
        {value: false, field: 'goods_id', label: '商品id'},
        {value: false, field: 'goods_name', label: '商品名'},
        {value: false, field: 'goods_desc', label: '来源数据'},
        {value: false, field: 'goods_quantity', label: '商品库存'},
        {value: false, field: 'market_price', label: '划线价'},
        {value: false, field: 'discount_price', label: '售卖价'},
        {value: false, field: 'image_url', label: '主图'},
        {value: false, field: 'category', label: '类目'},
        {value: false, field: 'pay_type_str', label: '支付方式'},
        {value: false, field: 'mobile', label: '客服手机'},
        {value: false, field: 'status_str', label: '商品状态'},
        {value: false, field: 'tp_outer_iid', label: '货号'},
        {value: false, field: 'presell_type', label: '发货模式'},
        {value: false, field: 'sku_id', label: 'skuid'},
        {value: false, field: 'spec_detail_names', label: 'sku规格'},
        {value: false, field: 'sku_code', label: 'sku编码'},
        {value: false, field: 'sku_quantity', label: 'sku现货或预售库存'},
        {value: false, field: 'sku_step_quantity', label: 'sku阶梯库存'},
        {value: false, field: 'sku_price', label: 'sku价格'}
      ],
      excelStatus: '',
      excelPercent: -1,
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
      exportFields: 'getExportFields',
      getTokenHeaders: 'getTokenHeaders'
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
    if (this.$refs.dyProductListView) {
      this.$refs.dyProductListView.dialogOptimizeVisible = false
    }
    if (this.$refs.dyUnsalableListView) {
      this.$refs.dyUnsalableListView.dialogOptimizeVisible = false
    }
  },
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
      'setExportFields'
    ]),
    getProductList (isResetIndex = true, isSilent = false) {
      if (this.$refs.dyProductListView) {
        this.$refs.dyProductListView.changeSelectAllData()
      }

      this.isLoadProduct = true
      if (isResetIndex) {
        this.pagination1.index = 1
      }

      let params = this.$refs.dySearchFilterView.getParams()
      params['page_index'] = this.pagination1.index
      params['page_size'] = this.pagination1.size

      this.request('getProductList', params, data => {
        this.dyProductList = data.items
        this.pagination1.total = data.total

        if (this.$refs.dyProductListView) {
          this.$refs.dyProductListView.setSelectRow()
        }
      }, undefined, isSilent)
    },
    getUnsalableProductList (isResetIndex = true, isSilent = false) {
      if (this.$refs.dyUnsalableListView) {
        this.$refs.dyUnsalableListView.changeSelectAllData()
      }

      this.isLoadProduct = true
      if (isResetIndex) {
        this.pagination2.index = 1
      }

      let params = this.$refs.dyUnsalableFilterView.getParams()
      params['page_index'] = this.pagination2.index
      params['page_size'] = this.pagination2.size

      this.request('getUnsalableProductList', params, data => {
        this.dyUnsalableList = data.items
        this.pagination2.total = data.total

        if (this.$refs.dyUnsalableListView) {
          this.$refs.dyUnsalableListView.setSelectRow()
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
      this.$refs.batchEditView.setProductList(this.$refs.dyProductListView.selectProductList)
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
      // 查询最近一次商品导出的文件信息
      this.request('getExcelFile', {}, data => {
        this.showDownloadFile = true
        this.recentProductExcelTime = data['last_update_time']
      })
      // const arrField = this.exportFields.split(',')
      // for (let i in this.exportFieldList) {
      //   let item = this.exportFieldList[i]
      //   item.value = arrField.includes(item.field)
      // }
      this.checkAllFieldSelected()
      // 窗口打开，去查询当前导出任务的状态
      this.request('genProductExcel', {
        'goods_attr_list': JSON.stringify([]),
        'is_new': 0
      }, data => {
        // 如果导出状态为未开始，成功或失败，则允许用户重新导出新文件
        if (['unbegin', 'success', 'fail'].includes(data.status)) {
          if (data.status === 'success') {
            // this.$message.success('商品导出完成')
            this.showDownloadFile = true
          }
          this.isNew = 1
        } else {
          this.onGenProductsExcel()
        }
      })
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
      // 百度统计打点
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '全部商品', '点击', '商品导出'])
      }
      // 查询导出状态
      // this.getProductExcelInfo()
    },
    onGenProductsExcel () {
      let fieldList = []
      let self = this
      for (let i in this.exportFieldList) {
        const item = this.exportFieldList[i]
        if (item.value) {
          fieldList.push({
            key: item.field,
            name: item.label
          })
        }
      }
      if (this.isNew && fieldList.length === 0) {
        this.$message.error('请选择需要导出的字段')
        return
      }
      // this.setExportFields(fields)
      this.request('genProductExcel', {
        'goods_attr_list': JSON.stringify(fieldList),
        'is_new': this.isNew
      }, data => {
        if (data['total_nums'] === 0) {
          data['total_nums'] = 1
        }
        this.excelPercent = parseInt(data['left_nums'] * 100 / data['total_nums'])
        this.showProcess = true
        if (['success', 'fail'].includes(data.status)) {
          // 如果导出状态是成功或者失败，则移除定时器
          if (data.status === 'success') {
            this.$message.success('商品导出完成')
            this.showDownloadFile = true
            this.recentProductExcelTime = data['last_update_time']
          } else if (data.status === 'fail') {
            this.$message.error('商品导出失败')
          }
          this.showProcess = false
          this.isNew = 1
          clearTimeout(this.syncTimer)
        } else if (['running', 'unbegin'].includes(data.status)) {
          this.isNew = 0
          // 如果任务还在进行中，则走定时器，继续请求这个接口
          this.syncTimer = setTimeout(function () {
            self.onGenProductsExcel()
          }, 2000)
        }
      })
    },
    onSelectChange () {
      this.isDisableBatch = (this.$refs.dyProductListView.selectProductList.length === 0)
    },
    delayProductExcelInfo (params) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      let self = this
      this.syncTimer = setTimeout(function () {
        self.getProductExcelInfo(params)
      }, 2000)
    },
    getProductExcelInfo (params) {
      this.request('getProductExcelProgress', params, data => {
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
    onDownloadExcel () {
      this.request('getExcelDownloadUrl', {}, data => {
        utils.downloadURL(data.url, '')
      })
    },
    /**
     * sku编码导入成功后的回调
     * @param response
     * @param file
     * @param fileList
     */
    skuExcelImportSuccess (response, file, fileList) {
      this.$refs.upload.clearFiles()
      this.isSkuImporting = false
      if (response.code !== 0) {
        this.$message.error(response.msg)
        return
      }
      this.errorList = response.data['error_list']
      if (utils.isEmptyObj(this.errorList)) {
        // 如果导入成功，则提示成功
        this.$message.success('导入成功' + response.data['success_nums'] + '条')
      } else {
        // 如果有失败的，则返回具体失败的原因
        this.skuExcelImportSuccessNums = response.data['success_nums']
        this.skuExcelImportDialogVisible = true
      }
    },
    /**
     * sku编码导入中的回调
     * @param event
     * @param file
     * @param fileList
     */
    skuExcelImporting (event, file, fileList) {
      this.isSkuImporting = true
    },
    /**
     * sku编码导入失败的回调
     * @param xerr
     * @param file
     * @param fileList
     */
    skuExcelImportError (xerr, file, fileList) {
      this.isSkuImporting = false
      this.$message.error('sku编码导入失败')
    },
    /**
     * 统计商品sku导入按钮的点击次数
     */
    recordSkuExcelImportBtnClick () {
      // 百度统计打点
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '全部商品', '点击', '商品sku编码导入'])
      }
    },
    /**
     * 生成sku编码模板文件
     */
    downloadExcel () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '全部商品', '下载', '下载sku编码模板'])
      }
      window.location.href = 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code.xlsx'
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';
</style>
