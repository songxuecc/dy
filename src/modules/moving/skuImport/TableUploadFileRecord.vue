<!-- sku导入列表 -->
<template>
  <div class="TableUploadFileRecord mt-20">
    <el-table :data="tableDataRecord"  :row-style="{height:'53px'}" :header-cell-style="{padding: 0}" stripe style="width: 100%;" header-row-class-name="label"   row-key="id" >
      <el-table-empty slot="empty"/>
      <el-table-column prop="create_time" label="修改时间" width="180">
      </el-table-column>
      <el-table-column prop="total_nums" label="sku数" width="180">
      </el-table-column>
      <el-table-column prop="success_nums" label="成功数">
      </el-table-column>
      <el-table-column prop="fail_nums" label="失败数" class-name="fail" label-class-name="label">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120"  :filters="filters" :filter-method="filterHandler">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'running'" class="flex column warning ">
            导入中
            <el-progress :percentage="scope.row.percent" :show-text="false" style="width:80px" :stroke-width="10"></el-progress>
          </div>
          <div v-else-if="scope.row.status === 'stop'">终止</div>
          <div v-else>修改完成</div>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="220">
        <template slot-scope="scope">
          <!-- <a class="pramiry" @click="onShutdown(scope.row.id)">终止</a> -->
          <a class="pramiry" @click="handleEdit('onDetail',scope.row)">查看详情</a>
          <a class="pramiry" @click="onDelete(scope.row.id)">删除记录</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationRecord.page_index"
      class=" pt-20 right mr-20" :page-sizes="paginationRecord.sizes" :page-size="paginationRecord.page_size"
      layout="total, sizes, prev, pager, next, jumper" :total="paginationRecord.total">
    </el-pagination>

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
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('moving/skuImport')

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
        {text: '中止', value: 'stop'},
        {text: '失败', value: 'success'},
        {text: '修改完成', value: 'fail'}
      ]
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    ...mapState(['tableDataRecord', 'paginationRecord', 'filtersRecord', 'progressIds'])
  },
  methods: {
    ...mapActions(['getProductSkuExcelPage', 'deleteProductSkuExcelPage']),
    init () {
      this.getProductSkuExcelPage({
        filtersRecord: this.filtersRecord,
        paginationRecord: this.paginationRecord
      })
    },
    handleEdit (type, id) {
      this.$emit(type, id)
    },
    handleSizeChange (pageSize) {
      this.getProductSkuExcelPage({
        paginationRecord: {
          ...this.paginationRecord,
          page_size: pageSize
        }
      })
    },
    handleCurrentChange (pageIndex) {
      this.getProductSkuExcelPage({
        paginationRecord: {
          ...this.paginationRecord,
          page_index: pageIndex
        }
      })
    },
    filterHandler (value, row, column) {
      this.getProductSkuExcelPage({
        filtersRecord: {
          ...this.filtersRecord,
          [column.property]: value
        }
      })
    },
    onShutdown (id) {
      this.visibleShutDown = true
    },
    onDelete (id) {
      this.visibleDelete = true
      this.deleteId = id
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
