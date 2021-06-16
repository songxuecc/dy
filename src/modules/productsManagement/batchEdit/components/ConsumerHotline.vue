<!-- 客服电话 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="left"
  >
    <el-form-item label="客服电话:">
      <el-input clearable @clear="handleClear" v-model="form.mobile_no" style="width:300px" placeholder="请输入客服电话"></el-input>
    </el-form-item>
    <el-form-item label="下架商品修改后:" class="mt-10">
      <el-radio-group v-model="form.commit_type">
        <el-radio :label="0">直接上架</el-radio>
        <el-radio :label="1">保存到草稿箱</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'ConsumerHotline',
  props: {},
  data () {
    return {
      form: {
        mobile_no: '',
        commit_type: 0
      }
    }
  },
  methods: {
    handleClear () {
      this.form.mobile_no = ''
    },
    getForm () {
      if (!this.form.mobile_no) {
        this.$message.error('请输入客服电话')
        return false
      }
      return this.form
    }
  }
}
</script>
<style lang="less" scoped>
</style>
