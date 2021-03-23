<template lang="html">
  <div style="background:#ffffff; padding: 20px 0;min-height:100%;box-sizing:border-box">
    <el-row class="tac">
      <div class="sideBar">
        <el-menu :default-active='$route.path' router @select="handleSelect" :default-openeds="['1', '2', '3']" >
          <el-submenu index="1">
            <template slot="title">
              <hh-icon type="iconfuzhishangpin" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>搬家上货</span>
            </template>
            <el-menu-item index="/migrate" :disabled="!isAuth()">
              <span slot="title">开始复制</span>
            </el-menu-item>
            <el-menu-item index="/productList" :disabled="!isAuth()">
              <span slot="title">搬家列表</span>
            </el-menu-item>
            <el-menu-item index="/migrateSetting" :disabled="!isAuth()">
              <span slot="title" style="display: flex;align-items: center;">搬家设置<NewFeatureTips type="搬家设置图片" /></span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <hh-icon type="iconshangpinguanli" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>商品管理</span>
            </template>
            <el-menu-item index="/dyProductList" :disabled="!isAuth()">
              <span slot="title">全部商品</span>
            </el-menu-item>
            <el-menu-item index="/batchEdit/title" :disabled="!isAuth()">
              <span slot="title" style="display: flex;align-items: center;">批量处理</span>
            </el-menu-item>
            <el-menu-item index="/SkuImport" :disabled="!isAuth()">
              <span slot="title">sku导入修改<NewFeatureTips type="sku导入修改图片" /></span>
            </el-menu-item>
<!--            <el-menu-item index="/poster/dg/list" :disabled="!isAuth()">-->
<!--              <span slot="title">详情海报</span>-->
<!--            </el-menu-item>-->
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <hh-icon type="icongengduogongneng" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>更多功能</span>
            </template>
            <el-menu-item @click="openPdd">
              <span slot="title">虎虎搬家（拼多多）</span>
            </el-menu-item>
            <el-menu-item index="/meizhe">
              <span slot="title">短信水印</span>
            </el-menu-item>
            <el-menu-item index="/woda">
              <span slot="title">打单发货</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
    </el-row>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import common from '@/common/common.js'

export default {
  data () {
    return {}
  },
  inject: ['reload'],
  methods: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc'
    }),
    handleSelect (key, keyPath) {
      if (key === '/productList') {
        this.reload()
      }
    },
    openHelp () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')
    },
    openPdd () {
      window.open('https://pdd.huhuguanjia.com/?from=douyin')
    }
  },
  computed: {
    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~./index.less';

</style>
