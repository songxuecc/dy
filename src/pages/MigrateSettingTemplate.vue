<template lang="html">
    <div v-loading="loadingCnt">
        <div style="text-align: left">
            <el-steps :active="2" finish-status="success">
                <el-step title="选择商品"></el-step>
                <el-step title="编辑价格"></el-step>
                <el-step title="修改模板"></el-step>
            </el-steps>
        </div><br>
        <el-card class="setting-content-with-tip" body-style="display:flex;">
            <el-form ref="template1" :model="template.model" :rules="rules" label-width="100px" style="width: 50%">
                <el-form-item label="团购人数:" prop="customer_num">
                    <el-input v-model.number="template.model.customer_num" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>

                <el-form-item label="单次限量:" prop="order_limit">
                    <el-input v-model.number="template.model.order_limit" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>

                <el-form-item label="限购次数:" prop="buy_limit">
                    <el-input v-model.number="template.model.buy_limit" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>

                <el-form-item label="运费模板:" prop="cost_template_id">
                    <el-select v-model="template.model.cost_template_id" placeholder="请选择" size="medium"
                               class="input-text-left input-normal-width" @change="check"
                    >
                        <el-option v-for="item in template.model.template_list" :label="item.cost_template_name"
                                   :key="item.cost_template_id" :value="item.cost_template_id"
                        >
                        </el-option>
                    </el-select>
                    <el-button type="text" @click="reloadLogisticsTemplate">
                        <i class="el-icon-refresh"></i>
                    </el-button>
                    <el-link type="primary" target="_blank" :underline="false" style="margin-left: 10px;"
                             href="https://mms.pinduoduo.com/orders/order/carriage/add"
                    >新建运费模板</el-link>
                </el-form-item>

                <el-form-item label="搬迁方式:" required>
                    <el-radio-group v-model="migrate_type">
                        <el-radio :label="0">草稿箱</el-radio>
                        <el-radio :label="1">直接上线</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <el-form ref="template2" :model="template.model" :rules="rules" label-width="100px" style="width: 50%">
                <el-form-item label="7天退换:" prop="is_refundable">
                    <el-select v-model="template.model.is_refundable" placeholder="请选择" size="small" @change="check">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="假一赔十:" prop="is_folt">
                    <el-select v-model="template.model.is_folt" placeholder="请选择" size="small" @change="check">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="发货承诺:" prop="shipment_limit_second">
                    <el-select v-model="template.model.shipment_limit_second" placeholder="请选择" size="small" @change="check">
                        <el-option label="24小时" :value="86400"></el-option>
                        <el-option label="48小时" :value="172800"></el-option>
                        <el-option label="5天" :value="432000"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否预售:" prop="is_pre_sale">
                    <el-select v-model="template.model.is_pre_sale" placeholder="请选择" size="small" @change="check">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                    <el-date-picker v-if="template.model.is_pre_sale" v-model="preSaleDate"
                                    placeholder="选择日期" size="small" class="input-date-left"
                                    style="width: 150px; margin-left: 10px;"
                                    :picker-options="pickerOptions"
                                    @change="check"
                    > </el-date-picker>
                </el-form-item>

            </el-form>
        </el-card>
        <div  class="common-bottom">
            <el-button style="margin-right: 15px" @click="goback">返回</el-button>
            <el-tooltip :disabled="msgError === ''" placement="top" :content="msgError">
                <span>
                    <el-button type="primary" @click="startMigrate" :disabled="msgError !== ''"
                    >开始搬家</el-button>
                </span>
            </el-tooltip>
        </div>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import utils from '@/common/utils'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

export default {
  mixins: [request],
  components: {
  },
  data () {
    let validateCostTemplate = (rule, value, callback) => {
      if (this.template.model.template_list.length === 0) {
        callback(new Error('运费模板为空，请先新建运费模板'))
      } else if (value === '' || value.toString() === '0') {
        callback(new Error('请选择运费模板'))
      } else {
        callback()
      }
    }
    let validatePreSale = (rule, value, callback) => {
      if (value && !this.preSaleDate) {
        callback(new Error('请选择预售时间'))
      } else {
        callback()
      }
    }
    return {
      migrate_type: 1,
      preSaleDate: null,
      msgError: '',
      typeRadios: [
        { value: 0, label: '草稿箱' },
        { value: 1, label: '直接上线' }
      ],
      pickerOptions: this.disabledDate(),
      rules: {
        customer_num: [
          { required: true, message: '请输入团购人数', trigger: 'change' },
          { type: 'number', message: '团购人数必须为数字' }
        ],
        order_limit: [
          { required: true, message: '请输入单次限量', trigger: 'change' },
          { type: 'number', message: '单次限量必须为数字' }
        ],
        buy_limit: [
          { required: true, message: '请输入限购次数', trigger: 'change' },
          { type: 'number', message: '限购次数必须为数字' }
        ],
        cost_template_id: [
          { required: true, message: '请选择运费模板', trigger: 'change' },
          { validator: validateCostTemplate, trigger: 'change' }
        ],
        is_refundable: [
          { required: true, message: '请选择是否7天退换', trigger: 'change' }
        ],
        is_folt: [
          { required: true, message: '请选择是否假一赔十', trigger: 'change' }
        ],
        is_pre_sale: [
          { required: true, message: '请选择是否是否预售', trigger: 'change' },
          { validator: validatePreSale, trigger: 'change' }
        ],
        shipment_limit_second: [
          { required: true, message: '请选择发货承诺', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      getSelectTPProductIdList: 'getSelectTPProductIdList',
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices'
    })
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
    this.check()
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    disabledDate (time) {
      let self = this
      return {
        disabledDate (time) {
          let curTime = time.getTime()
          // “预售时间不能小于当前时间+承诺发货时间+1天之和”
          // “预售时间不可超过30天”（今天为1天，最后1天也为1天，29天）
          return curTime < moment().startOf('day').add(1, 'days').valueOf() + self.template.model.shipment_limit_second * 1000 || curTime > moment().startOf('day').add(28, 'days').valueOf()
        }
      }
    },
    beforeunloadFn (e) {
      e = e || window.event
      if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    check () {
      this.msgError = ''
      let validateFun = (valid) => {
        if (valid) {
        } else {
          this.msgError = '模板存在错误'
          return false
        }
      }
      this.$refs['template1'].validate(validateFun)
      this.$refs['template2'].validate(validateFun)
    },
    startMigrate () {
      if (this.msgError !== '') {
        return
      }
      let keyList = ['customer_num', 'order_limit', 'buy_limit', 'cost_template_id',
        'is_refundable', 'is_folt', 'is_pre_sale', 'shipment_limit_second',
        'group_price_rate', 'group_price_diff', 'single_price_rate', 'single_price_diff',
        'price_rate', 'price_diff']
      let params = {}
      for (let key in this.template.model) {
        if (keyList.includes(key)) {
          params[key] = this.template.model[key]
        }
      }
      if (this.template.isDiff()) {
        this.request('updateTemplate', params, data => {
          this.migrage()
        })
      } else {
        this.migrage()
      }
    },
    migrage () {
      if (this.getSelectTPProductIdList.length === 0) {
        this.$message.error('没有选择搬家商品')
      }
      let date = ''
      if (this.template.model.is_pre_sale && this.preSaleDate) {
        date = moment(this.preSaleDate).format('L')
      }
      let params = {
        group_mult: this.template.model.group_price_rate * 100,
        group_diff: utils.yuanToFen(this.template.model.group_price_diff),
        unit_mult: this.template.model.single_price_rate * 100,
        unit_diff: utils.yuanToFen(this.template.model.single_price_diff),
        price_mult: this.template.model.price_rate * 100,
        price_diff: utils.yuanToFen(this.template.model.price_diff),
        migration_type: this.migrate_type,
        pre_sale_date: date,
        tp_product_ids: this.getSelectTPProductIdList,
        custom_prices: JSON.stringify(this.dicCustomPrices)
      }
      this.request('migrate', params, data => {
        if (this.loadingCnt === 0) {
          this.$message('搬家任务已生效')
          this.setSelectTPProductIdList([])
          this.dicCustomPrices = {}
          this.$router.push({
            name: 'ProductList',
            params: {
              isMigrateComplete: false,
              keepStatus: true,
              needRefresh: true
            }
          })
        }
      })
    },
    goback () {
      this.$router.go(-1)
    },
    reloadLogisticsTemplate () {
      this.request('getPddLogisticsTemplate', {}, data => {
        if (data.length > 0) {
          this.template.model.template_list = data
          this.check()
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
