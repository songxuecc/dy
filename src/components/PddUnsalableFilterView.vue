<template lang="html">
    <div>
        <el-form ref="form" :model="unsalableFilter" :inline="true" style="text-align: left">
            <el-form-item label="近一个月销量不超过">
                <el-input v-model="unsalableFilter.tradingVolumeLte" size="small" placeholder="0"
                          @keyup.enter.native="handleFilterChange" style="width: 50px" class="input-text-mini">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="handleFilterChange">滞销商品查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      unsalableFilter: {
        tradingVolumeLte: 0
      }
    }
  },
  computed: {},
  mounted () {
  },
  methods: {
    handleFilterChange () {
      this.$emit('filterChange')
    },
    getParams () {
      return {
        'trading_volume_lte': this.unsalableFilter.tradingVolumeLte
      }
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
