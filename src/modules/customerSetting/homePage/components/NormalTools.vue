<!-- 常用工具 -->
<template>
    <div class="tools">
        <div class="title"><hh-icon type="iconchangyonggongju"></hh-icon> 常用工具</div>
        <div class="flex" style="padding-left:3px;justify-content: space-around;flex-shrink: 0;height:65px;overflow:hidden;flex-wrap:wrap" >
            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'single'}},'多商品复制')">
                <div>
                    <img :src="prosuctsCopy" alt="多商品复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">多商品复制</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'shop'}},'整店复制')">
                <div>
                    <img :src="allProduct" alt="整店复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">整店复制</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'file'}},'导入复制')">
                <div>
                    <img :src="excelCopy" alt="导入复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">导入复制</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'bindCopy'}},'多商品复制')">
                <div>
                    <img :src="bindCopy" alt="绑定复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">绑定复制</div>
            </div>

            <div class="content" @click="go({name:'ProductList'},'搬家列表')">
                <div>
                    <img :src="migrateList" alt="搬家列表">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">搬家列表</div>
            </div>

            <div class="content" @click="go({name:'MigrateSetting'},'基本设置')">
                <div>
                    <img :src="baseSettings" alt="基本设置">
                </div>
                <div class="tip">基本设置</div>
            </div>

             <div class="content" @click="go({name:'StartMigrate',params:{activeName:'single'}},'多商品复制')">
                <div>
                    <img :src="prosuctsCopy" alt="多商品复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">多商品复制1</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'shop'}},'整店复制')">
                <div>
                    <img :src="allProduct" alt="整店复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">整店复制1</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'file'}},'导入复制')">
                <div>
                    <img :src="excelCopy" alt="导入复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">导入复制1</div>
            </div>

            <div class="content" @click="go({name:'StartMigrate',params:{activeName:'bindCopy'}},'多商品复制')">
                <div>
                    <img :src="bindCopy" alt="绑定复制">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">绑定复制1</div>
            </div>

            <div class="content" @click="go({name:'ProductList'},'搬家列表')">
                <div>
                    <img :src="migrateList" alt="搬家列表">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">搬家列表1</div>
            </div>

            <div class="content" @click="go({name:'MigrateSetting'},'基本设置')">
                <div>
                    <img :src="baseSettings" alt="基本设置">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">基本设置1</div>
            </div>

             <div class="content" @click="go({name:'MigrateSetting'},'基本设置')">
                <div>
                    <img :src="baseSettings" alt="基本设置">
                    <!-- <el-divider direction="vertical" style="height:30px"></el-divider> -->
                </div>
                <div class="tip">基本设置2</div>
            </div>

        </div>
    </div>
</template>

<script>
import allProduct from '../images/allProduct.png'
import baseSettings from '../images/baseSettings.png'
import batchEdit from '../images/batchEdit.png'
import bindCopy from '../images/bindCopy.png'
import excelCopy from '../images/excelCopy.png'
import exportProduct from '../images/exportProduct.png'
import ImportProduct from '../images/ImportProduct.png'
import migrateList from '../images/migrateList.png'
import productCollection from '../images/productCollection.png'
import prosuctsCopy from '../images/prosuctsCopy.png'
import seniorVersion from '../images/seniorVersion.png'
import shopsCopy from '../images/shopsCopy.png'
import trialVersion from '../images/trialVersion.png'
import wechat from '../images/wechat.png'

export default {
  name: 'NormalTools',
  props: {
  },
  data () {
    return {
      allProduct,
      baseSettings,
      batchEdit,
      bindCopy,
      excelCopy,
      exportProduct,
      ImportProduct,
      migrateList,
      productCollection,
      prosuctsCopy,
      seniorVersion,
      shopsCopy,
      trialVersion,
      wechat
    }
  },
  methods: {
    go (options, name) {
      this.$router.push(options)
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '主页', '点击', `常用工具-${name}`])
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-divider{
    height: 30px;
    background: #EBEBEB;
}
.tools {
    // width: 644px;
    height: 131px;
    background: rgba(247, 248, 249, 0.8);
    border-radius: 20px;
    padding: 14px 16px;
    box-sizing: border-box;
    .title {
        height: 28px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: #6A6E80;
        line-height: 28px;
        margin-bottom: 9px;
    }
    .content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        cursor: pointer;
        img {
            width: 44px;
            padding-right: 25px;
            padding-left: 25px;
            margin-bottom: 5px;
        }
        div {
            color:@icon-info-color;
            font-size: 12px;
        }

        .tip {
            line-height: 16px;
            font-family: Microsoft YaHei;
        }
        &:hover {
            div {
                color:@navbar-font-primary-color;
                font-size: 12px;
            }
        }

    }

}

// @media screen and (min-width:1000px) and (max-width: 1200px){
//    .tools .content img {
//        padding-left: 35px;
//        padding-right: 35px;
//    }
// }

/*当页面宽度大于1000px且小于1200px的时候执行，1000-1200*/
@media screen and (min-width:1000px) and (max-width: 1200px){
    // body{
    //     font-size:16px
    // }
}
/*当页面宽度大于1280px且小于1366px的时候执行,1280-1366*/
@media screen and (min-width:1280px) and (max-width: 1366px){
    // body{
    //     font-size:18px
    // }
}
/*当页面宽度大于1440px且小于1600px的时候执行,1440-1600*/
@media screen and (min-width:1440px) and (max-width:1600px){
//        .tools .content img {
//        padding-left: 45px;
//        padding-right: 45px;
//    }
}
/*当页面宽度大于1680px且小于1920px的时候执行,1680-1920*/
@media screen and (min-width:1680px) and (max-width:1920px){
    .tools .content img {
       padding-left: 40px;
       padding-right: 40px;
   }
}
</style>
