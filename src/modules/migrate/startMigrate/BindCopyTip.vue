<!--  -->
<template>
    <div class="left BindCopyTip">
        <h1 class="color333 mb-10">绑定复制是什么？</h1>
        <p class="info  mb-10">多个抖音店铺在软件内绑定后，可将任意一个店铺的商家搬家至另一个店铺。</p>
        <h1 class="color333 mb-10">相比于整店复制的优势？</h1>
        <p class="info">1、支持复制已下架商品</p>
        <p class="info">2、支持复制sku编码</p>
        <p class="info">3、支持复制类目资质</p>
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
  }
}
</script>
<style lang="less" scoped>
    .BindCopyTip{
        width: 931px;
        background: #f3f4f97e;
        padding: 20px;
        border-radius: 2px;
    }
</style>
