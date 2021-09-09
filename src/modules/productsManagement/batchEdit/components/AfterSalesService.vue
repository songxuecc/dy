<!-- 售后服务 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="right"
    label-width="100px"
  >
    <el-form-item label="售后服务:">
      <el-radio-group v-model="form.supply_7day_return">
        <el-radio :label="1">支持7天无理由退换货</el-radio>
        <el-radio :label="2">支持7天无理由退换货(拆封后不支持)</el-radio>
        <el-radio :label="0">不支持7天无理由退换货</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="下架商品修改后:">
      <el-radio-group v-model="form.commit_type">
        <el-radio :label="0">直接上架</el-radio>
        <el-radio :label="1">保存到草稿箱</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Phone',
  props: {},
  data () {
    return {
      form: {
        supply_7day_return: 1,
        commit_type: 0
      }
    }
  },
  methods: {
    getForm () {
      return this.form
    }
  }
}
</script>
<style lang="less" scoped>
</style>
