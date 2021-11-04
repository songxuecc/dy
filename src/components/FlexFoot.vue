<template lang="html">
  <div class="float-nav">
    <div
        :class="['float-button relative',isDragging ?'move':'']"
        @click="goToHelp"
        @mouseover="changeFlexFootIndex($event,1)"
        @mouseout="changeFlexFootIndex($event,0)">
      <div class="color-tip">教程</div>
      <div :class="['column-name text', flexFootIndex === 1 ? 'text-in' : '']">打开</div>
    </div>
    <div
        :class="['float-button wechat-button',isDragging ?'move':'']"
        v-if="flexFootVisible && isAuth"
        @mouseover="changeFlexFootIndex($event,2)"
        @mouseout="changeFlexFootIndex($event,0)">
      <div class="service-content" v-if="isServiceBoxShow" ref="ServiceBox">
        <service-box @serviceHandle="closeService"></service-box>
      </div>
      <div class="color-tip" @click="handleClick">客服</div>
      <div :class="['column-name text', flexFootIndex === 2 ? 'text-in' : '']"
      @click="handleClick">联系</div>
    </div>
    <div
        :class="['float-button',isDragging ?'move':'']"
        @click="goToComments"
        v-if="flexFootVisible"
        @mouseover="changeFlexFootIndex($event,3)"
        @mouseout="changeFlexFootIndex($event,0)">
      <div class="color-tip" @click="goToComments">意见</div>
      <div :class="['column-name text', flexFootIndex === 3 ? 'text-in' : '']">提出</div>
    </div>
    <div
        :class="['float-button collect-button',isDragging ?'move':'']"
        @click="addToFavorite"
        v-if="flexFootVisible"
      @mouseover="changeFlexFootIndex($event,5)" @mouseout="changeFlexFootIndex($event,0)">
      <div class="color-tip">收藏</div>
      <div :class="['column-name text', flexFootIndex === 5 ? 'text-in' : '']">点击</div>
    </div>
    <div
        :class="['float-button nav-go-top',isDragging ?'move':'']"
        @click="backToTop"
        @mouseover="changeFlexFootIndex($event,6)"
        @mouseout="changeFlexFootIndex($event,0)">
      <hh-icon
            type="iconshanglajiantou"
            style="font-size:18px;" />
      <div :class="['go-to-top text', flexFootIndex === 6 ? 'text-in' : '']">到顶部</div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import ServiceBox from './ServiceBox.vue'
import common from '@/common/common.js'
export default {
  props: {
    flexFootVisible: Boolean
  },
  data () {
    return {
      isServiceBoxShow: false,
      dialogNotificationVisible: false,
      flexFootIndex: 0,
      isDragging: false
    }
  },
  components: {
    ServiceBox
  },
  computed: {
    ...mapGetters({
      unRead: 'getUnRead',
      isAuth: 'getIsAuth'
    })
  },
  methods: {
    changeIsDragging () {
      this.isDragging = !this.isDragging
    },
    handleClick (event) {
      // 阻止冒泡
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      // this.isServiceBoxShow = true
      if (!this.isAuth) return this.$message.error('您未购买')
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '右下角微信',
          '点击',
          '展示微信公众号'
        ])
      }
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
      if (this.$refs.ServiceBox && !this.$refs.ServiceBox.contains(e.target)) {
        // 点击除弹出层外的空白区域
        this.hide()
      }
    },
    openNotificationBox (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '通知列表', '点击', '打开通知列表'])
      }
      this.$emit('toggleDialogNotificationVisible', true)
    },
    backToTop (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      const el = document.querySelector('.page-component__scroll')
      el.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    },
    closeService (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      this.isServiceBoxShow = false
    },
    goToHelp (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      window.open(common.HELP_LINK)
    },
    goToComments (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      window.open(common.COMMENTS_LINK)
    },
    addToFavorite (event) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '导航栏', '点击', '添加到收藏夹'])
      }
      let strShortcut =
        navigator.userAgent.toLowerCase().indexOf('mac') !== -1
          ? 'Command+D'
          : 'Ctrl+D'
      let ua = navigator.userAgent.toLowerCase()
      if (ua.indexOf('360se') > -1) {
        this.$alert(
          `由于360浏览器功能限制，请按 ${strShortcut} 手动收藏!`,
          '温馨提示',
          {
            confirmButtonText: '确定'
          }
        )
      } else if (ua.indexOf('msie 8') > -1) {
        window.external.AddToFavoritesBar(
          this.projectConfig.url,
          this.projectConfig.title
        ) // IE8
      } else if (document.all) {
        try {
          window.external.addFavorite(
            this.projectConfig.url,
            this.projectConfig.title
          )
        } catch (e) {
          this.$alert(
            `您的浏览器不支持,请按 ${strShortcut} 手动收藏!`,
            '温馨提示',
            {
              confirmButtonText: '确定'
            }
          )
        }
      } else if (window.sidebar) {
        try {
          window.sidebar.addPanel(
            this.projectConfig.title,
            this.projectConfig.url,
            ''
          )
        } catch (e) {
          this.$alert(
            `您的浏览器不支持,请按 ${strShortcut} 手动收藏!`,
            '温馨提示',
            {
              confirmButtonText: '确定'
            }
          )
        }
      } else {
        this.$alert(
          `您的浏览器不支持,请按 ${strShortcut} 手动收藏!`,
          '温馨提示',
          {
            confirmButtonText: '确定'
          }
        )
      }
    },

    changeFlexFootIndex (event, index) {
      event || (event = window.event)
      event.stopPropagation
        ? event.stopPropagation()
        : (event.cancelBubble = true)
      event.preventDefault()
      if (this.isDragging) {
        return false
      }
      this.flexFootIndex = parseInt(index)
    }
  },
  beforeDestroy () {
    this.hide()
  }
}
</script>
<style lang="less" scoped>
/* 右侧导航 */
.float-nav {
  width: 50px;
  text-align: center;
  background: #ffffff;
  box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  .float-button {
    padding: 4px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-bottom: solid 1px #ebeaea;
    cursor: pointer;

    &:hover {
      .color-tip {
          color: #3277FF;
        }
    }
    .notice-icon {
      font-family: 'Avenir', Helvetica, Arial, sans-serif;
      position: absolute;
      z-index: 1;
      left: 20px;
      top: 0;
      display: inline-block;
      padding: 2px 4px;
      font-size: 12px;
      line-height: 1;
      color: #ffffff;
      border-radius: 8px;
      background: #e02020;
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
  .nav-go-top {
    height: 24px;
    padding: 7px 0 6px;
    border-top: 4px solid @body-bg;
  }
  .nav-go-top:hover {
    background: #ffffff;
  }

  .collect-button:hover {
    background: #ffffff;
  }
  .text {
    position: absolute;
    font-size: 12px;
    top: 0;
    left: 0;
    height: 40px;
    width: 0;
    background: #1d8fff;
    line-height: 40px;
    text-align: center;
    color: #fff;
    border-radius: 4px 0 0 4px;
    transition: all 0.2s;
    opacity: 0;
    box-shadow: 0 4px 10px 0 rgba(0, 0, 0, 0.1);
  }
  .go-to-top {
    height: 37px;
    line-height: 37px;
  }
  .text-in {
    animation: fadeLeftIn ease 0.2s;
    width: 48px;
    opacity: 1;
    left: -48px;
  }

  @keyframes fadeLeftIn {
    0% {
      opacity: 0;
      left: 0;
    }
    100% {
      opacity: 1;
      left: -48px;
    }
  }
  .move {
    cursor: move !important;
  }

  .color-tip {
    color: #6A6E80;
  }
}
</style>
