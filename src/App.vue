<template>
    <div id="app">
        <good-assess-dialog></good-assess-dialog>
        <el-header :style="{height:(curNavNotification ? 'auto' : '96px')}">
          <nav-bar></nav-bar>
          <div class="full-screen">
            <div class="header-notice">
              <div class="main-inner clearfix">
                <el-alert v-if="curNavNotification" class="notification-info" center @close="onCloseNotification"
                          :closable="notificationClosable" close-text="不再显示" title="-"
                ></el-alert>
              </div>
            </div>
          </div>
        </el-header>
        <el-container class="main-wrapper" v-if="!$route.meta.specialShow">
            <el-container>
                <el-aside class="aside" width="220px">
                    <div class="aside-bar">
                      <side-bar></side-bar>
                    </div>
                </el-aside>
                <el-main>
                  <div class="mainer">
                    <div class="inner">
                      <keep-alive>
                          <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
                      </keep-alive>
                      <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
                    </div>
                  </div>
                </el-main>
            </el-container>
        </el-container>
        <div v-else>
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
        </div>
        <el-footer>
          <div class="inner-foot full-screen">
            <el-link href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" >沪ICP备16034003号</el-link>
          </div>
        </el-footer>
        <div v-if="isShowFloatView" class="float-view">
          <flex-foot></flex-foot>
        </div>
        <hh-dialog width="500" :visible.sync="msgDialogShow" :isClose="false" :isBgClose="false" :isHeadLine="false" :zIndex="3000" @closeDialog="closeDialog(curMsgNotification)">
            <template v-slot:content>
                <div class="notice-main">
                    <div class="notice-title" v-if="curMsgNotification.title !== '-'">
                        {{curMsgNotification.title}}
                    </div>
                    <div class="notice-content">
                        <div v-html="curMsgNotification.data"></div>
                    </div>
                </div>
            </template>
            <template v-slot:foot>
                <div class="notice-foot">
                    <el-button @click="closeDialog(curMsgNotification)">我知道啦</el-button>
                    <el-button v-if="curMsgNotification.is_btn === 1" type="primary" @click="goBtnLink(curMsgNotification)">{{curMsgNotification.btn_text}}</el-button>
                </div>
            </template>
        </hh-dialog>
    </div>
</template>

<script>
import '@/assets/css/base.less'
import GoodAssessDialog from '@/components/GoodAssessDialog'
import navBar from '@/components/Navbar'
import sideBar from '@/components/Sidebar.vue'
import FlexFoot from '@/components/FlexFoot.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import common from '@/common/common.js'
import commonUtils from '@/common/commonUtils.js'
import utils from '@/common/utils'
import request from '@/mixins/request.js'

export default {
  name: 'App',
  mixins: [request],
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true,
      haveSynced: false,
      syncTimer: null,
      notificationClosable: false,
      curNavNotification: null,
      curMsgNotification: null,
      userOrderTimes: 0,
      userLeftDays: null,
      dialogTimer: null,
      expireNotifyStyle: {},
      msgNotificationData: {},
      msgDialogShow: false
    }
  },
  components: {
    navBar,
    sideBar,
    FlexFoot,
    GoodAssessDialog
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      orderTimes: 'getOrderTimes',
      leftDays: 'getLeftDays',
      syncStatus: 'getSyncStatus',
      ignoreNotiList: 'getIgnoreNotiList',
      notificationList: 'getNotificationList',
      isShowFloatView: 'isShowFloatView'
    }),
    unreadNotiNum () {
      let dicIgnore = {}
      for (let i in this.ignoreNotiList) {
        dicIgnore[this.ignoreNotiList[i]] = 1
      }
      let num = this.notificationList.length
      for (let i in this.notificationList) {
        let notification = this.notificationList[i]
        if (notification.id in dicIgnore) {
          num--
        }
      }
      return num
    }
  },
  watch: {
    syncStatus (val, oldVal) {
      if (val.status === 'ready' || val.status === 'running') { // 有任务在运行
        this.checkSyncProgress()
      } else if (oldVal.status === '') { // 初始化的时候
        this.syncProducts()
      } else if (oldVal.status !== 'complete' && val.status === 'complete') {
        this.$message('商品同步完成')
      } else if (oldVal.status !== 'error' && val.status === 'error') {
        this.$message.error('商品同步出错：' + val.message)
      }
    },
    notificationList (notiList) {
      // 预渲染不处理notifincation
      if (window.__PRERENDER_INJECTED && window.__PRERENDER_INJECTED.isReader) {
        return
      }
      this.getUserNoticeStatus()
      for (let i in notiList) {
        if (this.ignoreNotiList.includes(notiList[i].id.toString()) ||
          notiList[i].end_time < moment().format('YYYY-MM-DD HH:mm:ss')
        ) {
          continue
        }
        if (parseInt(notiList[i].type) === common.NotificationType['msg_box']) { // 弹窗通知
          if (!this.curMsgNotification && (this.leftDays !== '') && this.userOrderTimes && this.userLeftDays && (notiList[i].is_show === 0)) {
            let result = utils.isAppendNotice(notiList[i], this.userOrderTimes, this.userLeftDays)
            if (result) {
              this.setCurMsgNotification(notiList[i])
            }
          }
        } else if (parseInt(notiList[i].type) !== common.NotificationType['only_in_mail']) { // 头部导航通知
          if (!this.curNavNotification) {
            if (utils.isAppendNotice(notiList[i], this.userOrderTimes, this.userLeftDays)) {
              this.setCurNavNotification(notiList[i])
            }
          }
        }
      }
    }
  },
  created () {
    this.getChannelInfo()
    window.onClickNotiLink = this.onClickNotiLink
  },
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
      'ignoreNotification',
      'requestOperate'
    ]),
    getChannelInfo () {
      let channel = commonUtils.getURLSearchParams('from')
      if (common.CHANNEL_WHITE_LIST.indexOf(channel) !== -1) {
        let channelName = utils.getCookie('channel_name')
        let userMark = localStorage.getItem('user_mark')
        if (!userMark) {
          userMark = channel + new Date().getTime()
          localStorage.setItem('user_mark', userMark)
        }
        let params = {
          'channel_name': channel,
          'user_mark': userMark
        }
        let time = null
        if (!channelName) {
          utils.setCookie('channel_name', channel)
        }
        if (!this.isAuth) {
          this.request('saveChannelInfo', params, data => {
            clearTimeout(time)
            this.goToRegister(channel)
          })
          time = setTimeout(() => { // 接口未返回 默认1200毫秒后跳转
            this.goToRegister(channel)
          }, 1200)
        } else {
          clearTimeout(time)
        }
      }
    },
    goToRegister (channel) {
      window.location.href = commonUtils.getChannelegisterUrl(channel)
    },
    getUserNoticeStatus () {
      this.userOrderTimes = this.orderTimes > 4 ? 5 : this.orderTimes
      this.userLeftDays = this.leftDays > 5 ? -1 : 1
    },
    syncProducts () {
      let timeBefore12hour = moment().subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
      if (!this.haveSynced && this.syncStatus.last_sync_time < timeBefore12hour) {
        this.haveSynced = true
        this.requestSyncProducts({ sync_type: common.SyncType['all'], operation_type: 0 })
      }
    },
    checkSyncProgress () {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      let self = this
      this.syncTimer = setTimeout(function () {
        self.updateSyncStatus()
      }, 2000)
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    onCloseNotification () {
      if (parseInt(this.curNavNotification.type) === common.NotificationType['nav_close_not_show_again']) {
        this.ignoreNotification(this.curNavNotification.id.toString())
        this.curNavNotification = null
      }
    },
    setCurMsgNotification (notification) {
      this.curMsgNotification = notification
      clearTimeout(this.dialogTimer)
      this.dialogTimer = setTimeout(() => {
        let result = utils.isAppendNotice(notification, this.userOrderTimes, this.userLeftDays)
        if (result) {
          this.msgDialogShow = true
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '通知弹框', '展示', `${notification.title}显示`])
          }
        }
      }, 400)
    },
    setCurNavNotification (notification) {
      this.curNavNotification = notification
      this.notificationClosable = (parseInt(notification.type) !== common.NotificationType['nav_cannot_close'])
      this.$nextTick(function () {
        let elem = this.$el.querySelector('span.el-alert__title')
        if (notification.title === '-') {
          elem.innerHTML = '<img src="https://img.pddpic.com/mms-material-img/2020-10-09/9207c610-73fe-4613-bb3a-62a34676dcbd.png" style="width: 12px; position: relative; top: 0; padding-right: 4px;">' + '<div style="display: inline-block">' + notification.data + '</div>'
        } else {
          elem.innerHTML = '<img src="https://img.pddpic.com/mms-material-img/2020-10-09/9207c610-73fe-4613-bb3a-62a34676dcbd.png" style="width: 12px; position: relative; top: 0; padding-right: 4px;"><span>' + notification.title + '</span> : ' + '<div style="display: inline-block">' + notification.data + '</div>'
        }
      })
    },
    onClickNotiLink (val) {
      if (val.substr(0, 4) === 'http') {
        window.open(val, '_blank')
      }
    },
    closeDialog (notification) {
      this.msgDialogShow = false
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知弹框--我知道按钮', '点击', `${notification.title}按钮点击`])
      }
      let params = {
        notification_id: notification.id,
        is_show: 1
      }
      this.request('setNotificationStatus', params, data => {
      })
    },
    goBtnLink (notification) {
      this.msgDialogShow = false
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知弹框--主按钮点击', '点击', `${notification.title}主按钮点击`])
      }
      let params = {
        notification_id: notification.id,
        is_show: 1
      }
      this.request('setNotificationStatus', params, data => {
        if (notification.is_new_window === 1) {
          window.open(notification.btn_link)
        } else {
          window.location.href = notification.btn_link
        }
      })
    }
  }
}
</script>

<style lang="less">
  #app {
    font-family: 14px/1.5 Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height:100%;
    height: auto !important;
    height: 100%; /*IE6不识别min-height*/
    position: relative;
    /*margin-top: 60px;*/
  }

  .main-wrapper {
    width: 1320px;
    margin: auto;
    /deep/ .el-container {
      padding-bottom: 60px;
    }
  }

  .aside {
    padding: 14px 0 14px 20px;
    text-align: left;
  }

  .aside .aside-bar {
    background: #ffffff;
    height: 100%;
  }

  .mainer {
    background: #ffffff;
    height: 100%
  }
  .inner {
    padding: 30px;
  }

  .notification-box {
    width: auto !important;
    min-width: 420px !important;
  }
</style>
