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
              <div class="manageShops" @click="manageShops"> 多店铺管理 </div>
               <el-menu  class="el-menu-demo" mode="horizontal" @select="handleSelect">

                <!-- <el-submenu index="3" popper-class="nav-menu-popup">
                  <template slot="title">{{ mallName ? mallName : name }}</template>
                  <el-menu-item index="3-1">订购记录</el-menu-item>
                  <el-menu-item index="3-2">退出</el-menu-item>
                </el-submenu> -->
              </el-menu>
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
      ]
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
      const bindShopList = (this.bindChildShopList || []).map((bindShop, index) => {
        return [
          `${bindShop.user_id}-${index}`, {
            handle: () => {
              if (window._hmt) window._hmt.push(['_trackEvent', '导航栏', '点击', '切换店铺'])
              // this.onChangeShop(bindShop.user_id) 暂时还没onChangeShop
            },
            comment: '切换绑定店铺'
          }
        ]
      })
      const selectMap = new Map([
        ['1', {
          handle: () => commonUtils.addToFavorite(),
          comment: '添加到收藏'
        }],
        ['2-1', {
          handle: () => this.onLogout(),
          comment: '退出'
        }],
        ['3', {
          handle: () => this.$router.push({path: '/meizhe'}),
          comment: '短信水印'
        }],
        ['4', {
          handle: () => this.$router.push({path: '/woda'}),
          comment: '打单发货'
        }],
        ['1-0', {
          handle: () => this.$router.push({path: '/woda'}),
          comment: '返回主账号'
        }],
        ['1-2', {
          handle: () => {
            if (window._hmt) window._hmt.push(['_trackEvent', '导航栏', '点击', '店铺绑定'])
            this.$router.push({ path: '/setting/shopsBand' })
          },
          comment: '绑定店铺'
        }],
        ...bindShopList
      ])
      const value = selectMap.get(key)
      if (value && value.handle) value.handle()
    },
    manageShops () {
      if (window._hmt) window._hmt.push(['_trackEvent', '导航栏', '点击', '店铺绑定'])
      this.$router.push({ path: '/setting/shopsBand' })
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
<style >
/* .el-menu--collapse .el-menu .el-submenu, .el-menu--popup {
    min-width: 100px !important;
  } */
</style>
<style lang="less" scoped>
    @import '~@/assets/css/navbar.less';
    .manageShops {
      line-height: 80px;
      color: white;
      margin-right:10px
    }
    .manageShops:hover {
      color:#409EFF;
    }
</style>
