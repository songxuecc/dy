<!-- PayRecord -->
<template>
    <div v-loading="loading">

        <el-alert type="warning" style="height:30px"  :closable="false" class="mb-20">
          <span slot="title" class="color-333 font-12" ><span class="fail">* </span>充值后的额度可用于非抖音平台的商品复制（抖音平台支持无限量复制，无需充值）</span>
        </el-alert>

        <div class="mb-10 color-333 font-12 bold flex align-c">
          非抖音平台复制 剩余额度数：{{availablePddCaptureNums}}条
          <el-link class="font-12 bold ml-5" :underline="false" type="primary" @click="toggleVisible">额度计算规则</el-link>
          <el-link class="font-12 bold ml-5" :underline="false" type="primary" @click="toggleVisibleConsumptionRecord">额度消耗记录</el-link>
        </div>
        <div class="mb-10 color-333 font-12 bold">
          请选择充值条数：
          <span v-for="(tag,idx) in versionList" :key="idx" :class="['tag','pointer',idx === active && !custome?'active' :'']" @click="handleChange(idx)">{{tag.nums}}条</span>
          <span>自定义 <el-input style="width:100px" size="mini" v-model="nums" class="input" :class="['tag','pointer',custome && 'active']" @focus="custome = true" > </el-input> 条 <el-link class="font-12 bold ml-5" :underline="false" type="primary" @click="toggleVisibleBillingrules">计费规则</el-link></span>
        </div>
        <div class="mb-20 color-333 font-12 bold">价格：
          <span class="price font-24 bold" v-if="versionList && versionList.length && !custome">{{versionList[active].amount / 100 || 0}}</span>
          <span class="price font-24 bold" v-if="versionList && versionList.length && custome">{{customAmount}}</span><span class="price">元</span>
        <span class="tutorials">支持开发票</span>
        </div>
        <el-button type="primary" class="mb-20" @click="onCharge" :loading="loading" :diabled="loading" style="width:120px" >立即充值</el-button>
        <TableRecharge />
        <ModalEvalRules :visible.sync="visible" @toggleVisible="toggleVisible"/>
        <ModalWxPay ref="ModalWxPay" :qrCode="qrCode" :orderData="orderData"/>
        <ConsumptionRecord ref="ConsumptionRecord" />
        <Billingrules ref="Billingrules" />

    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
import ModalEvalRules from '@customerSetting/paidRecharge/components/ModalEvalRules'
import TableRecharge from '@customerSetting/paidRecharge/components/TableRecharge.vue'
import ModalWxPay from '@customerSetting/paidRecharge/components/ModalWxPay.vue'
import ConsumptionRecord from '@customerSetting/paidRecharge/components/ConsumptionRecord.vue'
import Billingrules from '@customerSetting/paidRecharge/components/Billingrules.vue'

import utils from '@/common/utils'
import { accMul } from '@/common/evalFloat.js'

const {
  mapState
} = createNamespacedHelpers('customerSetting/paidRecharge')

export default {
  name: 'payRecord',
  props: {
  },
  components: {ModalEvalRules, TableRecharge, ModalWxPay, ConsumptionRecord, Billingrules},
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
      seconds: 0,
      nums: '',
      custome: false,
      visibleConsumptionRecord: false
    }
  },
  computed: {
    ...mapState(['versionList', 'availablePddCaptureNums']),
    customAmount () {
      if (utils.isNumber(this.nums)) {
        let unit = 0
        if (this.nums > 0 && this.nums <= 100) {
          unit = 0.025
        } else if (this.nums > 100 && this.nums <= 500) {
          unit = 0.020
        } else if (this.nums > 500 && this.nums <= 1000) {
          unit = 0.018
        } else if (this.nums > 1000) {
          unit = 0.016
        }
        return accMul(this.nums, unit)
      } else {
        return 0
      }
    }
  },
  methods: {
    handleChange (active) {
      this.active = active
      this.custome = false
    },
    toggleVisible () {
      this.visible = !this.visible
    },
    toggleVisibleConsumptionRecord () {
      this.$refs.ConsumptionRecord.open()
    },
    toggleVisibleBillingrules () {
      this.$refs.Billingrules.open()
    },
    async onCharge () {
      this.loading = true
      try {
        const versionType = this.versionList[this.active].version_type
        const parmas = {
          op_type: 'pdd_capture',
          version_type: versionType,
          ext_json: {}
        }
        if (this.custome) {
          parmas.ext_json.nums = this.nums
        }
        const data = await Api.hhgjAPIs.userAccountFlowCreate(parmas)
        this.orderData = data
        const qrCode = await Api.hhgjAPIs.thirdpartPayCreate({
          pay_type: 'wechat',
          order_id: data.order_id,
          pay_title: '虎虎商品管家',
          pay_desc: '额度充值'
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

    .tutorials{
      background-image: linear-gradient(164deg, #FF9527 0%, #EB2202 100%);
      border-radius: 8px 0 8px 0;
      font-size: 10px;
      color: #FFFFFF;
      display: inline-block;
      line-height: 18px;
      text-align: center;
      height: 18px;
      padding: 0 4px;
      margin-bottom: 3px;
      margin-left: 5px;
      font-weight: normal;
    }
    .input {
      /deep/ .el-input__inner {
        padding: 0 10px;
        border:0;
        height: 18px;
      }
    }
</style>
