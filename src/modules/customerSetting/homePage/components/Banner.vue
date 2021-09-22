<!-- banner -->
<template>
  <div class="Banner">
    <el-carousel height="185px">
      <el-carousel-item v-for="item in items" :key="item">
        <h3 class="small">
            <img :src="item" alt="" style="width:100%;height:100%">
        </h3>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import banner1 from '../images/banner1.png'
import banner2 from '../images/banner2.png'
export default {
  name: 'banner',
  props: {
    msg: String
  },
  data () {
    return {
      items: [
        banner1,
        banner2
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.Banner {
  margin-top: 10px;
  width: 356px;
  height: 185px;
  background: #d8d8d8;
  border-radius: 18px;
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
</style>
