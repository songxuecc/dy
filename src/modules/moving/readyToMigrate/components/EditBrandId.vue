<!--  -->
<template>
<!-- todo  新建刷新 按钮 一套 -->
<el-dialog title="批量修改本页品牌" :visible.sync="visible" v-hh-modal width="40%" center @close="close">
  <div class="flex align-c mb-10">
    <el-select v-model="value" placeholder="请选择" style="flex:1" >
    <el-option v-for="item in options" :key="item.id" :label="item.brand_chinese_name" :value="item.id">
    </el-option>
  </el-select>
  <el-button type="text" @click="loadData"><i class="el-icon-refresh"></i>刷新</el-button>
  <el-button type="text" @click="open()"> 添加品牌 </el-button>
  </div>
  <span class="info">&nbsp;&nbsp;<span class="fail">*&nbsp;</span>仅针对&nbsp;<b>已填写类目且该类目是在品牌授权范围内</b>&nbsp;的商品生效</span>
  <span slot="footer">
    <el-button type="primary" style="width:120px" @click="confirm" :loading="loading" :disabled="loading">{{loading?'处理中':'确定'}}</el-button>
  </span>
</el-dialog>
</template>

<script>

import Api from '@/api/apis'
export default {
  name: 'EditBrandId',
  props: {
    visible: Boolean,
    loading: Boolean
  },
  data () {
    return {
      options: [],
      value: ''
    }
  },
  created () {
    this.loadData()
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    loadData () {
      Api.hhgjAPIs.getShopBrandList().then(data => {
        this.options = data
        if (data.length) {
          this.value = data[0].id
        }
      })
    },
    confirm () {
      if (this.value) {
        this.$emit('updateBrands', this.value)
      } else {
        this.$message.error('请选择品牌')
      }
    },
    open (catId) {
      window.open(`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2`)
    }
  }
}
</script>
<style lang="less" scoped></style>
