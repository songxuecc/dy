<template lang="html">
    <div class="step-delivery setting-content-with-tip">
        <el-form size="small" ref="form" :model="template.model" :rules="rules" label-width="120px" style="width: 46%">
            <el-form-item label="付款方式:" prop="pay_type">
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
            <el-form-item label="客服电话:" prop="mobile">
                <el-input v-model="template.model.mobile" size="medium" class="input-num" @input="check"></el-input>
            </el-form-item>
            <!-- 新版运费模版 start-->
            <el-form-item label="运费模版:" prop="cost_template_id">
                <el-select v-model="template.model.cost_template_id" placeholder="请选择" size="small" @change="check">
                  <el-option
                    :label="costTemplate.template.template_name"
                    :value="costTemplate.template.id"
                    v-for="(costTemplate,index) in costTemplateList"
                    :key="index"></el-option>
                </el-select>
                <el-button type="text" @click="getCostTemplateList"><i class="el-icon-refresh"></i>刷新</el-button>
                <el-button type="text" @click="open()">添加运费模版</el-button>
            </el-form-item>
            <el-form-item label="订单库存计数:" prop="reduce_type">
                <el-radio-group v-model="template.model.reduce_type">
                    <div><el-radio :label="1">下单减库存 <span class="info">买家提交订单，扣减库存，存在恶拍风险</span></el-radio></div>
                    <div><el-radio :label="2">付款减库存 <span class="info">买家支付订单时，扣件库存，存在超卖风险</span></el-radio></div>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { createNamespacedHelpers, mapGetters, mapState } from 'vuex'

const {
  mapState: mapStateMoving,
  mapActions: mapActionsMoving
} = createNamespacedHelpers('moving/migrateSettingTemplate')

export default {
  components: {
  },
  data () {
    return {
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
        reduce_type: [
          { required: true, message: '请选择订单库存计数', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['getSelectTPProductIdList']),
    ...mapState(['ownerId']),
    ...mapStateMoving(['template', 'costTemplateList'])
  },
  methods: {
    ...mapActionsMoving(['getCostTemplateList']),
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
