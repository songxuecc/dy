<!--  -->
<template>
    <div class="card">
        <h1>类目价格</h1>
         <el-form ref="form" size="mini" :model="form" label-width="100px" :rules="rules">
            <el-form-item  label="组合商品类目:" class="item" prop="category_id">
              <el-select v-model="form.category_id" @change="chooseProperties" @blur="chooseProperties(form.category_id)" placeholder="选择商品后可选择类目,请选择组合商品类目" style="width:295px;margin-right:12px" :disabled="!categoryOptions.length">
                <el-option :label="option.category_show" :value="option.category_leaf_id" v-for="option in categoryOptions" :key="option.product_id" class="left dropdown">{{option.category_show}}</el-option>
              </el-select>
              <i class="el-icon-loading" v-if="loading"></i>
            </el-form-item>

            <el-form-item label="类目属性:" class="item" >
              <i class="el-icon-loading" v-if="loading"></i>
              <span v-else>
                <span
                  class="underline-hover pointer font-12 primary"
                  v-if="form.category_id && propertiesChooseText"
                  @click="chooseProperties(form.category_id)"
                  >{{ propertiesChooseText }}</span>
              <span
                  class="underline-hover pointer font-12 warning"
                  v-else
                  @click="chooseProperties(form.category_id)"
                  >选择类目后可选择属性，请选择组合商品类目属性</span
                >
              </span>
            </el-form-item>

            <el-form-item label="发货模式:" class="item" prop="presell_type">
                  <el-radio-group v-model="form.presell_type">
                    <el-radio :label="0">现货发货模式</el-radio>
                    <el-radio :label="1">全款预售发货模式</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="现货发货时间:" prop="delivery_delay_day" class="item mb-10" v-if="form.presell_type === 0" >
                  <el-radio-group v-model="form.delivery_delay_day">
                    <el-radio :label="9999">当日发</el-radio>
                    <el-radio :label="1">24小时</el-radio>
                    <el-radio :label="2">48小时</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="预售结束时间:"  v-if="form.presell_type === 1" prop="presell_end_time" style="margin-bottom:10px">
                  <el-date-picker
                    class="margin-bottom-4"
                    v-model="form.presell_end_time"
                    :picker-options="pickerOptions"
                    type="datetime"
                    placeholder="选择日期时间"
                    default-time="00:00:00">
                  </el-date-picker>
                  <p class="info">最多支持设置距离当前30天</p>
              </el-form-item>
              <el-form-item  label=" 预售发货时间:" prop="presell_delay" style="display:inline-block;width:400px;margin-bottom:10px" v-if="form.presell_type === 1">
                <span>订单生成后</span>
                <el-input-number
                    controls-position="right"
                    @change="handleChange"
                    v-model="form.presell_delay"
                    :min="2"
                    :max="15"
                    class="input-number mb-5"></el-input-number>
                <span>天发货</span>
                <p class="info mb-10 ladderText">预售发货时间需在2-15天</p>
            </el-form-item>

              <el-form-item  label="售卖价:"  class="item" prop="discount_price" >
                  <el-input
                      style="width: 295px"
                      :max="99999999"
                      v-model="form.discount_price"
                      class="price"
                      placeholder="必须大于0，最多保留两位小数"
                  >
                      <template slot="append">元</template>
                  </el-input>
              </el-form-item>

              <el-form-item  label="划线价:"  class="item"  prop="market_price" >
                  <el-input
                      style="width: 295px"
                      :max="99999999"
                      v-model="form.market_price"
                      class="price"
                      placeholder="划线价需高于售卖价，最多保留两位小数"
                  >
                      <template slot="append">元</template>
                  </el-input>
              </el-form-item>
          </el-form>
          <el-dialog
            class="dialog-tight"
            title="类目属性设置"
            width="858px"
            :visible.sync="visible"
            append-to-body
            center
            ref="PropertiesVislble"
          >
            <Properties ref="Properties" @close="handleClose" v-if="visible"/>
          </el-dialog>

    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'
import Properties from './Properties.vue'
import servises from '@servises'
import commonUtils from '@/common/commonUtils'
import utils from '@/common/utils'

export default {
  name: 'component_name',
  props: {
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if ((value && !utils.isNumber(value))) {
        callback(new Error('请填写数字'))
      } else if (!value) {
        callback(new Error('请填写价格'))
      } else {
        callback()
      }
    }

    return {
      visible: false,
      loading: false,
      form: {
        category_id: '',
        presell_type: 0,
        market_price: '',
        discount_price: '',
        presell_end_time: '',
        delivery_delay_day: 9999,
        presell_delay: 2
      },
      attribution_list: undefined,
      pickerOptions: {
        disabledDate: (time) => {
          const value = moment(time)
          const now = moment()
          const diff = value.diff(now, 'days', true)
          return diff > 30 || value.isBefore(now, 'days')
        }
      },
      rules: {
        category_id: [
          { required: true, message: '请选择组合商品类目，先选择商品即可选择类目', trigger: ['blur', 'change'] }
        ],
        market_price: [
          { required: true, message: '请选择划线价', trigger: ['blur', 'change'] },
          { validator: validatePass, trigger: ['blur', 'change'] }
        ],
        discount_price: [
          { required: true, message: '请输入售卖价', trigger: ['blur', 'change'] },
          { validator: validatePass, trigger: ['blur', 'change'] }
        ],
        presell_type: [
          { required: true, message: '请输入发货模式', trigger: ['blur', 'change'] }
        ],
        delivery_delay_day: [
          { required: true, message: '请输入发货时间', trigger: ['blur', 'change'] }
        ],
        presell_end_time: [
          { required: true, message: '请输入预售结束时间', trigger: ['blur', 'change'] },
          { validator: commonUtils.checkDeliveryDelayDay, trigger: ['blur', 'change'] }
        ],
        presell_delay: [
          { required: true, message: '请输入发货时间', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  components: {
    Properties
  },
  computed: {
    ...mapGetters('productManagement/combination/tableSepcify', [
      'categoryOptions'
    ]),
    propertiesChooseText () {
      if (!this.attribution_list) return ''
      let requireTotal = 0
      let requireNumber = 0
      let chooseTotal = 0
      let chooseNumber = 0
      const properties = this.attribution_list.properties

      properties.forEach((item) => {
        if (item.required) {
          requireTotal++
          if (item.tp_value) requireNumber++
        } else {
          chooseTotal++
          if (item.tp_value) chooseNumber++
        }
      })

      if (properties.length) {
        return `必填${requireNumber}/${requireTotal},选填${chooseNumber}/${chooseTotal}`
      }
      return false
    }
  },
  methods: {
    async chooseProperties (id) {
      if (id && typeof id === 'number') {
        const option = this.categoryOptions.find(item => item.category_leaf_id === id)
        const category = {
          name: option.category_show,
          id
        }
        this.loading = true
        const data = {}
        // 如果这次请求和上次请求的id相同 则不请求
        if (data.preCategoryId && data.preCategoryId === id) {
          this.visible = !this.visible
          this.$nextTick(() => {
            this.$refs.Properties && this.$refs.Properties.init(data)
            this.loading = false
          })
          return false
        }
        const properties = await servises.getPropductCategoryProperty({
          category_id: id
        })
        data.properties = properties
        data.preCategoryId = id
        data.category = category
        this.visible = !this.visible
        this.$nextTick(() => {
          this.$refs.Properties && this.$refs.Properties.init(data)
          this.loading = false
        })
      } else {
        this.loading = false
        return this.$message.warning('请选择分类')
      }
    },

    handleClose (data, idx) {
      this.visible = !this.visible
      data.properties = data.properties
        .filter(item => item.tp_value)
        .map(item => ({
          name: item.name,
          value: item.tp_value
        }))
      this.attribution_list = data
      console.log(data, 'data')
    },
    getForm () {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid, object) => {
          if (this.form.category_id && this.attribution_list && this.attribution_list.properties) {
            const form = {
              ...this.form,
              attribution_list: JSON.stringify(this.attribution_list.properties),
              discount_price: utils.yuanToFen(this.form.discount_price),
              market_price: utils.yuanToFen(this.form.market_price)
            }
            resolve(form)
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
.price {
        /deep/ .el-input__inner {
          // border-right: none;
          padding: 5px;
          padding-left: 10px;
        }

      }
  .dropdown {
      height: 25px;
      line-height: 25px;
      font-size: 12px;
      padding: 0 10px;
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
