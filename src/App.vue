<template>
    <div id="app">
        <div v-if="$route.meta.isFullShow">
          <router-view></router-view>
        </div>
        <el-container class="main-wrapper" v-else-if="!$route.meta.specialShow">
            <el-header :style="{height:(curNavNotification ? '98px' : '60px')}">
                <nav-bar></nav-bar>
                <el-alert v-if="curNavNotification" class="notification-info" center @close="onCloseNotification"
                          :closable="notificationClosable" close-text="不再显示" title="-"
                ></el-alert>
            </el-header>
            <el-container>
                <el-aside class="aside" width="200px">
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
import navBar from '@/components/Navbar'
import sideBar from '@/components/Sidebar.vue'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
import common from '@/common/common.js'

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
      syncTimer: null
    }
  },
  components: {
    navBar,
    sideBar
  },
  computed: {
    ...mapGetters({
      syncStatus: 'getSyncStatus'
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
    }
  },
  created () {
    window.onClickNotiLink = this.onClickNotiLink
  },
  methods: {
    ...mapActions([
      'requestSyncProducts',
      'updateSyncStatus',
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

<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
