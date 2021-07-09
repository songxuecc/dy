<template>
  <div class="expire-notify-dialog">
    <div v-if="showType === 2">
      <el-dialog
        :visible.sync="visible"
        width="448px"
        top="8%"
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="expire-notify-box"
      >
        <div class="describe">
          <span
            >您的虎虎搬家助手还有<span class="left-days">{{ leftDays }}</span
            >天到期</span
          >
        </div>
        <div class="countdown">
          <div class="time-day">{{ days }}天</div>
          <div class="time-content">
            <div class="time-item hour10">{{ hour10 }}</div>
            <div class="time-item hour1">{{ hour1 }}</div>
            <div class="time-split">
              <div class="time-split-item"></div>
              <div class="time-split-item"></div>
            </div>
            <div class="time-item minute10">{{ minute10 }}</div>
            <div class="time-item minute1">{{ minute1 }}</div>
            <div class="time-split">
              <div class="time-split-item"></div>
              <div class="time-split-item"></div>
            </div>
            <div class="time-item second10">{{ second10 }}</div>
            <div class="time-item second1">{{ second1 }}</div>
          </div>
        </div>
        <div class="close-btn" @click="createStatisticsEvent('close')"></div>
        <div class="wait-btn" @click="createStatisticsEvent('wait')"></div>
        <div class="resubscribe-btn" @click="resubscribe"></div>
        <div class="inside"></div>
      </el-dialog>
    </div>

    <div v-if="showType === 1">
      <el-dialog
        :visible.sync="visible"
        width="448px"
        top="8%"
        :show-close="false"
        :close-on-click-modal="false"
        custom-class="asd"
      >
        <div>
          <div class="w"></div>
          <hh-icon type="iconquxiaoxiao" class="iconquxiaoxiao" @click="createStatisticsEvent('close')"></hh-icon>
          <div class="r">
            <div class="e">
              <div class="hh">虎 虎 搬 家</div>
              <div class="daoqi left">
                <div class="huiyuan">会员即将到期</div>
                <div class="tip" v-if="days">您的虎虎搬家助手还有{{ days }}天到期</div>
                <div class="tip" v-if="!days">您的虎虎搬家助手今天到期</div>
              </div>
            </div>
            <div class="flip">
              <span class="days" v-if="days">{{ days }} </span>
              <span class="text" v-if="days">天</span>
              <FlipClock :FlipClockTime="FlipClockTime" v-if="FlipClockTime"></FlipClock>
            </div>

            <div class="weihai relative">
              <div class="songle"></div>
              <div class="shangxin">
                <hh-icon type="icontishi"></hh-icon>
                虎虎到期可能会使店铺上新、商品流量受到严重危害！
              </div>
              <div class="xiaolv">
                <span
                  >上货效率500%<hh-icon
                    type="iconjiantou2"
                    style="padding: 0"
                  ></hh-icon
                ></span>
                <span
                  >修改效率500%<hh-icon
                    type="iconxiajiang"
                    style="color: green; padding: 0; font-size: 10px"
                  ></hh-icon
                ></span>
              </div>
            </div>

            <div class="flex f">
              <span class="text">
                <span class="tian"> 0.35/天 </span>
                <span class="pingtai"> 全平台最低价 </span>
              </span>
              <span class="test-wrap"></span>
              <span class="xuding" @click="resubscribe">现在续订</span>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import utils from '@/common/utils'
import common from '@/common/common'
import request from '@/mixins/request.js'
import FlipClock from '@/components/FlipClock'
import { mapGetters } from 'vuex'
export default {
  name: 'ExpireNotifyDialog',
  components: {
    FlipClock
  },
  mixins: [request],
  data () {
    return {
      visible: false,
      dyServiceUrl: '',
      days: 0,
      moreDays: 0,
      hour10: 0,
      hour1: 0,
      minute10: 0,
      minute1: 0,
      second10: 0,
      second1: 0,
      countdouwnTimer: null,
      expireNotify: {
        is_show: false,
        show_type: 2
      },
      showType: 2,
      FlipClockTime: undefined
    }
  },
  mounted () {},
  watch: {
    subsc (val) {
      this.expireNotify = val.expire_notify
      this.showType = this.expireNotify.show_type || 2
      this.visible = this.expireNotify.is_show
      console.log(this.visible, 'visible')
      console.log(this.showType, 'showType')
      this.countdown()
    }
  },
  computed: {
    ...mapGetters({
      subsc: 'getCurrentSubsc'
    }),
    leftDays () {
      if (this.subsc.deadline === '') {
        return '-'
      }
      return utils.diffDate(this.subsc.deadline) + 1
    }
  },
  methods: {
    countdown () {
      let nowtime = new Date()
      let endtime = new Date(this.subsc.deadline)
      let lefttime = parseInt((endtime.getTime() - nowtime.getTime()) / 1000)
      let days = parseInt(lefttime / (24 * 60 * 60))
      let hours = parseInt((lefttime / (60 * 60)) % 24)
      let minutes = parseInt((lefttime / 60) % 60)
      let seconds = parseInt(lefttime % 60)

      this.days = days
      this.hour10 = parseInt(hours / 10)
      this.hour1 = hours % 10
      this.minute10 = parseInt(minutes / 10)
      this.minute1 = minutes % 10
      this.second10 = parseInt(seconds / 10)
      this.second1 = seconds % 10

      this.FlipClockTime = `2024-04-23 ${this.hour10}${this.hour1}:${this.minute10}${this.minute1}:${this.second10}${this.second1}`
      this.countdouwnTimer = setTimeout(this.countdown, 1000)
    },
    createStatisticsEvent (action) {
      // 创建事件记录
      this.request('createStatisticsEvent', {
        event_type:
          this.show_type === 2
            ? 'expire_notify_dialog'
            : 'expire_notify_dialog_new',
        action: action
      })
      this.visible = false
    },
    resubscribe () {
      // 去续订
      this.createStatisticsEvent('resubscribe')
      window.open(common.DY_SERVICE_LINK)
    }
  }
}
</script>
<style lang="less">
.expire-notify-dialog .expire-notify-box {
  background-image: url('https://img.pddpic.com/mms-material-img/2021-04-20/ce0b0070-d5a8-45d1-9611-3931afcb1650.png.a.jpeg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 12px;
}

.expire-notify-dialog .asd {
  border-radius: 20px;
  height: 365px;
  // background: #1F1F1F;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0px 0px 69px 31px rgb(0, 0, 0, 85%);
  .w {
    width: 100%;
    height: 365px;
    background: #1f1f1f;
    opacity: 0.9;
    filter: blur(16px);
    position: absolute;
    left: 0;
    top: 0;
  }

  .iconquxiaoxiao {
    color: #fff;
    right: 15px;
    position: absolute;
    top: 15px;
    border: 1px solid #fff;
    border-radius: 50%;
    font-size: 22px;
    font-weight: 700;
    cursor: pointer;
    z-index: 3;
  }

  .r {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    text-align: center;
    height: 365px;
    width: 100%;
    color: #fff;
    .e {
      display: flex;
      align-items: center;
      justify-content: center;
      .hh {
        width: 17px;
        height: 72px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #3d3d3d;
        line-height: 18px;
        letter-spacing: 1px;
        width: 28px;
        height: 88px;
        background: linear-gradient(180deg, #ffebb5 0%, #e7c278 100%);
        border-radius: 14px 0px 14px 0px;
        margin-right: 10px;
        padding-top: 6px;
        box-sizing: border-box;
      }
    }

    .daoqi {
      padding-top: 18px;
      .huiyuan {
        font-size: 48px;
        background: linear-gradient(to bottom, #f9f1da, #e4c675);
        -webkit-background-clip: text;
        color: transparent;
        font-weight: 700;
      }
      .tip {
        height: 56px;
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffe6c2;
        line-height: 28px;
        letter-spacing: 1px;
      }
    }

    .flip {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 29px;
      font-weight: 700;
      line-height: 34px;
      font-family: FZLTTHK--GBK1-0, FZLTTHK--GBK1;
      .text {
        padding-bottom: 5px;
        display: inline-block;
        margin-right: 10px;
      }
      .days {
        margin-right: 3px;
        padding-bottom: 5px;
        display: inline-block;
      }
    }
  }
  .weihai {
    width: 448px;
    background: #fff7eb;
    padding: 15px 0 10px 0;
    margin-top: 20px;

    .shangxin {
      font-size: 12px;
      font-family: FZLTXHK--GBK1-0, FZLTXHK--GBK1;
      font-weight: normal;
      color: #666666;
      line-height: 20px;
      letter-spacing: 1px;
    }
    .xiaolv {
      height: 27px;
      display: flex;
      justify-content: space-around;
      margin: 10px 80px 0 80px;
      span {
        background: #ffe6c2;
        font-size: 12px;
        font-family: FZLTXHK--GBK1-0, FZLTXHK--GBK1;
        font-weight: normal;
        color: #666666;
        display: inline-block;
        padding: 4px 10px;
      }
    }

    .songle {
      width: 0;
      height: 0;
      border: 20px solid transparent;
      border-bottom: 15px solid #FFF7EB;
      padding:0;
      position:absolute;
      right:162px;
      top:-35px;
    }
  }
  .f {
    .text {
      flex: 1;
      .tian {
        display: inline-block;
        margin-top: 10px;
        height: 45px;
        font-size: 32px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #ffe6c2;
        line-height: 45px;
        text-shadow: 0px -5px 10px rgba(0, 0, 0, 0.07);
        margin-right: 10px;
      }

      .pingtai {
        width: 84px;
        height: 20px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffe6c2;
        line-height: 20px;
        text-shadow: 0px -5px 10px rgba(0, 0, 0, 0.07);
      }
    }

    .test-wrap {
          width: 0;
          height: 0;
          border-top: 64px solid transparent;
          border-right: 40px solid #f8ddc8;;
      }
    .xuding {
      display: inline-block;
      font-size: 28px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #613d2d;
      line-height: 64px;
      text-shadow: 0px -5px 10px rgba(0, 0, 0, 0.07);
      width: 137px;
      height: 64px;
      background: #f8ddc8;
      border-radius: 0px 0px 20px 0px;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>

<style lang="less" scoped>
.describe {
  position: absolute;
  top: 92px;
  left: 88px;
  /*width: 248px;*/
  height: 40px;
  font-size: 20px;
  font-weight: normal;
  color: #fff6c6;
  line-height: 23px;
  padding-top: 10px;
}

.countdown {
  position: absolute;
  width: 160px;
  top: 378px;
  left: 124px;
  font-weight: 900;
}

.close-btn {
  position: absolute;
  width: 22px;
  height: 22px;
  top: 18px;
  right: 18px;
  cursor: pointer;
}

.wait-btn {
  position: absolute;
  width: 187.9px;
  height: 43px;
  top: 432px;
  left: 76px;
  border-radius: 21.5px;
  cursor: pointer;
}

.resubscribe-btn {
  position: absolute;
  width: 166px;
  height: 43px;
  top: 432px;
  left: 205.6px;
  border-radius: 21.5px;
  cursor: pointer;
}

.inside {
  height: 497px;
}

.left-days {
  font-size: 32.4px;
  font-weight: 900;
  padding-left: 3px;
  padding-right: 3px;
}

.time-day {
  display: inline-block;
  float: left;
  width: 52px;
  height: 22px;
  font-size: 16px;
  font-weight: normal;
  color: #ffffff;
  line-height: 22px;
  padding-right: 4px;
  box-sizing: border-box;
  text-align: right;
}

.time-item {
  display: inline-block;
  width: 14px;
  height: 24px;
  background-color: white;
  color: #36379f;
  float: left;
  border-radius: 2px;
  margin-left: 2px;
  font-size: 16px;
  line-height: 24px;
}

.time-split {
  display: inline-block;
  float: left;
  color: white;
  text-align: center;
  margin-left: 2px;
  padding-top: 7px;
  width: 2px;
}

.time-split-item {
  display: inline-block;
  width: 2px;
  height: 2px;
  margin-bottom: 5px;
  background-color: white;
  float: left;
}

.asd {
  width: 126px;
  height: 391px;
  background: #1f1f1f;
  opacity: 0.63;
  filter: blur(18px);
}
</style>
