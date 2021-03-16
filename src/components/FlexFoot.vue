<template lang="html">
  <div class="float-nav">
    <div class="float-button" @click="goToHelp" @mouseover="changeFlexFootIndex(1)" @mouseout="changeFlexFootIndex(0)">
      <hh-icon :type="flexFootIndex === 1 ? 'iconjiaochengbarhover' : 'iconjiaochengbar'" style="font-size:28px;" />
      <div class="column-name">教程</div>
    </div>
    <div class="float-button wechat-button" @mouseover="changeFlexFootIndex(3)" @mouseout="changeFlexFootIndex(0)">
      <div class="service-content" v-if="isServiceBoxShow" ref="ServiceBox">
        <service-box @serviceHandle="closeService"></service-box>
      </div>
      <hh-icon @click="handleClick" :type="flexFootIndex === 3 ? 'iconkefuweixinbarhover' : 'iconkefuweixinbar'" style="font-size:28px;" />
      <div class="column-name" @click="handleClick">客服</div>
    </div>
    <div class="float-button" @click="goToComments" @mouseover="changeFlexFootIndex(2)" @mouseout="changeFlexFootIndex(0)">
      <hh-icon :type="flexFootIndex === 2 ? 'iconyijianbarhover' : 'iconyijianbar'" style="font-size:28px;" />
      <div class="column-name">意见</div>
    </div>
    <div class="float-button" @click="openNotificationBox" @mouseover="changeFlexFootIndex(4)" @mouseout="changeFlexFootIndex(0)">
      <span v-if="unRead > 0" class="notice-icon" @click="openNotificationBox">{{unRead}}</span>
      <hh-icon :type="flexFootIndex === 4 ? 'icontongzhibarhover' : 'icontongzhibar'" style="font-size:28px;" />
      <div class="column-name">通知</div>
    </div>
    <div class="float-button collect-button" @click="addToFavorite" @mouseover="changeFlexFootIndex(5)" @mouseout="changeFlexFootIndex(0)">
      <hh-icon :type="flexFootIndex === 5 ? 'iconshoucangbarhover' : 'iconshoucangbar'" style="font-size:28px;" />
      <div class="column-name">收藏</div>
    </div>
    <div class="float-button nav-go-top" @click="backToTop">
        <hh-icon type="iconshanglajiantou" style="font-size:17px;" />
      <!-- <el-backtop target=".page-component__scroll" :visibility-height="0">
      </el-backtop> -->
    </div>
    <hh-dialog width="600" :visible.sync="dialogNotificationVisible" :isClose="false" :isHeadLine="false" :zIndex="3000" @closeDialog="closeDialog">
      <template v-slot:content>
        <div class="mail-notice-box">
          <notification-list-view ref="notificationListView" @closeDialog="closeDialog"
          ></notification-list-view>
        </div>
      </template>
    </hh-dialog>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import ServiceBox from './ServiceBox.vue'
import notificationListView from './NotificationListView.vue'
import common from '@/common/common.js'
export default {
  data () {
    return {
      isServiceBoxShow: false,
      dialogNotificationVisible: false,
      flexFootIndex: 0
    }
  },
  components: {
    ServiceBox,
    notificationListView
  },
  computed: {
    ...mapGetters({
      unRead: 'getUnRead'
    })
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
    openNotificationBox () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表', '点击', '打开通知列表'])
      }
      this.dialogNotificationVisible = true
      this.$nextTick(function () {
        this.$refs.notificationListView.init()
      })
    },
    backToTop () {
      const el = document.querySelector('.page-component__scroll')
      el.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    closeService () {
      this.isServiceBoxShow = false
    },
    goToHelp () {
      window.open(common.HELP_LINK)
    },
    goToComments () {
      window.open(common.COMMENTS_LINK)
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
    },
    closeDialog () {
      this.dialogNotificationVisible = false
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表', '点击', '关闭通知列表'])
      }
    },
    changeFlexFootIndex (index) {
      this.flexFootIndex = parseInt(index)
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="less" scoped>

.float-button {
    padding: 4px;
    position: relative;
    .notice-icon {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      position: absolute;
      z-index: 1;
      left: 20px;
      top: 0;
      display: inline-block;
      //min-width: 16px;
      padding: 2px 4px;
      font-size: 12px;
      line-height: 1;
      color: #ffffff;
      border-radius: 8px;
      background: #E02020;
      cursor: pointer;
      transform: scale(0.8, 0.8);
    }
    /deep/ .el-button.is-circle {
      font-size: 26px;
    }
  }
  .wechat-button {
    position: relative;
    span.wechat-icon {
      display: block;
      width: 26px;
      height: 26px;
      background: url('~@/assets/icon/service-white.png') no-repeat;
      background-size: 100%;
    }
  }

.icon {
    background: #fff;
    color: #409EFF;
    height: 58px;
    padding: 4px;
    .column-name {
      color: #666666;
      height: 21px;
      padding: 5px 0;
    }
    &:hover {
      color: #fff;
      background: #409EFF;
      .column-name {
        color: #fff;
      }
    }
  }

  /* 右侧导航 */
.float-nav {
  width: 56px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .float-button {
    cursor: pointer;
    span.nav-icon {
      padding: 10px 0 0 0;
      width: 26px;
      height: 26px;
      display: block;
      margin: 0 auto;
      background-position: 0 10px;
      background-repeat: no-repeat;
    }
    .column-name {
      color: #666666;
      padding: 1px 0 8px;
    }
    .comments-icon {
      font-size: 26px;
      color: #409eff;
    }
  }
  .float-button:first-child {
    padding-top: 12px;
  }
  .nav-go-top {
    height: 20px;
    padding: 7px 0 6px;
    border-top: 4px solid @body-bg;
  }
  .nav-go-top:hover {
    background: #ffffff;
  }
  .collect-button:hover {
    background: #ffffff;
    .column-name {
      color: #666666;
    }
  }
}
</style>
