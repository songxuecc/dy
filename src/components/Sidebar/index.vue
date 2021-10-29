<template lang="html">
  <div style="background:#ffffff; padding: 10px 0;min-height:100%;box-sizing:border-box;z-index: 1;position: relative;">
    <el-row class="tac">
      <div class="sideBar">
        <!-- 新旧首页 灰度 -->
        <router-link
            :to="{name: 'HomePage'}"
            custom
            v-slot="{ href, route, isActive, isExactActive }"
            v-if="isAuth()"
          >
            <div :class="[isExactActive && 'homePage-active',isActive && 'homePage-active']" class="homePage " @click="gotoHomePage">
              <hh-icon type="iconshouyeweixuanzhong" style="font-size:16px; margin-right:4px" />
              <span  >首页</span>
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
              <div slot="title" class="flex align-c">
                <hh-icon type="iconkaishifuzhixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">开始复制</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/productList" :disabled="!isAuth()" >
              <div slot="title" class="flex align-c">
                <hh-icon type="iconbanjialiebiaoxuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">搬家列表</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/migrateSetting" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="iconjibenshezhixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">基本设置</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/migrate/productionCollection" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="iconshangpincaijixuanzhong1" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">商品采集</span>
              </div>
            </el-menu-item>

          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <div class="" style="padding-left:40px">商品管理</div>
            </template>
            <el-menu-item index="/productsManagement/allProducts" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="iconquanbushangpinxuanzhong1" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">全部商品</span>
              </div>
            </el-menu-item>

            <el-menu-item index="/productsManagement/batchEdit" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="iconpiliangchulixuanzhong2" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">批量处理<NewFeatureTips type="批量处理新版本-售卖价"/></span>
              </div>
            </el-menu-item>
            <el-menu-item index="/productsManagement/skuImport" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="icondaorubiaogexiugaixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">导入表格修改</span>
              </div>
            </el-menu-item>
            <el-menu-item index="/productsManagement/productExports" :disabled="!isAuth()">
              <div slot="title" class="flex align-c">
                <hh-icon type="icondaochushangpinxuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">导出商品<NewFeatureTips type="导出商品"/></span>
              </div>
            </el-menu-item>
           <!-- <el-menu-item index="/shopDecorate/poster/dg/list" :disabled="!isAuth()">
             <span slot="title">批量新增详情</span>
           </el-menu-item> -->
           <el-menu-item index="/productsManagement/productsSync" :disabled="!isAuth()">
             <div slot="title" class="flex align-c">
                <hh-icon type="iconshangpinyuantongbuweixuanzhong1" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">商品源同步</span>
              </div>
           </el-menu-item>
           <el-menu-item index="/productsManagement/combination" :disabled="!isAuth()">
             <div slot="title" class="flex align-c">
                <hh-icon type="iconzuheshangpinxuanzhong1" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="">组合商品</span>
              </div>
           </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
             <template slot="title">
              <div class="" style="padding-left:40px">更多功能</div>
            </template>
            <el-menu-item index="" @click="openPdd" >
              <div slot="title" class="flex align-c">
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
              <div slot="title" class="flex align-c">
                <hh-icon type="iconkaidianbibeigongjuweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="relative">美折·短信CRM
                  <span  class="badge bold">送一年</span>
                </span>
              </div>
            </el-menu-item>
            <el-menu-item index="" @click="openMeiZheSHouhou">
              <div slot="title" class="flex align-c">
                <hh-icon type="iconkaidianbibeigongjuweixuanzhong" style="font-size:16px; margin-right:4px"></hh-icon>
                <span class="relative">售后管家
                  <span  class="badge2 bold">提效10倍</span>
                </span>
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
        // this.reload()
      }
    },
    openHelp () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')
    },
    openPdd () {
      window.open('https://pdd.huhuguanjia.com/?from=douyin')
    },
    openMeiZhe () {
      window.open('https://dx5.cn/45Uosn')
    },
    openMeiZheSHouhou () {
      window.open('https://dx5.cn/45TC4j')
    },
    gotoHomePage () {
      if (!this.isAuth()) return false
      this.$router.push({
        name: 'HomePage'
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
    },
    ...mapGetters({
      userId: 'getUserId'
    })
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
      color: #333333;
      text-decoration: underline;
    }
    &:hover {
      color: #333333;
      text-decoration: underline;
    }
  }

  .homePage-active {
    color: #3277FF;
  }

 .badge{
    position:absolute;
    right:-28px;
    top:0px;
    font-size:12px;
    transform:scale(0.7);
    background:#dc4041;
    border-radius:5px;
    height:20px;
    min-width:20px;
    box-sizing:border-box;
    line-height:16px;
    padding:2px 4px !important;
    color:#fff;
    text-align:center;
  }
  .badge2{
    position:absolute;
    right:-40px;
    top:0px;
    font-size:12px;
    transform:scale(0.7);
    background:#dc4041;
    border-radius:5px;
    height:20px;
    min-width:20px;
    box-sizing:border-box;
    line-height:16px;
    padding:2px 4px !important;
    color:#fff;
    text-align:center;
  }
</style>
