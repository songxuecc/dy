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
            <el-form-item label="重量:" prop="weight">
              <el-radio-group v-model="template.model.weight_unit">
                <el-radio :label="0">kg</el-radio>
                <el-radio :label="1">g</el-radio>
              </el-radio-group>
              <el-input v-model="template.model.weight"  class="input-num" style="width:150px"></el-input>
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
                    <el-radio :label="0">不支持7天无理由退换货</el-radio>
<!--                    <el-radio :label="2">支持（拆封后不支持）</el-radio>-->
                </el-radio-group>
                <div style="position: absolute;top: 15px;left: 192px;color: #E02020; font-size: 1px;">仅少数商品可选，一般商品不要选择此项</div>
                <el-popover
                  placement="top"
                  width="600"
                  trigger="click">
                  <el-image
                    :src="dySupplyImg"
                    fit="fit">
                  </el-image>
                  <el-link slot="reference" :underline="false" style="margin-left: 100px; color: #1D8FFF; font-size: 1px;">注:什么商品可以不支持7天无理由退换货?</el-link>
                </el-popover>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { createNamespacedHelpers, mapGetters, mapState } from 'vuex'

const {
  mapState: mapStateMigrate,
  mapActions: mapActionsMigrate
} = createNamespacedHelpers('migrate/migrateSettingTemplate')

export default {
  data () {
    return {
      dySupplyImg: 'https://img.pddpic.com/mms-material-img/2021-04-21/091fb3a4-fa82-49eb-9821-229aaa330567.png.a.jpeg',
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
          { required: true, message: '请选择搬迁方式', trigger: 'change' }
        ],
        product_type: [
          { required: true, message: '请选择商品类型', trigger: 'change' }
        ],
        reduce_type: [
          { required: true, message: '请选择订单库存计数', trigger: 'blur' }
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
}

</style>
