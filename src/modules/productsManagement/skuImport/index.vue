<!-- sku 导入 -->
<template>
<div >
  <Search />
  <UploadFile />
  <TableUploadFileRecord @onDetail="onDetail" ref="tableUploadFileRecord"/>
  <el-drawer
    :title="title"
    :visible.sync="visibleSkuEdit"
    :direction="drawerDirection"
    size="60%"
    custom-class="sku-import-drawer"
    style="padding: 10px"
    :before-close="toggleEdit">
    <DetailSkuEdit v-if="visibleSkuEdit" />
  </el-drawer>
  <div class="closeBtn pointer" v-show="visibleSkuEdit" @click="toggleEdit">
    <hh-icon type="iconguanbi1" class="iconguanbi"></hh-icon>
  </div>
</div>
</template>

<script>
import {createNamespacedHelpers, mapActions, mapState} from 'vuex'
import UploadFile from './UploadFile'
import TableUploadFileRecord from './TableUploadFileRecord'
import DetailSkuEdit from './DetailSkuEdit'
import Search from './Search'

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
    DetailSkuEdit,
    Search
  },
  computed: {
    ...mapState('productManagement/skuImport', ['productSkuExcelFilters']),
    title () {
      if (this.productSkuExcelFilters.file_type === 2 || this.productSkuExcelFilters.file_type === 3) return '商品修改详情'
      return 'sku修改详情'
    }
  },
  updated () { },
  methods: {
    ...mapMutations(['save']),
    ...mapActions([
      'setIsShowFloatView'
    ]),
    ...mapActions('productManagement/test', ['fetch', 'table1fetch', 'table2fetch']),
    getFileType () {
      return this.activeName === 'byTitle' ? 0 : 1
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
.closeBtn {
  position: fixed;
  left:30%;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 36px;
  height: 36px;
  z-index: 9999;
  border-radius: 50%;
  background:#c7c7c7;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  &:active {
    background: @color-text-placeholder;
  }
  .iconguanbi {
    font-size: 18px;
    color:#ffffff;
  }
}
</style>
