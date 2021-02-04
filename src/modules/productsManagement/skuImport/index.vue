<!-- sku 导入 -->
<template>
<div class=''>
  <p class="font-12 l-h-16 left bold">导入sku商品</p>
  <el-divider class="mb-20 mt-10"></el-divider>
  <UploadFile />
  <TableUploadFileRecord @onDetail="onDetail" />
  <el-dialog title="sku编码修改详情" :visible.sync="visibleSkuEdit"  v-hh-modal width="780px" center
    @close="toggleEdit">
    <DetailSkuEdit v-if="visibleSkuEdit"/>
  </el-dialog>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
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
      loading: false
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
    toggleEdit () {
      this.visibleSkuEdit = false
    },
    onDetail (rowData) {
      this.visibleSkuEdit = true
      this.save({
        parentRowData: rowData
      })
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
