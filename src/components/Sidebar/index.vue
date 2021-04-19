<template lang="html">
  <div style="background:#ffffff; padding: 20px 0;min-height:100%;box-sizing:border-box;z-index: 1;position: relative;">
    <el-row class="tac">
      <div class="sideBar">
        <el-menu :default-active='$route.path' router @select="handleSelect" :default-openeds="['1', '2', '3']"
        @close="handleClose"
        @open="handleOpen">
          <el-submenu index="1">
            <template slot="title">
              <hh-icon type="iconfuzhishangpin" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>搬家上货</span>
            </template>
            <el-menu-item index="/migrate/startMigrate" :disabled="!isAuth()">
              <span slot="title">开始复制</span>
            </el-menu-item>
            <el-menu-item index="/migrate/productList" :disabled="!isAuth()" >
              <span slot="title">搬家列表</span>
            </el-menu-item>
            <el-menu-item index="/migrate/migrateSetting" :disabled="!isAuth()">
              <span slot="title" style="display: flex;align-items: center;">基础设置</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <hh-icon type="iconshangpinguanli" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>商品管理</span>
            </template>
            <el-menu-item index="/productsManagement/allProducts" :disabled="!isAuth()">
              <span slot="title">全部商品</span>
            </el-menu-item>
            <el-menu-item index="/productsManagement/batchEdit/title" :disabled="!isAuth()">
              <span slot="title" style="display: flex;align-items: center;">批量处理</span>
            </el-menu-item>
            <el-menu-item index="/productsManagement/skuImport" :disabled="!isAuth()">
              <span slot="title">sku导入修改</span>
            </el-menu-item>
           <el-menu-item index="/shopDecorate/poster/dg/list" :disabled="!isAuth()">
             <span slot="title">批量新增详情</span>
           </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <hh-icon type="icongengduogongneng" style="font-size:14px; padding-left: 28px;margin-right:4px" />
              <span>更多功能</span>
            </template>
            <el-menu-item index="" @click="openPdd" >
              <span slot="title">虎虎搬家（拼多多）</span>
            </el-menu-item>
            <el-menu-item index="/customerSetting/meizhe">
              <span slot="title">短信水印</span>
            </el-menu-item>
            <el-menu-item index="/customerSetting/woda">
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
import NewFeatureOnlineTip from '@/components/NewFeatureOnlineTip'

export default {
  data () {
    return {
      currentActiveSubMenu: ['1', '2', '3']
    }
  },
  inject: ['reload'],
  components: {
    NewFeatureOnlineTip
  },
  created () {
    setTimeout(() => {
      this.$emit('open', this.currentActiveSubMenu)
    }, 300)
  },
  methods: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc'
    }),
    handleSelect (key, keyPath) {
      if (key === '/migrate/productList') {
        this.reload()
      }
    },
    openHelp () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')
    },
    openPdd () {
      window.open('https://pdd.huhuguanjia.com/?from=douyin')
    },
    handleOpen (index) {
      setTimeout(() => {
        if (!this.currentActiveSubMenu.includes(index)) {
          this.currentActiveSubMenu.push(index)
        }
        this.$emit('open', this.currentActiveSubMenu)
      }, 300)
    },
    handleClose (index) {
      if (this.currentActiveSubMenu.includes(index)) {
        this.currentActiveSubMenu = this.currentActiveSubMenu.filter(item => item !== index)
      }
      console.log(this.currentActiveSubMenu, 'this.currentActiveSubMenu')
      this.$emit('open', this.currentActiveSubMenu)
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
