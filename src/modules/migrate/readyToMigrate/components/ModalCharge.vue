<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    class="ModalCharge"
    :show-close="false"
  >
    <div class="ModalVersionUp " >
      <hh-icon type="iconjinggao1" style="font-size:50px"></hh-icon>
      <div class="payAmount"  >请订购</div>
      <div class="payAmount" >请升级</div>
      <div class="payAmount" >请充值额度</div>
      <div class="tip mb-10" >非抖音平台受复制成本影响有额度限制，当前剩余{{left_capture_nums}}条，请充值</div>

      <div class=" left" style="margin-left:38px" >
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
          <span class="color-primary underline pointer" >额度计算规则</span>
        </el-tooltip>
      </div>
      <div class="mt-20" >
        <el-button type="primary" plain style="width:120px" @click="close">暂不充值</el-button>
        <el-button class="relative modalVersionUpBtn" type="primary" style="width:120px" @click="charge">充值额度<span class="g">低至0.016元/条</span></el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'ModalCharge',
  props: {
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState('migrate/readyToMigrate', ['userVersion', 'versionType'])
  },
  methods: {
    open () {
      this.visible = !this.visible
    },
    close () {
      this.visible = !this.visible
    },
    async charge () {
      let routeData = this.$router.resolve({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
      window.open(routeData.href, '_blank')
      this.close()
    },
    goUpVersion () {
      let routeData = this.$router.resolve({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
      this.close()
      window.open(routeData.href, '_blank')
    },
    goOrder () {
      this.close()
      window.open('https://fuwu.jinritemai.com/detail?service_id=42&from=fxg_admin_home_sidebar')
    }
  }
}
</script>
<style lang="less" scoped>
.ModalCharge {
  .payAmount {
    height: 24px;
    font-size: 18px;
    color: #4E4E4E;
    line-height: 24px;
    margin-bottom: 14px;
    margin-top: 12px;
  }
  .tip {
    height: 19px;
    font-size: 14px;
    color: #4E4E4E;
    line-height: 19px;
  }

  .g {
      display: inline-block;
      width: 105px;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #FFFFFF;
      position: absolute;
      height: 28px;
      background: linear-gradient(270deg, #FF6717 0%, #FFC300 100%);
      border-radius: 10px 0px 10px 0px;
      top:-10px;
      right:-80px;
      line-height: 28px;

      height: 19px;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      color: #FFFFFF;
      line-height: 19px;

    }
    .g1 {
      width: 105px;
    }
    .g2 {
      width: 70px;
      right: -45px;
    }
    /deep/ .el-dialog__header {
      padding-top: 0;
    }
}

</style>
