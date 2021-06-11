<!-- 发货模式 -->
<template>
  <el-form :rules="rules" ref="form" :model="form" size="small" label-position="left">
    <el-form-item>
      <el-radio-group v-model="form.presell_type" class="mb-10">
        <el-radio :label="0">现货发货模式</el-radio>
        <el-radio :label="1">预售发货模式</el-radio>
        <el-radio :label="2">阶梯发货模式</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 现货发货模式 -->
    <div v-if="form.presell_type == 0">
      <div class="mb-10 color-333 font-12"> <span style="width:90px;display:inline-block;">现货发货时间：</span>
      <el-select v-model="form.delivery_delay_day" placeholder="请选择" size="small" default-first-option style="width:220px;margin-right:10px;align-items:center">
          <el-option label="2天" :value="2"></el-option>
          <el-option :value="3">3天 <span class="fail">仅支持</span><el-link type="danger" :underline="false"  class="font-12" @click="openSpacialCategory">特殊类目</el-link><span class="fail">选择</span></el-option>
          <el-option :value="5">5天 <span class="fail">仅支持</span><el-link type="danger" :underline="false"  class="font-12" @click="openSpacialCategory">特殊类目</el-link><span class="fail">选择</span></el-option>
          <el-option :value="7">7天 <span class="fail">仅支持</span><el-link type="danger" :underline="false"  class="font-12" @click="openSpacialCategory">特殊类目</el-link><span class="fail">选择</span></el-option>
          <el-option :value="10">10天 <span class="fail">仅支持</span><el-link type="danger" :underline="false"  class="font-12" @click="openSpacialCategory">特殊类目</el-link><span class="fail">选择</span></el-option>
          <el-option :value="15">15天 <span class="fail">仅支持</span><el-link type="danger" :underline="false"  class="font-12" @click="openSpacialCategory">特殊类目</el-link><span class="fail">选择</span></el-option>
      </el-select>
      </div>
      <el-form-item>
        <span slot="label">下架商品修改后：</span>
        <el-radio-group v-model="form.commit_type">
          <el-radio :label="0">直接上架</el-radio>
          <el-radio :label="1">保存到草稿箱</el-radio>
        </el-radio-group>
      </el-form-item>

    </div>

    <!-- 预售发货模式 -->
    <div v-if="form.presell_type == 1">
        <el-form-item label="预售结束时间:" prop="preSaleDate" style="display:inline-block;width:330px">
            <el-date-picker
                class="mb-5"
                :picker-options="pickerOptions"
                v-model="form.presell_end_time"
                type="datetime"
                placeholder="选择日期时间">
            </el-date-picker>
            <p class="info mb-10 ladderText">最多支持设置距离当前30天</p>
        </el-form-item>
        <el-form-item  label=" 预售发货时间:" prop="presell_delay" style="display:inline-block;width:400px">
            <span>订单生成后</span>
            <el-input-number
                controls-position="right"
                @change="handleChange"
                :picker-options="pickerOptions"
                v-model="form.presell_delay"
                :min="3"
                :max="15"
                class="input-number mb-5"></el-input-number>
            <span>天发货</span>
            <p class="info mb-10 ladderText">阶梯发货期间商品发货时间以此限制为主，仅可设置3-15天</p>
        </el-form-item>
        <el-form-item label="下架商品修改后:">
            <el-radio-group v-model="form.commit_type">
                <el-radio :label="0">直接上架</el-radio>
                <el-radio :label="1">保存到草稿箱</el-radio>
            </el-radio-group>
        </el-form-item>
    </div>

     <!-- 阶梯发货 -->
    <div v-if="form.presell_type == 2">
        <el-form-item label="阶梯发货时间:" prop="preSaleDate" style="display:inline-block;width:400px">
            <span>订单生成后</span>
            <el-input-number
                controls-position="right"
                @change="handleChange"
                :picker-options="pickerOptions"
                v-model="form.presell_delay"
                :min="3"
                :max="15"
                class="input-number mb-5 "></el-input-number>
            <span>天发货</span>
            <p class="info mb-10 ladderText">阶梯发货期间商品发货时间以此限制为主，仅可设置3-15天</p>
        </el-form-item>
        <el-form-item label="下架商品修改后:">
            <el-radio-group v-model="form.commit_type">
                <el-radio :label="0">直接上架</el-radio>
                <el-radio :label="1">保存到草稿箱</el-radio>
            </el-radio-group>
        </el-form-item>
    </div>
    <div class="info mt-5">
        注：若是现货/预售发货改为阶梯发货，已将原现货/预售库存调整为现阶梯库存，现现货库存为0；<br />
        若是阶梯发货改为现货/预售发货，已将原阶梯库存调为现现货（预售）库存。
      </div>
  </el-form>
</template>

<script>
import commonUtils from '@/common/commonUtils'
import moment from 'moment'
export default {
  name: 'deliverMode',
  props: {
  },
  data () {
    return {
      form: {
        commit_type: 0,
        presell_type: 0,
        delivery_delay_day: 2,
        presell_end_time: '',
        presell_delay: 3
      },
      rules: {
        presell_end_time: [
          { required: true, message: '请输入预售结束时间', trigger: ['blur', 'change'] },
          { validator: commonUtils.checkDeliveryDelayDay, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    getForm () {
      if (this.form.presell_type === 1 && !this.form.presell_end_time) {
        this.$message.error('请选择预售结束时间')
        return false
      } else if (this.form.presell_type === 1 && this.form.presell_end_time) {
        const startTime = new Date()
        const days = moment(this.form.presell_end_time).diff(moment(startTime), 'days', true)
        if (days > 30) {
          this.$message.error('预售结束时间不可以超过30天')
          return false
        }
      }
      return {
        ...this.form
      }
    },
    openSpacialCategory () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/fpa940')
    }
  }
}
</script>
<style lang="less" scoped>

.ladderText{
    margin-left:87px;
}
</style>
