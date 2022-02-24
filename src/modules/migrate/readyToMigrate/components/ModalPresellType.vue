<!-- 极速搬家设置发货模式 -->
<template>
    <div>
        <el-dialog :visible.sync="visible" class="left ModalPresellType" title="发货模式设置" width="580px">
            <p class="mb-20">当前设置的发货模式是预售发货，请填写正确的预售发货时间</p>
            <el-form
                style="width:400px"
                label-width="120px"
                size="small"
                :rules="rules"
                :model="template"
                ref="form">
                <el-form-item prop="presell_type" label-width="0" >
                    <!-- 预售类型，1-全款预售，0-非预售，2-阶梯库存，默认0 -->
                    <el-radio-group v-model="template.presell_type"  @change="check">
                    <el-radio :label="0" class="presell_type">现货发货模式</el-radio>
                    <el-radio :label="1" class="presell_type">全款预售发货模式
                    </el-radio>
                    <el-radio :label="2" class="presell_type">
                        阶梯发货模式
                    </el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- 现货发货模式 -->
                <el-form-item label="承诺发货时间:" prop="delivery_delay_day" v-if="template.presell_type === 0">
                    <div style="display:flex">
                    <el-select v-model="template.delivery_delay_day" placeholder="请选择" size="small" default-first-option style="width:150px;margin-right:10px;align-items:center">
                        <el-option :value="9999" label="当日" :key="9999"> </el-option>
                        <el-option :value="1" label="次日"> </el-option>
                        <el-option :value="2" label="48小时"> </el-option>
                        <el-option :value="3" label="3天">3天 <span class="warning">仅支持特殊类目可选，一般类目不要选</span></el-option>
                        <el-option :value="5" label="5天">5天 <span class="warning">仅支持特殊类目可选，一般类目不要选</span></el-option>
                        <el-option :value="7" label="7天">7天 <span class="warning">仅支持特殊类目可选，一般类目不要选</span></el-option>
                        <el-option :value="10" label="10天">10天 <span class="warning">仅支持特殊类目可选，一般类目不要选</span></el-option>
                        <el-option :value="15" label="15天">15天 <span class="warning">仅支持特殊类目可选，一般类目不要选</span></el-option>
                    </el-select>
                    <!-- <span class="info" style="line-height:16px;flex:1">
                    注：目前抖店官方对发货模式及发货时限规则开始调整，若选择现货发货模式，需在消费者下单后<span class="fail">&nbsp;&nbsp;48小时&nbsp;&nbsp;</span>内发货。部分特殊类目可自主设置【3-15天】的发货时间，具体类目以商家后台展示为准。点击查看&nbsp;&nbsp;<el-link @click="open" type="primary" style="font-size:12px" :underline="false">官方文档</el-link>&nbsp;&nbsp;说明  。
                    </span> -->
                    </div>
                    <div class="fail" v-if="template.delivery_delay_day !==2"> </div>
                </el-form-item>
                <!-- 全款预售发货模式 -->
                <el-form-item label="预售结束时间:"  v-if="template.presell_type === 1" prop="presell_end_time">
                    <el-date-picker
                      class="margin-bottom-4"
                      v-model="template.presell_end_time"
                      :picker-options="pickerOptions"
                      type="datetime"
                      placeholder="选择日期时间"
                      default-time="00:00:00">
                    </el-date-picker>
                    <!-- <p class="info">最多支持设置距离当前30天</p> -->
                </el-form-item>
                <!-- 阶梯发货 -->
                <el-form-item label="现货发货时间:"  v-if="template.presell_type === 2" >
                    <el-select v-model="template.delivery_delay_day" placeholder="请选择" size="small" default-first-option style="width:150px;margin-right:10px;align-items:center">
                        <el-option :value="9999" label="当日" :key="9999"> </el-option>
                        <el-option :value="1" label="次日"> </el-option>
                        <el-option :value="2" label="48小时"> </el-option>
                    </el-select>
                    <!-- <p class="info">现货发货模式下生成的订单平台统一规定发货时间为48小时，请严格按照承诺发货时间进行发货</p> -->
                </el-form-item>
                <el-form-item
                :label="template.presell_type === 1 ?'预售发货时间:':'阶梯发货时间:'"
                v-if="template.presell_type === 1 || template.presell_type === 2"
                prop="presell_delay">
                    <template v-if="template.presell_type === 1">
                    <span>预售结束后</span>
                    <el-input-number
                    v-model="template.presell_delay"
                    controls-position="right"
                    @change="handleChange"
                    :min="2"
                    :max="15"
                    class="input-number margin-bottom-4"></el-input-number>
                    <span>天发货</span>
                    <!-- <p class="info">预售商品发货时间以此限制为主，仅可设置2-15天</p> -->
                    </template>
                    <template v-if="template.presell_type === 2">
                    <div>
                        <span>订单生成后</span>
                        <el-input-number
                        v-model="template.presell_delay"
                        controls-position="right"
                        @change="handleChange"
                        :picker-options="pickerOptions"
                        :min="3"
                        :max="5"
                        class="input-number margin-bottom-4"></el-input-number>
                        <span>天发货</span>
                        <!-- <p class="info">阶梯发货期间商品发货时间以此限制为主，仅可设置3-5天</p> -->
                    </div>
                    </template>
                </el-form-item>
            </el-form>
            <div class="mt-20">
                <el-button type="primary" plain style="width:120px" @click="visible = false">取消</el-button>
                <el-button type="primary" style="width:175px" @click="quickMigrate">已设置，开始极速搬家</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="jietiImgVisible">
            <el-image
            :src="jietiImg"
            fit="fit">
            </el-image>
        </el-dialog>

    </div>
</template>

<script>
import moment from 'moment'
import commonUtils from '@/common/commonUtils'
import utils from '@/common/utils'
import services from '@services'
import pick from 'lodash/pick'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (!utils.isNumber(value) || (utils.isNumber(value) && value % 1)) {
        callback(new Error('必须大于等于51, 小于等于100，且为整数'))
      } else {
        callback()
      }
    }
    return {
      template: {},
      selectIdList: [],
      visible: false,
      jietiImgVisible: false,
      jietiImg: 'https://img.pddpic.com/mms-material-img/2021-08-18/094e8bb6-74b6-4d00-952c-94b4203bd870.png.a.jpeg',
      tip: '51% <= 现货库存设置 <= 100%',
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
        step_stock_num_percentage: [
          { validator: validatePass, trigger: ['blur', 'change'] },
          { required: true, message: '请输入库存设置', trigger: ['blur', 'change'] }
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
          return diff > 30 || value.isBefore(now, 'days')
        }
      }
    }
  },
  methods: {
    open (template, selectIdList) {
      console.log(template, 'template')
      this.visible = true
      this.selectIdList = selectIdList
      this.template = template
    },
    resetForm () {
      this.$refs.form.resetFields()
    },
    validate (cb) {
      return this.$refs.form.validate(cb)
    },
    check (value) {
      if (value === 2 && ![9999, 1, 2].includes(Number(this.template.delivery_delay_day))) {
        this.template.delivery_delay_day = 1
      }
      this.$refs.form.clearValidate()
      if (value === 0) {
        this.$refs.form.validateField(['delivery_delay_day'])
      } else if (value === 1) {
        this.$refs.form.validateField(['presell_end_time', 'presell_delay'])
      } else if (value === 2) {
        this.$refs.form.validateField(['presell_delay', 'delivery_delay_day'])
      }
    },
    quickMigrate () {
      this.$refs.form.validate((valid, object) => {
        if (valid) {
          let pamars = {
          }
          if (this.template.presell_type === 0) {
            pamars = pick(this.template, ['delivery_delay_day'])
            pamars.presell_end_time = ''
          } else if (this.template.presell_type === 1) {
            pamars = pick(this.template, ['presell_end_time', 'presell_delay'])
            pamars.presell_end_time = moment(this.template.presell_end_time).format('YYYY-MM-DD HH:mm:ss')
          } else {
            pamars = pick(this.template, ['presell_delay', 'delivery_delay_day'])
            pamars.presell_end_time = ''
          }
          pamars.presell_type = this.template.presell_type
          console.log(pamars, 'pamars')
          services.migrate({
            tp_product_ids: this.selectIdList,
            is_quick_migrate: 1,
            commit_type: this.template.commit_type,
            quick_migrate_params: JSON.stringify(pamars)
          }).then(data => {
            this.visible = false
            location.reload()
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.ModalPresellType {

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
      color: #E02020;
      margin-right: 4px;
    }
  }
}

.step-delivery {
  margin-bottom: 20px;
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
/deep/ .el-dialog__header {
    text-align: center;
}
/deep/ .el-dialog__body {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}
}
</style>
