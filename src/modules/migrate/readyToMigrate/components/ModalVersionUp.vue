<!-- ModalVersionUp -->
<template>
  <el-dialog
    :visible.sync="visible"
    width="600px"
    class="versionUp"
    :show-close="false"
  >
    <div class="ModalVersionUp" v-if="versionType">
      <div class="flex mb-20 justify-c">
        <div class="old">
          <div class="flex column justify-c">
            <p class="shengji left">{{ versionType.left }}</p>
            <p class="shiyong left">试用版</p>
            <p class="shiyongri left">10个/日</p>
          </div>
        </div>
        <div class="flex column align-c justify-c color-999 ml-10 mr-10">
          <p class="font-12">版本升级</p>
          <p class="font-12 jiantou flex align-c justify-c mt-5">
            <hh-icon type="iconjiantou1" style="color: #fff"></hh-icon>
          </p>
          <p class="font-12 mt-5">{{ versionType.price }}</p>
        </div>
        <div class="new">
          <div class="flex column justify-c">
            <p class="shengji left">{{ versionType.right }}</p>
            <p class="shiyong left">高级版</p>
            <p class="shiyongri left">无上限/日</p>
          </div>
        </div>
      </div>
      <div class="color-666 font-14" v-if="userVersion">
        当前版本为试用版，每日搬家数限10个。今日已搬家{{
          userVersion.today_cnt
        }}个商品，仅剩
        <span class="price">{{ 10 - (userVersion.today_cnt || 0) }}</span>
        个额度
      </div>
      <div class="color-666 font-14">
        建议您升级为高级版，升级后每日搬家数 <span class="price">无上限</span>
      </div>
    </div>
    <div class="flex justify-b modalVersionUpBtn center" slot="footer" v-if="versionType">
      <div class="moreThink pointer" @click="close">再想想</div>
      <div
        class="up flex align-c justify-c pointer"
        @click="up(versionType.btn)"
      >
        {{ versionType.btn }}
        <div class="tip">限时特惠{{ versionType.price }}</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ModalVersionUp',
  props: {
    key: {
      type: String,
      default: 'up'
    },
    visible: Boolean
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('migrate/readyToMigrate', ['userVersion', 'versionType'])
  },
  methods: {
    close () {
      this.visible = !this.visible
      this.$emit('visibleModalVersionUpChange')
    },
    up (btnText) {
      this.close()
      if (btnText === '去升级') {
        this.$router.push({
          name: 'PaidRecharge'
        })
      } else {
        window.open(
          'https://fuwu.jinritemai.com/detail?from=fuwu_market_myService&service_id=42'
        )
      }
    }
  }
}
</script>
<style lang="less" scoped>
.versionUp {
  /deep/ .el-dialog__footer {
    padding: 0;
  }
  .price {
    color: #dc4041;
    font-weight: bold;
  }

  .jiantou {
    width: 22px;
    height: 22px;
    background: linear-gradient(360deg, #c9c9c9 0%, #999999 100%);
    border-radius: 50%;
  }
  .ModalVersionUp {
    border-radius: 10px;
    overflow: hidden;
    .old {
      width: 200px;
      height: 132px;
      background: linear-gradient(206deg, #f9fafe 0%, #e8e6e9 100%);
      border-radius: 7px;
      position: relative;
      .shengji {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 16px;
        width: 50px;
        height: 16px;
        background: #ffffff;
        border-radius: 8px 0px 8px 0px;
        text-align: center;
      }
      .shiyong {
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #535360;
        line-height: 45px;
        opacity: 0.5;
      }
      .shiyongri {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #999999;
        line-height: 28px;
      }
      div {
        position: absolute;
        left: 20px;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
      }
      &::after {
        content: '';
        position: absolute;
        display: block;
        width: 200px;
        height: 132px;
        background: linear-gradient(206deg, #f9fafe 0%, #e8e6e9 100%);
        border-radius: 7px;
        opacity: 0.2;
        top: 8px;
      }
    }

    .new {
      width: 200px;
      height: 132px;
      background: linear-gradient(206deg, #e4d2a8 0%, #c6a776 100%);
      border-radius: 7px;
      position: relative;
      div {
        position: absolute;
        left: 20px;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        z-index: 1;
      }
      .shengji {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #cdb282;
        line-height: 16px;
        width: 50px;
        height: 16px;
        background: #ffffff;
        border-radius: 8px 0px 8px 0px;
        text-align: center;
      }
      .shiyong {
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffffff;
        line-height: 45px;
      }
      .shiyongri {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 28px;
      }
      &::after {
        content: '';
        position: absolute;
        display: block;
        width: 200px;
        height: 132px;
        background: linear-gradient(206deg, #e4d2a8 0%, #c6a776 100%);
        border-radius: 7px;
        opacity: 0.2;
        top: 8px;
      }
    }
  }
  .modalVersionUpBtn {
    height: 64px;
    background: #f9f9f9;
    border-radius: 0 0 10px 10px;

    .moreThink {
      font-size: 18px;
      font-family: MicrosoftYaHei;
      color: #c2c2c2;
      width: 50%;
      text-align: center;
      line-height: 64px;
    }

    .up {
      font-size: 18px;
      font-family: MicrosoftYaHei;
      color: #3d9fff;
      width: 50%;
      text-align: center;
      line-height: 64px;
      .tip {
        height: 18px;
        padding: 0 4px;
        margin-left: 4px;
        background: linear-gradient(165deg, #ff9527 0%, #eb2202 100%);
        border-radius: 10px 0px 10px 0px;
        color: #ffffff;
        font-size: 12px;
        line-height: 18px;
      }
    }
  }
}
</style>
