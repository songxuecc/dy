<template>
  <div class="drawer-container">
    <el-row class="drawer-title">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <span style="font-size: 14px; line-height:32px;">下架商品修改后：</span>
        <el-radio-group v-model="commitType">
          <el-radio :label="1">直接上架</el-radio>
          <el-radio :label="2">保存到草稿箱</el-radio>
        </el-radio-group>
<!--        <el-button type="info" size="small" @click="rollbackChange">全部重置</el-button>-->
        <div v-if="Object.keys(selectProductDict).length === 0" style="display: inline-block; margin-left: 10px;">
          <el-tooltip class="item" effect="dark" placement="top" content="请选择需要修改的商品">
            <span class="button-wrapper">
              <el-button type="primary" size="small" disabled>全部保存</el-button>
            </span>
          </el-tooltip>
        </div>
        <el-button v-else type="primary" size="small" @click="confirmChange">全部保存</el-button>
      </el-col>
    </el-row>
    <div class="step-delivery setting-content-with-tip">
      <div style="padding: 8px 0;">
        <span>发货模式: </span>&nbsp;
        <el-radio-group v-model="presell.presellType">
          <el-radio :label="0">现货发货</el-radio>
          <el-radio :label="1">预售发货</el-radio>
          <el-radio :label="2">阶梯发货</el-radio>
        </el-radio-group>
      </div>
      <el-form
        label-width="120px"
        size="small"
        :inline="true"
        :rules="presellRules"
        :model="presell"
        label-position="left"
        ref="presellRef"
      >
        <el-form-item v-if="presell.presellType === 1" label="预售结束时间:" style="padding-right: 30px;" prop="presellEndTime">
          <el-date-picker
            class="margin-bottom-4"
            size="small"
            v-model="presell.presellEndTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="00:00:00"
            :picker-options="pickerOptions"
          > </el-date-picker>
          <p class="info">最多支持设置距离当前30天</p>
        </el-form-item>
        <el-form-item v-if="presell.presellType > 0" :label="presell.presellType === 1 ? '预售发货时间:':'阶梯发货时间:'" prop="presellDelay">
          <span>{{ presell.presellType === 1 ? '预售结束后' : '订单生成后' }}</span>
          <el-input-number
            v-model="presell.presellDelay"
            size="small"
            controls-position="right"
            :min="3"
            :max="30"
            class="input-number margin-bottom-4"></el-input-number>
          <span>天发货</span>
          <p class="info">{{ presell.presellType === 1 ?
            '预售商品发货时间以此限制为主，仅可设置3-30天' :
            '阶梯发货期间商品发货时间以此限制为主，仅可设置3-30天'}}
          </p>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import commonUtils from '@/common/commonUtils'

export default {
  components: {},
  props: {
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      commitType: 1,
      presell: {
        presellType: 0,
        presellEndTime: '',
        presellDelay: 3
      },
      presellRules: {
        presellEndTime: [
          { required: true, message: '请输入预售结束时间', trigger: 'blur' },
          { validator: commonUtils.checkDeliveryDelayDay, trigger: 'blur' }
        ],
        presellDelay: [
          { required: true, message: '请输入发货时间', trigger: 'blur' }
        ]
      },
      pickerOptions: {
        disabledDate (time) {
          let selectTime = time.getTime()
          return selectTime < moment() || selectTime > moment().startOf('day').add(30, 'days').valueOf()
        }
      }
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    rollbackChange () {
      this.$emit('rollback')
    },
    applyChange () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        product.model.presell_type = this.presell.presellType
        if (this.presell.presellType > 0) {
          product.model.presell_delay = this.presell.presellDelay
        }
        if (this.presell.presellType === 1) {
          product.model.presell_end_time = moment(this.presell.presellEndTime).format('YYYY-MM-DD HH:mm:ss')
        }
        if (product.model.status === 1 && product.model.check_status === 1) {
          // 下架商品
          product.model.commit = this.commitType
        }
      }
    },
    confirmChange () {
      this.applyChange()
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/migratesetting.less';
</style>
