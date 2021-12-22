<!-- ModalWxPay  微信支付弹窗-->
<template>
    <el-dialog title="微信扫码支付" :visible.sync="visible"  v-hh-modal width="500px" center @closed="closed">
        <div class="flex align-c column">
        <el-alert title="微信扫一扫支付" type="info" show-icon :closable="false" :center="true" ></el-alert>
        <img :src="'data:image/png;base64,'+ qrCode" class="qrcode" v-if="orderStatus === 'unpay'"/>
        <!-- <span class="info font-12">{{seconds}}秒后自动关闭</span> -->
        </div>
    </el-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'

const {
  mapState
} = createNamespacedHelpers('customerSetting/paidRecharge')
const PAY_TIME = 120

export default {
  name: 'ModalWxPay',
  props: {
    qrCode: String,
    orderData: Object
  },
  components: {},
  data () {
    return {
      active: 0,
      visible: false,
      payType: 'alipay',
      orderStatus: 'unpay',
      seconds: 0
    }
  },
  computed: {
    ...mapState(['versionList'])
  },
  methods: {
    toggleVisible () {
      this.visible = !this.visible
    },
    async onCharge () {
      this.orderStatus = 'unpay'
      this.visible = true
      this.isWaiting = true
      this.startGetOrderStatus()
      this.seconds = PAY_TIME
      const delay = await this.delay(this.seconds)
      if (delay) {
        this.isWaiting = false
      }
    },
    delay (seconds) {
      return new Promise(resolve => {
        if (this.seconds === seconds) {
          this.resolve = resolve
        }
        if (this.seconds > 0 && this.isWaiting) {
          this.timer = setTimeout(() => {
            this.seconds--
            clearTimeout(this.timer)
            this.timer = null
            this.delay()
          }, 1000)
        } else {
          clearTimeout(this.timer)
          this.timer = null
          this.resolve(true)
        }
      })
    },
    closed () {
      this.isWaiting = false
    },
    async startGetOrderStatus () {
      console.log(this.orderData)
      // 后台报错 支付失败 直接关闭
      // 时间到了 还未支付 直接关闭 1
      // 时间未到 支付成功 倒计时关闭 1
      // 时间未到 还未支付 继续轮训 1
      try {
        // 时间未到 还未支付 继续轮训
        if (this.orderStatus !== 'pay' && this.isWaiting) {
          // console.log('时间未到 还未支付 继续轮训')
          const status = await Api.hhgjAPIs.userAccountFlowQuery({
            order_id: this.orderData.order_id
          })
          if (status.order_status !== 'pay') {
            setTimeout(() => {
              this.startGetOrderStatus()
            }, 1000)
          } else {
            // console.log('支付成功')
            this.$message.success('支付成功')
            this.orderStatus = 'pay'
            this.visible = false
            // this.startGetOrderStatus()
          }
          // 时间未到 支付成功 倒计时关闭
        } else if (this.orderStatus === 'pay' && this.isWaiting) {
          // console.log('时间未到 支付成功 倒计时关闭')
          // this.seconds = CLOSE_TIME
          // const delay = await this.delay(this.seconds)
          // if (delay) {
          //   this.visible = false
          // }
          // 时间到了 还未支付 直接关闭
        } else if (this.orderStatus !== 'pay' && !this.isWaiting) {
          this.visible = false
        }
        // else if (this.orderStatus === 'pay' && !this.isWaiting)  {

        // }
      } catch (err) {
        // console.log('后台报错 支付失败 直接关闭')
        this.orderStatus = 'payfail'
        this.visible = false
        this.$message.error(`${err}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>

    .qrcode {
      width: 370px;
      height: 370px;
    }

</style>
