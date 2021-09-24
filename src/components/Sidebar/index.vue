<template lang="html">
  <div style="background:#ffffff; padding: 10px 0;min-height:100%;box-sizing:border-box;z-index: 1;position: relative;">
    <el-row class="tac">
      <div class="sideBar">

        <router-link  :to="{name: 'homePage'}" active-class="homePage-active">
          <div class="homePage " >
            <hh-icon type="iconshouyeweixuanzhong" style="font-size:16px; margin-right:4px" />
            <span >首页</span>
          </div>
        </router-link>

        <el-menu
          :default-active='$route.path'
          router
          @select="handleSelect"
          :default-openeds="['1', '2', '3']"
          @close="handleClose"
          @open="handleOpen">
          <el-submenu index="1">

            <template slot="title">
              <div class="" style="padding-left:40px">搬家上货</div>
            </template>

            <el-menu-item index="/migrate/startMigrate" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="iconkaishifuzhixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">开始复制</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/productList" :disabled="!isAuth()" >
              <div slot="title">
                <hh-icon type="iconbanjialiebiaoxuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">搬家列表</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/migrateSetting" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="iconjibenshezhixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">基本设置</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/productionCollection" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="iconshangpincaijiweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">商品采集</span>
              </div>
            </el-menu-item>

          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <div class="" style="padding-left:40px">商品管理</div>
            </template>
            <el-menu-item index="/productsManagement/allProducts" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="iconquanbushangpinweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">全部商品</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/productsManagement/batchEdit" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="iconpiliangchuliweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">批量处理<NewFeatureTips type="批量处理新版本-售卖价"/></span>
              </div>
            </el-menu-item>
            <el-menu-item index="/productsManagement/skuImport" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="icondaorubiaogexiugaixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">导入表格修改</span>
              </div>
            </el-menu-item>
            <el-menu-item index="/productsManagement/productExports" :disabled="!isAuth()">
              <div slot="title">
                <hh-icon type="icondaochushangpinxuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">导出商品<NewFeatureTips type="导出商品"/></span>
              </div>
            </el-menu-item>
           <!-- <el-menu-item index="/shopDecorate/poster/dg/list" :disabled="!isAuth()">
             <span slot="title">批量新增详情</span>
           </el-menu-item> -->
          </el-submenu>
          <el-submenu index="3">
             <template slot="title">
              <div class="" style="padding-left:40px">更多功能</div>
            </template>
            <el-menu-item index="" @click="openPdd" >
              <div slot="title">
                <hh-icon type="iconhuhubanjiaweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">虎虎搬家（拼多多）</span>
              </div>
            </el-menu-item>
<!--            <el-menu-item index="/customerSetting/meizhe">-->
<!--              <span slot="title">短信水印</span>-->
<!--            </el-menu-item>-->
<!--            <el-menu-item index="/customerSetting/woda">-->
<!--              <span slot="title">打单发货</span>-->
<!--            </el-menu-item>-->
            <el-menu-item index="" @click="openMeiZhe">
              <div slot="title">
                <hh-icon type="iconkaidianbibeigongjuweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">开店必备工具</span>
              </div>
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
      currentActiveSubMenu: ['1', '2', '3', '4']
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
    openMeiZhe () {
      window.open('https://www.meideng.net/product?from=dyhhbjzs')
    },
    goToHomePage () {
      this.$router.push({
        name: 'homePage'
      })
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
  .homePage {
    font-family: MicrosoftYaHei;
    color: #767989;
    line-height: 50px;
    padding-left: 40px;
    display: flex;
    align-items: center;

    cursor: pointer;
    &:active {
      color: #000000;
    }
    &:hover {
      color: #333333;
    }
  }

  .homePage-active {
    .homePage {
      color: #1D8FFF;
    }
  }
</style>
