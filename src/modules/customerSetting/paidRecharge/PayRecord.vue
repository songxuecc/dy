<!-- PayRecord -->
<template>
    <div v-loading="loading">
        <div class="mb-10 color-333 font-12 bold flex align-c">抓取拼多多剩余额度数：{{availablePddCaptureNums}}条 <el-link class="font-12 bold ml-5" :underline="false" type="primary" @click="toggleVisible">额度计算规则</el-link></div>
        <div class="mb-10 color-333 font-12 bold">拼多多抓取充值：<span v-for="(tag,idx) in versionList" :key="idx" :class="['tag',idx === active?'active' :'']" @click="handleChange(idx)">{{tag.nums}}条</span></div>
        <div class="mb-20 color-333 font-12 bold">价格：<span class="price font-24 bold" v-if="versionList && versionList.length">{{versionList[active].amount / 100}}</span><span class="price">元</span></div>
        <el-button type="primary" style="width:120px" @click="onCharge" :loading="loading" :diabled="loading">立即充值</el-button>
        <ModalEvalRules :visible.sync="visible" @toggleVisible="toggleVisible"/>
        <el-dialog title="微信扫码支付" :visible.sync="visiblePayChat"  v-hh-modal width="500px" center @closed="closed">
          <div class="flex align-c column">
            <el-alert title="微信扫一扫支付" type="info" show-icon :closable="false" :center="true" ></el-alert>
            <img :src="'data:image/png;base64,'+ qrCode" class="qrcode" v-if="orderStatus === 'unpay'"/>
            <!-- <div class="mt-20"  v-if="orderStatus === 'pay'"><hh-icon type="iconzhifuchenggong" style="font-size:106px"></hh-icon></div> -->
            <!-- <div  class="mb-5 mt-20 color-success bold  font-18" v-if="orderStatus === 'pay'">支付成功</div> -->
            <span class="info font-12">{{seconds}}秒后自动关闭</span>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
import ModalEvalRules from './ModalEvalRules'
const {
  mapState
} = createNamespacedHelpers('customerSetting/paidRecharge')
const PAY_TIME = 120
// const CLOSE_TIME = 3

export default {
  name: 'payRecord',
  props: {
  },
  components: {ModalEvalRules},
  data () {
    return {
      active: 0,
      visible: false,
      loading: false,
      qrCode: '',
      visiblePayChat: false,
      payType: 'alipay',
      orderData: undefined,
      orderStatus: 'unpay',
      seconds: 0
    }
  },
  computed: {
    ...mapState(['versionList', 'availablePddCaptureNums'])
  },
  methods: {
    handleChange (active) {
      this.active = active
    },
    toggleVisible () {
      this.visible = !this.visible
    },
    async onCharge () {
      this.loading = true
      try {
        const versionType = this.versionList[this.active].version_type
        const data = await Api.hhgjAPIs.userAccountFlowCreate({
          op_type: 'pdd_capture',
          version_type: versionType
        })
        this.orderData = data
        const qrCode = await Api.hhgjAPIs.thirdpartPayCreate({
          pay_type: 'wechat',
          order_id: data.order_id,
          pay_title: '测试商品',
          pay_desc: '商品描述'
        })
        if (qrCode) {
          this.loading = false
          this.qrCode = qrCode
          this.orderStatus = 'unpay'
          this.visiblePayChat = true
          this.isWaiting = true
          this.startGetOrderStatus()
          this.seconds = PAY_TIME
          const delay = await this.delay(this.seconds)
          if (delay) {
            this.isWaiting = false
          }
        }
      } catch (err) {
        this.loading = false
        this.visiblePayChat = false
        this.$message.error(`${err}`)
      }
    },
    delay (seconds) {
      return new Promise(resolve => {
        if (this.seconds === seconds) {
          this.resolve = resolve
        }
        if (this.seconds > 0) {
          this.timer = setTimeout(() => {
            this.seconds--
            clearTimeout(this.timer)
            this.timer = null
            this.delay()
          }, 1000)
        } else {
          this.resolve(true)
        }
      })
    },
    closed () {
      this.isWaiting = false
    },
    async startGetOrderStatus () {
      // 后台报错 支付失败 直接关闭
      // 时间到了 还未支付 直接关闭 1
      // 时间未到 支付成功 倒计时关闭 1
      // 时间未到 还未支付 继续轮训 1
      try {
        // 时间未到 还未支付 继续轮训
        if (this.orderStatus !== 'pay' && this.isWaiting) {
          console.log('时间未到 还未支付 继续轮训')
          const status = await Api.hhgjAPIs.userAccountFlowQuery({
            order_id: this.orderData.order_id
          })
          if (status.order_status !== 'pay') {
            setTimeout(() => {
              this.startGetOrderStatus()
            }, 1000)
          } else {
            console.log('支付成功')
            this.$message.success('支付成功')
            this.orderStatus = 'pay'
            this.visiblePayChat = false
            // this.startGetOrderStatus()
          }
          // 时间未到 支付成功 倒计时关闭
        } else if (this.orderStatus === 'pay' && this.isWaiting) {
          console.log('时间未到 支付成功 倒计时关闭')
          // this.seconds = CLOSE_TIME
          // const delay = await this.delay(this.seconds)
          // if (delay) {
          //   this.visiblePayChat = false
          // }
          // 时间到了 还未支付 直接关闭
        } else if (this.orderStatus !== 'pay' && !this.isWaiting) {
          this.visiblePayChat = false
        }
        // else if (this.orderStatus === 'pay' && !this.isWaiting)  {

        // }
      } catch (err) {
        console.log('后台报错 支付失败 直接关闭')
        this.orderStatus = 'payfail'
        this.visiblePayChat = false
        this.$message.error(`${err}`)
      }
    }
  }
}
</script>
<style lang="less" scoped>

    .tag {
        text-align: center;
        line-height: 24px;
        width: 60px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid @border-color-light;
        font-size: 12px;
        color:@color-text-regular;
        margin-right: 10px;
        display: inline-block;
        font-family: MicrosoftYaHei;
    }
    .active {
        position: relative;
        transition: all 0.5s ease;
        color:#1D8FFF;
        border: 1px solid #1D8FFF;
        &::after {
            content: '✓';
            display: block;
            height: 0px;
            width: 0px;
            position: absolute;
            bottom: 0;
            right: 0;
            color:#fff;
            font-size: 4px;
            line-height: 4px;
            text-align: left;
            border-style: solid;
            border-bottom-width:8px;
            border-right-width:10px;
            border-top-width:8px;
            border-left-width:10px;
            border-color: transparent #1D8FFF #1D8FFF transparent;;
        }
    }
    .price{
      color:#DC4041
    }
    .font-24 {
      font-size: 24px;
      font-weight: bolder;
      font-family: 'Noto Sans SC';
    }

    .qrcode {
      width: 370px;
      height: 370px;
    }

</style>
