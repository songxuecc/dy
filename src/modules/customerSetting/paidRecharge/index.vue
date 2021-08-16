<!-- 我的页面 -->
<template>
    <div class='left'  v-loading="loadingVersion">
        <div style="margin-bottom: 20px;margin-top: 20px;font-size:18px;font-weight:bold">
          <h label="PayRecord" v-if="userVersion && (userVersion.is_senior || userVersion.is_free_upgrate)" >拼多多额度充值</h>
          <h label="VersionUp" v-else >试用版本升级</h>
        </div>
        <PayRecord v-if="userVersion && (userVersion.is_senior || userVersion.is_free_upgrate)"/>
        <VersionUp v-else/>
    </div>
</template>

<script>
import { createNamespacedHelpers, mapState } from 'vuex'
import PayRecord from '@customerSetting/paidRecharge/PayRecord.vue'
import VersionUp from '@customerSetting/paidRecharge/VersionUp.vue'

const {
  mapActions
} = createNamespacedHelpers('customerSetting/paidRecharge')
export default {
  data () {
    return {
      tabType: 'PayRecord',
      available_pdd_capture_nums: 0,
      total_pdd_capture_nums: 0
    }
  },
  components: {
    PayRecord,
    VersionUp
  },
  computed: {
    ...mapState('customerSetting/paidRecharge', ['userVersion']),
    ...mapState({
      loadingVersion: state => state['@@loading'].effects['customerSetting/paidRecharge/userVersionQuery']
    })
  },
  created () {
    this.userVersionQuery()
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

    ...mapActions(['getUserAccountQuery', 'userVersionQuery']),
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
