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
            <el-form size="small" ref="template1" :model="template.model" :rules="rules" label-width="100px" style="width: 46%">

                <el-form-item label="付款方式:" required>
                    <el-radio-group v-model="pay_type">
                        <el-radio :label="0">货到付款</el-radio>
                        <el-radio :label="1">在线支付</el-radio>
                        <el-radio :label="2">两者都支持</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="客服号码:" prop="mobile">
                    <el-input v-model.number="template.model.mobile" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>
                <el-form-item label="佣金比例:" prop="cos_ratio">
                  <el-input v-model.number="template.model.cos_ratio" size="medium" class="input-num" @input="check"></el-input><span>&nbsp;&nbsp;%</span>
                </el-form-item>
            </el-form>
            <el-form size="small" ref="template2" :model="template.model" :rules="rules" label-width="120px" style="width: 55%">

                 <el-form-item label="承诺发货时间:" prop="shipment_limit_day">
                    <el-select v-model="template.model.shipment_limit_day" placeholder="请选择" size="small" @change="check">
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
                    <span v-if="template.model.is_pre_sale">&nbsp;&nbsp;预售时间：</span>
                    <el-date-picker v-if="template.model.is_pre_sale" v-model="preSaleDate"
                                    type="datetime"
                                    placeholder="选择日期" size="small" class="input-date-left"
                                    style="width: 150px; margin-left: 10px;"
                                    :picker-options="pickerOptions"
                                    @change="check"
                    > </el-date-picker>
                  <br>
                  <span v-if="template.model.is_pre_sale" style="padding-top: 20px">预售结束后几天发货：</span>
                  <el-select style="padding-top: 20px" v-if="template.model.is_pre_sale" v-model="deliverDateDayLater" placeholder="请选择" size="small" @change="check">
                    <el-option v-for="item in dateRange" :key="item" :label="item" :value="item"></el-option>
                  </el-select>
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
    let validatePreSale = (rule, value, callback) => {
      if (value && !this.preSaleDate && !this.deliverDateDayLater) {
        callback(new Error('请选择预售时间及发货时间'))
      } else {
        callback()
      }
    }
    return {
      pay_type: 1,
      preSaleDate: null,
      deliverDateDayLater: null,
      msgError: '',
      typeRadios: [
        { value: 0, label: '草稿箱' },
        { value: 1, label: '直接上线' }
      ],
      pickerOptions: this.disabledDate(),
      rules: {
        mobile: [
          { required: true, message: '请输入客服号码', trigger: 'change' },
          { type: 'number', message: '客服号码必须为数字' }
        ],
        cos_ratio: [
          { required: true, message: '请输入佣金比例', trigger: 'change' },
          { type: 'number', message: '佣金比例数字' }
        ],
        is_pre_sale: [
          { required: true, message: '请选择是否是否预售', trigger: 'change' },
          { validator: validatePreSale, trigger: 'change' }
        ],
        shipment_limit_day: [
          { required: true, message: '请选择发货承诺', trigger: 'change' }
        ]
      },
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
          return curTime < moment().startOf('day').add(1, 'days').valueOf() + self.template.model.shipment_limit_day * 1000 || curTime > moment().startOf('day').add(28, 'days').valueOf()
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
      let keyList = ['mobile', 'is_pre_sale', 'shipment_limit_day',
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
      if (this.template.model.is_pre_sale && this.preSaleDate && this.deliverDateDayLater) {
        date = moment(this.preSaleDate).format('L')
      }
      let params = {
        group_mult: this.template.model.group_price_rate * 100,
        group_diff: utils.yuanToFen(this.template.model.group_price_diff),
        unit_mult: this.template.model.single_price_rate * 100,
        unit_diff: utils.yuanToFen(this.template.model.single_price_diff),
        price_mult: this.template.model.price_rate * 100,
        price_diff: utils.yuanToFen(this.template.model.price_diff),
        pay_type: this.pay_type,
        pre_sale_date: date,
        deliver_date_day_later: this.deliverDateDayLater,
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
