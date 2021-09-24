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
          <!-- 软件教程 -->
          <Banner />
      </div>
  </div>
</template>

<script>

import NormalTools from './components/NormalTools'
import MigrateProducts from './components/MigrateProducts'
import ProductManagement from './components/ProductManagement'
import Renew from './components/Renew'
import Notify from './components/Notify'
import Banner from './components/Banner'

export default {
  data () {
    return {
    }
  },
  components: {
    NormalTools,
    MigrateProducts,
    ProductManagement,
    Renew,
    Notify,
    Banner

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

// .pxMixin() {
//   @functions: ~`(function() {
//     var clientWidth = '(100vw - 200px) / 1079 * ';
//     function convert(size) {
//       return typeof size === 'string' ?
//         size.replace('px', '') : (size + '');
//     }
//     this.px =  function(size) {
//       return 'calc(' + clientWidth + convert(size) + ')';
//     }
//   })()`;
// }
// .pxMixin();

.homePage {
  padding: 8px  0 0 20px;
  width: 1079px;
  box-sizing: border-box;
  padding-bottom: 30px;
  margin:auto;

    /deep/ .el-divider {
      margin:0;
    }
    background: #fff;
    display: flex;
    .left {
      margin-right: 16px;
      width: 644px;
    }
    .right {
      width: 356px;
    }

}
</style>
