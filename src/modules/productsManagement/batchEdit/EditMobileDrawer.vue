<template>
  <div class="drawer-container">
    <el-row class="drawer-title pt-10">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <span style="font-size: 14px; line-height:32px;">下架商品修改后：</span>
        <el-radio-group v-model="commitType">
          <el-radio :label="1">直接上架</el-radio>
          <el-radio :label="2">保存到草稿箱</el-radio>
        </el-radio-group>
        <el-button type="info" size="small" @click="rollbackChange" class="ml-5">全部重置</el-button>
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
    <div class="drawer-content">
      <span class="drawer-immediate">客服电话：</span>
      <el-input v-model="mobile" size="small" style="display: inline-block;width: 80px"></el-input>
    </div>
  </div>
</template>

<script>
import request from '@/mixins/request.js'
export default {
  mixins: [request],
  components: {},
  props: {
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      mobile: '',
      commitType: 1
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
        product.model.mobile = this.mobile
      }
    },
    confirmChange () {
      for (let key in this.selectProductDict) {
        let product = this.selectProductDict[key]
        // 下架商品
        if (product.model.status === 1 && product.model.check_status === 1) {
          // 下架商品
          product.model.commit = this.commitType
        }
      }
      this.applyChange()
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
