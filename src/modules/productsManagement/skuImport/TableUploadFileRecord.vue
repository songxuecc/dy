<!-- sku导入列表 -->
<template>
  <div class="TableUploadFileRecord mt-20">
    <el-table :data="tableDataRecord" @filter-change="filterHandler"  :row-style="{height:'53px'}" :header-cell-style="{padding: 0}" stripe style="width: 100%;" header-row-class-name="label"   row-key="id">
      <el-table-empty slot="empty"/>
      <el-table-column prop="create_time" label="修改时间" width="180">
      </el-table-column>
      <el-table-column prop="total_nums" label="sku数" width="180">
      </el-table-column>
      <el-table-column prop="success_nums" label="成功数">
      </el-table-column>
      <el-table-column prop="fail_nums" label="失败数" class-name="fail" label-class-name="label">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120"  :filters="filters" :filter-multiple="true"  column-key="status">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'running'" class="flex column warning ">
            <span>导入中<span v-if="scope.row.percent !== 100"> - {{scope.row.percent || 0}}%</span></span>
            <el-progress :percentage="scope.row.percent" :show-text="false" style="width:80px" :stroke-width="10"></el-progress>
          </div>
          <div v-else-if="scope.row.status === 'stop'">终止</div>
          <div v-else>修改完成</div>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="220">
        <template slot-scope="scope">
          <!-- <a class="pramiry" @click="onShutdown(scope.row.id)">终止</a> -->
          <a class="pramiry pointer" @click="handleEdit('onDetail',scope.row)">查看详情</a>
          <a :class="[ scope.row.status === 'running' ? 'info no-decoration' :'pramiry pointer' ]" @click="onDelete(scope.row)" >删除记录</a>
          <a :class="[ scope.row.status === 'running' ? 'info no-decoration' :'pramiry pointer' ]" @click="onDownloadFail(scope.row)" >下载失败详情</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationRecord.page_index"
      class=" pt-20 right mr-20" :page-sizes="sizes" :page-size="paginationRecord.page_size"
      layout="total, sizes, prev, pager, next, jumper" :total="totalRecord">
    </el-pagination>

     <el-dialog title="提示" :visible="visibleDelete || visibleShutDown" v-hh-modal width="30%" center @close="closeDelete">
      <p style="text-align:center;" v-if="visibleDelete">
        确定要删除当前操作吗？
      </p>
      <p style="text-align:center;" v-if="visibleShutDown">
        确定要中止当前记录吗？
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
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('productManagement/skuImport')

export default {
  name: 'TableUploadFileRecord',
  props: {
    msg: String
  },
  data () {
    return {
      visibleDelete: false,
      visibleShutDown: false,
      filters: [
        {text: '导入中', value: 'running'},
        // {text: '中止', value: 'stop'},
        {text: '失败', value: 'fail'},
        {text: '修改完成', value: 'complete'}
      ]
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState(['tableDataRecord', 'sizes', 'totalRecord', 'paginationRecord', 'filtersRecord', 'progressIds'])
  },
  methods: {
    ...mapActions(['getProductSkuExcelPage', 'deleteProductSkuExcelPage']),
    init () {
      this.getProductSkuExcelPage()
    },
    handleEdit (type, row) {
      this.$emit(type, row)
    },
    handleSizeChange (pageSize) {
      this.getProductSkuExcelPage({
        paginationRecord: {
          page_size: pageSize
        }
      })
    },
    handleCurrentChange (pageIndex) {
      this.getProductSkuExcelPage({
        paginationRecord: {
          page_index: pageIndex
        }
      })
    },
    filterHandler (value, row, column) {
      const status = value.status
      this.getProductSkuExcelPage({
        filtersRecord: {
          status_list: JSON.stringify(status)
        }
      })
    },
    onShutdown (id) {
      this.visibleShutDown = true
    },
    onDelete (row) {
      if (['complete', 'fail'].includes(row.status)) {
        this.visibleDelete = true
        this.deleteId = row.id
      }
    },
    onDownloadFail (row) {
      if (['complete', 'fail'].includes(row.status)) {
        window.open(location.origin + '/api/product/sku/excel/query?id=' + row.id + '&token=' + localStorage.getItem('token'))
      }
    },
    async confirmDelete () {
      try {
        await Api.hhgjAPIs.deleteProductSkuExcelPage({id: this.deleteId})
      } catch (err) {
        console.log(err)
        this.$message.error(`${err}`)
      }
      this.$message.success(`删除成功`)
      this.closeDelete()
      this.init()
    },
    closeDelete () {
      this.visibleDelete = false
      this.visibleShutDown = false
    }
  }
}
</script>
<style lang="less" scoped>
.fail {
  color:#E02020
}

/deep/ .label {
  color: #333333 !important;
}

</style>
