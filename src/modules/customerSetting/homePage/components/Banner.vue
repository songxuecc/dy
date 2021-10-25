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
        this.gotoSync,
        this.gotoMeizhe
      ]
    }
  },
  methods: {
    gotoOrder () {
      window.open('https://fuwu.jinritemai.com/detail/purchase?service_id=42&sku_id=866&from=fuwu_market_home')
    },
    gotoMeizhe () {
      window.open('https://dx5.cn/454S1A')
    },
    gotoSync () {
      this.$router.push({name: 'ProductsSync'})
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '主页', '点击', `banner-ProductsSync`])
      }
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
  background-image: url('../images/banner2.png');
  background-size: cover;
}
.img1 {
  background-image: url('../images/meizhe-banner.png');
  background-size: cover;
}

@media screen and (min-width:1680px) and (max-width:1920px){
    .img0 {
      background-image: url('../images/banner2-1680.png');
      background-size: cover;
    }
    .img1 {
      background-image: url('../images/meizhe-banner-1680.png');
      background-size: cover;
    }
}
</style>
