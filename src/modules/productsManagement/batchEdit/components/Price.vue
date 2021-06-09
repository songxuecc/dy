<!-- 库存 -->
<template>
  <div>
    <el-form ref="form" :model="form" size="small" label-position="left">
      <el-form-item>
        <el-radio v-model="form.is_formula" @change="handleIsFormulaChange" :label="1">
          <span class="color-4e font-12">按照公式修改&nbsp;原价*</span>
          <el-input-number
            style="width: 80px"
            :max="99999999"
            v-model="form.origin_price_rate"
            @focus="handleIsFormulaFocus"
          />
          <span class="color-4e font-12">&nbsp;%&nbsp;+&nbsp;</span>
          <el-input-number
            style="width: 80px"
            :max="99999999"
            v-model="form.incr_diff"
            @focus="handleIsFormulaFocus"
          />
          <span class="color-4e font-12">&nbsp;-&nbsp;</span>
          <el-input-number
            style="width: 80px"
            :max="99999999"
            v-model="form.desc_diff"
            @focus="handleIsFormulaFocus"
          />
        </el-radio>
      </el-form-item>
      <el-form-item>
        <el-radio
          v-model="form.is_every_price"
          @change="handleIsEveryPriceChange"
          :label="1"
        >
          <span class="color-4e font-12">价格统一为&nbsp;</span>
          <el-input-number
            style="width: 330px"
            v-model="form.every_price"
            :max="99999999"
            @focus="handleIsEveryPriceFocus"
          />
        </el-radio>
      </el-form-item>

      <el-form-item label="误操作防范：">
        <el-checkbox v-model="form.is_open_min_price" style="display: block">
          <el-form-item label="新价格不低于">
            <el-tooltip
              content="若此处填10，当新价格低于10元，则将新价格调整为10"
              placement="right"
            >
              <el-input-number
                :max="99999999"
                style="width: 230px"
                v-model="form.min_price"
              />
            </el-tooltip>
          </el-form-item>
        </el-checkbox>
        <el-checkbox
          v-model="form.is_open_min_price_rate"
          style="margin-left: 84px; display: block; margin-top: 5px"
        >
          <el-form-item label="新价格不低于原价的">
            <el-tooltip
              content="若此处填200，当新价格低于原价的2倍时，则将新价格调整为原价的2倍"
              placement="right"
            >
              <el-input-number
                :max="99999999"
                style="width: 194px"
                v-model="form.min_price_rate"
              />
            </el-tooltip>
            <span class="color-4e font-12">&nbsp;%&nbsp;</span>
          </el-form-item>
        </el-checkbox>
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
    msg: String
  },
  data () {
    return {
      form: {
        is_formula: 0,
        origin_price_rate: undefined,
        incr_diff: undefined,
        desc_diff: undefined,
        is_every_price: 0,
        every_price: undefined,
        is_open_min_price: 0,
        min_price: undefined,
        is_open_min_price_rate: 0,
        min_price_rate: undefined
      }
    }
  },
  methods: {
    handleIsFormulaChange (value) {
      if (this.form.is_formula) {
        this.form.is_every_price = 0
      } else {
        this.form.is_every_price = 1
      }
    },
    handleIsFormulaFocus () {
      this.form.is_formula = 1
    },
    handleIsEveryPriceChange (value) {
      if (this.form.is_every_price) {
        this.form.is_formula = 0
      } else {
        this.form.is_formula = 1
      }
    },
    handleIsEveryPriceFocus () {
      this.form.is_every_price = 1
    },
    getForm () {
      return {
        ...this.form,
        is_formula: Number(this.form.is_formula),
        is_every_price: Number(this.form.is_every_price),
        is_open_min_price: Number(this.form.is_open_min_price),
        is_open_min_price_rate: Number(this.form.is_open_min_price_rate),
        every_price: utils.yuanToFen(this.form.every_price),
        min_price: utils.yuanToFen(this.form.min_price),
        origin_price_rate: utils.yuanToFen(this.form.origin_price_rate),
        incr_diff: utils.yuanToFen(this.form.incr_diff),
        desc_diff: utils.yuanToFen(this.form.desc_diff),
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
</style>
