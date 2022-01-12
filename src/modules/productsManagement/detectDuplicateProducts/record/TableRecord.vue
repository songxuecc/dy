<!--  -->
<template>
   <div>
      <el-table
        :data="tableData"
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
            <el-link :underline="false" class="font-12 flex column justify-c align-c no-decoration" type="primary" v-if="scope.row.status === 1">
              <span>进行中 <span v-if="scope.row.percent !== 100"> - {{scope.row.percent || 0}}%</span></span>
              <el-progress :percentage="scope.row.percent" :show-text="false" style="width:80px" :stroke-width="10"></el-progress>
            </el-link>
            <el-link :underline="false" class="font-12 no-decoration" type="warning" v-if="scope.row.status === 2">已完成</el-link>
            <el-link :underline="false" class="font-12 no-decoration" type="success" v-if="scope.row.status === 3">成功</el-link>
            <el-link :underline="false" class="font-12 no-decoration" type="danger" v-if="scope.row.status === 4">失败</el-link>
            <el-link :underline="false" class="font-12 no-decoration" type="info" v-if="scope.row.status === 0">未开始</el-link>
          </template>
        </el-table-column>
        <el-table-column
          width="250"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-link :underline="false" class="font-12 mr-5" type="primary" @click="handleDetail(scope.$index, scope.row)">查看详情</el-link>
            <el-link :underline="false" class="font-12 mr-5" type="primary" @click="handleDelete(scope.$index, scope.row)">删除并中止</el-link>
            <el-link :underline="false" :class="['font-12  mr-20']" type="primary" @click="handleDownload(scope.$index, scope.row)" :disabled="!scope.row.fail_nums">下载失败详情</el-link>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.page_index"
        class=" pt-20 right mr-20 pagination"
        :page-size="pagination.page_size"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <TableRecordDetail ref="TableRecordDetail" v-if="visibleTableRecordDetail"/>
   </div>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import TableRecordDetail from './TableRecordDetail'
import Api from '@/api/apis.js'

export default {
  name: 'TableRecord',
  props: {
  },
  components: {
    TableRecordDetail
  },
  data () {
    return {
      visibleTableRecordDetail: false
    }
  },
  computed: {
    ...mapState('productManagement/detectDuplicateProducts/tableRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/detectDuplicateProducts/tableRecord/fetch']
    })
  },
  methods: {
    ...mapActions('productManagement/detectDuplicateProducts/tableRecord', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    handleDetail (index, row) {
      this.visibleTableRecordDetail = false
      this.visibleTableRecordDetail = true
      this.$nextTick(() => {
        this.$refs.TableRecordDetail && this.$refs.TableRecordDetail.open(row)
      })
    },
    handleDelete (value, row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
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
          this.fetch()
        } catch (e) {
          this.$message({
            message: e,
            type: 'error'
          })
        }
      }).catch(() => {

      })
    },
    handleDownload (index, row) {
      if (!row.fail_nums) return false
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '开始复制',
          '下载',
          '批量修改记录下载'
        ])
      }
      const href = location.origin + '/api/hh_task/product/excel/query?task_id=' + row.task_id + '&token=' + localStorage.getItem('token')
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
