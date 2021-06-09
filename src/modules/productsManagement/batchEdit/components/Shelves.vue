<!-- 上下架 -->
<template>
    <el-radio-group v-model="onshelf">
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
      onshelf: 0
    }
  },
  methods: {
    getForm () {
      return {onshelf: this.onshelf}
    }
  }

}
</script>
<style lang="less" scoped>
</style>
