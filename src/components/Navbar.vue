<template lang="html">
    <div class="navbar" id="navBar">
        <div class="navbar-content">
          <div class="main-inner clearfix">
            <div class="nav-title" @click="goInfo">
              <img src="@/assets/icon/logo.png" alt="虎虎搬家助手">
              <hh-icon type="icondouyinban" style="font-size:42px;position:absolute;margin-left:4px;top:12px" />
            </div>
            <div class="nav-right">
              <img v-if="shopName" src="@/assets/images/efficientAndStable.gif" alt="高效稳定" @click="onEfficientAndStable" class="efficientAndStable" />
              <!-- 用户使用天数 -->
              <div v-if="shopName">
                 <el-tooltip v-if="subsc.order_list.length">
                  <div slot="content" >
                    <p v-for="order in subsc.order_list" :key="order.order_id"  class="left font-12">
                      {{order.start_time}}~{{order.end_time}} 您的版本为 {{order.sku_spec || '-'}} <a v-if="!order.is_free_upgrate " class="primary pointer" @click="paidUp">升级为高级版</a>
                    </p>
                  </div>
                  <div @click="goToOrder()" class="flex align-c" >
                    <div class="flex column color-fff mr-5 ">
                      <p v-for="order in subsc.order_list" :key="order.order_id" class="font-12"  v-if="subsc.order_list.length">
                        {{order.sku_spec || '-'}} 剩 {{order.left_days || '-'}} 天
                      </p>
                    </div>
                    <img style="height: 28px; display: inline-block; position: relative; top: 0px; cursor: pointer" src="../assets/images/reorder.gif" />
                  </div>
                </el-tooltip>
                <img @click="goToOrder()" style="height: 28px; display: inline-block; position: relative; top: 0px; cursor: pointer" src="../assets/images/reorder.gif" v-else/>
              </div>
              <!-- 充值升级 -->
              <div v-if="shopName" class="syncProduct pointer" @click="paidRecharge" :disabled="isSyncing">
                  <p style="display:flex;align-items:center"><hh-icon type="iconchongzhi1" style="font-size:15px;margin-right:2px"/>充值升级</p>
                </div>
              <!-- 同步商品 & 绑定店铺 -->
              <el-tooltip v-if="shopName" class="syncProductToolTip" effect="dark" placement="bottom">
                <template slot="content">
                  <p style="font-size: 12px;margin-bottom:2px">将抖店后台的商品立马同步至本软件，每隔24小时自动同步一次</p>
                  <p style="font-size: 12px;margin-bottom:2px">若使用了其他第三方软件修改商品，可能会导致同步数据不准确；若同步数据有问题请联系客服</p>
                  <div> 最近同步时间 {{ syncStatus.last_sync_time }} </div>
                </template>
                <div class="syncProduct" @click="handleSyncProducts" :disabled="isSyncing">
                  <p style="display:flex;align-items:center"><hh-icon type="icontongbushangpin2" style="font-size:20px;"/>{{syncButtonText}}</p>
                </div>
              </el-tooltip>
              <div v-if="shopName" class="manageShops" @click="manageShops">
                <p style="display:flex;align-items:center"><hh-icon type="iconduodianpuguanli2" style="font-size:20px;"/>绑定店铺管理</p>
              </div>
              <!-- 退出 & 登录-->
              <el-menu v-if="shopName" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                  <el-submenu index="2" popper-class="nav-menu-popup">
                      <template slot="title">{{ shopName }}</template>
                      <el-menu-item index="2-1">退出</el-menu-item>
                  </el-submenu>
              </el-menu>
              <div class="nav-not-login" v-if="!shopName">
                <el-button type="primary" @click="goToServiceMarket" >购买</el-button>
                <el-button type="primary" @click="onLogin"  >登录</el-button>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex'
import commonUtils from '@/common/commonUtils'
import utils from '@/common/utils'
import common from '@/common/common.js'
const { mapActions: mapActionsNavbar } = createNamespacedHelpers(
  'customerSetting/shopsBand'
)

export default {
  data () {
    return {
      form: {
        app_key: '',
        app_secret: ''
      },
      bindChildShopList: [
        {
          mall_name: 'mall_name1',
          user_id: 'user_id1'
        },
        {
          mall_name: 'mall_name2',
          user_id: 'user_id2'
        }
      ],
      isSyncing: false,
      syncButtonText: '同步后台商品'
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
      shopName: 'getShopName',
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc',
      syncStatus: 'getSyncStatus'
    }),
    leftDays () {
      if (this.subsc.deadline === '') {
        return '-'
      }
      return utils.diffDate(this.subsc.deadline) + 1
    },
    subscName () {
      if (this.subsc.item_name === '') {
        return '-'
      }
      return this.subsc.item_name.split(' ')[0]
    },
    isShowLastSyncTime () {
      if (
        !this.syncStatus.last_sync_time ||
        this.syncStatus.last_sync_time < '2019-01-01'
      ) {
        return false
      }
      return true
    }
  },
  mounted () {
    if (this.isAuth && window.location.pathname !== 'authorize') {
      this.asyncUserAndNotice()
    }
  },
  watch: {
    isAuth (val) {
      if (val) {
        this.asyncUserAndNotice()
      }
    },
    syncStatus (val, oldVal) {
      this.isSyncing = val.status !== 'complete' && val.status !== 'error'
      this.refreshSyncButtonText()
    }
  },
  methods: {
    ...mapActions([
      'logout',
      'requestUserInfo',
      'requestNotification',
      'requestSyncProducts'
    ]),
    ...mapActionsNavbar([]),
    async asyncUserAndNotice () {
      // 同步获取userInfo及notification
      try {
        await this.requestUserInfo()
        this.requestNotification()
      } catch (error) {
        console.error(error)
      }
    },
    // 同步商品
    handleSyncProducts () {
      if (!this.isAuth || this.isSyncing) return false
      this.isSyncing = true
      this.syncButtonText = '正在准备同步...'
      this.requestSyncProducts({
        sync_type: common.SyncType['all'],
        operation_type: 1
      })
    },
    refreshSyncButtonText () {
      let val = this.syncStatus
      if (val.status === 'ready') {
        this.syncButtonText = '正在准备同步...'
      } else if (val.status === 'running') {
        this.syncButtonText = '同步中...(' + val.cur + '/' + val.total + ')'
      } else {
        this.syncButtonText = '同步后台商品'
      }
    },
    onLogin () {
      commonUtils.login(null)
    },
    onLogout () {
      this.logout()
      this.$router.push({
        path: '/'
      })
    },
    handleSelect (key, keyPath) {
      const selectMap = new Map([
        [
          '1',
          {
            handle: () => commonUtils.addToFavorite(),
            comment: '添加到收藏'
          }
        ],
        [
          '2-1',
          {
            handle: () => this.onLogout(),
            comment: '退出'
          }
        ],
        [
          '3',
          {
            handle: () => this.$router.push({ path: '/customerSetting/meizhe' }),
            comment: '短信水印'
          }
        ],
        [
          '4',
          {
            handle: () => this.$router.push({ path: '/customerSetting/woda' }),
            comment: '打单发货'
          }
        ],
        [
          '1-0',
          {
            handle: () => this.$router.push({ path: '/customerSetting/woda' }),
            comment: '返回主账号'
          }
        ],
        [
          '1-2',
          {
            handle: () => {
              if (window._hmt) { window._hmt.push(['_trackEvent', '导航栏', '点击', '店铺绑定']) }
              this.$router.push({ path: '/customerSetting/shopsBand' })
            },
            comment: '绑定店铺'
          }
        ]
      ])
      const value = selectMap.get(key)
      if (value && value.handle) value.handle()
    },
    manageShops () {
      if (window._hmt) { window._hmt.push(['_trackEvent', '导航栏', '点击', '店铺绑定']) }
      this.$router.push({ path: '/customerSetting/shopsBand' })
    },
    goInfo () {
      this.$router.push({
        path: '/info'
      })
    },
    goToServiceMarket () {
      window.location.href =
        'https://fuwu.jinritemai.com/detail?from=tab&service_id=42'
    },
    goToOrder () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '导航栏', '点击', '续费点击'])
      }
      window.location.href =
        'https://fuwu.jinritemai.com/detail?from=tab&service_id=42'
    },
    onEfficientAndStable () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '导航栏', '点击', '高效稳定banner'])
      }
      window.open('https://s.woda.com/9xS4C')
    },
    // 付费充值
    paidRecharge () {
      this.$router.push({
        name: 'PaidRecharge',
        params: {
          active: 'PayRecord'
        }
      })
    },
    paidUp () {
      this.$router.push({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.navbar {
  background: @navbar-bg;
  /deep/ .el-menu .el-menu--popup {
    color: blue !important;
    min-width: 130px;
  }
  /deep/ .el-menu {
    .el-menu-item {
      &:hover {
        background-color: @color-light-blue;
      }
    }
    .el-submenu__title {
      color: #ffffff;
      border-bottom: 2px solid #ffffff;
      background: @navbar-bg;
      padding: 0 8px;
      i {
        color: #ffffff;
      }
      &:hover {
        background: #409eff;
        color: #ffffff;
        i {
          color: @color-light-blue;
        }
      }
    }
    .el-icon-arrow-down:before {
      color: #ffffff !important;
    }
  }
  /deep/ .el-menu.el-menu--horizontal {
    border-bottom: none;
  }
  /deep/ .el-button--primary {
    font-size: 16px;
  }
  /deep/ .el-menu--popup {
    color: blue !important;
    min-width: 130px !important;
  }
  .navbar-content {
    color: @color-white;
    height: 60px;
    .nav-title {
      float: left;
      padding: 12px 0 12px 20px;
      position: relative;
      cursor: pointer;
      img {
        height: 36px;
      }
    }
    .nav-right {
      position: absolute;
      right: 30px;
      height: 60px;
      display: flex;
      align-items: flex-start;
      align-items: center;
      color: #333333;
      background: @navbar-bg;
      .efficientAndStable {
        cursor: pointer;
        height: 36px;
        margin-right: 10px;
      }
      .el-button {
        vertical-align: middle;
        width: 100px;
        padding: 10px;
      }
      .wx-box {
        padding: 10px;
        background: #50aeff;
        position: absolute;
        left: 0;
        top: 58px;
        z-index: 9999;
        .wx-title {
          font-size: 12px;
          font-weight: bold;
          margin: 0 auto;
          line-height: 34px;
        }
        .wx-info {
          p {
            padding-left: 10px;
            font-size: 12px;
            text-align: left;
            margin: 0;
            line-height: 20px;
          }
        }
      }
      .order-board-box {
        position: absolute;
        z-index: 999;
        right: -21px;
        top: 60px;
      }
    }

    .main-inner {
      background: @navbar-bg;
      height: 100%;
    }
    .nav-right .dialog-footer .el-button {
      vertical-align: middle;
      width: auto;
      padding: 10px;
    }
  }
}

.menu-content {
  margin: 0;
  padding: 0;
  display: inline-block;
  overflow: hidden;
  height: 100%;
  line-height: 60px;
  li {
    border: 0;
    padding: 0 8px;
    display: block;
    float: left;
    cursor: pointer;
    color: #ffffff;
    background: @navbar-bg;
  }
  li:hover {
    color: @color-light-blue;
  }
}
.more-shop-order-dialog {
  line-height: normal;
}
.more-shop-order {
  text-indent: 26px;
  p {
    font-size: 16px;
    line-height: 30px;
    padding: 20px 0;
  }
  em {
    color: red;
    font-weight: bold;
  }
  span {
    font-size: 12px;
    line-height: 24px;
    color: #666666;
  }
}

/* 未登陆头部导航样式 */
.nav-not-login {
  padding: 11px 40px 11px 0;
}

.nav-menu-popup {
  color: blue !important;
  min-width: 130px;
}

.syncProductToolTip {
  cursor: pointer;
}

.manageShops {
  color: white;
  transition: all 0.3s;
  padding: 0 8px;
  align-items: center;
  display: flex;
  cursor: pointer;
  height: 100%;
  span {
    font-size: 12px;
    padding-top: 2px;
  }
  &:hover {
    background: #409eff;
    color: #ffffff;
  }
}
.syncProduct {
  color: white;
  transition: all 0.3s;
  padding: 0 8px;
  align-items: center;
  display: flex;
  height: 100%;
  span {
    font-size: 12px;
    padding-top: 2px;
  }
  &:hover {
    background: #409eff;
    color: #ffffff;
  }
}
</style>
