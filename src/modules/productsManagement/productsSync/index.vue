<!-- 我的页面 -->
<template>
  <div>
    <TableSyncRecord @handleCreateSyncPlan="handleCreateSyncPlan"  v-if="!createSyncPlanVisible"/>
    <DrawerSyncDetail />
    <CreateSyncPlan v-if="createSyncPlanVisible" @goback="goback"></CreateSyncPlan>

  </div>
</template>

<script>
import TableSyncRecord from './components/TableSyncRecord'
import DrawerSyncDetail from './components/DrawerSyncDetail'
import CreateSyncPlan from './components/CreateSyncPlan'

export default {
  data () {
    return {
      createSyncPlanVisible: true
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
  components: {
    TableSyncRecord,
    DrawerSyncDetail,
    CreateSyncPlan
  },
  methods: {
    // 事件名称
    handleCreateSyncPlan () {
      this.createSyncPlanVisible = true
    },
    goback () {
      this.createSyncPlanVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
