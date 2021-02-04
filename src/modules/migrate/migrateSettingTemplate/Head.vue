<!--  -->
<template>
    <div style="text-align: left">
      <el-steps :active="2" finish-status="success">
          <el-step title="选择商品"></el-step>
          <el-step title="编辑价格"></el-step>
          <el-step title="修改模板"></el-step>
      </el-steps>
    </div>
</template>

<script>
export default {
  name: 'Head',
  props: {
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
</style>
