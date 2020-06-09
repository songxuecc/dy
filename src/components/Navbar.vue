<template lang="html">
    <div class="navbar" id="navBar">
        <div class="navbar-content">
            <div class="nav-title">抖音小店</div>
            <div class="nav-right">
              <el-menu v-if="phone" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="1">添加到收藏</el-menu-item>
                    <el-submenu index="2" popper-class="nav-menu-popup">
                        <template slot="title">{{ phone }}</template>
                        <el-menu-item index="2-1">退出</el-menu-item>
                    </el-submenu>
                </el-menu>
            </div>
        </div>
      <el-dialog title="绑定店铺" :visible.sync="isShowBind">
        <el-form :model="form">
          <el-form-item label="Appkey" :label-width="formLabelWidth">
            <el-input v-model="form.app_key" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Appsercet" :label-width="formLabelWidth">
            <el-input v-model="form.app_secret" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
<!--          <el-button @click="dialogFormVisible = false">取 消</el-button>-->
          <el-button type="primary" @click="subBindApp">确 定</el-button>
        </div>
      </el-dialog>
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
      phone: 'getPhone',
      name: 'getName',
      mallName: 'getMallName',
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
      'requestUserInfo',
      'requestBindApp'
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
      let host = encodeURI(window.location.protocol + '//' + window.location.host)
      let state = {}
      if (process.env.BUILD_ENV !== 'prod') {
        state['host'] = host
      }
      let shareId = this.$route.query.share_id
      if (shareId) {
        state['share_id'] = shareId
      }
      window.location.href = 'https://mms.pinduoduo.com/open.html?state=' + JSON.stringify(state) + '&response_type=code&client_id=eb864d87975a4716878287d2855c8d55&redirect_uri=https://optimize.huhuguanjia.com/authorize'
    },
    onLogout () {
      this.logout()
      location.reload()
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
      let title = '虎虎抖音小店'
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
    },
    createShortcut () {
      let url = 'https://optimize.huhuguanjia.com/'
      let name = '虎虎抖音小店'

      try {
        if (window.ActiveXObject || 'ActiveXObject' in window) {
          let wshShell = new window.ActiveXObject('WScript.Shell')
          let urlLink = wshShell.CreateShortcut(wshShell.SpecialFolders('Desktop') + '\\' + name + '.url')
          urlLink.TargetPath = url
          urlLink.Save()
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          let text = '[InternetShortcut]\nURL=' + url
          let blob = new Blob([text], { type: 'text/plain' })
          if (window.navigator && window.navigator.msSaveOrOpenBlob) { // for IE
            window.navigator.msSaveOrOpenBlob(blob, name + '.url')
          } else {
            let anchor = document.createElement('a')
            document.body.appendChild(anchor)
            anchor.download = name + '.url'
            anchor.href = (window.webkitURL || window.URL).createObjectURL(blob)
            anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':')
            anchor.click()
            document.body.removeChild(anchor)
            anchor.remove()
          }
        }
      } catch (e) {
        alert('当前IE安全级别不允许操作！')
      }
    },
    subBindApp () {
      let params = {
        'app_key': this.form.app_key,
        'app_secret': this.form.app_secret
      }
      this.requestBindApp(params).then(data => {
        this.$message.success('绑定成功~')
        this.isShowBind = false
      }).catch(err => {
        this.message = '用户信息抓取失败'
        this.$message.error(err.message)
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/navbar.less';
</style>
