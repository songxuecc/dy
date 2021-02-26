<!--  -->
<template>
<!-- todo  新建刷新 按钮 一套 -->
<el-dialog title="批量修改本页品牌" :visible.sync="visible" v-hh-modal width="40%" center @close="close"
  :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
  <div class="flex align-c mb-10">
    <el-select v-model="value" placeholder="请选择" style="flex:1">
      <el-option v-for="item in options" :key="item.id" :label="(item.brand_chinese_name).trim() || (item.brand_english_name).trim()" :value="item.id">
      </el-option>
    </el-select>
    <el-button type="text" @click="loadData"><i class="el-icon-refresh"></i>刷新</el-button>
    <el-button type="text" @click="open()"> 添加品牌 </el-button>
  </div>
  <span class="info">&nbsp;&nbsp;<span class="fail">*&nbsp;</span>仅针对&nbsp;<b>已填写类目且该类目是在品牌授权范围内</b>&nbsp;的商品生效</span>
  <div class="mt-10"  v-if="loading"><el-progress :percentage="percentage" :format="format" ></el-progress></div>
  <span slot="footer">
      <el-button style="width:120px" @click="close" v-if="!loading">取消</el-button>
      <el-button type="primary" style="width:120px" @click="confirm" v-if="!loading">确定</el-button>
      <div v-if="loading" class="flex column justify-c align-c "><el-button @click="onShutdown" :loading="shutdown">更新中，点击中止操作</el-button><div class="pl-10 info" style="margin-top:5px">已经更新的数据无法撤回</div></div>
    </span>
</el-dialog>
</template>

<script>

import Api from '@/api/apis'
import debounce from 'lodash/debounce'
export default {
  name: 'EditBrandId',
  props: {
    visible: Boolean,
    loading: Boolean,
    percentage: Number,
    shutdown: Boolean
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
    onShutdown: debounce(function () {
      if (this.value) {
        this.$emit('onShutdown')
      }
    }, 300),
    open (catId) {
      window.open(`https://fxg.jinritemai.com/index.html#/ffa/goods/qualification/edit?type=2`)
    },
    format (percentage) {
      return `已完成${percentage}%`
    }
  }
}
</script>
<style lang="less" scoped></style>
