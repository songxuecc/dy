<!--  -->
<template>
    <div>
         <p class="left font-12 mt-20 " v-if="userVersion && !userVersion.is_free_upgrate && !userVersion.is_senior && userVersion.version_type === 'free_seven_days'">
            当前为试用版仅限20条复制额度，剩余<span class="fail">{{availablePddCaptureNums}} 条</span>；建议订购高级版提升额度
            <span class="color-primary ml-10 underline pointer" @click="goOrder">去订购</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" class='left'>
                <div class="mb-5">试用版：全平台仅限20条复制额度。</div>
                <div class="mb-5">高级版：抖音平台支持无限量复制；</div>
                <div class="mb-5">非抖音平台订购1月送500条额度，订购3月送1500条，以此类推（用完可充值）</div>
                </div>
                <span class="color-primary ml-10 underline pointer">版本区别</span>
            </el-tooltip>
            </p>
        <p class="left font-12 mt-20 "  v-else-if="userVersion && !userVersion.is_free_upgrate && !userVersion.is_senior && userVersion.version_type === 'free_three_months'">
            当前为试用版仅限20条复制额度，剩余<span class="fail">{{availablePddCaptureNums}} 条</span>；建议升级高级版提升额度
            <span class="color-primary ml-10 underline pointer" @click="goUpVersion">去升级</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" class='left'>
                <div class="mb-5">试用版：全平台仅限20条复制额度。</div>
                <div class="mb-5">高级版：抖音平台支持无限量复制；</div>
                <div class="mb-5">非抖音平台订购1月送500条额度，订购3月送1500条，以此类推（用完可充值）</div>
                </div>
                <span class="color-primary ml-10 underline pointer">版本区别</span>
            </el-tooltip>
        </p>
        <p class="left font-12 mt-20 "  v-else>非抖音平台的复制受成本影响有额度限制（抖音平台无限量），共剩额度<span class="fail">{{availablePddCaptureNums}} 条</span>
            <span class="color-primary ml-10 underline pointer" @click="goCharge">去充值 </span>
            <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" class='left'>
                <div>1、订购1个月赠送500条，订购3个月赠送1500条，订购了6个月赠送3000条</div>
                <div style="padding-left:20px" class="mb-5">订购12个月赠送6000条；</div>
                <div>2、试用版升级高级版，升级费用0-5元赠送150条，升级费用5-10元赠送300条</div>
                <div style="padding-left:20px"  class="mb-5">升级费用10-15元赠送500条，升级费用15-22.5元赠送600条；</div>
                <div  class="mb-5">3、赠送额度用完后可通过额外付费充值增加额度；</div>
                <div >4、赠送额度、充值额度均可累计且在任何场景下不会被清空；</div>
                <div style="padding-left:20px"  class="mb-5">抓取成功1个商品消耗1条额度，抓取失败不消耗额度；</div>
                <div>5、此规则从2021.12.X日开始生效，在此前产生的充值费用不支持退差价。</div>
                </div>
                <span class="color-primary ml-10 underline pointer">额度计算规则</span>
            </el-tooltip>
        </p>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'payCharge',
  props: {
    activeName: String
  },
  data () {
    return {
    }
  },
  async created () {
    if (!this.userVersion) (await this.userVersionQuery())
    console.log(this.userVersion, 'userVersion')
  },
  computed: {
    ...mapState('customerSetting/paidRecharge', ['availablePddCaptureNums', 'versionList']),
    ...mapState('migrate/readyToMigrate', [
      'userVersion'
    ])
  },
  methods: {
    ...mapActions('migrate/readyToMigrate', [
      'userVersionQuery'
    ]),
    goOrder () {
      window.open('https://fuwu.jinritemai.com/detail?service_id=42&from=fxg_admin_home_sidebar')
    },
    goUpVersion () {
      let routeData = this.$router.resolve({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
      window.open(routeData.href, '_blank')
    },
    goCharge () {
      let routeData = this.$router.resolve({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
      window.open(routeData.href, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
