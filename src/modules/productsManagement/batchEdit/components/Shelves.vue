<!-- 上下架 -->
<template>
    <el-radio-group v-model="isOnSale">
        <el-radio :label="1">批量上架</el-radio>
        <el-radio :label="0">批量下架</el-radio>
    </el-radio-group>
</template>

<script>
export default {
  name: 'Shelves',
  props: {
  },
  data () {
    return {
      isOnSale: 0
    }
  }
}
</script>
<style lang="less" scoped>
</style>
