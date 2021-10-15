<!-- 支付设置 -->
<template>
<div class="card">
    <h1>支付设置</h1>
    <el-form ref="form" size="mini" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="支付方式:" prop="pay_type" class="item" >
          <el-radio-group v-model="form.pay_type">
            <el-radio :label="1">在线支付</el-radio>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="订单库存计数:" prop="reduce_type" class="item" required>
          <el-radio-group v-model="form.reduce_type">
              <div><el-radio :label="1">下单减库存 <span class="info">买家提交订单，扣减库存，存在恶拍风险</span></el-radio></div>
              <div><el-radio :label="2">付款减库存 <span class="info">买家支付订单时，扣件库存，存在超卖风险</span></el-radio></div>
          </el-radio-group>
      </el-form-item>
      <el-form-item label="商品限购设置:" class="item-order item">
          <el-form-item prop="limit_per_buyer"  style="display:inline-block;margin-bottom:0">
          <span class="font-12  " style="margin-right:30px">单用户累计限购<el-input @input="handleChange" v-model.number="form.limit_per_buyer"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
          </el-form-item>
          <el-form-item prop="maximum_per_order" style="display:inline-block;margin-bottom:0">
          <span class="font-12  " style="margin-right:30px">每次限购<el-input @input="handleChange" v-model.number="form.maximum_per_order" class="input-num ml-5" style="width:125px"></el-input> 件 </span>
          </el-form-item>
          <el-form-item prop="minimum_per_order"  style="display:inline-block;margin-bottom:0">
          <span class="font-12  " style="margin-right:30px">每次至少购买<el-input @input="handleChange" v-model.number="form.minimum_per_order"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
          </el-form-item>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>
import utils from '@/common/utils'

export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    // 每次至少购买
    const validatePass = (rule, value, callback) => {
      // 起售件数
      const minimum = this.form.minimum_per_order
      // 累计限购件数
      const limit = this.form.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.form.maximum_per_order

      if ((value && !utils.isNumber(value)) || value % 1 || value < 0) {
        callback(new Error('请填写正整数'))
      } else if (minimum && minimum > 200) {
        callback(new Error('商品起售件数需为小于或等于200件的正整数'))
      } else if (limit && minimum && minimum > limit) {
        callback(new Error('起售件数不能超过商品每次限购件数'))
      } else if (maximum && minimum && minimum > maximum) {
        callback(new Error('起售件数不能超过商品每次限购件数'))
      } else {
        callback()
      }
    }

    // 每次限购
    const validatePass2 = (rule, value, callback) => {
      // 起售件数
      // 累计限购件数
      const limit = this.form.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.form.maximum_per_order

      if ((value && !utils.isNumber(value)) || value % 1 || value < 0) {
        callback(new Error('请填写正整数'))
      } else if (maximum && maximum > 200) {
        callback(new Error('每次限购件数需为小于200的正整数'))
      } else if (limit && maximum && maximum > limit) {
        callback(new Error('每次限购件数不能超过累计限购件数'))
      } else {
        callback()
      }
    }
    // 单用户累计限购
    const validatePass1 = (rule, value, callback) => {
      const limit = this.form.limit_per_buyer
      if ((value && !utils.isNumber(value)) || value % 1 || value < 0) {
        callback(new Error('请填写正整数'))
      } else if (limit && limit > 200) {
        callback(new Error('累计限购件数需为小于200的正整数'))
      } else {
        callback()
      }
    }

    return {
      form: {
        pay_type: 1,
        reduce_type: 1,
        maximum_per_order: '',
        minimum_per_order: '',
        limit_per_buyer: ''
      },
      rules: {
        reduce_type: [
          { required: true, message: '请选择订单库存计数', trigger: ['blur', 'change'] }
        ],
        maximum_per_order: [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ],
        limit_per_buyer: [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        minimum_per_order: [
          { validator: validatePass, trigger: ['focus', 'blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    handleChange () {
      this.$refs.form.validateField('ext_json.minimum_per_order')
      this.$refs.form.validateField('ext_json.maximum_per_order')
      this.$refs.form.validateField('ext_json.limit_per_buyer')
    },
    getForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, object) => {
          if (valid) {
            resolve(this.form)
          } else {
            const e = object
            reject(e)
          }
        })
      })
    }
  }
}
</script>
<style lang="less" scoped>
 /deep/ .item-order{
    .el-form-item__content {
      margin-left: 0 !important;
      align-items: center;
    display: flex;

    }
  }

  .price {
        /deep/ .el-input__inner {
          // border-right: none;
          padding: 5px;
          padding-left: 10px;
        }

      }

    .item {
        padding-bottom: 10px;
        box-sizing: border-box;
    }
    .card {
      background: #f9f9fa;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 24px 24px 1px;
    }
    h1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        font-family: yahei;
    }
</style>
