<!-- VersionUp试用版本升级 -->
<template>
    <div class="VersionUp" v-loading="loadingUserVersionQuery">
        <div class="upVip">
            <p class="color-333 font-12 bold mb-10">
                试用版升级高级版，仅需0.3元/日
                <el-popover
                    placement="right"
                    width="320"
                    trigger="hover">
                    <div class="left " >
                        <p class="font-12">1、试用版每日搬家数为20，高级版每日搬家数不受限制</p>
                        <p class="font-12">2、试用版升级高级版费用为0.3元/日，升级后使用时长不变</p>
                    </div>
                    <a class="primary " slot="reference">版本区别</a>
                </el-popover>
            </p>
            <p class="color-333 font-12 bold mb-10">当前试用版还剩60天，升级费用共计60*0.3=18元</p>
            <p class="mb-20 color-333 font-12 bold">价格：<span class="price font-24 bold">10</span><span class="price">元</span></p>
            <el-button type="primary" class="mb-20" style="width:120px" @click="onVipUp" :loading="loading" :diabled="loading">立即升级</el-button>
        </div>
        <div class="isVip flex column align-c jutify-c">
            <img src="@/assets/images/vip-tip.png" alt="" class="mb-20 ">
            <p>您目前已是VIP高级版，剩60天，无需升级～</p>
        </div>
        <ModalWxPay ref="ModalWxPay" :qrCode="qrCode" />
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import Api from '@/api/apis'
import ModalWxPay from '@customerSetting/paidRecharge/ModalWxPay.vue'

export default {
  name: 'VersionUp',
  props: {
    msg: String
  },
  data () {
    return {
      loading: false
    }
  },
  created () {
    this.userVersionQuery()
  },
  components: {ModalWxPay},
  computed: {
    ...mapState({
      loadingUserVersionQuery: state => state['@@loading'].effects['customerSetting/paidRecharge/userVersionQuery']
    })
  },
  watch: {
    loadingUserVersionQuery (n) {
      console.log(n, 'loadingUserVersionQuery')
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
</style>
