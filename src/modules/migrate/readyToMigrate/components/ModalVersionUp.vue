<!-- ModalVersionUp -->
<template>
  <el-dialog
    :visible.sync="visible"
    width="600px"
    class="versionUp"
  >
  <div slot="title">
      <p class="title">升级高级版，搬家次数无上限</p>
  </div>
    <div class="ModalVersionUp" v-if="versionType">
      <div class="flex mb-20 justify-c">
        <div class="old">
          <div class="flex column justify-c">
            <p class="shiyong left">3个月试用用户</p>
            <p class="shiyongri left">每日搬家数：10</p>
          </div>
        </div>
        <div class="flex column align-c justify-c color-999 ml-10 mr-10">
          <p class="center">
            <hh-icon type="icona-VS2x" style="font-size:40px"></hh-icon>
          </p>
        </div>
        <div class="new">
          <div class="flex column justify-c">
            <p class="shiyong left">高级版用户</p>
            <p class="shiyongri left flex align-c"> <span class="meiribanjia">每日搬家数：</span>无上限</p>
          </div>
        </div>
      </div>
      <div class="color-666 font-14" v-if="userVersion">
        当前版本为试用版，每日搬家数限10个。今日已搬家{{
          userVersion.today_cnt
        }}个商品，仅剩
        <span class="price">{{ userVersion.left_cnt || 0 }}</span>
        个额度
      </div>
      <div class="color-666 font-14">
        建议您升级为高级版，升级后每日搬家数: <span >无上限</span>
      </div>
    </div>
    <div class="modalVersionUpBtn pb-20" slot="footer" v-if="versionType">
      <p class="relative heartbeat pointer" @click="up">
        升级高级版 搬家无限制
        <span>0.25元/天</span>
      </p>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import Api from '@/api/apis'

export default {
  name: 'ModalVersionUp',
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
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '试用限制优化20210507', '弹层曝光', '3个月试用限制_展示弹层'])
      }
      this.visible = !this.visible
    },
    close () {
      this.visible = !this.visible
    },
    async up () {
      try {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '试用限制优化20210507', '按钮点击', '3个月试用限制_升级高级版本'])
        }
        // 订单统计打点
        await Api.hhgjAPIs.statisticsEventCreate({
          event_type: 'free_three_months',
          action: 'modal'
        })
        this.close()
        let routeData = this.$router.resolve({
          name: 'PaidRecharge',
          params: {
            active: 'VersionUp'
          }
        })
        window.open(routeData.href, '_blank')
      } catch (err) {
        this.$message.error(`${err}`)
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
  /deep/ .el-dialog__body {
    padding-bottom: 24px;
  }

  .title {
    height: 35px;
    font-size: 26px;
    font-family: MicrosoftYaHei;
    color: #6A6E80;
    line-height: 35px;
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
      height: 108px;
      background: linear-gradient(206deg, #F9FAFE 0%, #E8E6E9 100%);
      border-radius: 7px;
      div {
        padding: 19px 15px;
      }
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
        height: 42px;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #535360;
        line-height: 42px;
      }
      .shiyongri {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 28px;
        color: #999999;
        padding-top: 4px;
      }
    }

    .center {
      width: 42px;
      height: 42px;
      background: linear-gradient(360deg, #C9C9C9 0%, #999999 100%);
      border-radius: 50%;
      line-height: 42px;
    }

    .new {
      height: 108px;
      background: linear-gradient(206deg, #E4D2A8 0%, #C6A776 100%);
      border-radius: 7px;
      div {
        padding: 19px 15px;
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
        height: 42px;
        font-size: 30px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #FFFFFF;
        line-height: 42px
      }
      .shiyongri {
        font-size: 20px;
        font-weight: 500;
        color: #ffffff;
        font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
        font-weight: normal;
        padding-top: 4px;
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        line-height: 28px;
      }
    }
  }
  .modalVersionUpBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    p{
      height: 46px;
      background: linear-gradient(180deg, #2972E8 0%, #6CA9FF 100%);
      box-shadow: 0px 3px 6px 0px rgba(191, 214, 249, 0.77);
      border-radius: 22px;
      box-sizing: border-box;
      width: 310px;
      font-size: 22px;
      font-family: MicrosoftYaHei;
      color: #FFFFFF;
      line-height: 46px;
      text-align: center;
      margin-bottom: 12px;
      span {
        width: 51px;
        font-size: 14px;
        font-family: MicrosoftYaHei;
        color: #FFFFFF;
        position: absolute;
        width: 70px;
        height: 28px;
        background: linear-gradient(270deg, #FF6717 0%, #FFC300 100%);
        border-radius: 10px 0px 10px 0px;
        top:-10px;
        right:-50px;
        line-height: 28px;
      }
    }
    div {
      margin-bottom: 27px;
    }
  }

  .heartbeat {
    animation: breath 0.95s infinite linear;
  }
  @keyframes breath {
    from { opacity: 1; transform: scale(1);  }                          /* 动画开始时 */
    50%  { opacity: 0.8; transform: scale(1.05); }      /* 动画50% 时 */
    to   { opacity: 1; transform: scale(1); }                          /* 动画结束时 */
  }

}

</style>
