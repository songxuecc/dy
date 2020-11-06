<template lang="html">
    <div v-loading="loadingCnt">
        <div style="text-align: left">
            <el-steps :active="2" finish-status="success">
                <el-step title="选择商品"></el-step>
                <el-step title="编辑价格"></el-step>
                <el-step title="修改模板"></el-step>
            </el-steps>
        </div><br>
        <el-card class="setting-content-with-tip" body-style="display:flex; position:relative;">
            <el-form size="small" ref="template1" :model="template.model" :rules="rules" label-width="100px" style="width: 46%">

                <el-form-item label="付款方式:" required>
                    <el-radio-group v-model="template.model.pay_type">
                        <el-radio :label="0">货到付款</el-radio>
                        <el-radio :label="1">在线支付</el-radio>
                        <el-radio :label="2">两者都支持</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="客服号码:" prop="mobile">
                    <el-input v-model="template.model.mobile" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>
<!--                <el-form-item label="佣金比例:" prop="cos_ratio">-->
<!--                  <el-input v-model.number="template.model.cos_ratio" size="medium" class="input-num" @input="check"></el-input><span>&nbsp;&nbsp;%</span>-->
<!--                </el-form-item>-->
            </el-form>
            <el-form size="small" ref="template2" :model="template.model" :rules="rules" label-width="180px" style="width: 55%">

                 <el-form-item label="承诺发货时间:" prop="delivery_delay_day">
                    <el-select v-model="template.model.delivery_delay_day" placeholder="请选择" size="small" @change="check">
                        <el-option label="2天" :value="2"></el-option>
                        <el-option label="3天" :value="3"></el-option>
                        <el-option label="5天" :value="5"></el-option>
                        <el-option label="7天" :value="7"></el-option>
                        <el-option label="10天" :value="10"></el-option>
                        <el-option label="15天" :value="15"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否预售:" prop="is_pre_sale">
                    <el-select v-model="template.model.is_pre_sale" placeholder="请选择" size="small" @change="check">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="template.model.is_pre_sale" label="预售结束时间:" prop="preSaleDate">
                  <el-date-picker v-model="preSaleDate"
                                  type="datetime"
                                  placeholder="选择日期" size="small" class="input-date-left"
                                  style="width: 190px;"
                                  :picker-options="pickerOptions"
                                  @change="check"
                  > </el-date-picker>
                </el-form-item>
                <el-form-item v-if="template.model.is_pre_sale" label="预售结束后几天发货:" prop="presell_delay">
                  <el-select v-model="template.model.presell_delay" placeholder="请选择" size="small" @change="check">
                    <el-option v-for="item in dateRange" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
                </el-form-item>

            </el-form>
          <div class="help-tips" @click="goHelpLink">
            <span><i class="el-icon-s-opportunity"></i>如何填写？</span>
          </div>
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
    let validatePreSale = (rule, value, callback) => {
      if (value && !this.preSaleDate && !this.template.model.presell_delay) {
        callback(new Error('请选择预售时间及发货时间'))
      } else {
        callback()
      }
    }
    return {
      pay_type: 1,
      preSaleDate: null,
      msgError: '',
      typeRadios: [
        { value: 0, label: '草稿箱' },
        { value: 1, label: '直接上线' }
      ],
      pickerOptions: this.disabledDate(),
      rules: {
        mobile: [
          { required: true, message: '请输入客服号码', trigger: 'change' }
        ],
        // cos_ratio: [
        //   { required: true, message: '请输入佣金比例', trigger: 'change' },
        //   { type: 'number', message: '佣金比例数字' }
        // ],
        is_pre_sale: [
          { required: true, message: '请选择是否是否预售', trigger: 'change' },
          { validator: validatePreSale, trigger: 'change' }
        ],
        delivery_delay_day: [
          { required: true, message: '请选择发货承诺', trigger: 'change' }
        ]
      },
      isStartMigrate: false,
      dateRange: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
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
    if (Object.entries(this.template.model).length === 0) {
      this.loadingCnt++
      this.requestTemplate().then(data => {
        this.loadingCnt--
        this.loadTempTemplate()
        this.check()
      })
    }
  },
  methods: {
    ...mapActions([
      'setSelectTPProductIdList',
      'requestTemplate',
      'loadTempTemplate',
      'removeTempTemplate'
    ]),
    disabledDate (time) {
      let self = this
      return {
        disabledDate (time) {
          let curTime = time.getTime()
          // “预售时间不能小于当前时间+承诺发货时间+1天之和”
          // “预售时间不可超过30天”（今天为1天，最后1天也为1天，29天）
          return curTime < moment().startOf('day').add(1, 'days').valueOf() + self.template.model.delivery_delay_day * 1000 || curTime > moment().startOf('day').add(28, 'days').valueOf()
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
    getTemplateParams () {
      let keyList = ['pay_type', 'mobile', 'cos_ratio', 'delivery_delay_day', 'presell_delay', 'cost_template_id',
        'is_refundable', 'is_folt', 'is_pre_sale', 'shipment_limit_second',
        'group_price_rate', 'group_price_diff', 'single_price_rate', 'single_price_diff',
        'price_rate', 'price_diff', 'origin_price_diff']
      let params = {}
      for (let key in this.template.model) {
        if (keyList.includes(key)) {
          params[key] = this.template.model[key]
        }
      }
      return params
    },
    startMigrate () {
      if (this.msgError !== '') {
        return
      }
      this.removeTempTemplate()
      let params = this.getTemplateParams()
      if (this.template.model.migrate_shop_template && this.template.model.migrate_shop_template.length > 0) {
        params['cost_template_id'] = this.template.model.migrate_shop_template[0].cost_template_id
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
      this.isStartMigrate = true
      if (this.getSelectTPProductIdList.length === 0) {
        this.$message.error('没有选择搬家商品')
      }
      let date = ''
      if (this.preSaleDate) {
        date = moment(this.preSaleDate).format('YYYY-MM-DD HH:mm:ss')
      }
      let migrateShop = []
      if (this.template.model.migrate_shop_template) {
        for (let i = 0; i < this.template.model.migrate_shop_template.length; i++) {
          let item = this.template.model.migrate_shop_template[i]
          if (item.is_migrate === true && item.cost_template_id !== '') {
            migrateShop.push({
              'user_id': item['user_id'],
              'template': {
                'cost_template_id': item.cost_template_id
              }
            })
          }
        }
      }
      let templateParams = this.getTemplateParams()
      templateParams.group_price_rate = Math.round(templateParams.group_price_rate * 100)
      templateParams.group_price_diff = utils.yuanToFen(templateParams.group_price_diff)
      templateParams.single_price_rate = Math.round(templateParams.single_price_rate * 100)
      templateParams.single_price_diff = utils.yuanToFen(templateParams.single_price_diff)
      templateParams.price_rate = Math.round(templateParams.price_rate * 100)
      templateParams.price_diff = utils.yuanToFen(templateParams.price_diff)
      templateParams.origin_price_diff = utils.yuanToFen(templateParams.origin_price_diff)
      let params = {
        template: JSON.stringify(templateParams),
        migration_type: this.migrate_type,
        pre_sale_date: date,
        // mobile: this.template.model.mobile,
        // pay_type: this.template.model.pay_type,
        // cos_ratio: this.template.model.cos_ratio,
        // presell_delay: this.template.model.presell_delay,
        tp_product_ids: this.getSelectTPProductIdList,
        custom_prices: JSON.stringify(this.dicCustomPrices),
        migrate_shop: JSON.stringify(migrateShop)
      }
      this.request('migrate', params, data => {
        if (this.loadingCnt === 0) {
          this.isStartMigrate = false
          this.setSelectTPProductIdList([])
          this.dicCustomPrices = {}
          this.$alert('搬家任务已在后台生成, 虎虎正在努力为你搬家，您可以继续其它操作', '提示', {
            confirmButtonText: '确定',
            callback: action => {
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
        }
      }, data => { this.isStartMigrate = false })
    },
    goback () {
      this.$router.go(-1)
    },
    reloadLogisticsTemplate (userId = undefined) {
      let params = {}
      if (userId !== undefined) {
        params['user_id'] = userId
      }
      this.request('getPddLogisticsTemplate', params, data => {
        if (data.length > 0) {
          this.template.model.template_list = data
          this.check()
        }
      })
    },
    goHelpLink () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/zghdvq')
    }
  }
}
</script>

<style lang="less" scoped>
.help-tips {
  width: 100px;
  right: 0px;
  bottom: 15px;
  position: absolute;
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  i {
    font-size: 13px;
    color: #efb947;
    padding-right: 2px;
  }
}
</style>
