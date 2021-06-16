<!-- 计数方式 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="right"
    label-width="100px"
  >
    <el-form-item label="订单计数方式:">
      <el-radio-group v-model="form.reduce_type">
        <el-radio :label="1">下单减库存</el-radio>
        <el-radio :label="2">支付减库存</el-radio>
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
        reduce_type: 1,
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
