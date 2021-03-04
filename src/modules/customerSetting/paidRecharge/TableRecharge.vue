<!-- Recharge -->
<template>
<div class="Recharge">
  <el-table :data="tableData" style="width: 100%">
    <el-table-empty slot="empty" />
    <el-table-column prop="order_id" label="订单号" align="center">
    </el-table-column>
    <el-table-column prop="remark" label="记录" align="center">
    </el-table-column>
    <el-table-column prop="pay_time" label="时间" align="center">
    </el-table-column>
    <el-table-column prop="amount" label="金额" align="center">
    </el-table-column>
  </el-table>
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
    this.userAccountFlowList()
  },
  activated () {
    this.userAccountFlowList()
  },
  computed: {
    ...mapState(['tableData'])
  },
  methods: {
    ...mapActions(['userAccountFlowList'])
  }
}
</script>
<style lang="less" scoped>
.Recharge {
    width: 100%;
}
</style>
