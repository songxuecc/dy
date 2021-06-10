<!--  -->
<template>
   <div>
      <el-table
        :data="hhTaskPageTableData"
        v-loading="loading"
        style="width: 100%;box-sizing:border-box;padding-right:20px">
        <el-table-empty slot="empty"/>
        <el-table-column
          prop="create_time"
          label="修改时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="task_title"
          label="修改任务"
          align="center">
        </el-table-column>
        <el-table-column
          prop="total_nums"
          label="修改商品数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="success_nums"
          label="修改成功数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="fail_nums"
          label="修改失败数"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="任务状态"
          class="primary"
          align="center">
          <template slot-scope="scope">
            <el-link :underline="false" class="font-12" type="primary" v-if="scope.row.status === 1">进行中</el-link>
            <el-link :underline="false" class="font-12" type="success" v-if="scope.row.status === 2">成功</el-link>
            <el-link :underline="false" class="font-12" type="info" v-if="scope.row.status === 3">完成</el-link>
            <el-link :underline="false" class="font-12" type="danger" v-if="scope.row.status === 4">失败</el-link>
            <el-link :underline="false" class="font-12" type="warning" v-if="scope.row.status === 0">未开始</el-link>
          </template>
        </el-table-column>
        <el-table-column
          width="230"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <a class="font-12 pointer primary mr-5" @click="handleDetail(scope.$index, scope.row)">查看详情</a>
            <a class="font-12 pointer primary mr-5" @click="handleDelete(scope.$index, scope.row)">删除记录</a>
            <a class="font-12 pointer primary mr-20" @click="handleDownload(scope.$index, scope.row)">下载失败详情</a>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="hhTaskPagePagination.page_index"
        :page-size="hhTaskPagePagination.page_size"
        :page-sizes="hhTaskPageSizes"
        @size-change="handleSizeChange"
        :total="hhTaskPageTotal">
      </el-pagination>

      <TableRecordDetail ref="TableRecordDetail"/>
   </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableRecordDetail from './TableRecordDetail'
import Api from '@/api/apis.js'

export default {
  name: '修改记录',
  components: {
    TableRecordDetail
  },
  data () {
    return {
      tableData: [
        {
          'total_nums': 1,
          'success_nums': 1,
          'task_title': '批量改价格',
          'task_id': 1,
          'status_str': '完成',
          'fail_nums': 0,
          'status': 2,
          'create_time': '2021-06-08 14:16:28'
        }
      ]
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', ['hhTaskPageTableData', 'hhTaskPagePagination', 'hhTaskPageSizes', 'hhTaskPageTotal']),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/batchEdit/fetchHhTaskPage']
    })
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchHhTaskPage']),
    handleDetail (index, row) {
      this.$refs.TableRecordDetail.open(row)
    },
    handleCurrentChange (pageIndex) {
      if (this.loading) return
      this.fetchHhTaskPage({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    handleSizeChange (pageSize) {
      this.fetchHhTaskPage({
        pagination: {
          page_index: 1,
          page_size: pageSize
        }
      })
    },
    handleDelete (value, row) {
      this.$confirm('此操作将永久删除该, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await Api.hhgjAPIs.hhTaskDelete({
            task_id: row.task_id
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchHhTaskPage({
            pagination: {
              page_index: 1
            }
          })
        } catch (e) {
          this.$message({
            message: e,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleDownload (href) {
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '开始复制',
          '下载',
          '批量修改记录下载'
        ])
      }
      let link = document.createElement('a')
      link.href = href
      link.download = '批量修改记录下载'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
