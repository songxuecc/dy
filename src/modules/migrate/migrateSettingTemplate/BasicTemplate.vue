<template lang="html">
    <div class="step-delivery setting-content-with-tip">
        <el-form size="small" ref="form" :model="template.model" :rules="rules" label-width="120px">
            <el-form-item label="付款方式:"  prop="pay_type">
                <el-radio-group v-model="template.model.pay_type">
                    <el-radio :label="0">货到付款</el-radio>
                    <el-radio :label="1">在线支付</el-radio>
                    <el-radio :label="2">两者都支持</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="搬迁方式:" prop="commit_type">
                <el-radio-group v-model="template.model.commit_type">
                    <el-radio :label="0">直接上线</el-radio>
                    <el-radio :label="1">草稿箱</el-radio>
                    <el-radio :label="2">仓库中</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="客服电话:" prop="mobile" >
                <el-input v-model="template.model.mobile"  class="input-num" @input="check" style="width:150px"></el-input>
            </el-form-item>
            <!-- 新版运费模版 start-->
            <el-form-item label="运费模版:" prop="cost_template_id">
                <el-select v-model="template.model.cost_template_id" placeholder="请选择" size="small" @change="check" style="width:150px">
                  <el-option
                    :label="costTemplate.template.template_name"
                    :value="costTemplate.template.id"
                    v-for="(costTemplate,index) in costTemplateList"
                    :key="index"></el-option>
                </el-select>
                <el-button type="text" @click="getCostTemplateList"><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
                <el-button type="text" @click="open()">添加运费模版</el-button>
            </el-form-item>
            <el-form-item label="商品重量:" class="flex item-order">
              <el-radio-group v-model="template.model.weight_unit" style="">
                <el-radio :label="0">kg</el-radio>
                <el-radio :label="1">g</el-radio>
              </el-radio-group>
              <el-form-item prop="weight" style="display:inline-flex;margin-left:10px;margin-bottom: 0;" class="weight">
                <el-input-number v-model="template.model.weight"  class="input-num" style="width:150px"></el-input-number>
              </el-form-item>
            </el-form-item>
            <el-form-item label="商品限购设置:" v-if="template.model.ext_json" class="flex item-order">
              <el-form-item prop="ext_json.limit_per_buyer"  style="display:inline-block;margin-bottom:0">
              <span class="font-12  " style="margin-right:30px">单用户累计限购<el-input @input="handleChange" v-model.number="template.model.ext_json.limit_per_buyer"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
              </el-form-item>
              <el-form-item prop="ext_json.maximum_per_order" style="display:inline-block;margin-bottom:0">
                <span class="font-12  " style="margin-right:30px">每次限购<el-input @input="handleChange" v-model.number="template.model.ext_json.maximum_per_order" class="input-num ml-5" style="width:125px"></el-input> 件 </span>
              </el-form-item>
              <el-form-item prop="ext_json.minimum_per_order"  style="display:inline-block;margin-bottom:0">
              <span class="font-12  " style="margin-right:30px">每次至少购买<el-input @input="handleChange" v-model.number="template.model.ext_json.minimum_per_order"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
              </el-form-item>
            </el-form-item>
            <el-form-item label="商品类型:" prop="product_type">
                <el-radio-group v-model="template.model.product_type">
                    <el-radio :label="0">普通商品</el-radio>
                    <el-radio :label="3">虚拟商品</el-radio>
                    <el-radio :label="6">玉石闪购</el-radio>
                    <el-radio :label="7">云闪购</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="订单库存计数:" prop="reduce_type">
                <el-radio-group v-model="template.model.reduce_type">
                    <div><el-radio :label="1">下单减库存 <span class="info">买家提交订单，扣减库存，存在恶拍风险</span></el-radio></div>
                    <div><el-radio :label="2">付款减库存 <span class="info">买家支付订单时，扣件库存，存在超卖风险</span></el-radio></div>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="售后服务:"  prop="supply_7day_return">
                <el-radio-group v-model="template.model.supply_7day_return">
                    <el-radio :label="1">支持7天无理由退换货</el-radio>
                    <el-radio :label="2">支持7天无理由退换货(拆封后不支持)</el-radio>
                    <el-radio :label="0">不支持7天无理由退换货</el-radio>
<!--                    <el-radio :label="2">支持（拆封后不支持）</el-radio>-->
                </el-radio-group>
                <div style="position: absolute;top: 17px;left: 352px;color: #E02020; font-size: 1px;color:#FA6400" v-if="!template.model.supply_7day_return">仅少数商品可选，一般商品不要选择此项</div>
                <el-link  :underline="false" style="margin-left: 130px; color: #1D8FFF; font-size: 1px;" @click="dySupplyImgVisible = !dySupplyImgVisible" v-if="!template.model.supply_7day_return">什么商品可以不支持7天无理由退换货</el-link>
                <el-dialog :visible.sync="dySupplyImgVisible">
                  <el-image
                    :src="dySupplyImg"
                    fit="fit">
                  </el-image>
                </el-dialog>

            </el-form-item>
        </el-form>

    </div>
</template>
<script>
import { createNamespacedHelpers, mapGetters, mapState } from 'vuex'
import utils from '@/common/utils'

const {
  mapState: mapStateMigrate,
  mapActions: mapActionsMigrate
} = createNamespacedHelpers('migrate/migrateSettingTemplate')

export default {
  data () {
    // 每次至少购买
    const validatePass = (rule, value, callback) => {
      // 起售件数
      const minimum = this.template.model.ext_json.minimum_per_order
      // 累计限购件数
      const limit = this.template.model.ext_json.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.template.model.ext_json.maximum_per_order

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
      const limit = this.template.model.ext_json.limit_per_buyer
      // 每次下单限购件数
      const maximum = this.template.model.ext_json.maximum_per_order

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
      const limit = this.template.model.ext_json.limit_per_buyer
      if ((value && !utils.isNumber(value)) || value % 1 || value < 0) {
        callback(new Error('请填写正整数'))
      } else if (limit && limit > 200) {
        callback(new Error('累计限购件数需为小于200的正整数'))
      } else {
        callback()
      }
    }

    const validateWeight = (rule, value, callback) => {
      if ((value && !utils.isNumber(value))) {
        callback(new Error('请填写数字'))
      } else {
        callback()
      }
    }

    return {
      dySupplyImg: 'https://img.pddpic.com/mms-material-img/2021-04-21/091fb3a4-fa82-49eb-9821-229aaa330567.png.a.jpeg',
      dySupplyImgVisible: false,
      rules: {
        pay_type: [
          { required: true, message: '请选择付款方式', trigger: 'change' }
        ],
        mobile: [
          { required: true, message: '请输入客服电话', trigger: 'change' }
        ],
        cost_template_id: [
          { required: true, message: '请选择运费模版', trigger: 'blur' }
        ],
        commit_type: [
          { required: true, message: '请选择搬迁方式', trigger: ['blur', 'change'] }
        ],
        product_type: [
          { required: true, message: '请选择商品类型', trigger: ['blur', 'change'] }
        ],
        reduce_type: [
          { required: true, message: '请选择订单库存计数', trigger: ['blur', 'change'] }
        ],
        weight: [
          { validator: validateWeight, trigger: ['focus', 'blur', 'change'] }
        ],
        'ext_json.maximum_per_order': [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ],
        'ext_json.limit_per_buyer': [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        'ext_json.minimum_per_order': [
          { validator: validatePass, trigger: ['focus', 'blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getSelectTPProductIdList']),
    ...mapState(['ownerId']),
    ...mapStateMigrate(['template', 'costTemplateList'])
  },
  methods: {
    ...mapActionsMigrate(['getCostTemplateList']),
    handleChange () {
      this.$refs.form.validateField('ext_json.minimum_per_order')
      this.$refs.form.validateField('ext_json.maximum_per_order')
      this.$refs.form.validateField('ext_json.limit_per_buyer')
    },
    resetForm () {
      this.$refs.form && this.$refs.form.resetFields()
    },
    open () {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/morder/logistics/freight-list')
    },
    validate (cb) {
      return this.$refs.form.validate(cb)
    }
  }
}
</script>

<style lang="less" scoped>

.setting-content-with-tip {
  /deep/ .el-checkbox__label {
    font-size: 12px;
  }
  /deep/ .el-checkbox__inner {
    width: 12px;
    height: 12px;
  }
  /deep/ .el-checkbox__inner::after {
    left: 3px;
    top: 0px;
  }
  /deep/ .label-tip {
    position:absolute;
    font-size: 12px;
    color:#999999
  }
  .checkbox {
    margin-bottom: 8px;
  }
  .current-shop {
    margin-bottom: 10px;
    line-height: 12px;
  }
  .group {
    margin-bottom: 14px;
  }
  .is-main {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #333333;
  }
  .label-name {
    position:relative;
  }
  .diffrent-category-tip {
    margin-top: 14px;
    color:#999999;
    font-size: 12px;
    span {
      color: red;
      margin-right: 4px;
    }
  }
}

.step-delivery {
  .info {
    color: #999999;
    font-size: 12px;
    line-height: 12px;
  }
  .presell_type {
    display: block;
    margin-bottom: 8px;
    p {
      color: #999999;
      font-size: 12px;
      line-height: 14px;
      margin-left: 26px;
    }
  }

  /deep/ .el-input-number.is-controls-right .el-input__inner {
    padding: 0;
  }
  .input-number {
    margin-left: 5px;
    margin-right: 5px;
  }
  span {
    color:#606266;
  }
  .margin-bottom-4 {
    margin-bottom: 4px;
  }
  .weight {
      /deep/ .el-form-item__content {
        display: inline-block;
      }
    }

  /deep/ .item-order{
    .el-form-item__content {
      margin-left: 0 !important;
      align-items: center;
    display: flex;

    }
  }
}

.setting-content-with-tip {
  /deep/  .el-form-item .el-form-item__error {
    padding-top: 3px;
  }
}

</style>
