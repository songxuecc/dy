<!-- 商品管理 -->
<template>
    <div class="ProductManagement">
      <div class="title">
        <hh-icon type="iconshangpinguanli1" ></hh-icon> 商品管理
      </div>

      <div class="flex">
        <div class="color-767989 item"  @click="go({name:'BatchEdit'},'商品管理-批量处理')">
            <div class="icon-content">
              <hh-icon type="iconpiliangchulixuanzhong1" class="icon"></hh-icon>
              <img :src="hot" class="hot ml-5"></img>
            </div>
            <h1 class="font-14 mb-5">批量处理</h1>
            <ul class="text">
              <li class="font-12">批量上下架</li>
              <li class="font-12">批量删除商品</li>
              <li class="font-12">批量改标题、库存价格、发货模式…</li>
            </ul>
            <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
        </div>

        <div class="color-767989 item" @click="go({name:'SkuImport'},'商品管理-导入表格')">
            <div class="icon-content">
              <hh-icon type="icondaorubiaogexiugaixuanzhong1" class="icon"></hh-icon>
              <img :src="newImg" class="new ml-5"></img>
            </div>
            <h1 class="font-14 mb-5">导入表格修改</h1>
            <ul class="text">
              <li class="font-12">导入改商品标题</li>
              <li class="font-12">导入改SKU价格、库存、编码</li>
            </ul>
            <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
        </div>

        <div class="color-767989 item" @click="go({name:'ProductExports'},'商品管理-商品导出')">
            <div class="icon-content">
              <hh-icon type="iconshangpindaochuxuanzhong" class="icon"></hh-icon>
              <!-- <img :src="hot" class="hot ml-5"></img> -->
            </div>
            <h1 class="font-14 mb-5">商品导出</h1>
            <ul  class="text">
              <li class="font-12">支持按商品编号导出、全部商品一键导出</li>
            </ul>
            <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
        </div>

        <div class="color-767989 item" @click="go({name:'ProductSync'},'商品管理-商品源同步')">
            <div class="icon-content">
              <hh-icon type="iconshangpinyuantongbuxuanzhong" class="icon"></hh-icon>
              <!-- <img :src="hot" class="hot ml-5"></img> -->
            </div>
            <h1 class="font-14 mb-5">商品源同步</h1>
            <ul class="text">
              <li class="font-12">当货源方的价格、库存、标题、上下架信息发生变化时，系统将检测变化并做出修改。</li>
            </ul>
            <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
        </div>

      </div>
    </div>
</template>

<script>
import hot from '../images/hot.png'
import newImg from '../images/new.png'

export default {
  name: 'ProductManagement',
  props: {
    msg: String
  },
  data () {
    return {
      hot,
      newImg
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
.title {
  height: 28px;
  font-size: 20px;
  font-family: MicrosoftYaHei;
  font-weight: normal;
  color: #6a6e80;
  line-height: 28px;
  margin-bottom: 9px;
}
.ProductManagement {
  // height: 280px;
  background: rgba(247, 248, 249, 0.8);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px 26px;
}

.icon {
  font-size: 46px;
}
.hot {
  width: 25px;
  height: 21px;
}

.new {
  width: 30px;
  height: 14px;
}

.item {
  width: 135px;
  background: #FFFFFF;
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  padding: 16px;
  box-sizing: border-box;
  margin-right: 18px;
  opacity: 0.6;
  cursor: pointer;
  border: 1px solid rgba(50, 119, 255, 0.3);
  &:hover{
    border: 1px solid #F2F2F2;
  }
  .text {
    height: 97px;
    overflow: hidden;
    padding-left: 0;
    line-height: 16px;
    margin:0;
    li {
      display: inline-flex;
      &::before {
        content: "\02022";
        margin-left: -20rpx;
        margin-right: 8rpx;
        color: rgba(106, 110, 128, 0.5);
        font-style: normal;
        text-decoration: none;
    }
    }
  }
  .font-12 {
    line-height: 16px;
    font-size: 12px;
  }

  &:hover{
    opacity: 1;
  }

  .icon-content {
    margin-bottom: 8px;
    display: flex;
    height: 46px;
  }
   .btn {
      width: 26px;
      height: 26px;
      background: rgba(50, 119, 255, 0.5);
      border-radius: 13px;
      font-size: 26px;
      margin:auto;
      margin-top: 8px;
      display: block;
    }
}

.opacity {
}
</style>
