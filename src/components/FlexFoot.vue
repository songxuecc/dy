<template lang="html">
  <div class="float-nav">
    <div class="float-button" @click="goToHelp">
      <span class="nav-icon nav-help"></span>
      <div class="column-name">教程</div>
    </div>
    <div class="float-button wechat-button">
      <div class="service-content" v-if="isServiceBoxShow" ref="ServiceBox">
        <service-box @serviceHandle="closeService"></service-box>
      </div>
      <span class="nav-icon nav-service" @click="handleClick"></span>
      <div class="column-name" @click="handleClick">客服</div>
    </div>
    <div class="float-button" v-if="false">
      <span class="notice-icon"></span>
      <span class="nav-icon nav-notice"></span>
      <div class="column-name">通知</div>
    </div>
    <div class="float-button collect-button" @click="addToFavorite">
<!--      <el-button type="primary" icon="el-icon-top" circle ></el-button>-->
      <span class="nav-icon nav-collect"></span>
      <div class="column-name">收藏</div>
    </div>
    <div class="float-button nav-go-top" @click="backToTop">
      <span class="nav-icon nav-gotop"></span>
    </div>
  </div>
</template>
<script>
import ServiceBox from './ServiceBox.vue'
import common from '@/common/common.js'
export default {
  data () {
    return {
      isServiceBoxShow: false
    }
  },
  components: {
    ServiceBox
  },
  methods: {
    handleClick (event) {
      // this.isServiceBoxShow = true
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '右下角微信', '点击', '展示微信公众号'])
      }
      // 阻止冒泡
      event || (event = window.event)
      event.stopPropagation ? event.stopPropagation() : (event.cancelBubble = true)
      this.isServiceBoxShow ? this.hide() : this.show()
    },
    show () {
      this.isServiceBoxShow = true
      document.addEventListener('click', this.hidePanel, false)
    },
    hide () {
      this.isServiceBoxShow = false
      document.removeEventListener('click', this.hidePanel, false)
    },
    hidePanel (e) {
      if (this.$refs.ServiceBox && !this.$refs.ServiceBox.contains(e.target)) { // 点击除弹出层外的空白区域
        this.hide()
      }
    },
    backToTop () {
      scrollTo(0, 0)
    },
    closeService () {
      this.isServiceBoxShow = false
    },
    goToHelp () {
      window.open(common.HELP_LINK)
    },
    addToFavorite () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '导航栏', '点击', '添加到收藏夹'])
      }
      let strShortcut = navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Command+D' : 'Ctrl+D'
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('360se') > -1) {
        this.$alert(`由于360浏览器功能限制，请按 ${strShortcut} 手动收藏!`, '温馨提示', {
          confirmButtonText: '确定'
        })
      } else if (ua.indexOf('msie 8') > -1) {
        window.external.AddToFavoritesBar(this.projectConfig.url, this.projectConfig.title) // IE8
      } else if (document.all) {
        try {
          window.external.addFavorite(this.projectConfig.url, this.projectConfig.title)
        } catch (e) {
          this.$alert(`您的浏览器不支持,请按 ${strShortcut} 手动收藏!`, '温馨提示', {
            confirmButtonText: '确定'
          })
        }
      } else if (window.sidebar) {
        try {
          window.sidebar.addPanel(this.projectConfig.title, this.projectConfig.url, '')
        } catch (e) {
          this.$alert(`您的浏览器不支持,请按 ${strShortcut} 手动收藏!`, '温馨提示', {
            confirmButtonText: '确定'
          })
        }
      } else {
        this.$alert(`您的浏览器不支持,请按 ${strShortcut} 手动收藏!`, '温馨提示', {
          confirmButtonText: '确定'
        })
      }
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
