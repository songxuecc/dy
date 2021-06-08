<!-- 我的页面 -->
<template>
    <div class='left'>
        <el-radio-group v-model="tabType" style="margin-bottom: 30px;">
            <el-radio-button label="PayRecord">拼多多额度充值</el-radio-button>
            <el-radio-button label="VersionUp">试用版本升级</el-radio-button>
        </el-radio-group>
        <PayRecord v-if="tabType === 'PayRecord'"/>
        <VersionUp v-if="tabType === 'VersionUp'" />
        <el-dialog title="额度计算规则" class="product-dialog" :visible.sync="vislble" @close="dialogEditClose" v-hh-modal  width="400px" >
            <div>
                <p>1、订购免费版赠送10条额度，订购1个月版赠送100条额度，订购3个月版赠送300条额度，订购了6个月版赠送600条额度，订购12个月版赠送1200条额度；</p>
                <p>2、试用版升级高级版升级费用在10~15元，赠送100条；升级费用在15元~22.5元，赠送150条；</p>
                <p>3、可通过付费充值增加额度，收费标准：100条=10元、300条=25元、500条=35元、1000条=60元；</p>
                <p>4、赠送额度、充值额度均可累计且在任何场景下不会被清空；抓取成功耗费一条额度，抓取失败不耗费额度。</p>
            </div>
            <p class="flex justify-c"><el-button type="primary" style="width:120px">我知道了</el-button></p>
        </el-dialog>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import PayRecord from '@customerSetting/paidRecharge/PayRecord.vue'
import VersionUp from '@customerSetting/paidRecharge/VersionUp.vue'

const {
  mapActions
} = createNamespacedHelpers('customerSetting/paidRecharge')
export default {
  data () {
    return {
      tabType: 'PayRecord',
      vislble: false,
      available_pdd_capture_nums: 0,
      total_pdd_capture_nums: 0
    }
  },
  components: {
    PayRecord,
    VersionUp
  },
  created () {
    if (this.$route.params.active) {
      this.tabType = this.$route.params.active
    }
  },
  activated () {
    this.getUserAccountQuery()
    if (this.$route.params.active) {
      this.tabType = this.$route.params.active
    }
  },
  watch: {
    tabType (tabType) {
      this.$router.replace({ path: tabType })
    }
  },
  methods: {
    ...mapActions(['getUserAccountQuery']),
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.tabType = to.params.active
    next()
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
/deep/ .el-radio-button__inner {
        min-width: 100px !important;
    }
</style>
