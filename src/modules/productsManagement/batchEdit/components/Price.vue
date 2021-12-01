<!-- 库存 -->
<template>
  <div>
    <el-form ref="form" :model="form" size="small" label-position="left" :rules="rules">
      <el-form-item>
        <el-radio v-model="form.is_formula" @change="handleIsFormulaChange" :label="1" class="flex align-c">
          <span class="flex align-c"><span class="color-4e font-12">按照公式修改&nbsp;<span class="bold">原价</span>
            <span class="font-12 ml-5 mr-5">x&nbsp;</span>
          </span>
          <el-form-item prop="origin_price_rate">
            <el-input
              style="width: 95px"
              :max="99999999"
              v-model="form.origin_price_rate"
              @focus="handleIsFormulaFocus"
              class="price"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <span class="color-4e font-14 ml-5 mr-5">&nbsp;+&nbsp;</span>
          <el-form-item prop="incr_diff">
          <el-input
            style="width: 95px"
            :max="99999999"
            v-model="form.incr_diff"
            @focus="handleIsFormulaFocus"
          class="price"
          >
            <template slot="append">元</template>
          </el-input>
          </el-form-item>
          <span class="color-4e font-18 ml-5 mr-5">&nbsp;-&nbsp;</span>
          <el-form-item prop="desc_diff">
          <el-input
            style="width: 95px"
            :max="99999999"
            v-model="form.desc_diff"
            @focus="handleIsFormulaFocus"
          class="price"
          >
            <template slot="append">元</template>
          </el-input>
          </el-form-item>

              </span>
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio
          v-model="form.is_every_price"
          @change="handleIsEveryPriceChange"
          :label="1"
          class="flex align-c"
        >
        <span class="flex align-c">
          <span class="color-4e font-12">价格统一为&nbsp;&nbsp;</span>
          <el-form-item prop="every_price">
          <el-input
            class="price"
            style="width: 390px"
            v-model="form.every_price"
            :max="99999999"
            @focus="handleIsEveryPriceFocus"
            clearable
            @clear="handleClear('every_price')"
          >
            <template slot="append">元</template>
          </el-input>
      </el-form-item>

              </span>

        </el-radio>
      </el-form-item>

      <el-form-item label="误操作防范：">
        <el-checkbox v-model="form.is_open_min_price" style="display: block">
          <el-form-item label="新价格不低于">
            <el-tooltip
              content="若此处填10，当新价格低于10元，则将新价格调整为10"
              placement="right"
            >
          <el-form-item prop="min_price">
              <el-input
                :max="99999999"
                style="width: 289px"
                v-model="form.min_price"
                @focus="handlChecked('is_open_min_price')"
                clearable
                @clear="handleClear('min_price')"
              class="price"
          >
            <template slot="append">元</template>
          </el-input>
      </el-form-item>

            </el-tooltip>
          </el-form-item>
        </el-checkbox>
        <el-checkbox
          v-model="form.is_open_min_price_rate"
          style="margin-left: 84px; display: block; margin-top: 5px"
        >
          <el-form-item label="新价格不低于原价的" prop="min_price_rate">
            <el-tooltip
              content="若此处填200，当新价格低于原价的2倍时，则将新价格调整为原价的2倍"
              placement="right"
            >
              <el-input
                :max="99999999"
                style="width: 254px"
                @focus="handlChecked('is_open_min_price_rate')"
                v-model="form.min_price_rate"
                clearable
                @clear="handleClear('min_price_rate')"
              class="price"
          >
            <template slot="append">%</template>
          </el-input>
            </el-tooltip>
          </el-form-item>
        </el-checkbox>
      </el-form-item>

      <el-form-item label="抹零设置：" class="flex mt-5">
        <el-radio-group v-model="form.unit" class="ml-10">
          <el-radio   :label="1">
            四舍五入保留整数
          </el-radio>
          <el-radio   :label="2">
            四舍五入保留一位小数点
          </el-radio>
          <el-radio   :label="3">
            四舍五入保留两位小数点
          </el-radio>

          <el-radio   :label="-1">
            四舍五入保留两位小数点
            <el-tooltip content="请填写大于0小于1的数。如填写0.8，则原价9元的商品将变为9.8元" placement="top-start">
            <span class="relative">
              <el-input v-model="form.every_decimal"  :debounce="500" controls-position="right" @focus="focus" size="mini" placeholder="请填写数字" style="width:110px" class="numberInput"/>
              <span class="tipNumber" v-if="tipNumberShow">请填写大于0小于1的数字。</span>
            </span>
          </el-tooltip>

          </el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>
    <p class="tip mt-10">
      <span class="fail">*</span
      >注：为保证审核通过，修改后划线价自动调为sku最高价，售卖价调为sku最低价。
    </p>
  </div>
</template>

<script>
import utils from '@/common/utils'
export default {
  name: 'Stocks',
  props: {
  },
  data () {
    // 每次至少购买
    const validatePass1 = (rule, value, callback) => {
      this.valid()

      if (value && !utils.isNumber(value)) {
        callback(new Error('必须填写数字'))
      } else {
        callback()
      }
    }

    // 每次至少购买
    const validatePass2 = (rule, value, callback) => {
      this.valid()
      if (this.form.is_every_price === 1) {
        if (value && !utils.isNumber(value)) {
          callback(new Error('必须填写数字'))
        } else {
          callback()
        }
      } else {
        this.$refs.form.clearValidate(['every_price'])
        callback()
      }
    }

    // 每次至少购买
    const validatePass3 = (rule, value, callback) => {
      this.valid()
      if (value && !utils.isNumber(value)) {
        callback(new Error('必须填写数字'))
      } else {
        callback()
      }
    }

    // 每次至少购买
    const validatePass4 = (rule, value, callback) => {
      this.valid()
      if (value && !utils.isNumber(value)) {
        callback(new Error('必须填写数字'))
      } else {
        callback()
      }
    }
    return {

      rules: {
        'origin_price_rate': [
          { validator: validatePass1, trigger: ['blur', 'change'] }
        ],
        'incr_diff': [
          { validator: validatePass1, trigger: ['blur', 'change'] }
        ],
        'desc_diff': [
          { validator: validatePass1, trigger: ['blur', 'change'] }
        ],
        'every_price': [
          { validator: validatePass2, trigger: ['blur', 'change'] }
        ],
        'min_price': [
          { validator: validatePass3, trigger: ['blur', 'change'] }
        ],
        'min_price_rate': [
          { validator: validatePass4, trigger: ['blur', 'change'] }
        ]
      },
      form: {
        is_formula: 1,
        origin_price_rate: '100',
        incr_diff: '',
        desc_diff: '',
        is_every_price: 0,
        every_price: '',
        is_open_min_price: false,
        min_price: '',
        is_open_min_price_rate: false,
        min_price_rate: '',
        unit: 3,
        every_decimal: ''
      }
    }
  },
  computed: {
    tipNumberShow () {
      let unit = this.form.unit
      let value = this.form.every_decimal
      console.log(value, 'value')
      if (unit === -1) {
        if (value && utils.isNumber(value) && value > 0 && value < 1) {
          return false
        } else {
          return true
        }
      }
    }
  },
  methods: {
    focus () {
      this.form.unit = -1
    },
    valid () {
      if (!this.form.is_formula) {
        this.$refs.form.clearValidate(['origin_price_rate', 'incr_diff', 'desc_diff'])
      }
      if (!this.form.is_every_price) {
        this.$refs.form.clearValidate(['every_price'])
      }
      if (!this.form.is_open_min_price) {
        this.$refs.form.clearValidate(['min_price'])
      }
      if (!this.form.is_open_min_price_rate) {
        this.$refs.form.clearValidate(['min_price_rate'])
      }
    },
    handleIsFormulaChange (value) {
      if (this.form.is_formula) {
        this.form.is_every_price = 0
      } else {
        this.form.is_every_price = 1
      }
    },
    handleIsFormulaFocus () {
      this.form.is_formula = 1
      this.form.is_every_price = 0
    },
    handleIsEveryPriceChange (value) {
      if (this.form.is_every_price) {
        this.form.is_formula = 0
      } else {
        this.form.is_formula = 1
      }
    },
    handleIsEveryPriceFocus () {
      this.form.is_formula = 0
      this.form.is_every_price = 1
    },
    handlChecked (attribute) {
      this.form[attribute] = true
    },
    handleClear (attribute) {
      this.form[attribute] = ''
    },
    getForm () {
      if (!this.form.is_formula && !this.form.is_every_price) {
        this.$message.error('请选择价格修改方式')
        return false
      } else if (this.form.is_formula && !this.form.origin_price_rate) {
        this.$message.error('请填写价格公式')
        return false
      } else if (this.form.is_every_price && !this.form.every_price) {
        this.$message.error('请填写统一价格')
        return false
      }

      return {
        ...this.form,
        is_formula: Number(this.form.is_formula),
        is_every_price: Number(this.form.is_every_price),
        is_open_min_price: Number(this.form.is_open_min_price),
        is_open_min_price_rate: Number(this.form.is_open_min_price_rate),
        every_price: utils.yuanToFen(this.form.every_price),
        min_price: utils.yuanToFen(this.form.min_price),
        origin_price_rate: utils.yuanToFen(this.form.origin_price_rate),
        incr_diff: utils.yuanToFen(this.form.incr_diff || 0),
        desc_diff: utils.yuanToFen(this.form.desc_diff || 0),
        min_price_rate: utils.yuanToFen(this.form.min_price_rate)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.block {
  display: inline-block;
}
.tipNumber {
  position: absolute;
  bottom:-22px;
  left: 0;
  color:red;
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
</style>
