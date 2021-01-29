<!-- sku导入列表 -->
<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%;" header-row-class-name="label" >
      <el-table-empty slot="empty"/>
      <el-table-column prop="create_time" label="修改时间" width="180">
      </el-table-column>
      <el-table-column prop="total_nums" label="sku数" width="180">
      </el-table-column>
      <el-table-column prop="success_nums" label="成功数">
      </el-table-column>
      <el-table-column prop="fail_nums" label="失败数" class-name="fail" label-class-name="label">
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120">
        <template slot-scope="scope">
          <div v-if="scope.row.status === 'running'" class="flex column warning ">
            导入中
            <el-progress :percentage="50" :show-text="false" style="width:80px" :stroke-width="10"></el-progress>
          </div>
          <div v-else-if="scope.row.status === 'stop'">终止</div>
          <div v-else>修改完成</div>
        </template>
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="220">
        <template slot-scope="scope">
          <a class="pramiry" @click="handleEdit('onShutdown',scope.row.id)">终止</a>
          <a class="pramiry" @click="handleEdit('onDetail',scope.row.id)">查看详情</a>
          <a class="pramiry" @click="handleEdit('onDelete',scope.row.id)">删除记录</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4"
      class=" pt-20 right mr-20" :page-sizes="[100, 200, 300, 400]" :page-size="100"
      layout="total, sizes, prev, pager, next, jumper" :total="400">
    </el-pagination>
  </div>
  </template>
<script>
export default {
  name: 'TableUploadFileRecord',
  props: {
    msg: String
  },
  data () {
    return {
      tableData: [ {
        'id': 1,
        'is_delete': 0,
        'success_nums': 0,
        'status': 'running',
        'total_nums': 0,
        'fail_nums': 0,
        'create_time': '2021-01-27 12:15:35'
      },
      {
        'id': 2,
        'is_delete': 0,
        'success_nums': 0,
        'status': 'stop',
        'total_nums': 0,
        'fail_nums': 0,
        'create_time': '2021-01-27 12:15:35'
      },
      {
        'id': 3,
        'is_delete': 0,
        'success_nums': 0,
        'status': 'complete',
        'total_nums': 0,
        'fail_nums': 0,
        'create_time': '2021-01-27 12:15:35'
      }]
    }
  },
  methods: {
    handleEdit (type, id) {
      this.$emit(type, id)
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
