<template>
  <el-dialog
    :visible.sync="visible"
    width="500px"
    class="ModalCharge"
    :show-close="false"
  >
    <div class="ModalVersionUp" >
      <hh-icon type="iconjinggao1" style="font-size:50px"></hh-icon>
      <div class="payAmount">请充值额度</div>
      <div class="tip mb-10">非抖音平台受复制成本影响有额度限制，当前剩余0条，请充值</div>
      <div class="mt-20">
        <el-button type="primary" plain style="width:120px">暂不充值</el-button>
        <el-button class="relative modalVersionUpBtn" type="primary" style="width:120px" @click="charge">充值额度<span class="g">原价订1年返38元</span></el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ModalCharge',
  props: {
    key: {
      type: String,
      default: 'up'
    }
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
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '付费充值', '按钮点击', '7天试用限制_订购高级版本'])
      }
      this.close()
      window.open('https://dy.huhuguanjia.com/customerSetting/paidRecharge/PayRecord')
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
    /deep/ .el-dialog__header {
      padding-top: 0;
    }
}

</style>
