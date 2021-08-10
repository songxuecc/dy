<!-- 备注 -->
<template>
  <el-form ref="form" :model="form" size="small" label-position="left">
    <el-form-item label-width="60px" label="商家备注">
      <el-input type="textarea" :autosize="{ minRows: 4}" placeholder="请输入内容" v-model="form.remark" style="width:590px"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'Remark',
  data () {
    return {
      form: {
        remark: ''
      }
    }
  },
  methods: {
    getForm () {
      if (this.form.remark) {
        return {
          ...this.form
        }
      } else {
        this.$message.error('请填写并选择修改内容')
        return false
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
