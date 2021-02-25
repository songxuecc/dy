<!-- 我的页面 -->
<template>
    <div class='left'>
        <el-radio-group v-model="tabType" style="margin-bottom: 30px;">
            <el-radio-button label="PayRecord">额度充值</el-radio-button>
            <el-radio-button label="Recharge">充值记录</el-radio-button>
        </el-radio-group>
        <PayRecord v-if="tabType === 'PayRecord' "/>
        <Recharge v-if="tabType === 'Recharge' " />
    </div>
</template>

<script>
import PayRecord from './PayRecord.vue'
import Recharge from './Recharge.vue'
export default {
  data () {
    return {
      tabType: 'PayRecord'
    }
  },
  components: {
    PayRecord,
    Recharge
  },
  computed: {

  },
  watch: {},
  created () {

  },
  mounted () {
  },
  updated () { },
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
