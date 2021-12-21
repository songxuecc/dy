<!-- VersionUp试用版本升级 -->
<template>
    <div class="VersionUp" v-loading="loadingVersion" >
        <div class="upVip" v-if="userVersion && !userVersion.is_free_upgrate">
            <p class="color-333 font-12 bold mb-10">
                试用版升级高级版，仅需{{userVersion.unit_price / 100 || 0.3}}元/日
                <el-popover
                    placement="right"
                    width="320"
                    trigger="hover">
                    <div class="left " >
                        <p class="font-12">1、试用版每日搬家数为10，高级版每日搬家数不受限制</p>
                        <p class="font-12">2、试用版升级高级版费用为{{userVersion.unit_price / 100 || 0.3}}元/日，升级后使用时长不变</p>
                    </div>
                    <a class="primary " slot="reference">版本区别</a>
                </el-popover>
            </p>
            <p class="color-333 font-12 bold mb-10" >当前试用版还剩{{userVersion.left_days}}天，升级费用共计{{userVersion.left_days}}*{{userVersion.unit_price / 100 || 0.3}}={{userVersion.free_upgrate_amount / 100 || 0}}元</p>
            <p class="mb-20 color-333 font-12 bold">价格：
              <span class="price font-24 bold" >{{userVersion.free_upgrate_amount / 100 || 0}}</span>
              <span class="price">元</span>
              <span v-if="getToolTip" class="tooltiptext">{{ getToolTip }}</span>
              <span class="tutorials">支持开发票</span>
            </p>
            <el-button type="primary" class="mb-10" style="width:120px" @click="onVipUp" :loading="loading" :diabled="loading">立即升级版本</el-button>  <span @click="reload" class="primary pointer"><hh-icon type="iconjiazai" style="font-size:12px;" class="ml-5"/> <a >已升级，刷新一下</a></span>
        </div>
        <div class="isVip flex column align-c jutify-c" v-if="userVersion && userVersion.is_free_upgrate">
            <img src="@/assets/images/vip-tip.png" alt="" class="mb-20 ">
            <p>您目前已是VIP高级版，剩{{userVersion.left_days}}天，无需升级～</p>
        </div>
        <ModalWxPay ref="ModalWxPay" :qrCode="qrCode" :orderData="orderData"/>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Api from '@/api/apis'
import ModalWxPay from '@customerSetting/paidRecharge/components/ModalWxPay.vue'

export default {
  name: 'VersionUp',
  props: {
    msg: String
  },
  data () {
    return {
      loading: false,
      orderData: {}
    }
  },
  created () {
    this.userVersionQuery()
  },
  components: {ModalWxPay},
  computed: {
    ...mapState({
      loadingVersion: state => state['@@loading'].effects['customerSetting/paidRecharge/userVersionQuery']
    }),
    ...mapState('customerSetting/paidRecharge', ['userVersion']),
    getToolTip () {
      let freeUpgradeAmount = this.userVersion.free_upgrate_amount
      if (freeUpgradeAmount > 1000 && freeUpgradeAmount <= 1500) {
        return '赠送拼多多抓取额度100条'
      } else if (freeUpgradeAmount > 1500) {
        return '赠送拼多多抓取额度150条'
      }
      return false
    }
  },
  methods: {
    ...mapActions('customerSetting/paidRecharge', ['userVersionQuery']),
    async onVipUp () {
      this.loading = true
      try {
        const data = await Api.hhgjAPIs.userAccountFlowCreate({
          op_type: 'free_upgrate'
        })
        this.orderData = data
        const qrCode = await Api.hhgjAPIs.thirdpartPayCreate({
          pay_type: 'wechat',
          order_id: data.order_id,
          pay_title: '虎虎商品管家',
          pay_desc: '试用版本升级'
        })
        if (qrCode) {
          this.loading = false
          this.qrCode = qrCode
          this.$refs.ModalWxPay.visible = true
          this.$refs.ModalWxPay.onCharge && this.$refs.ModalWxPay.onCharge()
        }
      } catch (err) {
        this.loading = false
        this.$refs.ModalWxPay.visible = false
        this.$message.error(`${err}`)
      }
    },
    reload () {
      this.$router.go(0)
    }
  }
}
</script>
<style lang="less" scoped>
.isVip{
    img{
        width: 154px;
        height: 120px;
        background: #fff;
    }
    p {
        width: 277px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #969696;
        line-height: 20px;
    }
}

.upVip {
    .price{
        color:#DC4041
    }
    .font-24 {
        font-size: 24px;
        font-weight: bolder;
        font-family: 'Noto Sans SC';
    }
}
 .tutorials{
      background-image: linear-gradient(164deg, #F7D1A4 0%, #BB8345 100%);
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
  .tooltiptext {
      position: relative;
      width: 160px;
      background-color: #303133;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px;
      margin-left: 10px;
  }
  .tooltiptext::after {
    content: "";
    border-top: solid 5px #00800000;
    border-left: solid 10px #00800000;
    border-right: solid 5px #303133;
    border-bottom: solid 5px #00800000;
    position: absolute;
    left: -15px;
    top: 6px;
  }
</style>
