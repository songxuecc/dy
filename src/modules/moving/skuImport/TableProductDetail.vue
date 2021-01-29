<!--  -->
<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%;" header-row-class-name="label">
      <el-table-empty slot="empty"/>
      <el-table-column prop="create_time" label="图片" width="80">
        <template slot-scope="scope">
          <img src="" alt="图片" class="product-img">
        </template>
      </el-table-column>
      <el-table-column prop="total_nums" label="商品信息" width="200">
      </el-table-column>
      <el-table-column prop="success_nums" label="SKU名称">
      </el-table-column>
      <el-table-column prop="fail_nums" label="SKU编码" class-name="fail" label-class-name="label">
      </el-table-column>
      <el-table-column prop="fail_nums" label="理由">
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="100">
        <template slot-scope="scope">
          <a class="pramiry" @click="handleEdit('onDetail',scope.row.id)">查看</a>
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
  name: 'TableProductDetail',
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
  }
}
</script>
<style lang="less" scoped>
</style>
