<!-- banner -->
<template>
  <div class="Banner">
    <el-carousel height="185px">
      <el-carousel-item v-for="(item,index) in items" :key="index">
        <div :class="`img${index}`" style="width:100%;height:100%" class="pointer" @click="item"></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  name: 'banner',
  props: {
    msg: String
  },
  data () {
    return {
      items: [
        this.gotoMeizheDuanxin,
        this.gotoMeizheShouhou,
        this.gotoOrder,
        this.gotoCycleProductsSelfPlanList,
        this.gotoWoda
      ]
    }
  },
  methods: {
    gotoOrder () {
      window.open('https://fuwu.jinritemai.com/detail/purchase?service_id=42&sku_id=866&from=fuwu_market_home')
    },
    gotoMeizheDuanxin () {
      window.open('https://dx5.cn/45LhbP')
    },
    gotoMeizheShouhou () {
      window.open('https://dx5.cn/45TfWd')
    },
    gotoCycleProductsSelfPlanList () {
      this.$router.push({name: 'cycleProductsSelf_PlanList'})
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '主页', '点击', `banner-cycleProductsSelf_PlanList`])
      }
    },
    gotoBatchEdit () {
      this.$router.push({name: 'BatchEdit', query: {editType: 16}})
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '主页', '点击', `banner-BatchEdit`])
      }
    },
    gotoWoda () {
      window.open('https://s.woda.com/E2c3W')
    }
  }
}
</script>
<style lang="less" scoped>
.Banner {
  margin-top: 10px;
  width: 100%;
  height: 185px;
  background: rgba(247, 248, 249, 0.8);
  border-radius: 25px;
  overflow: hidden;
}

.el-carousel__item h3 {
  font-size: 14px;
  line-height: 150px;
  margin: 0;
}

/deep/ .el-carousel {
    .el-carousel__indicators {
        display: flex;
        align-items: center;
    }
  .el-carousel__button {
    width: 10px;
    height: 6px;
    border-radius: 3px;
    box-sizing: border-box;
    border: 1px solid #ffffff !important;
    background: none;
  }

  .is-active {
    border-color: transparent;
    .el-carousel__button {
      border-color: transparent !important;
      background: #ffffff;
    }
  }
}
.img0 {
  background-image: url('https://cdn.meideng.net/fuwu-page/partner/huhu/huhu-yx-712_370@2x.png');
  background-size: cover;
}
.img1 {
  background-image: url('https://cdn.meideng.net/fuwu-page/partner/huhu/huhu-banner-356_185%402x.png');
  background-size: cover;
}

.img2 {
  background-image: url('https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9bfc2e6f0c6e4a369a46f3cbceda7ca6~tplv-k3u1fbpfcp-watermark.image?');
  background-size: cover;
}

.img3 {
  background-image: url('https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3bf5e4549a8c48868661949ab1d37af9~tplv-k3u1fbpfcp-watermark.image?');
  background-size: cover;
}

.img4 {
  background-image: url('https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6d383de95dd4906a5054d04674f60e0~tplv-k3u1fbpfcp-watermark.image?');
  background-size: cover;
}

@media screen and (min-width:1680px) and (max-width:1920px){
    .img0 {
      background-image: url('https://cdn.meideng.net/fuwu-page/partner/huhu/huhu-yx-1784_740@2x.png');
      background-size: cover;
    }
    .img1 {
      background-image: url('https://cdn.meideng.net/fuwu-page/partner/huhu/huhu-banner-892_370%402x.png');
      background-size: cover;
    }
    .img2 {
      background-image: url('https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3ea80fe796e6402d9a7db2e73532ff9e~tplv-k3u1fbpfcp-watermark.image?');
      background-size: cover;
    }
    .img3 {
      background-image: url('https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77845335654b4d76adab66cbcc6185c3~tplv-k3u1fbpfcp-watermark.image?');
      background-size: cover;
    }
    .img4 {
      background-image: url('https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a0458d615b7140fca9b3bae2cdd32cf9~tplv-k3u1fbpfcp-watermark.image?');
    }
}
</style>
