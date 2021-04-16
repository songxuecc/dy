<!-- sku 导入 -->
<template>
<div class=''>
  <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
    <el-tab-pane label="按商品名、规格名匹配" name="byTitle">
      <UploadFile :activeName="activeName"/>
    </el-tab-pane>
    <el-tab-pane name="byId">
      <span slot="label">按商品ID、规格ID匹配<NewFeatureTips type="根据id导入匹配" /></span>
      <UploadFile :activeName="activeName"/>
    </el-tab-pane>
  </el-tabs>
  <TableUploadFileRecord @onDetail="onDetail" ref="tableUploadFileRecord"/>
  <el-drawer
    title="sku编码修改详情"
    :visible.sync="visibleSkuEdit"
    :direction="drawerDirection"
    size="1000px"
    custom-class="sku-import-drawer"
    style="padding: 10px"
    :before-close="toggleEdit">
    <DetailSkuEdit v-if="visibleSkuEdit" />
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
      activeName: 'byTitle',
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
  computed: {
  },
  updated () { },
  methods: {
    ...mapMutations(['save']),
    ...mapActions([
      'setIsShowFloatView'
    ]),
    getFileType () {
      return this.activeName === 'byTitle' ? 0 : 1
    },
    handleClick (tab, event) {
      let self = this
      this.$refs.tableUploadFileRecord.filterHandlerRecord({
        file_type: self.getFileType()
      })
    },
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
