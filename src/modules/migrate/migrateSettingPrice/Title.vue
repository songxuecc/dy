<template>
    <el-steps :icon="true" :active="2" class="left">
        <el-step >
            <div slot="icon"><hh-icon type="iconxuanzeshangpinguoqushi" style="font-size:40px" /> </div>
            <div slot="title" class="color-4e font-12 ml">选择商品</div>
        </el-step>
        <el-step >
            <div slot="icon"><hh-icon type="iconbianjijiagexuanzhong" style="font-size:40px" /> </div>
            <div slot="title"  class="color-primary font-12 ml" >编辑价格</div>
        </el-step>
        <el-step >
            <div slot="icon"><hh-icon type="iconxiugaimobanweixuanzhong" style="font-size:40px" /> </div>
            <div slot="title"  class="color-4e font-12 ml">修改模板</div>
        </el-step>
    </el-steps>
</template>

<script>
export default {
  name: 'title',
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
.ml {
    margin-left: -10px;
}
</style>
