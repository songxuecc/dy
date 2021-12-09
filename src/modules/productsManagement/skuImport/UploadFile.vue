<!-- sku上传文件 -->
<template>
  <div class="left uploadFile pb-10">
    <p class="font-13">1、上传前确保已进行过商品同步&nbsp;&nbsp;<a :class="[isSyncing?'color-info':'click','pointer font-13']"
        @click="handleSyncProducts">{{syncButtonText}}</a> <span class="color-767989">&nbsp;最近同步时间
        {{ syncStatus.last_sync_time }} </span></p>
    <p class="font-13 " v-if="[0,1].includes(filterType)">2、每次支持5000个sku修改，导入的Excel格式仅支持.xlsx格式
    </p>
    <p class="font-13 " v-if="[2,3].includes(filterType)">2、每次支持5000个sku修改，导入的Excel格式仅支持.xlsx格式</p>
    <p class="font-13 ">3、仅支持售卖中、仓库中（已下架）的商品修改 </p>
    <p class="font-13 " v-if="filterType === 0">4、保证导入的商品标题、规格名与抖店后台一致。多个SKU规格请用英文逗号分隔，如：红色,36码 </p>
    <el-upload class="upload-demo mt-10" action="/api/product/sku/excel/create" :multiple="false"
      :data="getFileUploadData" :show-file-list="false" ref="upload" :limit=1 :headers="getTokenHeaders"
      :on-success="skuExcelImportSuccess" :before-upload="beforeUpload" :on-progress="skuExcelImporting"
      :on-error="skuExcelImportError">
      <el-button size="small" type="primary" :disabled="isSkuImporting" @click="recordSkuExcelImportBtnClick">
        <i class="el-icon-upload" v-if="!isSkuImporting"></i>
        <i v-if="isSkuImporting" class="el-icon-loading"></i>
        &nbsp;&nbsp;点击上传
      </el-button>
      &nbsp;&nbsp;<a class="click" style="font-size:13px" @click="downloadExcel">{{getFileName}}</a>
    </el-upload>

    <el-dialog title="sku编码更新结果" :visible.sync="skuExcelImportDialogVisible" width="80%">
      <div style="text-align: left">
        <div style="text-align: center;font-size: 16px;">成功:
          <span style="color: #4ca916">{{skuExcelImportSuccessNums}}</span>
        </div>
        <div v-for="(error, index) in errorList" :key="index">
          {{ error }}
        </div>
      </div>
    </el-dialog>

    <el-dialog title="价格设置" :visible.sync="priceSettingVisible" width="600px" v-hh-modal center>
      <el-form :model="model" :rules="rules" ref="model" label-width="170px" class="flex justify-c column align-c" >
        <el-form-item label="售卖价(需在sku价格范围内):" prop="resource" size="small" style="width: 530px;">
          <el-radio-group v-model="model.set_discount_price_min">
            <el-radio :label="0" style="width:108px" :value="0">不修改</el-radio>
            <el-radio :label="1" style="width:108px" :value="1">调为现sku最低价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="划线价(需>=sku最高价):" prop="resource" size="small"  style="width: 530px;">
          <el-radio-group v-model="model.set_market_price">
            <el-radio :label="0" style="width:108px" :value="0">不修改</el-radio>
            <el-radio :label="1"  :value="1">
              <span>调为现sku最高价<span style="margin-left: 5px">X</span><el-input type="number" style="width:70px"  size="mini" class="ml-5 mr-5" v-model="model.sku_max_price_rate"></el-input>%</span>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="flex justify-c"><el-button type="primary" class="mt-20" style="width:120px" @click="confirmSetting" :loading="getUserSettingQueryLoading" :disabled="getUserSettingQueryLoading">保存设置</el-button></div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import utils from '@/common/utils.js'
import Api from '@/api/apis'

import {
  mapGetters,
  mapActions,
  mapState
} from 'vuex'
import common from '@/common/common.js'

export default {
  name: 'UploadFile',
  props: {
    msg: String,
    activeName: String
  },
  data () {
    return {
      isSkuImporting: false,
      errorList: [],
      skuExcelImportDialogVisible: false,
      priceSettingVisible: false,
      skuExcelImportSuccessNums: 0,
      isNew: 0,
      showDownloadFile: false,
      showProcess: false,
      dialogBatchEditVisible: false,
      dialogExportVisible: false,
      fileList: [],
      isSyncing: false,
      syncButtonText: '同步后台商品',
      model: {},
      fileTypeDemoFile: {
        0: {
          fileName: '示例文件1',
          url: 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code-title.xlsx'
        },
        1: {
          fileName: '示例文件2',
          url: 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code-id.xlsx'
        },
        2: {
          fileName: '示例文件3',
          url: 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/goods-title.xlsx'
        },
        3: {
          fileName: '示例文件4',
          url: 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/goods-id.xlsx'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      exportFields: 'getExportFields',
      getTokenHeaders: 'getTokenHeaders',
      syncStatus: 'getSyncStatus',
      isAuth: 'getIsAuth'
    }),
    ...mapState('productManagement/skuImport', ['productSkuExcelFilters', 'productSkuExcelPagination']),
    isBlackUser () {
      let userId = localStorage.getItem('user_id')
      if (userId === '5009091') {
        return true
      }
      return false
    },
    getFileUploadData () {
      return {
        file_type: this.productSkuExcelFilters.file_type
      }
    },
    getFileName () {
      if (this.productSkuExcelFilters && this.productSkuExcelFilters.file_type) {
        return this.fileTypeDemoFile[this.productSkuExcelFilters.file_type].fileName
      } else {
        return this.fileTypeDemoFile[0].fileName
      }
    },
    isByTitle () {
      return this.activeName === 'byTitle'
    },
    filterType () {
      if (!this.productSkuExcelFilters.file_type) return 1
      return this.productSkuExcelFilters.file_type
    }
  },
  mounted () {
    if (this.isAuth && window.location.pathname !== 'authorize') {
      this.asyncUserAndNotice()
    }
  },
  watch: {
    isAuth (val) {
      if (val) {
        this.asyncUserAndNotice()
      }
    },
    syncStatus (val, oldVal) {
      this.isSyncing = (val.status !== 'complete' && val.status !== 'error')
      this.refreshSyncButtonText()
    }
  },
  methods: {
    ...mapActions([
      'requestUserInfo',
      'requestNotification',
      'requestSyncProducts'
    ]),
    async asyncUserAndNotice () { // 同步获取userInfo及notification
      try {
        await this.requestUserInfo()
        this.requestNotification()
      } catch (error) {
        console.error(error)
      }
    },
    ...mapActions('productManagement/skuImport', ['fetchRecord', 'deleteProductSkuExcelPage']),
      // 同步商品
    handleSyncProducts () {
      if (!this.isAuth || this.isSyncing) return false
      this.isSyncing = true
      this.syncButtonText = '正在准备同步...'
      this.requestSyncProducts({
        sync_type: common.SyncType['all'],
        operation_type: 1
      })
    },
    refreshSyncButtonText () {
      let val = this.syncStatus
      if (val.status === 'ready') {
        this.syncButtonText = '正在准备同步...'
      } else if (val.status === 'running') {
        this.syncButtonText = '同步中...(' + val.cur + '/' + val.total + ')'
      } else {
        this.syncButtonText = '同步后台商品'
      }
    },
    beforeUpload (file) {
        // let type = file.type
        // let size = file.size / 1024 / 1024
        // if (type !== 'xlsx') {
        //   this.$message.error('只能上传xlsx文件')
        //   return false
        // }
        // if (size > 3) {
        //   this.$message.error('表格不超过3M')
        //   return false
        // }
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
      console.log(response.data['error_list'])
      if (utils.isEmptyObj(this.errorList)) {
          // 如果导入成功，则提示成功
        this.$message.success('正在导入中...')
      } else {
          // 如果有失败的，则返回具体失败的原因
        this.skuExcelImportSuccessNums = response.data['success_nums']
        this.skuExcelImportDialogVisible = true
      }
        //  刷新列表
      this.fetchRecord({
        filters: this.productSkuExcelFilters,
        pagination: this.productSkuExcelPagination
      })
    },
      /**
       * sku编码导入中的回调
       * @param event
       * @param file
       * @param fileList
       */
    skuExcelImporting (event, file, fileList) {
      console.log(event, file, fileList)
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
       * 统计商品SKU导入按钮的点击次数
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
      this.$message.success('下载示例文件成功，请到浏览器下载内容查看')
      window.location.href = this.fileTypeDemoFile[this.productSkuExcelFilters.file_type].url
    },
    togglePriceSettingVisible () {
      this.priceSettingVisible = !this.priceSettingVisible
    },
    async settingPrice () {
      this.getUserSettingQueryLoading = true
      const settting = await Api.hhgjAPIs.userSettingQuery()
      this.model = settting
      this.getUserSettingQueryLoading = false
      this.togglePriceSettingVisible()
    },
    async confirmSetting () {
      try {
        this.getUserSettingQueryLoading = true
        await Api.hhgjAPIs.userSettingUpdate({ext_json: JSON.stringify(this.model)})
        this.getUserSettingQueryLoading = false
        this.togglePriceSettingVisible()
        this.$message.success('修改价格设置成功')
      } catch (err) {
        this.getUserSettingQueryLoading = false
        this.$message.error(`${err}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .uploadFile {
    background: #FFF6ED;
    border-radius: 3px;
    border: 1px solid rgba(250, 100, 0, 0.2);
    padding-top: 12px;
    padding-left: 17px;
    /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
      margin-bottom: 0;
    }
    /deep/ .el-form-item--small .el-form-item__label{
      text-align: left;
    }
    /deep/ .el-input__inner {
      padding-right:0;
    }
  }
</style>
