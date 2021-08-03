<!--  -->
<template>
    <el-button type="warning" plain size="mini" style="padding:5px 20px;margin-left: 5px;min-width:120px"  @click="handleSyncCategory">
        <span >{{loadingPercent ?`刷新类目中..${refreshCategoryPercentage}%`:'刷新类目'}}</span>
    </el-button>
</template>

<script>

import { mapState, mapActions } from 'vuex'
export default {
  name: 'refershCategoryBtn',
  props: {
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState('migrate/refershCategoryBtn', ['timer', 'refreshCategoryPercentage', 'loadingPercent'])
  },
  methods: {
    ...mapActions('migrate/refershCategoryBtn', ['handleSyncCategory'])
  }
}
</script>
<style lang="less" scoped>
</style>
