<!-- sku上传文件 -->
<template>
  <div class="left uploadFile pb-10">
    <p class="font-14 ">1、上传前确保已进行过商品同步&nbsp;&nbsp;<a :class="[isSyncing?'color-info':'color-primary','pointer font-14']"
        @click="handleSyncProducts">{{syncButtonText}}</a> <span class="color-767989">&nbsp;最近同步时间
        {{ syncStatus.last_sync_time }} </span></p>
    <p class="font-14 ">2、每次支持3000个sku修改，可修改维度有：sku编码、库存、价格&nbsp;<a class="pramiry pointer" style="font-size:14px" @click="downloadExcel">{{getFileName}}</a> </p>
    <p class="font-14 ">3、仅支持售卖中、已下架的商品修改 </p>
    <p v-if="isByTitle" class="font-14 ">4、保证导入的商品标题、规格名与抖店后台一致 </p>
    <el-upload class="upload-demo mt-10" action="/api/product/sku/excel/create" :multiple="false" :data="getFileUploadData"
      :show-file-list="false" ref="upload" :limit=1 :headers="getTokenHeaders" :on-success="skuExcelImportSuccess"
      :before-upload="beforeUpload" :on-progress="skuExcelImporting" :on-error="skuExcelImportError">
      <el-button v-if="!isBlackUser" size="medium" type="primary" :disabled="isSkuImporting" @click="recordSkuExcelImportBtnClick">
        <i class="el-icon-upload" v-if="!isSkuImporting"></i>
        <i v-if="isSkuImporting" class="el-icon-loading"></i>
        &nbsp;&nbsp;点击上传
      </el-button>
    </el-upload>
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
import utils from '@/common/utils.js'
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex'
import common from '@/common/common.js'

const {
  mapState: mapStateSkuImport,
  mapActions: mapActionsSkuImport
} = createNamespacedHelpers('productManagement/skuImport')

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
      skuExcelImportSuccessNums: 0,
      isNew: 0,
      showDownloadFile: false,
      showProcess: false,
      dialogBatchEditVisible: false,
      dialogExportVisible: false,
      fileList: [],
      isSyncing: false,
      syncButtonText: '同步后台商品'
    }
  },
  computed: {
    ...mapGetters({
      exportFields: 'getExportFields',
      getTokenHeaders: 'getTokenHeaders',
      syncStatus: 'getSyncStatus',
      isAuth: 'getIsAuth'
    }),
    ...mapStateSkuImport(['tableDataRecord', 'paginationRecord', 'filtersRecord']),
    isBlackUser () {
      let userId = localStorage.getItem('user_id')
      if (userId === '5009091') {
        return true
      }
      return false
    },
    getFileUploadData () {
      return {
        file_type: this.filtersRecord.file_type
      }
    },
    getFileName () {
      return this.activeName === 'byTitle' ? '示例文件下载1' : '示例文件下载2'
    },
    isByTitle () {
      return this.activeName === 'byTitle'
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
    ...mapActionsSkuImport(['getProductSkuExcelPage']),
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
      this.getProductSkuExcelPage({
        filtersRecord: this.filtersRecord,
        paginationRecord: this.paginationRecord
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
      this.$message.success('下载示例文件成功，请到浏览器下载内容查看')
      if (this.filtersRecord.file_type === 0) {
        window.location.href = 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code-title.xlsx'
      } else if (this.filtersRecord.file_type === 1) {
        window.location.href = 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code-id.xlsx'
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
}
</style>
