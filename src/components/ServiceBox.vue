<template lang="html">
  <div class="service-box " ref="main" :style="{top: serviceTop + 'px',background: '#fff' }">
    <div class="service-area">
      <div class="close-btn">
        <img @click="closeService" src="@/assets/icon/close.png">
      </div>
      <div class="service-wechat" style="padding-top: 0">
        <!--非工作时间隐藏微信-->
        <div style="font-size: 16px; text-align: center; margin-top: -20px"> 加入售后群，帮您解决问题 </div>
        <div style="font-size: 12px; color: #999; padding: 10px 0 0; text-align: center"> 如何入群：微信扫码 -> 添加为好友 -> 拉您入群 </div>
        <div class="wechat-box">
          <!--非工作时间隐藏微信-->
          <div class="wechat-img">
            <img src="@/assets/images/wxpic.jpg">
          </div>
          <div style="font-size: 12px; color: #999; text-align: center">客服在线时间10:00—18:30</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      serviceTop: 0
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    // this.serviceTop = (this.isShowWechat && !this.isWorkTime) ? -232 : -78  隐藏高度判断
  },
  methods: {
    closeService () {
      this.$emit('serviceHandle')
    }
  }
}
</script>

<style lang="less" scoped>
.service-box {
  box-shadow: 0 4px 14px 0 rgba(0, 0, 0, 0.05);
  position: absolute;
  right: 70px;
  top: -280px;
  z-index: 99;
  .service-area {
    width: 270px;
    .service-pdd {
      padding: 10px;
      background: #3fa0ff;
      box-shadow: inset 0 1px 7px 0 #2890e1;
      border-radius: 4px;
      border-radius: 0px;
      .service-title {
        color: #ffffff;
        font-size: 14px;
        img {
          width: 20px;
        }
        span {
          color: #ffffff;
        }
      }
      .service-time {
        color: #ffffff;
      }
    }
    .service-wechat {
      padding: 20px 4px 0;
      img {
        width: 20px;
      }
      .service-title {
        font-size: 14px;
        color: #ffffff;
        line-height: 21px;
        background: #3fa0ff;
        padding: 10px;
      }
      .wechat-box {
        display: block;
        padding-top: 0;
        .wechat-img {
          padding: 0;
          width: 200px;
          margin: 0 auto;
          img {
            width: 100%;
          }
        }
        .question-area {
          padding-top: 24px;
          h4 {
            font-weight: normal;
            margin-bottom: 10px;
          }
          p {
            padding-bottom: 4px;
            a {
              color: #999999;
            }
          }
          .see-more {
            padding-top: 18px;
          }
        }
      }
    }
  }
  .close-btn {
    text-align: right;
    img {
      cursor: pointer;
      width: 24px;
      height: auto;
      padding: 0 0 8px;
      position: relative;
      right: -4px;
    }
  }
}
</style>
