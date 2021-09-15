<!-- 我的页面 -->
<template>
  <div class='homePage'>
      <div class="left">
          <!-- 常用工具 -->
          <div>
              <div class="title"><hh-icon type="iconchangyonggongju"></hh-icon> 常用工具</div>

              <div>
                  <div>
                      <hh-icon type="iconchangyonggongju"></hh-icon>
                      <span>多商品复制</span>
                  </div>
              </div>
          </div>
          <!-- 搬家上货 & 搬家辅助功能 -->
          <!-- 商品管理 -->
      </div>
      <div class="right">
          <!-- 点击续订 -->
          <!-- 消息通知 -->
          <!-- 联系客服 -->
          <!-- 软件教程 -->
          <!-- banner -->
      </div>
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
  methods: {
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
.homePage {
    background: #fff;
    display: flex;
}
</style>
