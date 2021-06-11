<!-- 库存 -->
<template>
  <el-form ref="form" :model="form" size="small" label-position="left">
    <el-radio-group
      v-model="form.stock_type"
      class="mb-10 flex column"
      style="width: 320px"
    >
      <div class="flex">
        <div>
          <p class="font-12 color-4e mb-10">若商品是现货或预售发货模式</p>
          <el-radio :label="1">
            <el-form-item label-width="80px" class="block" label="库存统一增加">
              <el-input-number
                controls-position="right"
                v-model="form.stock_value_1"
                @focus="handleCheck(1)"
                @clear="handleClear('stock_value_1')"
                :picker-options="pickerOptions"
                :max="999999"
                class="input-number"
              />
            </el-form-item>
          </el-radio>
          <el-radio :label="2">
            <el-form-item label-width="80px" class="block" label="库存统一减少">
              <el-input-number
                controls-position="right"
                v-model="form.stock_value_2"
                @focus="handleCheck(2)"
                @clear="handleClear('stock_value_2')"
                :picker-options="pickerOptions"
                :max="999999"
                class="input-number"
              />
            </el-form-item>
          </el-radio>
          <el-radio :label="3">
            <el-form-item label-width="80px" class="block" label="库存统一为">
              <el-input-number
                controls-position="right"
                v-model="form.stock_value_3"
                @focus="handleCheck(3)"
                @clear="handleClear('stock_value_3')"
                :picker-options="pickerOptions"
                :max="999999"
                class="input-number"
              />
            </el-form-item>
          </el-radio>
        </div>

        <div>
          <p class="font-12 color-4e mb-10">若商品是阶梯发货模式</p>
          <div class="flex">
            <div>
              <el-radio :label="4">
                <el-form-item
                  label-width="80px"
                  class="block"
                  label="库存统一增加"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_4"
                    @focus="handleCheck(4)"
                    @clear="handleClear('stock_value_4')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
              <el-radio :label="5">
                <el-form-item
                  label-width="80px"
                  class="block"
                  label="库存统一减少"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_5"
                    @focus="handleCheck(5)"
                    @clear="handleClear('stock_value_5')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
              <el-radio :label="6">
                <el-form-item
                  label-width="80px"
                  class="block"
                  label="库存统一为"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_6"
                    @focus="handleCheck(6)"
                    @clear="handleClear('stock_value_6')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
            </div>

            <div>
              <el-radio :label="7">
                <el-form-item
                  label-width="105px"
                  class="block"
                  label="阶梯库存统一增加"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_7"
                    @focus="handleCheck(7)"
                    @clear="handleClear('stock_value_7')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
              <el-radio :label="8">
                <el-form-item
                  label-width="105px"
                  class="block"
                  label="阶梯库存统一减少"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_8"
                    @focus="handleCheck(8)"
                    @clear="handleClear('stock_value_8')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
              <el-radio :label="9">
                <el-form-item
                  label-width="105px"
                  class="block"
                  label="阶梯库存统一为"
                >
                  <el-input-number
                    controls-position="right"
                    v-model="form.stock_value_9"
                    @focus="handleCheck(9)"
                    @clear="handleClear('stock_value_9')"
                    :picker-options="pickerOptions"
                    :max="999999"
                    class="input-number"
                  />
                </el-form-item>
              </el-radio>
            </div>
          </div>
        </div>
      </div>
    </el-radio-group>
  </el-form>
</template>

<script>
export default {
  name: 'Stocks',
  props: {
    msg: String
  },
  data () {
    return {
      form: {
        stock_type: 1,
        stock_value_1: undefined,
        stock_value_2: undefined,
        stock_value_3: undefined,
        stock_value_4: undefined,
        stock_value_5: undefined,
        stock_value_6: undefined,
        stock_value_7: undefined,
        stock_value_8: undefined,
        stock_value_9: undefined
      }
    }
  },
  methods: {
    handleCheck (type) {
      console.log(type, 'type')
      this.form.stock_type = type
    },
    handleClear (attribute) {
      this.form[attribute] = ''
    },
    getForm () {
      return {
        stock_type: this.form.stock_type,
        stock_value: this.form[`stock_value_${this.form.stock_type}`]
      }
    }
  }
}
</script>
<style lang="less" scoped>
.block {
  display: inline-block;
}

.input-number {
  width: 160px;
  text-align: left;
}
/deep/ .el-input .el-input__inner {
  text-align: left;
}

/deep/ .el-input-number__increase {
  display: none;
}

/deep/ .el-input-number__decrease {
  display: none;
}

/deep/ .el-form-item__label {
  color: #4e4e4e;
}
/deep/ .el-input-number .el-input__inner {
  padding-left: 10px;
  padding-right: 10px;
}
</style>
