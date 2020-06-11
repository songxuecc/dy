<template lang="html">
    <div>
        <div>
            <el-table :data="upgradeOrderList"  border show-summary sum-text="可抵扣金额" v-if="upgradeOrderList.length"
                      style="width: 100%" :row-style="{height:'68px'}" :cell-style="{padding:0}"
            >
                <el-table-column label="未过期订购" align="center">
                <el-table-column label="版本" prop='subsc_item' width="100">
                </el-table-column>
                <el-table-column label="开始时间" prop='start_time' width="180">
                </el-table-column>
                <el-table-column label="结束时间" width="180" prop='end_time'></el-table-column>
                <el-table-column label="实付金额" width="180" prop="">
                    <template slot-scope="scope">
                        {{ scope.row.real_fee }} 元
                    </template>
                </el-table-column>
                <el-table-column label="剩余时间" width="180" prop="">
                    <template slot-scope="scope">
                        {{ scope.row.left_day }} 天
                    </template>
                </el-table-column>
                <el-table-column label="剩余金额" prop="left_fee">
                    <template slot-scope="scope">
                        {{ scope.row.left_fee }} 元
                    </template>
                </el-table-column>
            </el-table-column>
            </el-table>
        </div>
        <br><br>
        <div>
            <el-table :data="orderList" border
                      style="width: 100%" :row-style="{height:'68px'}" :cell-style="{padding:0}"
            >
                <el-table-column label="即将订购" align="center">
                <el-table-column label="版本" prop='subsc_item' width="100">
                </el-table-column>
                <el-table-column label="开始时间" prop='start_time' width="180">

                </el-table-column>
                <el-table-column label="结束时间" width="180" prop='end_time'>

                </el-table-column>
                <el-table-column label="周期" width="180" prop="subsc_cycle">
                </el-table-column>
                <el-table-column label="套餐价格" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.subsc_real_fee }} 元
                    </template>
                </el-table-column>
                <el-table-column label="实付金额" >
                    <template slot-scope="scope">
                        {{ scope.row.real_fee }} 元
                    </template>
                </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <br>
        <div style="text-align:right" v-if="orderList.length && orderList[0].status === 1">
            <div>
                <el-button v-if="realFee>=0" @click="payOrder('alipay')" size="medium"  type="primary" :disabled="!canDoPay">支付宝</el-button>
                <el-button v-if="realFee>=0" @click="payOrder('wxpay')" size="medium"  type="primary" :disabled="!canDoPay">微信</el-button>
            </div>
            <br>
            <div v-if="wxqrimge" style="width:40%;float:right">
                <el-alert title="微信扫一扫支付" type="info" show-icon :closable="false" :center="true" ></el-alert>
                <img :src="'data:image/png;base64,'+wxqrimge" />
            </div>
            <el-alert v-if="realFee<0" :closable="false" :center="true" title="订单金额为负" type="info" description="请重新选择订购套餐" show-icon>
            </el-alert>
        </div>

        <br>
    </div>
</template>
<script>

import request from '@/mixins/request.js'
import { mapActions } from 'vuex'
export default {
  mixins: [request],
  data () {
    return {
      orderList: [],
      upgradeOrderList: [],
      realFee: 0,
      wxqrimge: '',
      canDoPay: true
    }
  },
  computed: {
  },
  mounted () {
  },
  activated () {
    this.canDoPay = true
    this.wxqrimge = ''
    this.getOrderDetail()
  },
  methods: {
    ...mapActions([
    ]),
    getOrderDetail () {
      this.request('getOrderInfo', {'subsc_order_id': this.$route.params.orderId}, data => {
        this.orderList = []
        this.orderList.push(data['order'])
        this.realFee = data['order']['real_fee']
        this.upgradeOrderList = data['upgrade_order_list']
      })
    },
    payOrder (payChannel) {
      this.canDoPay = false
      this.request(
        'payOrder',
        { 'subsc_order_id': this.$route.params.orderId, 'pay_channel': payChannel },
        data => {
          this.canDoPay = false
          if (payChannel === 'alipay') {
            let url = data.url
            if (url === '/') {
              window.location.href = url
            } else {
              window.open(url)
            }
          } else {
            let url = data.url
            if (url === '/' && data.qrimg === '') {
              window.location.href = url
            } else {
              this.wxqrimge = data.qrimg
            }
          }
        },
        data => {
          this.canDoPay = true
        })
    },
    checkProgress () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let self = this
      for (let i in this.captureList) {
        let capture = this.captureList[i]
        if (parseInt(capture.status) === 1 || parseInt(capture.status) === 0) {
          this.timer = setTimeout(function () {
            self.getCaptureList(false, true)
          }, 2000)
          break
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
