<!-- 商品管理 -->
<template>
    <div class="ProductManagement">
      <div class="title">
        <hh-icon type="iconshangpinguanli1" class="mr-5"></hh-icon> 商品管理
      </div>

      <div>

        <div>
            <div class="icon"></div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'ProductManagement',
  props: {
    msg: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  height: 28px;
  font-size: 20px;
  font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
  font-weight: normal;
  color: #6a6e80;
  line-height: 28px;
  margin-bottom: 9px;
}
.ProductManagement {
  width: 647px;
  height: 280px;
  background: rgba(247, 248, 249, 0.8);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 20px 26px;
}
</style>
