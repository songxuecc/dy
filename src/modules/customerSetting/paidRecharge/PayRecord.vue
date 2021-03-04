<!-- PayRecord -->
<template>
    <div v-loading="loading">
        <div class="mb-10 color-333 font-12">抓取拼多多剩余额度数：{{availablePddCaptureNums}}条 <el-link class="font-12" :underline="false" type="primary" @click="toggleVisible">额度计算规则</el-link></div>
        <div class="mb-10 color-333 font-12">拼多多抓取充值：<span v-for="(tag,idx) in versionList" :key="idx" :class="['tag',idx === active?'active' :'']" @click="handleChange(idx)">{{tag.nums}}条</span></div>
        <div class="mb-20 color-333 font-12">价格：<span class="price font-24" v-if="versionList && versionList.length">{{versionList[active].amount / 100}}</span><span class="price">元</span></div>
        <el-button type="primary" style="width:120px" @click="onCharge" :loading="loading" :diabled="loading">立即充值</el-button>
        <ModalEvalRules :visible.sync="visible" @toggleVisible="toggleVisible"/>
        <el-dialog title="微信扫码支付" :visible.sync="visiblePayChat"  v-hh-modal width="500px" center @closed="closed">
          <div class="flex align-c column">
            <el-alert title="微信扫一扫支付" :type="orderStatus ? 'info':'success'" show-icon :closable="false" :center="true" ></el-alert>
            <img :src="'data:image/png;base64,'+ qrCode" class="qrcode" v-if="orderStatus"/>
            <div class="mt-20"  v-if="!orderStatus"><hh-icon type="iconzhifuchenggong" style="font-size:106px"></hh-icon></div>
            <div  class="mb-5 mt-20 color-success bold  font-18"  v-if="!orderStatus">支付成功</div>
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
      orderStatus: false,
      seconds: 5
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
          this.orderStatus = true
          this.visiblePayChat = true
          this.startGetOrderStatus()
          const delay = await this.delay(this.seconds)
          if (delay) {
            this.visiblePayChat = false
          }
        }
      } catch (err) {
        this.loading = false
        this.$message.error(`${err}`)
      }
    },
    closed () {
      this.seconds = 5
      this.orderStatus = false
    },
    delay (seconds) {
      return new Promise(resolve => {
        if (this.seconds === 5) {
          this.resolve = resolve
        }
        if (this.seconds > 0 && this.orderStatus) {
          setTimeout(() => {
            this.seconds--
            this.delay(this.seconds)
          }, 1000)
        } else {
          this.resolve(true)
        }
      })
    },
    async startGetOrderStatus () {
      try {
        if (this.orderStatus) {
          console.log('startGetOrderStatus')
          const status = await Api.hhgjAPIs.userAccountFlowQuery({
            order_id: this.orderData.order_id
          })
          if (status.order_status !== 'pay') {
            setTimeout(() => {
              this.startGetOrderStatus()
            }, 200)
          } else {
            // 支付成功
            this.orderStatus = false
          }
        }
      } catch (err) {
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
        color:@border-color-light;
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
      font-family: FZLTTHK--GBK1-0, FZLTTHK--GBK1;
    }

    .qrcode {
      width: 370px;
      height: 370px;
    }

</style>
