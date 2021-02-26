<template lang="html">
     <div class="step-delivery setting-content-with-tip">
          <el-form
            label-width="120px"
            size="small"
            :rules="rules"
            :model="template.model"
            ref="form">
            <el-form-item label="发货模式:" prop="presell_type">
                <!-- 预售类型，1-全款预售，0-非预售，2-阶梯库存，默认0 -->
                <el-radio-group v-model="template.model.presell_type"  @change="check">
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
                <div style="display:flex">
                  <el-select v-model="template.model.delivery_delay_day" placeholder="请选择" size="small" default-first-option style="width:150px;margin-right:10px;align-items:center">
                    <el-option label="2天" :value="2"></el-option>
                    <el-option :value="3">3天 <el-link type="danger" :underline="false"  class="font-12" href="https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940">仅支持特殊类目选择</el-link></el-option>
                    <el-option :value="5">5天 <el-link type="danger" :underline="false"  class="font-12" href="https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940">仅支持特殊类目选择</el-link></el-option>
                    <el-option :value="7">7天 <el-link type="danger" :underline="false"  class="font-12" href="https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940">仅支持特殊类目选择</el-link></el-option>
                    <el-option :value="10">10天 <el-link type="danger" :underline="false"  class="font-12" href="https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940">仅支持特殊类目选择</el-link></el-option>
                    <el-option :value="15">15天 <el-link type="danger" :underline="false"  class="font-12" href="https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940">仅支持特殊类目选择</el-link></el-option>
                </el-select>
                <span class="info" style="line-height:16px;flex:1" v-if="template.model.delivery_delay_day !==2">
                  注：目前抖店官方对发货模式及发货时限规则开始调整，若选择现货发货模式，需在消费者下单后<span style="color:red;font-size:12px">&nbsp;&nbsp;2天&nbsp;&nbsp;</span>内发货。部分特殊类目可自主设置【2-15天】的发货时间，具体类目以商家后台展示为准。建议选择阶梯发货模式，将现货库存设为0。点击查看&nbsp;&nbsp;<el-link @click="open" type="primary" style="font-size:12px" :underline="false">官方文档</el-link>&nbsp;&nbsp;说明  。
                </span>
                </div>
                <div style="color:red;font-size:12px" v-if="template.model.delivery_delay_day !==2">可能导致上货失败，请谨慎选择</div>
            </el-form-item>
            <!-- 全款预售发货模式 -->
            <el-form-item label="预售结束时间:"  v-if="template.model.presell_type === 1" prop="presell_end_time">
                <el-date-picker
                  class="margin-bottom-4"
                  v-model="template.model.presell_end_time"
                   :picker-options="pickerOptions"
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
                  <div>
                    <span>订单生成后</span>
                    <el-input-number
                      v-model="template.model.presell_delay"
                      controls-position="right"
                      @change="handleChange"
                      :picker-options="pickerOptions"
                      :min="3"
                      :max="15"
                      class="input-number margin-bottom-4"></el-input-number>
                    <span>天发货</span>
                    <p class="info">阶梯发货期间商品发货时间以此限制为主，仅可设置3-15天</p>
                  </div>
                </template>
            </el-form-item>
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
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
import moment from 'moment'
import commonUtils from '@/common/commonUtils'

const {
  mapGetters: mapGettersMigrate
} = createNamespacedHelpers('migrate/migrateSettingTemplate')

export default {
  data () {
    return {
      rules: {
        presell_type: [
          { required: true, message: '请选择发货模式', trigger: ['blur', 'change'] }
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
        ],
        step_stock_num_diff: [
          { required: true, message: '请输入库存设置', trigger: ['blur', 'change'] }
        ]
      },
      pickerOptions: {
        disabledDate: (time) => {
          const value = moment(time)
          const now = moment()
          const diff = value.diff(now, 'days', true)
          return diff > 30
        }
      }
    }
  },
  computed: {
    ...mapGettersMigrate({
      template: 'getTemplate'
    })
  },
  methods: {
    resetForm () {
      this.$refs.form.resetFields()
    },
    validate (cb) {
      return this.$refs.form.validate(cb)
    },
    check (value) {
      this.$refs.form.clearValidate()
      if (value === 0) {
        this.$refs.form.validateField(['delivery_delay_day'])
      } else if (value === 1) {
        this.$refs.form.validateField(['presell_end_time', 'presell_delay'])
      } else if (value === 2) {
        this.$refs.form.validateField(['presell_delay', 'step_stock_num_diff'])
      }
    },
    open () {
      window.open('https://school.jinritemai.com/doudian/web/article/101706')
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
