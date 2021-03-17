<!--  -->
<template>
    <div class="left BindCopyTip">
        <h1 class="color333 mb-10">绑定复制是什么？</h1>
        <p class="info  mb-10">多个抖音店铺在软件内绑定后，可将任意一个店铺的所有商品一键搬家至另一店铺。</p>
        <h1 class="color333 mb-10">相比于整店复制的优势？</h1>
        <p class="info">1、支持复制已下架商品</p>
        <p class="info">2、支持复制sku编码</p>
        <p class="info mb-10">3、可实现店铺所有商品一键搬家，搬家效率<span class="color-primary ml-5">500%↑</span></p>
        <h1 class="color333 mb-10">如何进行绑定复制？</h1>
        <p class="info pointer">第1步：<span class="color-primary ml-5 underline" @click="gotoBindShop">去绑定店铺</span></p>
        <p class="info">第2步：若是将A店商品复制到B店，则登录B店铺（右上角的店铺名需是B店铺）</p>
        <p class="info">第3步：进入绑定复制页面，选择被复制的店铺A，点击开始复制</p>
    </div>
</template>

<script>
export default {
  name: 'BindCopyTip',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  methods: {
    gotoBindShop () {
      this.$router.push({
        name: 'ShopsBand'
      })
    }
  }
}
</script>
<style lang="less" scoped>
    .BindCopyTip{
        background: #f3f4f97e;
        padding: 20px;
        border-radius: 2px;
        margin-top: 20px;
    }
</style>
