<template>
    <div id="app" >
        <good-assess-dialog></good-assess-dialog>
        <expire-notify-dialog></expire-notify-dialog>
        <el-header :style="{height:(curNavNotification ? 'auto' : '60px')}">
          <!-- 新旧首页 灰度 -->
          <!-- <nav-bar-old v-if="!(userId % 2)" ></nav-bar-old> -->
          <nav-bar ></nav-bar>
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
        <el-container class="main-wrapper flex" v-if="!$route.meta.specialShow">
            <div class="aside">
              <vue-custom-scrollbar class="scroll-area"  :settings="settings" @ps-scroll-y="scrollHanle">
                <side-bar @open="subMenuOpen" ></side-bar>
              </vue-custom-scrollbar>
            </div>
          <el-main style="background:#f9f9f9;height:100%;overflow:auto;padding:0" class="page-component__scroll">
            <div class="main-layout">
              <keep-alive>
                <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
            </div>
          </el-main>
        </el-container>
        <div v-else>
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
        </div>
        <!-- <el-footer class="footer">
          <el-link href="http://www.beian.gov.cn/portal/registerSystemInfo" target="_blank" >沪ICP备16034003号</el-link>
        </el-footer> -->
        <div  :class="['float-view pointer',!flexFootVisible ? 'float-view-active' :' ']"  @click="handleClick"  @mouseover.stop="handleHuhuTitletipActive" @mouseout.stop="handleHuhuTitletipActive">
          <div style="width:50px;height:31px;" class="huhutitle" >
            <div :class="['huhutitle-tip',huhuTitletipActive ? 'huhutitle-tip-active' :' ']" ref="tip">{{flexFootVisible ? '点击缩小哦～' : '点击放大哦～'}} </div>
          </div>
          <flex-foot ref="flexFoot"  :flexFootVisible="flexFootVisible"></flex-foot>
        </div>
        <hh-dialog width="600" :visible.sync="dialogNotificationVisible" :isClose="false" :isHeadLine="false" :zIndex="3000" @closeDialog="closeDialogNotification">
          <template v-slot:content>
            <div class="mail-notice-box">
              <notification-list-view ref="notificationListView" @closeDialog="closeDialogNotification"
              ></notification-list-view>
            </div>
          </template>
        </hh-dialog>
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
        <MeizheActivityModel />
    </div>
</template>

<script>
import '@/assets/css/index.less'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import GoodAssessDialog from '@/components/GoodAssessDialog'
import ExpireNotifyDialog from '@/components/ExpireNotifyDialog'
import NotificationListView from '@/components/NotificationListView.vue'
import MeizheActivityModel from '@/components/MeizheActivityModel'
import navBar from '@/components/Navbar'
import sideBar from '@/components/Sidebar'
import FlexFoot from '@/components/FlexFoot.vue'

import { mapGetters, mapActions, mapState } from 'vuex'
import moment from 'moment'
import common from '@/common/common.js'
import commonUtils from '@/common/commonUtils.js'
import utils from '@/common/utils'
import request from '@/mixins/request.js'
import 'vue-custom-scrollbar/dist/vueScrollbar.css'

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
      msgDialogShow: false,

      settings: {
        suppressScrollY: false,
        suppressScrollX: false,
        wheelPropagation: false
      },
      huhutitleHover: false,
      dialogNotificationVisible: false,
      subActiveArray: [],
      flexFootVisible: true,
      huhuTitletipActive: false
    }
  },
  components: {
    navBar,
    sideBar,
    FlexFoot,
    GoodAssessDialog,
    ExpireNotifyDialog,
    vueCustomScrollbar,
    NotificationListView,
    MeizheActivityModel
  },
  computed: {
    ...mapState({
      loading: state => (state['@@loading'].effects['requestToken'] || state['@@loading'].effects['fakeUser'] || state['@@loading'].effects['requestUserInfo'])
    }),
    ...mapGetters({
      getShopName: 'getShopName',
      userId: 'getUserId',
      isAuth: 'getIsAuth',
      isNew: 'getIsNew',
      orderTimes: 'getOrderTimes',
      leftDays: 'getLeftDays',
      syncStatus: 'getSyncStatus',
      ignoreNotiList: 'getIgnoreNotiList',
      notificationList: 'getNotificationList',
      isShowFloatView: 'isShowFloatView',
      currentSubsc: 'getCurrentSubsc'
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
    },
    newFeatureOnlineTipVisible () {
      if (!this.subActiveArray) return false
      if (!this.isAuth) return false
      if (!this.currentSubsc) {
        return false
      }
      if (this.currentSubsc.is_newcomer) return false

      return this.subActiveArray.length === 3
    }
  },
  watch: {
    syncStatus (val, oldVal) {
      if (val.status === 'ready' || val.status === 'running') { // 有任务在运行
        this.checkSyncProgress()
      } else if (oldVal.status === '') { // 初始化的时候
        this.syncProducts()
      } else if (oldVal.status !== 'complete' && val.status === 'complete') {
        this.$message({
          message: '商品同步完成',
          type: 'success'
        })
      } else if (oldVal.status !== 'error' && val.status === 'error') {
        this.$message.error('商品同步出错：' + val.message)
      }
    },
    notificationList (notiList) {
      // 新用户不展示通知
      if (this.isNew) {
        notiList = notiList.filter(item => !item.is_shield_new_user)
      }
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
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
      'ignoreNotification',
      'requestOperate'
    ]),
    toggleDialogNotificationVisible (bool) {
      this.dialogNotificationVisible = bool
      if (bool) {
        this.$nextTick(function () {
          this.$refs.notificationListView.init()
        })
      }
    },
    closeDialogNotification () {
      this.dialogNotificationVisible = false
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表', '点击', '关闭通知列表'])
      }
    },
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
      let timeBefore12hour = moment().subtract(12, 'months').format('YYYY-MM-DD HH:mm:ss')
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
      }, 5000)
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
          elem.innerHTML = '<img src="https://img.pddpic.com/mms-material-img/2020-10-09/9207c610-73fe-4613-bb3a-62a34676dcbd.png" style="width: 12px; position: relative; top: 0; padding-right: 4px;">' + '<div style="display: inline-block;fonts-zie:12px;height:16px" class="notification-text">' + notification.data + '</div>'
        } else {
          elem.innerHTML = '<img src="https://img.pddpic.com/mms-material-img/2020-10-09/9207c610-73fe-4613-bb3a-62a34676dcbd.png" style="width: 12px; position: relative; top: 0; padding-right: 4px;"><span>' + notification.title + '</span> : ' + '<div style="display: inline-block;fonts-zie:12px;height:16px"  class="notification-text">' + notification.data + '</div>'
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
    },
    subMenuOpen (subActiveArray) {
      this.subActiveArray = subActiveArray
    },
    handleClickNewFeatureOnlineTip (options) {
      this.$router.push(options)
    },
    handleClick () {
      this.flexFootVisible = !this.flexFootVisible
    },
    handleHuhuTitletipActive () {
      this.huhuTitletipActive = !this.huhuTitletipActive
    }
  }
}
</script>

<style lang="less">
  body,#app {
    font-family: 14px/1.5 Microsoft YaHei,Heiti SC,tahoma,arial,Hiragino Sans GB,"\5B8B\4F53",sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-height: 100vh;
    position: relative;
    height:auto!important;
    height:100vh; /*IE6不识别min-height*/
    min-height: 100vh;
    background: #F9F9F9;
  }

  .main-wrapper {
    margin-left: 40px;
    margin-top: 20px;
    height: calc(100vh - 100px);
    overflow: hidden;
  }
  .aside {
    text-align: left;
    // margin-right: 10px;
    border-right: 1px solid #F2F2F2;
  }

  .aside .aside-bar {
    background: #ffffff;
    height: 100%;
  }

  .mainer {
    background: #ffffff;
    height: 100%
  }
  .notification-box {
    width: auto !important;
    min-width: 420px !important;
  }
  .footer {
    width: 100%;
    background: #F9F9F9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

</style>

<style lang="less" scoped>

  /deep/ .app-notification {
    p {
      font-size: 12px;
    }
  }
  /deep/ .notice-foot {
    margin-top: -1px;
    margin-bottom: -6px;
    .el-button {
      min-width: 126px;
    }
  }

  /* 新通知弹框样式 */
  .notice-main {
    margin-top: -28px;
    .notice-title {
      font-size: 20px;
      color: #333333;
      line-height: 62px;
      border-bottom: 1px solid #e5e5e5;
    }
    .notice-content {
      padding: 22px 45px;
      color: #4e4e4e  ;
      font-size: 14px;
      text-align: left;
    }
  }

  .header-notice {
    background: #fff6ed;
    /deep/ .notification-text {
      p{
        height: 16px;
        line-height: 16px;
      }
    }
    .main-inner {
      width: 100%;
      margin: auto;
    }
    /deep/ .el-alert__title {
      display: flex;
      align-items: center;
    }
    .el-alert.is-light {
      background: #fff6ed;
    }
    /deep/ .el-alert {
      padding: 2px;
    }
    /deep/ .el-alert.is-light .el-alert__closebtn {
      padding-right: 6px;
    }
    /deep/ .el-alert__content {
      padding:0 4px;
      height: 16px;
    }
    /deep/ .el-alert__closebtn.is-customed {
      font-size: 12px;
      top: 1px
    }
}

  /* 头尾默认设置为全屏 */
  #app {
    /deep/ .el-header {
      padding: 0;
    }
  }

  .float-view {
    position: fixed;
    z-index: 9999;
    transform: translate(0,-50%);
    top: 78%;
    right: 15px;
    transition: all 0.2s;
  }

  .float-view-active {
    top: 85%;
    right: -30px;
  }

  .main-layout{
    padding-left:20px;
    padding-top:10px;
    padding-right:20px;
    margin-right:40px;
    background:#FFFFFF;
    min-height: 100%;
    box-sizing: border-box;
    min-width: 1036px;
    width: calc(100% -40px);

  }
  .full-screen {
    // min-width: @full-screen-width;
    position: absolute;
    width: 100%;
    z-index: 1;
  }

  .scroll-area {
    position: relative;
    margin: auto;
    width: 200px;
    height: calc(100vh - 100px);
  }

  /deep/ .ps__rail-y {
    width: 11px;
  }
  /deep/ .ps__rail-y:hover > .ps__thumb-y{
    width: 8px;
  }
  /deep/ .ps__rail-y:focus > .ps__thumb-y{
    width: 8px;
  }
  /deep/ .ps__rail-y.ps--clicking .ps__thumb-y{
    width: 8px;
  }
  .huhutitle {
    background-image: url("~@/assets/images/huhutitle.gif");
    background-size: 100%;
    background-repeat: no-repeat;
    position: relative;
    .huhutitle-tip {
      position:absolute;
      right:50px;
      top:-30px;
      width: 100px;
      background:#f3e0a1;
      height: 28px;
      line-height: 28px;
      font-size: 12px;
      border-radius: 4px;
      color: #755d0b;
      font-weight: bold;
      text-align: center;
      transition: all 0.2s;
      opacity: 0;
      display:none;
    }
    .huhutitle-tip-active {
      opacity: 1;
      display: block;
    }
    .huhutitle-tip::before {
          /*伪元素必须添加content*/
          position:absolute;
          z-index: -1;
          content: "";
          width: 0;
          height: 0;
          /*IE6下，height:0;不顶用，可使用font-size:0; + overflow:hidden;修复此问题*/
          font-size:0;
          // overflow:hidden;
          border-width: 20px;
          /*保留我们需要的那边的三角形，其他三角形设置为透明*/
          border-color: transparent #f3e0a1 transparent transparent;
          border-style: dashed solid dashed dashed;
          // top:  0; /*相对于矩形高度的位置*/
          left: 50px; /* 向左移动 矩形的左边框 + 自己边框*2 */
      }

  }

</style>
