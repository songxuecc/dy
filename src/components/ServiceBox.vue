<template lang="html">
  <div class="service-box" ref="main" :style="{top: serviceTop + 'px' }">
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
