<!-- 重量 -->
<template>
    <el-form class="weight" ref="form" :model="form" label-width="70px" size="small" label-position="left" :rules="rules">

        <el-form-item label="重量：" style="width:200px" prop="weight">
            <el-input clearable @clear="handleClear('weight')"  v-model="form.weight" ></el-input>
        </el-form-item>

        <el-form-item label-width="95px" class="mt-10">
            <span slot="label">重量单位：</span>
            <el-radio-group v-model="form.weight_unit">
                <el-radio :label="0">kg</el-radio>
                <el-radio :label="1">g</el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
import utils from '@/common/utils'

export default {
  name: 'Weight',
  props: {
  },
  data () {
    const validateWeight = (rule, value, callback) => {
      if ((value && !utils.isNumber(value))) {
        callback(new Error('请填写数字'))
      } else {
        callback()
      }
    }
    return {
      form: {
        weight_unit: 1,
        weight: 1000
      },
      rules: {
        weight: [
          { validator: validateWeight, trigger: ['focus', 'blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    handleClear (attribute) {
      if (this.form[attribute]) this.form[attribute] = ''
    },
    getForm () {
      const className = '.weight .el-form-item__error'
      const error = document.querySelector(className)
      console.log(error, 'error')
      if (error) {
        this.$message.error('请按提示修改错误')
        return false
      }
      return {
        weight: this.form.weight,
        weight_unit: Number(this.form.weight_unit)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
