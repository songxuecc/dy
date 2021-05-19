<!-- 上下架 -->
<template>
    <div>
    <el-radio-group v-model="radio">
        <el-radio :label="3">批量上架</el-radio>
        <el-radio :label="9">批量下架</el-radio>
    </el-radio-group>
    </div>
</template>

<script>
export default {
  name: 'Shelves',
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
</style>
