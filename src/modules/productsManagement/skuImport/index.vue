<!-- sku 导入 -->
<template>
<div class=''>
  <p class="font-12 l-h-16 left bold">导入sku商品</p>
  <el-divider class="mb-20 mt-10"></el-divider>
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
<!--  <el-dialog title="sku编码修改详情" :visible.sync="visibleSkuEdit"  v-hh-modal width="780px" center-->
<!--    @close="toggleEdit">-->
<!--    <DetailSkuEdit v-if="visibleSkuEdit"/>-->
<!--  </el-dialog>-->
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
