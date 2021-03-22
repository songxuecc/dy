<template lang="html">
    <div class="mail-content">
        <div class="close-icon" @click="closeDialog">
          <hh-icon type="iconquxiao" style="font-size:28px;margin-top:-2px" />
        </div>
        <el-table class="notification-box" v-if="mailNotificationList.length > 0" :data="mailNotificationList" :show-header="false" row-key="id"
                  style="max-height: 450px; overflow: auto; overflow-x: hidden;"  @cell-mouse-enter="showTipRead" @cell-mouse-leave="hideTipRead"
        >
            <el-table-column>
                <template slot-scope="scope">
                    <el-row style="padding-bottom: 6px; display:flex;">
                        <el-col :span="21" style="font-size: 18px; color: #333333">
                            <span class="red-circle" v-if="scope.row.is_read === 0"></span>
                            <span>{{ scope.row.title === '-' ? '通知' : scope.row.title }}</span>
                            <span class="has_read" v-if="scope.row.is_read === 1">已读</span>
                        </el-col>
                        <el-col :span="3" style="margin-right:0; font-size: 12px; color: #999999">
                            <span>{{ scope.row.start_time.substr(0, 10) }}</span>
                        </el-col>
                    </el-row>
                    <div style="padding-bottom: 6px;" v-html="scope.row.data"></div>
                    <div class="foot-btn">
                      <el-button size="small" @click="goBtnLink(scope.row)" v-if="scope.row.is_btn === 1" type="primary">{{scope.row.btn_text}}</el-button>
                      <el-button size="small" v-if="scope.row.is_show_tip && scope.row.is_read !== 1" @click="tipHasRead(scope.row)">标记为已读</el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-table-empty v-else />
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
import utils from '@/common/utils.js'
import common from '@/common/common.js'

export default {
  mixins: [request],
  components: {},
  data () {
    return {
      mailNotificationList: [],
      userOrderTimes: 0,
      userLeftDays: null,
      gradeData: {
        data: '<div sytle=\'vertical-align:baseline;\'>对付费订单完成<span style="color: blue;">5星好评+8字评语</span>并截图，<a href="https://mms.pinduoduo.com/chat-merchant/?convId=OCNCyX8yOxwnXRT1TQa3d6bi8bZGJtlNArqjRFjY5MpQmQ%3D%3D#/" target="_blank">联系客服</a>，即可返现<span  style="color: rgb(255, 0, 0); padding: 0 4px; font-weight: bold">5元</span>！（注：返现不限次数，每个付费订单均可返现）<br> <br>去好评链接:<a href="https://fuwu.pinduoduo.com/service-market/evaluation-manage" target="_blank">https://fuwu.pinduoduo.com/service-market/evaluation-manage</a> <br> </div>',
        end_time: '2020-11-31 18:56:51',
        id: 300, // 好评id默认为300
        start_time: '2020-06-30 18:58:22',
        title: '好评立返5元',
        type: 4,
        user_type: 2
      }
    }
  },
  computed: {
    ...mapGetters({
      notificationList: 'getNotificationList',
      ignoreNotiList: 'getIgnoreNotiList',
      orderTimes: 'getOrderTimes',
      leftDays: 'getLeftDays',
      unRead: 'getUnRead'
    })
  },
  methods: {
    ...mapActions([
      'ignoreNotification',
      'requestNotification',
      'setUnReadNum'
    ]),
    init () {
      let dicIgnore = {}
      for (let i in this.ignoreNotiList) {
        dicIgnore[this.ignoreNotiList[i]] = 1
      }
      this.mailNotificationList = []
      this.getUserNoticeStatus()
      for (let i in this.notificationList) {
        if (parseInt(this.notificationList[i].type) === common.NotificationType['only_in_mail'] && utils.isAppendNotice(this.notificationList[i], this.userOrderTimes, this.userLeftDays)) {
          this.mailNotificationList.push(this.notificationList[i])
        }
      }
      if (this.isCanGrade) { // 邮箱中加入好评返现
        // this.mailNotificationList.unshift(this.gradeData)
      }
      this.$nextTick(function () {
        for (let i in this.notificationList) {
          let notification = this.notificationList[i]
          if (notification.id in dicIgnore) {
            notification['is_ignore'] = dicIgnore[notification.id]
          } else {
            notification['is_ignore'] = 0
          }
          this.$set(this.notificationList, i, notification)
        }
      })
    },
    getUserNoticeStatus () {
      this.userOrderTimes = this.orderTimes > 4 ? 5 : this.orderTimes
      this.userLeftDays = this.leftDays > 5 ? -1 : 1
    },
    goBtnLink (notification) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表--主按钮', '点击', `${notification.title}主按钮`])
      }
      let params = {
        notification_id: notification.id,
        is_read: 1
      }
      this.request('setNotificationStatus', params, data => {
        this.hideRedCircle(notification)
        this.requestNotification()
        if (notification.is_new_window === 1) {
          window.open(notification.btn_link)
        } else {
          window.location.href = notification.btn_link
        }
      })
    },
    tipHasRead (notification) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表--标记已读', '点击', `${notification.title}标记已读`])
      }
      let params = {
        notification_id: notification.id,
        is_read: 1
      }
      this.request('setNotificationStatus', params, data => {
        this.hideRedCircle(notification)
        this.requestNotification()
      })
    },
    showTipRead (row, column, cell, event) {
      let index = this.mailNotificationList.indexOf(row)
      row.is_show_tip = true
      this.$set(this.mailNotificationList, index, row)
    },
    hideTipRead (row, column, cell, event) {
      let index = this.mailNotificationList.indexOf(row)
      row.is_show_tip = false
      this.$set(this.mailNotificationList, index, row)
    },
    hideRedCircle (row) {
      let index = this.mailNotificationList.indexOf(row)
      row.is_read = 1
      this.$set(this.mailNotificationList, index, row)
    },
    closeDialog () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表--空列表', '点击', '关闭空列表'])
      }
      this.$emit('closeDialog')
    }
  }
}
</script>
<style lang="less">
  .notification-box{
    &.el-table::before {
      height: 0;
    }
  }
  .mail-notice-box {
    /deep/ .el-table .cell {
      // padding-left: 33px;
      // padding-right: 30px;
    }
  }
  .red-circle {
    background: #E02020;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    display: inline-block;
    position: absolute;
    top: 6px;
    left: -10px;
  }
  .has_read {
    position: relative;
    top: -4px;
    font-size: 12px;
    padding: 2px 4px;
    width: 38px;
    height: 18px;
    background: linear-gradient(165deg, #FF9527 0%, #EB2202 100%);
    border-radius: 2px;
    color: #ffffff;
  }
  .empty-text {
    font-size: 14px;
    color: #969696;
    margin-top: 10px;
  }
  .empty-click {
    cursor: pointer;
    font-size: 14px;
    color: #1D8FFF;
    margin-top: 20px;
  }
  .foot-btn {
    /deep/ .el-button--small {
      min-width: 110px;
    }
    /deep/ .el-button--default {
      color: #1D8FFF;
      border-color: #1D8FFF;
    }
  }
  .mail-content {
    .close-icon {
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 0;
    }
    /deep/.el-table td {
      border-bottom: none;
    }
    /deep/ .el-table th.is-leaf {
      border-bottom: none;
    }
  }
</style>
