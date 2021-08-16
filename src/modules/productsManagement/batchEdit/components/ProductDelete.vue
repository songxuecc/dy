<!-- 计数方式 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="right"
    label-width="100px"
  >
    <span class="fail">批量删除选中商品</span>
  </el-form>
</template>

<script>
export default {
  name: 'ProductDelete',
  props: {},
  data () {
    return {

    }
  },
  methods: {
    getForm () {
      return {}
    }
  }
}
</script>
<style lang="less" scoped>
</style>
