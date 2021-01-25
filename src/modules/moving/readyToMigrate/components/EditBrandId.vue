<!--  -->
<template>
  <el-dialog title="批量修改本页品牌"    :visible.sync="visible" v-hh-modal width="30%" center @close="close" >
    <el-select v-model="value" placeholder="请选择" style="width:100%" class="mb-10">
      <el-option v-for="item in options" :key="item.id" :label="item.brand_chinese_name" :value="item.id">
      </el-option>
    </el-select>
    <span class="info">仅针对授权了该品牌的类目生效</span>
    <span slot="footer">
      <el-button type="plain" style="width:120px;margin-right:10px" @click.stop="close">取消
      </el-button>
      <el-button type="primary" style="width:120px" @click.stop="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>

import Api from '@/api/apis'
export default {
  name: 'EditBrandId',
  props: {
    visible: Boolean
  },
  data () {
    return {
      options: [],
      value: ''
    }
  },
  created () {
    Api.hhgjAPIs.getShopBrandList().then(data => {
      this.options = data
    })
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      if (this.value) {
        console.log(this.value)
        // todo 修改标题
        this.$emit('batchUpdateCategory', this.value)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
