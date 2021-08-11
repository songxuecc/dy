<!-- 售卖&划线价 -->
<template>
  <div>
    <el-form ref="form" :model="form" size="small" label-position="left" :rules="rules" >
      <div class="flex mb-10">
        <p style="padding-top: 10px;padding-right: 25px;">售卖价</p>
        <div>
          <el-form-item>
            <el-radio v-model="form.discount.discount_price_type" :label="4" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">按照公式修改&nbsp;<span class="bold">售卖价</span>&nbsp;=&nbsp;
                  <el-select v-model="form.discount.price_type" placeholder="请选择" style="width:105px"
                    popper-class="SaleAndUnderlinedPrice-popper-class" class="select-price">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <span class="font-12 ml-5 mr-5">x&nbsp;</span>
                </span>
                <el-form-item prop="discount.price_rate">
                  <el-input class="price" style="width: 80px;" :max="99999999" v-model="form.discount.price_rate"
                    @focus="handleFocus('discount.discount_price_type',4)">
                    <template slot="append" >%</template>
                  </el-input>
                </el-form-item>
                <span class="color-4e font-14 ml-5 mr-5">&nbsp;+&nbsp;</span>
                <el-form-item prop="discount.incr_diff">
                  <el-input class="price" style="width: 80px" :max="99999999" v-model="form.discount.incr_diff"
                    @focus="handleFocus('discount.discount_price_type',4)">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
                <span class="color-4e font-18 ml-5 mr-5">&nbsp;-&nbsp;</span>
                <el-form-item prop="discount.desc_diff">
                  <el-input class="price" style="width: 80px" :max="99999999" v-model="form.discount.desc_diff"
                    @focus="handleFocus('discount.discount_price_type',4)">
                    <template slot="append">元</template>
                  </el-input>
                </el-form-item>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.discount.discount_price_type"  :label="1" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">统一&nbsp;<span class="bold">售卖价&nbsp;</span>为&nbsp;</span>
                <el-form-item prop="discount.price">
                  <el-input class="price" style="width: 360px" v-model="form.discount.price" :max="99999999"
                    @focus="handleFocus('discount.discount_price_type',1)" clearable @clear="handleClear('discount.price')"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  </el-form-item>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.discount.discount_price_type"  :label="3" class="flex align-c">
              将售卖价设置为对应SKU的最低价
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.discount.discount_price_type"  :label="0" class="flex align-c">
              不修改
            </el-radio>
          </el-form-item>
        </div>
      </div>

      <div class="flex mb-10">
        <p style="padding-top: 10px;padding-right: 25px;">划线价</p>
        <div>
          <el-form-item>
            <el-radio v-model="form.market.discount_price_type"  :label="4" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">按照公式修改&nbsp;<span class="bold">划线价</span>&nbsp;=&nbsp;
                  <el-select v-model="form.market.price_type" placeholder="请选择" style="width:105px"
                    popper-class="SaleAndUnderlinedPrice-popper-class" class="select-price">
                    <el-option v-for="item in optionsMarket" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <span class="font-12 ml-5 mr-5">x&nbsp;</span>
                </span>
                <el-form-item prop="market.price_rate">
                  <el-input class="price" style="width: 80px;" :max="99999999" v-model="form.market.price_rate"
                  @focus="handleFocus('market.discount_price_type',4)">
                  <template slot="append">%</template>
                </el-input>
                </el-form-item>
                <span class="color-4e font-14 ml-5 mr-5">&nbsp;+&nbsp;</span>
                <el-form-item prop="market.incr_diff">
                  <el-input class="price" style="width: 80px" :max="99999999" v-model="form.market.incr_diff"
                  @focus="handleFocus('market.discount_price_type',4)">
                  <template slot="append">元</template>
                </el-input>
                </el-form-item>
                <span class="color-4e font-18 ml-5 mr-5">&nbsp;-&nbsp;</span>
                <el-form-item prop="market.desc_diff">
                  <el-input class="price" style="width: 80px" :max="99999999" v-model="form.market.desc_diff"
                  @focus="handleFocus('market.discount_price_type',4)"><template
                    slot="append">元</template>
                </el-input>
                </el-form-item>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.market.discount_price_type"  :label="3" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">统一&nbsp;<span class="bold">划线价&nbsp;</span>为&nbsp;</span>
                <el-form-item prop="market.price">
                  <el-input class="price" style="width: 360px" v-model="form.market.price" :max="99999999"
                  @focus="handleFocus('market.discount_price_type',3)" clearable @clear="handleClear('market.price')">
                  <template slot="append">元</template>
                </el-input>
                </el-form-item>
              </span>
            </el-radio>
          </el-form-item>
           <el-form-item>
            <el-radio v-model="form.discount.discount_price_type"  :label="0" class="flex align-c">
              不修改
            </el-radio>
          </el-form-item>
        </div>
      </div>

      <div class="flex">
        <p style="padding-right: 10px;">抹零设置</p>
        <el-form-item>
          <el-radio-group v-model="form.unit">
            <el-radio   :label="1" class="flex align-c">
              四舍五入保留整数
            </el-radio>
            <el-radio   :label="2" class="flex align-c">
              四舍五入保留一位小数点
            </el-radio>
            <el-radio   :label="3" class="flex align-c">
              四舍五入保留两位小数点
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>

<script>
import utils from '@/common/utils'
import set from 'lodash/set'
export default {
  name: 'SaleAndUnderlinedPrice',
  props: {
    msg: String
  },
  data () {
    // 每次至少购买
    const validatePass1 = (rule, value, callback) => {
      if (['discount.price_rate', 'discount.incr_diff', 'discount.desc_diff'].includes(rule.field)) {
        this.$refs.form.clearValidate(['discount.price'])
        if (value && !utils.isNumber(value)) {
          this.changeError(true)
          callback(new Error('必须填写数字'))
        } else {
          this.changeError(false)
          callback()
        }
      } else if (['discount.price'].includes(rule.field)) {
        this.$refs.form.clearValidate(['discount.price_rate', 'discount.incr_diff', 'discount.desc_diff'])
        if (value && !utils.isNumber(value)) {
          this.changeError(true)
          callback(new Error('必须填写数字'))
        } else {
          this.changeError(false)
          callback()
        }
      } else {
        this.changeError(false)
        callback()
      }
    }

    const validatePass2 = (rule, value, callback) => {
      if (['market.price_rate', 'market.incr_diff', 'market.desc_diff'].includes(rule.field)) {
        this.$refs.form.clearValidate(['market.price'])
        if (value && !utils.isNumber(value)) {
          this.changeError(true)
          callback(new Error('必须填写数字'))
        } else {
          this.changeError(false)
          callback()
        }
      } else if (['market.price'].includes(rule.field)) {
        this.$refs.form.clearValidate(['market.price_rate', 'market.incr_diff', 'market.desc_diff'])
        if (value && !utils.isNumber(value)) {
          this.changeError(true)
          callback(new Error('必须填写数字'))
        } else {
          this.changeError(false)
          callback()
        }
      } else {
        this.changeError(false)
        callback()
      }
    }

    return {
      hasError: false,
      options: [{
        value: 1,
        label: '原售卖价'
      }, {
        value: 2,
        label: 'SKU最高价'
      }, {
        value: 3,
        label: 'SKU最低价'
      }],
      optionsMarket: [{
        value: 1,
        label: '原划线价'
      }, {
        value: 2,
        label: 'SKU最高价'
      }],
      value: '',
      form: {
        discount: {
          discount_price_type: 3,
          price_type: 1,
          price_rate: 100,
          incr_diff: '',
          decr_diff: '',
          price: ''
        },
        market: {
          discount_price_type: 4,
          price_type: 1,
          price_rate: 100,
          incr_diff: '',
          decr_diff: '',
          price: ''
        },
        unit: 1
      },
      rules: {
        'discount.price': [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        'discount.desc_diff': [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        'discount.incr_diff': [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        'discount.price_rate': [
          { validator: validatePass1, trigger: ['focus', 'blur', 'change'] }
        ],
        'market.price': [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ],
        'market.desc_diff': [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ],
        'market.incr_diff': [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ],
        'market.price_rate': [
          { validator: validatePass2, trigger: ['focus', 'blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    changeError (bool) {
      this.hasError = bool
    },
    handleFocus (key, value) {
      set(this.form, key, value)
    },
    handleClear (attribute) {
      this.form[attribute] = ''
    },
    getForm () {
      if (this.hasError) {
        this.$message.error('请按提示修改错误')
        return false
      } else {
        const form = {
          discount: {
            discount_price_type: Number(this.form.discount.discount_price_type),
            price_type: Number(this.form.discount.price_type),
            price_rate: utils.yuanToFen(this.form.discount.price_rate),
            incr_diff: utils.yuanToFen(this.form.discount.incr_diff),
            decr_diff: utils.yuanToFen(this.form.discount.decr_diff),
            price: utils.yuanToFen(this.form.discount.price)
          },
          market: {
            discount_price_type: Number(this.form.market.discount_price_type),
            price_type: Number(this.form.market.price_type),
            price_rate: utils.yuanToFen(this.form.market.price_rate),
            incr_diff: utils.yuanToFen(this.form.market.incr_diff),
            decr_diff: utils.yuanToFen(this.form.market.decr_diff),
            price: utils.yuanToFen(this.form.market.price)
          },
          unit: Number(this.form.unit)
        }
        console.log(form, 'form')
        return form
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .block {
    display: inline-block;
  }

  .tip {
    width: 441px;
    height: 16px;
    font-size: 12px;
    color: #4e4e4e;
    line-height: 16px;
  }

  /deep/ .el-input-number__increase {
    display: none;
  }

  /deep/ .el-input-number__decrease {
    display: none;
  }

  /deep/ .el-input .el-input__inner {
    text-align: left;
  }

  /deep/ .el-input-number .el-input__inner {
    padding-left: 10px;
    padding-right: 10px;
  }

  /deep/ .el-input-group__append {
    background: none;
    padding: 0;
    padding-right: 5px;
    padding-left: 5px;
  }

  .price {
    /deep/ .el-input__inner {
      // border-right: none;
      padding: 5px;
      padding-left: 10px;
    }

  }

  .select-price {
    /deep/ .el-input__inner {
      padding: 10px;
    }
  }
</style>

<style lang="less">
  .ProductEditNewView-popper-class {
    border: none !important;
    background-color: #fff;
    background-clip: padding-box;
    border-radius: 4px;
    box-shadow: 0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%);
  }

  .el-select-dropdown__item {
    text-align: left;
    padding: 6px 8px 6px 12px;
    font-size: 12px;
    line-height: 20px;
    font-weight: 400;
    height: 32px;
  }
</style>
