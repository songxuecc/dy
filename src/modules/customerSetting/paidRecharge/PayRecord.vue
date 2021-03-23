<!-- PayRecord -->
<template>
    <div v-loading="loading">
        <div class="mb-10 color-333 font-12 bold flex align-c">抓取拼多多剩余额度数：{{availablePddCaptureNums}}条 <el-link class="font-12 bold ml-5" :underline="false" type="primary" @click="toggleVisible">额度计算规则</el-link></div>
        <div class="mb-10 color-333 font-12 bold">拼多多抓取充值：<span v-for="(tag,idx) in versionList" :key="idx" :class="['tag','pointer',idx === active?'active' :'']" @click="handleChange(idx)">{{tag.nums}}条</span></div>
        <div class="mb-20 color-333 font-12 bold">价格：<span class="price font-24 bold" v-if="versionList && versionList.length">{{versionList[active].amount / 100}}</span><span class="price">元</span></div>
        <el-button type="primary" class="mb-20" style="width:120px" @click="onCharge" :loading="loading" :diabled="loading">立即充值</el-button>
        <TableRecharge />
        <ModalEvalRules :visible.sync="visible" @toggleVisible="toggleVisible"/>
        <ModalWxPay ref="ModalWxPay" :qrCode="qrCode" />
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
import ModalEvalRules from '@customerSetting/paidRecharge/ModalEvalRules'
import TableRecharge from '@customerSetting/paidRecharge/TableRecharge.vue'
import ModalWxPay from '@customerSetting/paidRecharge/ModalWxPay.vue'

const {
  mapState
} = createNamespacedHelpers('customerSetting/paidRecharge')

export default {
  name: 'payRecord',
  props: {
  },
  components: {ModalEvalRules, TableRecharge, ModalWxPay},
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
          this.$refs.ModalWxPay.visible = true
        }
      } catch (err) {
        this.loading = false
        this.$refs.ModalWxPay.visible = false
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
