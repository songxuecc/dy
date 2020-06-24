<template lang="html">
    <div class="navbar" id="navBar">
        <div class="navbar-content">
            <div class="nav-title">抖音搬家助手</div>
            <div class="nav-right">
              <div v-if="!shopName">
<!--                <el-button size="small" @click="goToServiceMarket">购买</el-button>-->
                <el-button size="small" @click="onLogin">登录</el-button>
              </div>
              <el-menu v-if="shopName" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">添加到收藏</el-menu-item>
                    <el-submenu index="2" popper-class="nav-menu-popup">
                        <template slot="title">{{ shopName }}</template>
                        <el-menu-item index="2-1">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      isShowBind: false,
      form: {
        app_key: '',
        app_secret: ''
      }
    }
  },
  mounted () {
    if (this.isAuth) {
      this.getUserInfo()
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
      shopName: 'getShopName',
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc'
    })
  },
  watch: {
    isAuth (val) {
      if (val) {
        this.getUserInfo()
      }
    }
  },
  methods: {
    ...mapActions([
      'logout',
      'requestUserInfo'
    ]),
    getUserInfo () {
      this.requestUserInfo({}).then(data => {
        if (data.app_key === 0) {
          this.isShowBind = true
        }
      }).catch(err => {
        this.message = '用户信息抓取失败'
        this.$message.error(err.message)
      })
    },
    onLogin () {
      window.location.href = 'https://fxg.jinritemai.com/index.html#/ffa/open/serviceAuthorizeManage?page=1&size=10&tab='
      // this.$router.push({
      //   path: '/'
      // })
      // let shareId = this.$route.query.share_id
      // commonUtils.login(shareId)
    },
    onLogout () {
      this.logout()
      this.$router.push({
        path: '/'
      })
    },
    handleSelect (key, keyPath) {
      if (key === '1') {
        this.addToFavorite()
      } else if (key === '2-1') {
        this.onLogout()
      }
    },
    addToFavorite () {
      let url = 'https://optimize.huhuguanjia.com/'
      let title = '虎虎抖音搬家助手'
      let strShortcut = navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Command+D' : 'Ctrl+D'
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('360se') > -1) {
        alert('由于360浏览器功能限制，请按 ' + strShortcut + ' 手动收藏！')
      } else if (ua.indexOf('msie 8') > -1) {
        window.external.AddToFavoritesBar(url, title) // IE8
      } else if (document.all) {
        try {
          window.external.addFavorite(url, title)
        } catch (e) {
          alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
        }
      } else if (window.sidebar) {
        try {
          window.sidebar.addPanel(title, url, '')
        } catch (e) {
          alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
        }
      } else {
        alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
      }
    }
    // goToServiceMarket () {
    //   window.location.href = 'https://mms.pinduoduo.com/service-market/service-detail?detailId=236'
    // }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/navbar.less';
</style>
