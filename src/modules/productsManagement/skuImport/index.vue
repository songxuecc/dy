<!-- sku 导入 -->
<template>
<div class=''>
  <!-- <el-tabs v-model="activeName" @tab-click="handleClick" type="card">
    <el-tab-pane label="按商品名、规格名匹配" name="byTitle">
      <UploadFile :activeName="activeName"/>
    </el-tab-pane>
    <el-tab-pane name="byId">
      <span slot="label">按商品ID、规格ID匹配</span>
      <UploadFile :activeName="activeName"/>
    </el-tab-pane>
  </el-tabs> -->

  <Search />
  <UploadFile />
  <TableUploadFileRecord @onDetail="onDetail" ref="tableUploadFileRecord"/>
  <el-drawer
    title="sku编码修改详情"
    :visible.sync="visibleSkuEdit"
    :direction="drawerDirection"
    size="60%"
    custom-class="sku-import-drawer"
    style="padding: 10px"
    :before-close="toggleEdit">
    <DetailSkuEdit v-if="visibleSkuEdit" />
  </el-drawer>
  <div class="close pointer" v-show="visibleSkuEdit" @click="toggleEdit">
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
    ...mapState('productManagement/test', ['test1', 'test2', 'table1tableData'])
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
    change () {
      // this.fetch({
      //   apiName: 'getProductSkuExcelPage'
      // })
    },
    // change1 () {
    //   this.table1fetch({
    //     apiName: 'getProductSkuExcelPage',
    //     pagination: {
    //       page_size: 100,
    //       page_index: 1
    //     },
    //     filters: {

    //     }
    //   }).then(() => {
    //     console.log(this.table1tableData, 'table1tableData')
    //   })
    // },
    // change2 () {
    //   this.table2fetch({
    //     apiName: 'getProductSkuExcelPage'
    //   })
    // },
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
.close {
  position: fixed;
  left:30%;
  top: 0;
  bottom: 0;
  margin: auto;
  width: 36px;
  height: 36px;
  z-index: 9999;
  transition: all 0.8s;
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
