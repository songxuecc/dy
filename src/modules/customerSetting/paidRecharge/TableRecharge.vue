<!-- Recharge -->
<template>
<div class="Recharge">
  <el-table :data="tableData" style="width: 100%">
    <el-table-empty slot="empty" />
    <el-table-column prop="order_id" label="订单号" align="center">
    </el-table-column>
    <el-table-column prop="remark" label="记录" align="center">
    </el-table-column>
    <el-table-column prop="amount" label="金额" align="center">
    </el-table-column>
    <el-table-column prop="pay_time" label="时间" align="center">
    </el-table-column>
  </el-table>
  <el-pagination v-if="tableData.length " @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="pagination.index" :page-size="pagination.size" :page-sizes="[10, 20, 50, 100]"
    layout="sizes, prev, pager, next, jumper" :total="pagination.total">
  </el-pagination>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('customerSetting/paidRecharge')

export default {
  components: { },
  name: 'recharge',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  created () {
    this.userAccountFlowList({
      pagination: this.pagination
    })
  },
  activated () {
    this.userAccountFlowList({
      pagination: this.pagination
    })
  },
  computed: {
    ...mapState(['tableData', 'pagination'])
  },
  methods: {
    ...mapActions(['userAccountFlowList']),
    handleCurrentChange (index) {
      this.userAccountFlowList({
        pagination: {
          ...this.pagination, index
        }
      })
    },
    handleSizeChange (size) {
      this.userAccountFlowList({
        pagination: {
          ...this.pagination, size
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.Recharge {
    width: 100%;
}
</style>
