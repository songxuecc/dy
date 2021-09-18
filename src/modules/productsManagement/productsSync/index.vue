<!-- 我的页面 -->
<template>
  <div>
    <TableSyncRecord @go="handleGo"  v-if="step === 1"/>
    <CreateSyncPlan v-if="step === 2" @goback="goback" @go="handleGo" :prevStep="prevStep"></CreateSyncPlan>
    <TableProductList v-if="step === 3" @goback="goback" @go="handleGo" ref="TableProductList" :prevStep="prevStep"></TableProductList>
  </div>
</template>

<script>
import TableSyncRecord from './components/TableSyncRecord'
import CreateSyncPlan from './components/CreateSyncPlan'
import TableProductList from './components/TableProductList'

export default {
  data () {
    return {
      step: 1,
      prevStep: 3
    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
  },
  activated () {
    this.step = 1
    this.prevStep = 3
  },
  updated () { },
  components: {
    TableSyncRecord,
    CreateSyncPlan,
    TableProductList
  },
  methods: {
    // 事件名称
    handleGo (row, type) {
      this.prevStep = this.step
      this.step = type
      console.log(this.step, 'this.step')
    },
    goback () {
      const prevStep = this.step
      this.step = this.prevStep
      this.prevStep = prevStep
    }
  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

</style>
