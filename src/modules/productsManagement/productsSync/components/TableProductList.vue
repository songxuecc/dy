<!--  -->
<template>
  <div>
    <Search />
    <div class="right pr-10 click mb-10">一键全选所有商品
      <el-tooltip class="item" effect="dark" content="所有商品指所有页面商品总和" placement="top-end">
        <hh-icon type="iconxiangqing" class="pl-5"></hh-icon>
      </el-tooltip>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120"> </el-table-column>
      <el-table-column prop="address" label="地址" show-overflow-tooltip>
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pagination.page_index" class=" pt-20 right mr-20" :page-size="pagination.page_size"  :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="pb-20">
      <el-button type="primary" plain style="width:120px" @click="handleCancel">取消选择</el-button>
      <el-button type="primary" style="width:120px" @click="handleConfirm">确认选择</el-button>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import {
  mapState
} from 'vuex'
export default {
  name: 'component_name',
  props: {},
  components: {
    Search
  },
  data () {
    return {
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState('productManagement/productsSync/tableSyncRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ])
  },
  methods: {
    handleCancel () {
      this.$emit('goback')
    },
    handleConfirm () {
      this.$emit('goback')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
