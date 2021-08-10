<!-- 售卖&划线价 -->
<template>
  <div>
    <el-form ref="form" :model="form" size="small" label-position="left">
      <div class="flex mb-10">
        <p style="padding-top: 10px;padding-right: 25px;">售卖价</p>
        <div>
          <el-form-item>
            <el-radio v-model="form.is_formula" @change="handleIsFormulaChange" :label="1" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">按照公式修改&nbsp;<span class="bold">售卖价</span>&nbsp;=&nbsp;
                  <el-select v-model="value" placeholder="请选择" style="width:105px"
                    popper-class="SaleAndUnderlinedPrice-popper-class" class="select-price">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  &nbsp;*&nbsp;
                </span>
                <el-input class="price" style="width: 80px;" :max="99999999" v-model="form.origin_price_rate"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'origin_price_rate')">
                  <template slot="append">%</template>
                </el-input>
                <span class="color-4e font-12">&nbsp;+&nbsp;</span>
                <el-input class="price" style="width: 80px" :max="99999999" v-model="form.incr_diff"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'incr_diff')">
                  <template slot="append">元</template>
                </el-input>
                <span class="color-4e font-12">&nbsp;-&nbsp;</span>
                <el-input class="price" style="width: 80px" :max="99999999" v-model="form.desc_diff"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'desc_diff')"><template
                    slot="append">元</template>
                </el-input>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">统一&nbsp;<span class="bold">售卖价&nbsp;</span>为&nbsp;</span>
                <el-input class="price" style="width: 340px" v-model="form.every_price" :max="99999999"
                  @focus="handleIsEveryPriceFocus" clearable @clear="handleClear('every_price')"
                  @blur="handleBlur($event,'every_price')">
                  <template slot="append">元</template>
                </el-input>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              将售卖价设置为对应SKU的最低价
            </el-radio>
          </el-form-item>
        </div>
      </div>

      <div class="flex mb-10">
        <p style="padding-top: 10px;padding-right: 25px;">划线价</p>
        <div>
          <el-form-item>
            <el-radio v-model="form.is_formula" @change="handleIsFormulaChange" :label="1" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">按照公式修改&nbsp;<span class="bold">划线价</span>&nbsp;=&nbsp;
                  <el-select v-model="value" placeholder="请选择" style="width:105px"
                    popper-class="SaleAndUnderlinedPrice-popper-class" class="select-price">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  &nbsp;*&nbsp;
                </span>
                <el-input class="price" style="width: 80px;" :max="99999999" v-model="form.origin_price_rate"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'origin_price_rate')">
                  <template slot="append">%</template>
                </el-input>
                <span class="color-4e font-12">&nbsp;+&nbsp;</span>
                <el-input class="price" style="width: 80px" :max="99999999" v-model="form.incr_diff"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'incr_diff')">
                  <template slot="append">元</template>
                </el-input>
                <span class="color-4e font-12">&nbsp;-&nbsp;</span>
                <el-input class="price" style="width: 80px" :max="99999999" v-model="form.desc_diff"
                  @focus="handleIsFormulaFocus" @blur="handleBlur($event,'desc_diff')"><template
                    slot="append">元</template>
                </el-input>
              </span>
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              <span class="flex align-c">
                <span class="color-4e font-12">统一&nbsp;<span class="bold">划线价&nbsp;</span>为&nbsp;</span>
                <el-input class="price" style="width: 340px" v-model="form.every_price" :max="99999999"
                  @focus="handleIsEveryPriceFocus" clearable @clear="handleClear('every_price')"
                  @blur="handleBlur($event,'every_price')">
                  <template slot="append">元</template>
                </el-input>
              </span>
            </el-radio>
          </el-form-item>
        </div>
      </div>

      <div class="flex">
        <p style="padding-right: 10px;">抹零设置</p>
        <div>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              四舍五入保留整数
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              四舍五入保留一位小数点
            </el-radio>
          </el-form-item>
          <el-form-item>
            <el-radio v-model="form.is_every_price" @change="handleIsEveryPriceChange" :label="1" class="flex align-c">
              四舍五入保留两位小数点
            </el-radio>
          </el-form-item>
        </div>
      </div>

    </el-form>
  </div>
</template>

<script>
import utils from '@/common/utils'
export default {
  name: 'SaleAndUnderlinedPrice',
  props: {
    msg: String
  },
  data () {
    return {
      options: [{
        value: '原售卖价',
        label: '原售卖价'
      }, {
        value: 'SKU最低价',
        label: 'SKU最低价'
      }, {
        value: 'SKU最高价',
        label: 'SKU最高价'
      }],
      value: '',
      form: {
        is_formula: 1,
        origin_price_rate: '',
        incr_diff: '',
        desc_diff: '',
        is_every_price: 0,
        every_price: '',
        is_open_min_price: false,
        min_price: '',
        is_open_min_price_rate: false,
        min_price_rate: ''
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
    handleBlur (e, attribute) {
      if (utils.isNumber(e.target.value)) {
        this.form[attribute] = e.target.value
      } else {
        this.$message.error('请输入数字')
      }
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
    padding-right: 10px;
  }

  .price {
    /deep/ .el-input__inner {
      border-right: none;
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
