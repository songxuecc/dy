<!-- 重量 -->
<template>
    <el-form ref="form" :model="form" label-width="70px" size="small" label-position="left">

        <el-form-item label="重量：" style="width:200px">
            <el-input clearable @clear="handleClear('weight')"  v-model.number="form.weight" @focus="handleCheck('weight')"></el-input>
        </el-form-item>

        <el-form-item label-width="95px">
            <span slot="label">重量单位：</span>
            <el-radio-group v-model="form.weight_unit">
                <el-radio :label="0">kg</el-radio>
                <el-radio :label="1">g</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  name: 'Weight',
  props: {
  },
  data () {
    return {
      form: {
        weight_unit: 1,
        weight: 0
      }
    }
  },
  methods: {
    handleCheck (attribute) {
      if (!this.form[attribute]) this.form[attribute] = true
    },
    handleClear (attribute) {
      if (this.form[attribute]) this.form[attribute] = ''
    },
    getForm () {
      if (this.form.weight_unit) {
        return {
          ...this.form,
          weight_unit: Number(this.form.weight_unit)
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
