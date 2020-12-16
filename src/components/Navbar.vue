<template lang="html">
    <div class="navbar" id="navBar">
        <div class="navbar-content">
          <div class="main-inner clearfix">
            <div class="nav-title" @click="goInfo"><img src="../assets/icon/logo.png" alt="虎虎搬家助手"><icon-svg iconClass="icon-douyin-plat" style="width:50px; height:18px; position: relative; top: -7px;"></icon-svg></div>
            <div class="nav-right">
              <!--<el-menu v-if="!shopName" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="3">短信水印</el-menu-item>
                    <el-menu-item index="4">打单发货</el-menu-item>
              </el-menu>-->
              <div class="nav-not-login" v-if="!shopName">
                <el-button type="primary" @click="goToServiceMarket">购买</el-button>
                <el-button type="primary" @click="onLogin">登录</el-button>
              </div>
              <ul v-if="shopName" class="menu-content">
                <li @click="goToOrder()">
                  <span style="vertical-align: middle;">{{subscName}} 剩 {{leftDays}} 天</span>
                  <img style="height: 28px; display: inline-block; position: relative; top: -1px; cursor: pointer" src="../assets/images/reorder.gif" />
                </li>
              </ul>
              <el-menu v-if="shopName" class="el-menu-demo" mode="horizontal" @select="handleSelect">
<!--                    <el-menu-item index="3">短信水印</el-menu-item>-->
<!--                    <el-menu-item index="4">打单发货</el-menu-item>-->
<!--                    <el-menu-item index="1">添加到收藏</el-menu-item>-->
                    <el-submenu index="2" popper-class="nav-menu-popup">
                        <template slot="title">{{ shopName }}</template>
                        <el-menu-item index="2-1">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
          </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import commonUtils from '@/common/commonUtils'
import utils from '@/common/utils'

export default {
  data () {
    return {
      form: {
        app_key: '',
        app_secret: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
      shopName: 'getShopName',
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc'
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
    }
  },
  methods: {
    ...mapActions([
      'logout',
      'requestUserInfo',
      'requestNotification'
    ]),
    async asyncUserAndNotice () { // 同步获取userInfo及notification
      try {
        await this.requestUserInfo()
        this.requestNotification()
      } catch (error) {
        console.error(error)
      }
    },
    onLogin () {
      // window.location.href = 'https://fxg.jinritemai.com/index.html#/ffa/open/serviceAuthorizeManage?page=1&size=10&tab='
      // this.$router.push({
      //   path: '/'
      // })
      // let shareId = this.$route.query.share_id
      commonUtils.login(null)
    },
    onLogout () {
      this.logout()
      this.$router.push({
        path: '/'
      })
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        commonUtils.addToFavorite()
      } else if (key === '2-1') {
        this.onLogout()
      } else if (key === '3') {
        this.$router.push({
          path: '/meizhe'
        })
      } else if (key === '4') {
        this.$router.push({
          path: '/woda'
        })
      }
    },
    goInfo () {
      this.$router.push({
        path: '/info'
      })
    },
    goToServiceMarket () {
      window.location.href = 'https://fuwu.jinritemai.com/detail?from=tab&service_id=42'
    },
    goToOrder () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '导航栏', '点击', '续费点击'])
      }
      window.location.href = 'https://fuwu.jinritemai.com/detail?from=tab&service_id=42'
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/navbar.less';
</style>
