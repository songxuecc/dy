<template>
  <div class="expire-notify-dialog">
    <el-dialog
      :visible.sync="visible"
      width="448px"
      top="8%"
      :show-close="false"
      :close-on-click-modal="false"
      custom-class="expire-notify-box"
    >
      <div class="describe">
        <span>您的虎虎搬家助手还有<span class="left-days">{{leftDays}}</span>天到期</span>
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
</template>

<script>
import utils from '@/common/utils'
import common from '@/common/common'
import request from '@/mixins/request.js'
import {mapGetters} from 'vuex'
export default {
  name: 'ExpireNotifyDialog',
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
        is_show: false
      }
    }
  },
  mounted () {
  },
  watch: {
    subsc (val) {
      this.expireNotify = val.expire_notify
      this.visible = this.expireNotify.is_show
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
      let hours = parseInt(lefttime / (60 * 60) % 24)
      let minutes = parseInt(lefttime / 60 % 60)
      let seconds = parseInt(lefttime % 60)

      this.days = days
      this.hour10 = parseInt(hours / 10)
      this.hour1 = hours % 10
      this.minute10 = parseInt(minutes / 10)
      this.minute1 = minutes % 10
      this.second10 = parseInt(seconds / 10)
      this.second1 = seconds % 10

      this.countdouwnTimer = setTimeout(this.countdown, 1000)
    },
    createStatisticsEvent (action) {
      // 创建事件记录
      this.request(
        'createStatisticsEvent',
        {
          'event_type': 'expire_notify_dialog',
          'action': action
        }
      )
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
.expire-notify-dialog .expire-notify-box{
  background-image: url('~@/assets/images/components/expire_notify_dialog/bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 12px;
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
  color: #FFF6C6;
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
  padding-left:3px;
  padding-right: 3px;
}

.time-day {
  display: inline-block;
  float: left;
  width: 52px;
  height: 22px;
  font-size: 16px;
  font-weight: normal;
  color: #FFFFFF;
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
  color: #36379F;
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
</style>
