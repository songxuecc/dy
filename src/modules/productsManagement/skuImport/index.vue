<!-- sku 导入 -->
<template>
<div class=''>
  <p class="font-12 l-h-16 left bold">
    导入sku商品
    <img src="@/assets/images/tishi.gif" style="width:12px">新功能上线：现支持导入修改sku编码、sku库存、sku价格
    <a class="color-primary pointer font-12" @click="downloadExcel">新版示例文件下载</a>
  </p>
  <el-divider class="mb-10 mt-10"></el-divider>
  <UploadFile />
  <TableUploadFileRecord @onDetail="onDetail" />
  <el-drawer
    title="sku编码修改详情"
    :visible.sync="visibleSkuEdit"
    :direction="drawerDirection"
    size="1000px"
    custom-class="sku-import-drawer"
    style="padding: 10px"
    :before-close="toggleEdit">
    <DetailSkuEdit v-if="visibleSkuEdit"/>
  </el-drawer>
</div>
</template>

<script>
import {createNamespacedHelpers, mapActions} from 'vuex'
import UploadFile from './UploadFile'
import TableUploadFileRecord from './TableUploadFileRecord'
import DetailSkuEdit from './DetailSkuEdit'
const {
  mapMutations
} = createNamespacedHelpers('productManagement/skuImport')

export default {
  data () {
    return {
      visibleSkuEdit: false,
      parenId: undefined,
      loading: false,
      drawerDirection: 'rtl'
    }
  },
  components: {
    UploadFile,
    TableUploadFileRecord,
    DetailSkuEdit
  },
  updated () { },
  methods: {
    ...mapMutations(['save']),
    ...mapActions([
      'setIsShowFloatView'
    ]),
    toggleEdit () {
      this.visibleSkuEdit = false
      this.setIsShowFloatView(true)
    },
    onDetail (rowData) {
      this.visibleSkuEdit = true
      this.setIsShowFloatView(false)
      this.save({
        parentRowData: rowData
      })
    },
    /**
     * 生成sku编码模板文件
     */
    downloadExcel () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '全部商品', '下载', '下载sku编码模板'])
      }
      this.$message.success('下载示例文件成功，请到浏览器下载内容查看')
      window.location.href = 'https://dy-meizhe-woda.oss-cn-shanghai.aliyuncs.com/sku-code.xlsx'
    }
  }
}
</script>

<style lang="less">
.sku-import-drawer {
  padding-left: 20px;
  padding-right: 20px;
}
.el-drawer__header span:focus {
  outline: 0;
}
.el-drawer:focus {
    outline: none !important;
}
</style>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
