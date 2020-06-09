<template lang="html">
    <div>
        <div class="text-left">
            订购列表
        </div>
        <div>
            <el-table :data="mySubscOrder" border style="width: 100%" highlight-current-row>
                <el-table-column label="订单号" width="220" prop="order_sn"> </el-table-column>
                <el-table-column label="订购时间" width="200" prop="pay_time"></el-table-column>
                <el-table-column label="费用" width="100" prop="real_fee"></el-table-column>
                <el-table-column label="内容" prop="subsc_detail"></el-table-column>
                <el-table-column label="订单状态" width="180">
                    <template slot-scope="scope">
                        <div>
                            {{ orderStatusMap[scope.row.status] }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <br>
        </div>
    </div>
</template>
<script>

import request from '@/mixins/request.js'
import { mapActions } from 'vuex'
import common from '@/common/common.js'

export default {
  mixins: [request],
  data () {
    return {
      mySubscOrder: []
    }
  },
  computed: {
    orderStatusMap () {
      return common.orderStatusMap
    }
  },
  mounted () {
  },
  activated () {
    this.getMySubscOrder()
  },
  methods: {
    ...mapActions([
    ]),
    getMySubscOrder () {
      this.request('getMySubscOrder', {}, data => {
        this.mySubscOrder = data
      })
    },
    payOrder (subscOrderId) {
      this.request('payOrder', {'subsc_order_id': subscOrderId}, data => {
        let url = data.url
        if (url === '/') {
          window.location.href = url
        } else {
          window.open(url)
        }
      })
    },
    closeOrder (subscOrderId) {
      this.request('closeOrder', {'subsc_order_id': subscOrderId}, data => {
        this.getMySubscOrder()
      })
    }
  }
}
</script>
<style lang="less">
    @import "~@/assets/css/base.less";
</style>
