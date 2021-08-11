<!-- 限购 -->
<template>
  <el-form
    ref="form"
    :model="form"
    size="small"
    label-position="right"
    label-width="100px"
    :inline="true"
  >
      <el-form-item prop="limit_per_buyer"  label="单用户累计限购">
        <el-input @input="handleChange" v-model.number="form.limit_per_buyer"  class="input-num ml-5 append" style="width:155px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="maximum_per_order"  label="每次限购">
        <el-input @input="handleChange" v-model.number="form.maximum_per_order"  class="input-num ml-5 append" style="width:155px">
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="minimum_per_order"  label="每次至少购买">
        <el-input @input="handleChange" v-model.number="form.minimum_per_order"  class="input-num ml-5 append" style="width:155px"
        >
          <template slot="append">件</template>
        </el-input>
      </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'LimitCount',
  props: {},
  data () {
    // 每次至少购买
    const validatePass = (rule, value, callback) => {
      // 起售件数
      const minimum = this.template.model.ext_json.minimum_per_order
      // 累计限购件数
      const limit = this.template.model.ext_json.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.template.model.ext_json.maximum_per_order

      if (minimum && minimum > 200) {
        callback(new Error('商品起售件数需为小于或等于200件的正整数'))
      } else if (limit && minimum > limit) {
        callback(new Error('起售件数不能超过商品每次限购件数'))
      } else if (maximum && minimum > maximum) {
        callback(new Error('起售件数不能超过商品每次限购件数'))
      } else {
        callback()
      }
    }

    // 每次限购
    const validatePass2 = (rule, value, callback) => {
      // 起售件数
      // 累计限购件数
      const limit = this.template.model.ext_json.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.template.model.ext_json.maximum_per_order

      if (maximum && maximum > 200) {
        callback(new Error('每次限购件数需为小于200的正整数'))
      } else if (limit && maximum && maximum > limit) {
        callback(new Error('每次限购件数不能超过累计限购件数'))
      } else {
        callback()
      }
    }
    // 单用户累计限购
    const validatePass1 = (rule, value, callback) => {
      const limit = this.template.model.ext_json.limit_per_buyer
      if (limit && limit > 200) {
        callback(new Error('累计限购件数需为小于200的正整数'))
      } else {
        callback()
      }
    }
    return {
      form: {
        limit_per_buyer: 1,
        maximum_per_order: 0,
        minimum_per_order: 0
      },
      rules: {
        maximum_per_order: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        limit_per_buyer: [
          { validator: validatePass1, trigger: 'blur' }
        ],
        minimum_per_order: [
          { validator: validatePass, trigger: 'blur' }
        ]
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
/deep/ .el-input-group__append{
    background: none;
    padding:  0;
    padding-right:  10px;
}

.append {
    /deep/ .el-input__inner{
        border-right: none;
        padding:5px;
        padding-left: 10px;
    }

}
</style>
