<!-- sku 导入 -->
<template>
<div >
  <h1 class="left mb-10 mt-5">选择修改信息</h1>
  <Search />
  <h1 class="left mb-10 mt-10">导入修改文件</h1>
  <UploadFile />
  <h1 class="left mb-10  mt-10 flex align-c">修改记录列表
    <span style="margin-left:5px;font-weight:normal" class="syncProducts flex align-c">
      <span v-if="getSyncButtonStatus === 'ready'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在准备同步后台商品... <i class="el-icon-loading"></i></span>
      <span v-else-if="getSyncButtonStatus === 'running'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在同步后台商品...<span class="bold">{{getSyncButtonText}}</span> <i class="el-icon-loading"></i></span>
      <span v-else><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先<span class="underline pointer" @click="handleSyncProducts">同步后台商品</span>（最近同步时间：<span class="bold">{{getSyncButtonText}}</span>），待商品更新至最新再操作</span>
    </span>
  </h1>
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
import {createNamespacedHelpers, mapActions, mapState, mapGetters} from 'vuex'
import UploadFile from './UploadFile'
import TableUploadFileRecord from './TableUploadFileRecord'
import DetailSkuEdit from './DetailSkuEdit'
import Search from './Search'
import checkSyncProducts from '@/mixins/checkSyncProducts.js'

const {
  mapMutations
} = createNamespacedHelpers('productManagement/skuImport')

export default {
  mixins: [checkSyncProducts('skuImport')],
  data () {
    return {
      activeName: 'byTitle',
      visibleSkuEdit: false,
      parenId: undefined,
      loading: false,
      drawerDirection: 'rtl',
      activeNames: ['1', '2', '3']
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
    ...mapGetters(['getSyncStatus', 'getIsAuth', 'getSyncing', 'getSyncButtonText', 'getSyncButtonStatus']),

    title () {
      if (this.productSkuExcelFilters.file_type === 2 || this.productSkuExcelFilters.file_type === 3) return '商品修改详情'
      return 'sku修改详情'
    }
  },
  updated () { },
  methods: {
    ...mapMutations(['save']),
    ...mapActions(['handleSyncProducts']),
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
.syncProducts {
    height: 30px;
    background: #EAEDFA;
    border-radius: 15px;
    line-height: 30px;
    font-size: 12px;
    color: #999999;
    padding: 0 12px;
  }
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
