<template>
    <div id="app">
        <el-container class="main-wrapper" v-if="!$route.meta.specialShow">
            <el-header :style="{height:(curNavNotification ? 'auto' : '60px')}">
                <nav-bar></nav-bar>
                <el-alert v-if="curNavNotification" class="notification-info" center @close="onCloseNotification" title=""
                          :closable="notificationClosable" close-text="我知道啦 不再通知"
                ><p style="font-size: 14px;color: #666666;">&nbsp;<span style="color: red">请务必将我们软件链接收藏</span>&nbsp;<a @click="goHhgjLink" href="javascript:;">https://dy.huhuguanjia.com/</a>&nbsp;下次使用时直接打开该链接即可用</p></el-alert>
            </el-header>
            <el-container>
                <el-aside class="aside" width="160px">
                    <side-bar></side-bar>
                </el-aside>
                <el-main>
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
                </el-main>
            </el-container>
        </el-container>
        <div v-else>
          <keep-alive>
              <router-view v-if="$route.meta.keepAlive && isRouterAlive"></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive && isRouterAlive"></router-view>
        </div>
        <div class="float-view">
            <div class="float-button">
                <el-button type="primary" icon="el-icon-top" circle @click="backToTop"></el-button>
            </div>
        </div>
    </div>
</template>

<script>
import '@/assets/css/base.less'
import navBar from '@/components/Navbar'
import sideBar from '@/components/Sidebar.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import common from '@/common/common.js'
import commonUtils from '@/common/commonUtils.js'

export default {
  name: 'App',
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
      notificationClosable: true,
      // curNavNotification: null,
      curNavNotification: true
    }
  },
  components: {
    navBar,
    sideBar
  },
  computed: {
    ...mapGetters({
      syncStatus: 'getSyncStatus',
      ignoreNotiList: 'getIgnoreNotiList',
      notificationList: 'getNotificationList'
    })
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
      for (let i in notiList) {
        if (this.ignoreNotiList.includes(notiList[i].id.toString()) ||
          notiList[i].end_time < moment().format('YYYY-MM-DD HH:mm:ss')
        ) {
          continue
        }
        if (parseInt(notiList[i].type) === common.NotificationType['msg_box']) {
          if (!this.curMsgNotification) {
            this.setCurMsgNotification(notiList[i])
          }
        } else if (parseInt(notiList[i].type) !== common.NotificationType['only_in_mail']) {
          if (!this.curNavNotification) {
            this.setCurNavNotification(notiList[i])
          }
        }
      }
    }
  },
  created () {
    window.onClickNotiLink = this.onClickNotiLink
  },
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
      'ignoreNotification',
      'requestOperate'
    ]),
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
    backToTop () {
      scrollTo(0, 0)
    },
    setCurMsgNotification (notification) { // 弹框通知先不展示
      this.curMsgNotification = notification
      return false
      // this.$alert(notification.data, notification.title, {
      //   dangerouslyUseHTMLString: true,
      //   showCancelButton: true,
      //   confirmButtonText: '不再显示',
      //   cancelButtonText: '关闭',
      //   customClass: 'notification-box'
      // }).then(action => {
      //   this.ignoreNotification(notification.id.toString())
      // }).catch(() => {})
    },
    setCurNavNotification (notification) {
      this.curNavNotification = notification
      this.notificationClosable = (parseInt(notification.type) !== common.NotificationType['nav_cannot_close'])
      // this.$nextTick(function () {
      //   let elem = this.$el.querySelector('span.el-alert__title')
      //   if (notification) {
      //     if (notification.title === '-') {
      //       elem.innerHTML = '<img src="https://img.pddpic.com/mms-material-img/2020-09-18/7efc360f-1ba2-4f29-8c1a-14b6112cc9af.png" style="width: 20px; float: left">' + notification.data1 + `<a href="#" @click="${this.goHhgjLink}">点击此处</a>` + notification.data2
      //     } else {
      //       elem.innerHTML = '<strong><span style="color:red"><img src="https://img.pddpic.com/mms-material-img/2020-09-18/7efc360f-1ba2-4f29-8c1a-14b6112cc9af.png" style="width: 20px; float: left;">' + notification.title + '</span></strong> : ' + '<div style="display: inline-block">' + notification.data + '</div>'
      //     }
      //   }
      // })
    },
    onCloseNotification () {
      if (parseInt(this.curNavNotification.type) === common.NotificationType['nav_close_not_show_again']) {
        this.ignoreNotification(this.curNavNotification.id.toString())
        this.curNavNotification = null
      }
    },
    goHhgjLink () { // 虎虎管家引流打点
      commonUtils.addToFavorite()
      // if (window._hmt) {
      //   window._hmt.push(['_trackEvent', '导航通知导流跳转', '点击', '跳转到虎虎管家'])
      // }
      // let url = utils.getHHlink('hhgj') + '?from=douyin'
      // window.open(url)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

.main-wrapper {
    width: 1280px;
    margin: auto;
}

.aside {
    padding-left: 20px;
}

.notification-box {
    width: auto !important;
    min-width: 420px !important;
}
</style>
