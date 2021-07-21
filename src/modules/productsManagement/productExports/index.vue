<!-- 我的页面 -->
<template>
  <div class="left">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动性质">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll1"
          @change="handleCheckAllChange($event,'1')"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities1"
          @change="handleCheckedCitiesChange($event,'1')"
        >
          <el-checkbox v-for="city in cities1" :label="city" :key="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="sku信息">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll2"
          @change="handleCheckAllChange($event,'2')"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities2"
          @change="handleCheckedCitiesChange($event,'2')"
        >
          <el-checkbox v-for="city in cities2" :label="city" :key="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="图片链接">
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll3"
          @change="handleCheckAllChange($event,'3')"
          >全选</el-checkbox
        >
        <el-checkbox-group
          v-model="checkedCities3"
          @change="handleCheckedCitiesChange($event,'3')"
        >
          <el-checkbox v-for="city in cities3" :label="city" :key="city">{{
            city
          }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
const cityOptions1 = [
  '商品编号',
  '出售状态',
  '商品分类',
  '货号',
  '出售价',
  '商品库存',
  '商品阶梯库存',
  '商品链接',
  '审核状态',
  '商品标题',
  '划线价',
  '创建时间',
  '来源链接'
]

const cityOptions2 = [
  'skuID',
  'sku规格属性',
  'sku价格',
  'sku现货库存',
  'sku阶梯库存',
  '商品编码'
]

const cityOptions3 = [
  '主图1',
  '主图2',
  '主图3',
  '主图4',
  '主图5'
]
export default {
  data () {
    return {
      checkAll1: false,
      checkAll2: false,
      checkAll3: false,
      checkedCities1: ['商品编号', '出售状态'],
      checkedCities2: ['商品编号', '出售状态'],
      checkedCities3: ['商品编号', '出售状态'],
      cities1: cityOptions1,
      cities2: cityOptions2,
      cities3: cityOptions3,
      isIndeterminate1: true,
      isIndeterminate2: true,
      isIndeterminate3: true
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  updated () {},
  methods: {
    handleCheckAllChange (val, key) {
      this[`checkedCities${key}`] = val ? this[`cities${key}`] : []
      this[`isIndeterminate${key}`] = false
      console.log(val, this, 'val')
    },
    handleCheckedCitiesChange (value, key) {
      console.log(value, key)
      let checkedCount = value.length
      this[`checkAll${key}`] = checkedCount === this[`cities${key}`].length
      this[`isIndeterminate${key}`] =
        checkedCount > 0 && checkedCount < this[`cities${key}`].length
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类
/deep/ .el-checkbox__label {
    font-size: 14px;
    width: 80px;
}
/deep/ .el-form-item {
    margin-bottom: 0;
}
</style>
