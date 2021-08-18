<!-- 我的页面 -->
<template>
  <div class=''>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
      <TableSyncRecord />
      <DrawerSyncDetail />
    </el-container>
  </div>
</template>

<script>
import TableSyncRecord from './components/TableSyncRecord'
import DrawerSyncDetail from './components/DrawerSyncDetail'
export default {
  data () {
    return {

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
    DrawerSyncDetail
  },
  methods: {
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
