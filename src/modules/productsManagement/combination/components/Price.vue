<!--  -->
<template>
    <div class="card">
        <h1>类目价格</h1>
        <el-form-item required label="组合商品类目:" class="item">
          <el-select v-model="category_id" placeholder="默认无品牌设置" style="width:295px;margin-right:12px" :diabled="true">
            <el-option :label="option.category_leaf_id" :value="option.category_leaf_id" v-for="option in categoryOptions" :key="option.product_id">{{option.category_show}}</el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="发货模式:" class="item" >
              <el-radio-group v-model="presell_type">
                <el-radio :label="0">现货发货模式</el-radio>
                <el-radio :label="1">全款预售发货模式</el-radio>
            </el-radio-group>
          </el-form-item>

           <el-form-item label="现货发货时间:" class="item" v-if="presell_type === 0">
              <el-radio-group v-model="delivery_delay_day">
                <el-radio :label="9999">当日发</el-radio>
                <el-radio :label="1">24小时</el-radio>
                <el-radio :label="2">48小时</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="预售结束时间:"  v-if="presell_type === 1" prop="presell_end_time">
              <el-date-picker
                class="margin-bottom-4"
                v-model="presell_end_time"
                :picker-options="pickerOptions"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00">
              </el-date-picker>
              <p class="info">最多支持设置距离当前30天</p>
          </el-form-item>

          <el-form-item  label="售卖价:"  class="item" required>
              <el-input
                  style="width: 295px"
                  :max="99999999"
                  v-model="discount_price"
                  class="price"
                  placeholder="必须大于0，最多保留两位小数"
              >
                  <template slot="append">元</template>
              </el-input>
          </el-form-item>

          <el-form-item  label="划线价:"  class="item" required>
              <el-input
                  style="width: 295px"
                  :max="99999999"
                  v-model="market_price"
                  class="price"
                  placeholder="划线价需高于售卖价，最多保留两位小数"
              >
                  <template slot="append">元</template>
              </el-input>
          </el-form-item>
    </div>
</template>

<script>
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    return {
      presell_type: 0,
      market_price: '',
      discount_price: '',
      presell_end_time: '',
      delivery_delay_day: 9999
    }
  },
  computed: {
    ...mapGetters('productManagement/combination/tableSepcify', [
      'categoryOptions'
    ])
  },
  methods: {
    pickerOptions: {
      disabledDate: (time) => {
        const value = moment(time)
        const now = moment()
        const diff = value.diff(now, 'days', true)
        return diff > 30 || value.isBefore(now, 'days')
      }
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
