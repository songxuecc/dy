<template>
  <div class="drawer-container">
    <el-row class="drawer-title">
      <el-col :span="8">
        <span>批量设置</span>
      </el-col>
      <el-col :span="16" style="text-align: right">
        <el-button type="info" size="small" @click="rollbackChange">全部重置</el-button>
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
      <span class="drawer-immediate">批量：</span>
      <el-switch v-model="isOnSale" @change="applyChange"
                 :active-value="1" active-text="上架"
                 :inactive-value="0" inactive-text="下架"
      ></el-switch>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dyProductModelList: Array,
    selectProductDict: Object
  },
  data () {
    return {
      isOnSale: 1
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
        product.model.is_onsale = this.isOnSale
      }
    },
    confirmChange () {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
