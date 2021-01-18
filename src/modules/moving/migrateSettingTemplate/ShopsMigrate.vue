<template lang="html">
    <div v-loading="loadingCnt">
        <div style="text-align: left">
            <el-steps :active="2" finish-status="success">
                <el-step title="选择商品"></el-step>
                <el-step title="编辑价格"></el-step>
                <el-step title="修改模板"></el-step>
            </el-steps>
        </div><br>
       <div class="setting-content-with-tip" style="display:flex; position:relative;">
            <el-form size="small" ref="template1" :model="template.model" :rules="rules" label-width="120px" style="width: 46%">
                <el-form-item label="付款方式:" required>
                    <el-radio-group v-model="template.model.pay_type">
                        <el-radio :label="0">货到付款</el-radio>
                        <el-radio :label="1">在线支付</el-radio>
                        <el-radio :label="2">两者都支持</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="客服电话:" prop="mobile">
                    <el-input v-model="template.model.mobile" size="medium" class="input-num" @input="check"></el-input>
                </el-form-item>
            </el-form>
          <div class="help-tips" @click="goHelpLink">
            <span><i class="el-icon-s-opportunity"></i>如何填写？</span>
          </div>
        </div>
        <!-- 新版运费模版 start-->
        <div class="step-delivery setting-content-with-tip" >
          <el-form
            label-width="120px"
            size="small"
            ref="stock"
            :model="template.model"
            :rules="stockRules">
              <el-form-item label="运费模版:" prop="cost_template_id">
                  <el-select v-model="template.model.cost_template_id" placeholder="请选择" size="small" @change="check">
                    <el-option label="2天" :value="2"></el-option>
                    <el-option label="3天" :value="3"></el-option>
                    <el-option label="5天" :value="5"></el-option>
                    <el-option label="7天" :value="7"></el-option>
                    <el-option label="10天" :value="10"></el-option>
                    <el-option label="15天" :value="15"></el-option>
                </el-select>
                <el-button type="text" @click="reloadBrandList"><i class="el-icon-refresh"></i>刷新</el-button>
                <el-button type="text" @click="open(catId)"> 添加品牌 </el-button>
              </el-form-item>
              <el-form-item label="搬迁方式:" prop="commit_type">
                  <el-radio-group v-model="template.model.commit_type">
                      <el-radio :label="0">直接上线</el-radio>
                      <el-radio :label="1">草稿箱</el-radio>
                  </el-radio-group>
              </el-form-item>
              <el-form-item label="订单库存计数:" prop="reduce_type">
                  <el-radio-group v-model="template.model.reduce_type">
                      <div><el-radio :label="0">下单减库存 <span class="info">买家提交订单，扣减库存，存在恶拍风险</span></el-radio></div>
                      <div><el-radio :label="1">付款减库存 <span class="info">买家支付订单时，扣件库存，存在超卖风险</span></el-radio></div>
                  </el-radio-group>
              </el-form-item>
          </el-form>
        </div>
         <!-- 新版运费模版 end-->
        <!-- 发货模式 start-->
        <div class="step-delivery setting-content-with-tip" v-if="typeof template.model.presell_type !== 'undefined'" >
          <el-form
            label-width="120px"
            size="small"
            :rules="presellRules"
            :model="template.model"
            ref="presellRef">
            <el-form-item label="发货模式:" prop="presell_type" >
                <!-- 预售类型，1-全款预售，0-非预售，2-阶梯库存，默认0 -->
                <el-radio-group v-model="template.model.presell_type" >
                  <el-radio :label="0" class="presell_type">现货发货模式</el-radio>
                  <el-radio :label="1" class="presell_type">全款预售发货模式
                    <p  v-if="template.model.presell_type === 1">商品发布成功后，预售期间产生的订单需以预售发货时间进行发货，预售结束后，商品自动下架</p>
                  </el-radio>
                  <el-radio :label="2" class="presell_type">
                    阶梯发货模式
                    <p  v-if="template.model.presell_type === 2">商品发布成功先现货售卖，现货订单需按照现货发货时间进行发货；</p>
                    <p  v-if="template.model.presell_type === 2">现货库存售罄后生成的订单需以阶梯发货时间进行发货</p>
                  </el-radio>
                </el-radio-group>
                <div class="info">如果切换发货模式，原发货模式下的订单若被取消，系统不会自动回增库存</div>
            </el-form-item>

            <!-- 现货发货模式 -->
            <el-form-item label="承诺发货时间:" prop="delivery_delay_day" v-if="template.model.presell_type === 0">
                <el-select v-model="template.model.delivery_delay_day" placeholder="请选择" size="small" @change="check">
                    <el-option label="2天" :value="2"></el-option>
                    <el-option label="3天" :value="3"></el-option>
                    <el-option label="5天" :value="5"></el-option>
                    <el-option label="7天" :value="7"></el-option>
                    <el-option label="10天" :value="10"></el-option>
                    <el-option label="15天" :value="15"></el-option>
                </el-select>
            </el-form-item>

            <!-- 全款预售发货模式 -->
            <el-form-item label="预售结束时间:"  v-if="template.model.presell_type === 1" prop="presell_end_time">
                <el-date-picker
                  class="margin-bottom-4"
                  v-model="template.model.presell_end_time"
                  type="datetime"
                  placeholder="选择日期时间"
                  default-time="00:00:00">
                </el-date-picker>
                <p class="info">最多支持设置距离当前30天</p>
            </el-form-item>
            <!-- 阶梯发货 -->
            <el-form-item label="现货发货时间:"  v-if="template.model.presell_type === 2" >
                <span>48小时</span>
                <p class="info">现货发货模式下生成的订单平台统一规定发货时间为48小时，请严格按照承诺发货时间进行发货</p>
            </el-form-item>
            <el-form-item
              :label="template.model.presell_type === 1 ?'预售发货时间:':'阶梯发货时间:'"
              v-if="template.model.presell_type === 1 || template.model.presell_type === 2"
              prop="presell_delay">
                <template v-if="template.model.presell_type === 1">
                <span>预售结束后</span>
                <el-input-number
                  v-model="template.model.presell_delay"
                  controls-position="right"
                  @change="handleChange"
                  :min="3"
                  :max="30"
                  class="input-number margin-bottom-4"></el-input-number>
                <span>天发货</span>
                <p class="info">预售商品发货时间以此限制为主，仅可设置3-30天</p>
                </template>
                <template v-if="template.model.presell_type === 2">
                <span>订单生成后</span>
                <el-input-number
                  v-model="template.model.presell_delay"
                  controls-position="right"
                  @change="handleChange"
                  :min="3"
                  :max="30"
                  class="input-number margin-bottom-4"></el-input-number>
                <span>天发货</span>
                <p class="info">预售商品发货时间以此限制为主，仅可设置3-30天</p>
                </template>
            </el-form-item>
            <!-- 阶梯发货 -->
            <el-form-item label="库存设置:"  v-if="template.model.presell_type === 2" prop="step_stock_num_diff">
                <span>现货库存设置为</span>
                <el-input-number
                  v-model="template.model.step_stock_num_diff"
                  controls-position="right"
                  @change="handleChange"
                  :min="0"
                  class="input-number"></el-input-number>
                <span>,&nbsp;&nbsp;剩余为阶梯发货库存&nbsp;&nbsp;&nbsp;(原商品库存 = 现货库存 + 阶梯库存)</span>
            </el-form-item>
          </el-form>
        </div>
        <!-- 发货模式 end-->
        <!-- 搬家店铺 start-->
        <!-- <div class="setting-content-with-tip">
          <el-form label-width="120px"  size="small">
            <el-form-item label="搬家店铺:">
              <el-checkbox
                v-model="checkSelf"
                class="current-shop">
                本店铺</el-checkbox>
              <div v-for="(parentShop,idx) in bindList" :key="idx" class="group">
                <div v-if="parentShop.is_main" class="is-main">
                  <el-checkbox
                    @change="handleCheckAllChange($event,Number(parentShop.user_id))"
                    :value="isIndeterminate  ? isIndeterminate[`isIndeterminate${parentShop.user_id}`] : false"
                    style="margin-right:10px"
                    >全选&nbsp;&nbsp;{{parentShop.shop_name}} 是主店铺</el-checkbox>
                </div>
                <el-checkbox-group
                  v-model="checkedBindShopList"
                  @change="handleCheckedBindListValueChange($event,Number(parentShop.user_id))">
                  <el-checkbox
                    v-for="childShop in parentShop.user_list"
                    :label="Number(childShop.user_id)"
                    :key="Number(childShop.user_id)"
                    :disabled="parentShop.auth_status === 'expire'"
                    v-if="!childShop.is_self"
                    class="checkbox">
                      <div class="label-name">
                        <span>{{childShop.shop_name}}</span>
                        <span>({{childShop.auth_status === 'expire' ? '过期': childShop.first_category_name_list.join('、') }})</span>
                        <span v-html="getCannotMigrateShops(childShop.able_migrate_tp_product_id_list)"></span>
                      </div>
                    </el-checkbox>
                </el-checkbox-group>
              </div>
              <p class="diffrent-category-tip"><span >*</span>仅允许搬家商品一级类目与店铺一级类目相同的商品</p>
            </el-form-item>
          </el-form>
        </div> -->
        <!-- 搬家店铺 end -->
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
import { createNamespacedHelpers, mapGetters, mapState, mapActions } from 'vuex'
import moment from 'moment'
import cloneDeep from 'lodash/cloneDeep'
// import omit from 'lodash/omit'
import pick from 'lodash/pick'
import isEmpty from 'lodash/isEmpty'
// import isEqual from 'lodash/isEqual'
// import Api from '@/api/apis'

const {
  mapActions: mapActionsMoving,
  mapGetters: mapGettersMoving
} = createNamespacedHelpers('moving/migrateSettingTemplate')

export default {
  mixins: [request],
  components: {
  },
  data () {
    // let validatePreSale = (rule, value, callback) => {
    //   if (value && !this.preSaleDate && !this.template.model.presell_delay) {
    //     callback(new Error('请选择预售时间及发货时间'))
    //   } else {
    //     callback()
    //   }
    // }
    const checkDeliveryDelayDay = (rule, value, callback) => {
      const startTime = new Date()
      const days = moment(value).diff(moment(startTime), 'days')
      if (days > 30) {
        callback(new Error('不可以超过30天'))
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
          { required: true, message: '请输入客服电话', trigger: 'change' }
        ]
      },
      isStartMigrate: false,
      dateRange: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],

      // 多选
      checkSelf: true,
      checkAll: false,
      checkedBindShopList: [],
      isIndeterminate: undefined,
      bindList: [],
      bindListValue: {},
      presell: {},
      presellRules: {
        presell_type: [
          { required: true, message: '请选择发货模式', trigger: 'blur' }
        ],
        delivery_delay_day: [
          { required: true, message: '请输入发货时间', trigger: 'change' }
        ],
        presell_end_time: [
          { required: true, message: '请输入预售结束时间', trigger: 'blur' },
          { validator: checkDeliveryDelayDay, trigger: 'blur' }
        ],
        presell_delay: [
          { required: true, message: '请输入发货时间', trigger: 'blur' }
        ],
        step_stock_num_diff: [
          { required: true, message: '请输入库存设置', trigger: 'blur' }
        ]
      },
      stock: {},
      stockRules: {
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
  async created () {
    // 初始化 曾经有 就取保存的 没有就新建
    if (isEmpty(this.template.model)) {
      this.loadingCnt++
      await this.requestTemplate()
      this.loadingCnt--
    }
  },
  mounted () {

  },
  computed: {
    ...mapGettersMoving({
      template: 'getTemplate',
      dicCustomPrices: 'getDicCustomPrices'
    }),
    ...mapGetters({
      getSelectTPProductIdList: 'getSelectTPProductIdList'
    }),
    ...mapState(['ownerId'])
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
    this.check()
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  methods: {
    ...mapActionsMoving([
      'requestTemplate',
      'loadTempTemplate',
      'removeTempTemplate',
      'removeDicCustomPrices',
      'saveTempTemplate'
    ]),
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    getCannotMigrateShops (num) {
      if (!this.getSelectTPProductIdList) return ''
      const total = this.getSelectTPProductIdList.length || 0
      const str = total - num > 0 ? total - num : 0
      if (!str) return ''
      return `<p class="label-tip">预计有${str}个商品不可搬家</p>`
    },
    handleCheckedBindListValueChange (value, userId) {
      //  全选
      const currentGroup = this.bindList.find(item => Number(item.user_id) === Number(userId))
      if (currentGroup) {
        const childs = currentGroup.user_list || []
        const indeterminate = []
        childs.map(item => {
          const childUserId = Number(item.user_id)
          const childIndex = value.findIndex(v => childUserId === Number(v))
          if (childIndex > -1) {
            indeterminate.push(item.user_id)
          }
        })
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        if (indeterminate.length === (currentGroup.user_list.length)) {
          this.isIndeterminate = {...cloneDeep(this.isIndeterminate), [`isIndeterminate${userId}`]: true}
        } else {
          this.isIndeterminate = {...cloneDeep(this.isIndeterminate), [`isIndeterminate${userId}`]: false}
        }
      }
    },
    //  全选 反选
    handleCheckAllChange (value, userId) {
      const currentGroup = this.bindList.find(item => Number(item.user_id) === Number(userId))
      const childs = (currentGroup.user_list || []).map(item => Number(item.user_id))
      childs.push(Number(userId))
      if (value) {
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        this.isIndeterminate = cloneDeep(this.isIndeterminate || {})
        this.isIndeterminate[`isIndeterminate${userId}`] = true
        const unitcheckedBindShopList = this.checkedBindShopList.concat(childs).map(item => Number(item))
        const nextcheckedBindShopList = [...new Set(unitcheckedBindShopList)]
        this.checkedBindShopList = nextcheckedBindShopList
      } else {
        //  vue很傻逼 vue中数据更改了，但是视图没有更新 必须要重新复制一个新对象
        this.isIndeterminate = cloneDeep(this.isIndeterminate || {})
        this.isIndeterminate[`isIndeterminate${userId}`] = false
        const childsSet = new Set(childs)
        const checkedBindShopListSet = new Set(this.checkedBindShopList)
        const nextcheckedBindShopList = [...checkedBindShopListSet].filter(item => !childsSet.has(Number(item)))
        this.checkedBindShopList = [...nextcheckedBindShopList]
      }
    },
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
      // this.msgError = ''
      // let validateFun = (valid) => {
      //   if (valid) {
      //   } else {
      //     this.msgError = '模板存在错误'
      //     return false
      //   }
      // }
      // this.$refs['template1'].validate(validateFun)
      // this.$refs['template2'].validate(validateFun)
    },
    getTemplateParams () {
      let keyList = ['pay_type', 'mobile', 'cos_ratio', 'cost_template_id',
        'is_refundable', 'is_folt', 'is_pre_sale', 'shipment_limit_second',
        'group_price_rate', 'group_price_diff', 'single_price_rate', 'single_price_diff',
        'price_rate', 'price_diff', 'origin_price_diff', 'is_sale_price_show_max', 'step_stock_num_diff',
        'presell_type', 'presell_delay', 'deliver_delay_day'
      ]
      let params = {}
      for (let key in this.template.model) {
        if (keyList.includes(key)) {
          params[key] = this.template.model[key]
        }
      }
      return params
    },
    async startMigrate () {
      if (this.msgError !== '') {
        return
      }
      this.removeTempTemplate()
      let params = this.getTemplateParams()
      if (this.template.model.migrate_shop_template && this.template.model.migrate_shop_template.length > 0) {
        params['cost_template_id'] = this.template.model.migrate_shop_template[0].cost_template_id
      }
      // 检测发货模式
      const valid = await this.$refs.presellRef.validate()
      if (!valid) return
      // 根据不同的发货模式 取字段
      let presell = {}
      if (this.template.model.presell_type === 0) {
        presell = pick(this.template.model.presell_type, ['presell_type', 'delivery_delay_day'])
      } else if (this.template.model.presell_type === 1) {
        presell = pick(this.template.model.presell_type, ['presell_type', 'presell_end_time', 'presell_delay'])
        presell.presell_end_time = moment(presell.presell_end_time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        presell = pick(this.template.model.presell_type, ['presell_type', 'presell_delay', 'step_stock_num_diff'])
        // 抖音阶梯发货 现货都是48小时
        presell.deliver_delay_day = moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
        this.template.model.deliver_delay_day = moment().add(2, 'days').format('YYYY-MM-DD HH:mm:ss')
      }
      // const diffPresell = !isEqual(cloneDeep(this.template.model.presell), this.defaultPresell)
      const diffTemplate = this.template.isDiff()
      if (diffTemplate) {
        this.request('updateTemplate', params, data => {
          this.migrage(presell)
        })
      } else {
        this.migrage(presell)
      }
    },
    resetForm (formName) {
      this.$refs['presellRef'].resetFields()
    },
    migrage (presell = {}) {
      this.isStartMigrate = true
      if (this.getSelectTPProductIdList.length === 0) {
        this.$message.error('没有选择搬家商品')
      }
      // 检测必须要选择一个搬家店铺
      // let selfShopId = ''
      // this.originBindList.map(item => {
      //   if (item.is_self) {
      //     selfShopId = item.user_id
      //   } else {
      //     item.user_list.forEach(child => {
      //       if (child.is_self) {
      //         selfShopId = child.user_id
      //       }
      //     })
      //   }
      // })
      // let migrateShop = cloneDeep(this.checkedBindShopList)
      // if (this.checkSelf) {
      //   migrateShop.push(selfShopId)
      // } else {
      //   migrateShop = migrateShop.filter(i => Number(i) !== Number(this.selfShopId))
      // }
      // if (!migrateShop.length) {
      //   this.$message.error('请选择搬家店铺')
      //   return false
      // }
      // 注释多店铺搬家
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
      templateParams = {...templateParams, ...presell, ...this.stock}

      let params = {
        template: JSON.stringify(templateParams),
        migration_type: this.migrate_type,
        // 预售结束时间
        pre_sale_date: presell.presell_end_time,
        // mobile: this.template.model.mobile,
        // pay_type: this.template.model.pay_type,
        // cos_ratio: this.template.model.cos_ratio,
        tp_product_ids: this.getSelectTPProductIdList,
        custom_prices: JSON.stringify(this.dicCustomPrices),
        // 注释多店铺搬家
        // migrate_shop: JSON.stringify(migrateShop.map(userId => ({user_id: userId})))
        migrate_shop: JSON.stringify(migrateShop)
      }
      this.request('migrate', params, data => {
        if (this.loadingCnt === 0) {
          this.isStartMigrate = false
          this.setSelectTPProductIdList([])
          this.dicCustomPrices = {}
          this.removeDicCustomPrices()
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
      this.saveTempTemplate()
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
