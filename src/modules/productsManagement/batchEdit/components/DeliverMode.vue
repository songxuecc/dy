<!-- 发货模式 -->
<template>
  <el-form ref="form" :model="form" size="small" label-position="left">
    <el-form-item>
      <el-radio-group v-model="presell_type" class="mb-10">
        <el-radio :label="0">现货发货模式</el-radio>
        <el-radio :label="1">预售发货模式</el-radio>
        <el-radio :label="2">阶梯发货模式</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 现货发货模式 -->
    <div v-if="presell_type == 0">
      <div class="mb-10 color-333 font-12"> <span style="width:90px;display:inline-block;">现货发货时间：</span>默认两天</div>
      <el-form-item>
        <span slot="label">下架商品修改后：</span>
        <el-radio-group v-model="radio">
          <el-radio :label="3">直接上架</el-radio>
          <el-radio :label="6">保存到草稿箱</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <div class="info">
        注：若是现货/预售发货改为阶梯发货，已将原现货/预售库存调整为现阶梯库存，现现货库存为0；<br />
        若是阶梯发货改为现货/预售发货，已将原阶梯库存调为现现货（预售）库存。
      </div> -->
    </div>

    <!-- 预售发货模式 -->
    <div v-if="presell_type == 1">
        <el-form-item label="预售结束时间:" prop="preSaleDate" style="display:inline-block;width:330px">
            <el-date-picker
                class="mb-5"
                :picker-options="pickerOptions"
                type="datetime"
                placeholder="选择日期时间"
                default-time="00:00:00">
            </el-date-picker>
            <p class="info mb-10 ladderText">最多支持设置距离当前30天</p>
        </el-form-item>
        <el-form-item  label=" 预售发货时间:" prop="presell_delay" style="display:inline-block;width:400px">
            <span>订单生成后</span>
            <el-input-number
                controls-position="right"
                @change="handleChange"
                :picker-options="pickerOptions"
                :min="3"
                :max="15"
                class="input-number mb-5"></el-input-number>
            <span>天发货</span>
            <p class="info mb-10 ladderText">阶梯发货期间商品发货时间以此限制为主，仅可设置3-15天</p>
        </el-form-item>
        <el-form-item label="下架商品修改后:">
            <el-radio-group v-model="radio">
                <el-radio :label="3">直接上架</el-radio>
                <el-radio :label="6">保存到草稿箱</el-radio>
            </el-radio-group>
        </el-form-item>
    </div>

     <!-- 阶梯发货 -->
    <div v-if="presell_type == 2">
        <el-form-item label="阶梯发货时间:" prop="preSaleDate" style="display:inline-block;width:400px">
            <span>订单生成后</span>
            <el-input-number
                controls-position="right"
                @change="handleChange"
                :picker-options="pickerOptions"
                :min="3"
                :max="15"
                class="input-number mb-5 "></el-input-number>
            <span>天发货</span>
            <p class="info mb-10 ladderText">阶梯发货期间商品发货时间以此限制为主，仅可设置3-15天</p>
        </el-form-item>
        <el-form-item label="下架商品修改后:">
            <el-radio-group v-model="radio">
                <el-radio :label="3">直接上架</el-radio>
                <el-radio :label="6">保存到草稿箱</el-radio>
            </el-radio-group>
        </el-form-item>
    </div>

  </el-form>
</template>

<script>
export default {
  name: 'deliverMode',
  props: {
    msg: String
  },
  data () {
    return {
      form: {},
      presell_type: 0
    }
  }
}
</script>
<style lang="less" scoped>

.ladderText{
    margin-left:87px;
}
</style>
