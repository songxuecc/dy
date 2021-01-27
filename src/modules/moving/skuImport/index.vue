<!-- sku 导入 -->
<template>
  <div class=''>
    <p class="font-12 l-h-16 left bold">导入sku商品</p>
    <el-divider class="mb-20 mt-10"></el-divider>
    <UploadFile />
    <TableUploadFileRecord
    @onShutdown="onShutdown"
    @onDetail="onDetail"
    @onDelete="onDelete"/>

    <el-dialog title="选中商品" :visible.sync="visibleSkuEdit" v-hh-modal width="780px" center @close="toggleEdit" >
      <DetailSkuEdit />
    </el-dialog>

    <el-dialog title="提示" :visible="visibleDelete || visibleShutDown" v-hh-modal width="30%" center @close="closeDelete">
      <p style="text-align:center;" v-if="visibleDelete">
        确定要终止当前操作吗？
      </p>
      <p style="text-align:center;" v-if="visibleShutDown">
        确定要删除当前记录吗？
      </p>
      <span slot="footer">
        <el-button  style="width:120px" @click="closeDelete">
          点错了</el-button>
        <el-button type="primary" style="width:120px" @click="confirmDelete" :loading="loading" :disabled="loading">
          {{loading?'处理中':'确定'}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import UploadFile from './UploadFile'
import TableUploadFileRecord from './TableUploadFileRecord'
import DetailSkuEdit from './DetailSkuEdit'
export default {
  data () {
    return {
      visibleSkuEdit: true,
      visibleDelete: false,
      visibleShutDown: false,
      loading: false
    }
  },
  components: {
    UploadFile,
    TableUploadFileRecord,
    DetailSkuEdit
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
  methods: {
    toggleEdit () {
      this.visibleSkuEdit = false
    },
    confirmDelete () {
      this.closeDelete()
    },
    closeDelete () {
      this.visibleDelete = false
      this.visibleShutDown = false
    },
    onShutdown (id) {
      this.visibleShutDown = true
    },
    onDetail () {
      this.visibleSkuEdit = true
    },
    onDelete () {
      this.visibleDelete = true
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
