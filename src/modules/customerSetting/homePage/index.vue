<!-- 我的页面 -->
<template>
  <div class='homePage'>
      <div class="left">
          <!-- 常用工具 -->
          <NormalTools />
          <!-- 搬家上货 & 搬家辅助功能 -->
          <MigrateProducts />
          <!-- 商品管理 -->
          <ProductManagement />
      </div>
      <div class="right">
          <!-- 点击续订 -->
          <Renew />
          <!-- 消息通知 -->
          <Notify />
          <!-- 联系客服 -->
          <!-- 软件教程 -->
          <!-- banner -->
      </div>
  </div>
</template>

<script>
// import allProduct from './images/allProduct.png'
// import baseSettings from './images/baseSettings.png'
// import batchEdit from './images/batchEdit.png'
// import bindCopy from './images/bindCopy.png'
// import excelCopy from './images/excelCopy.png'
// import exportProduct from './images/exportProduct.png'
// import ImportProduct from './images/ImportProduct.png'
// import migrateList from './images/migrateList.png'
// import productCollection from './images/productCollection.png'
// import prosuctsCopy from './images/prosuctsCopy.png'
// import seniorVersion from './images/seniorVersion.png'
// import shopsCopy from './images/shopsCopy.png'
// import trialVersion from './images/trialVersion.png'
// import wechat from './images/wechat.png'

import NormalTools from './components/NormalTools'
import MigrateProducts from './components/MigrateProducts'
import ProductManagement from './components/ProductManagement'
import Renew from './components/Renew'
import Notify from './components/Notify'

export default {
  data () {
    return {
      // allProduct,
      // baseSettings,
      // batchEdit,
      // bindCopy,
      // excelCopy,
      // exportProduct,
      // ImportProduct,
      // migrateList,
      // productCollection,
      // prosuctsCopy,
      // seniorVersion,
      // shopsCopy,
      // trialVersion,
      // wechat
    }
  },
  components: {
    NormalTools,
    MigrateProducts,
    ProductManagement,
    Renew,
    Notify

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
  padding: 0  0 0 20px;
  width: 100%;
  box-sizing: border-box;
  padding-bottom: 30px;
    /deep/ .el-divider {
      margin:0;
    }
    background: #fff;
    display: flex;
    .left {
      margin-right: 16px;
      width: 60%;
    }
    .right {
      width: 40%;
    }

}
</style>
