<!-- 我的页面 -->
<template>
    <div class='left'>
        <el-radio-group v-model="tabType" style="margin-bottom: 30px;">
            <el-radio-button label="PayRecord">额度充值</el-radio-button>
            <el-radio-button label="Recharge">充值记录</el-radio-button>
        </el-radio-group>
        <PayRecord v-if="tabType === 'PayRecord' "/>
        <Recharge v-if="tabType === 'Recharge' " />
        <el-dialog title="额度计算规则" class="product-dialog" :visible.sync="vislble" @close="dialogEditClose" v-hh-modal  width="400px" >
            <div>
                <p>1、订购免费版赠送10条额度，订购1个月版赠送100条额度，订购3个月版赠送300条额度，订购了6个月版赠送600条额度，订购12个月版赠送1200条额度；</p>
                <p>2、可通过付费充值增加额度，收费标准：100条=10元、300条=25元、500条=35元、1000条=60元；</p>
                <p>3、赠送额度、充值额度均可累计且在任何场景下不会被清空；</p>
                <p>4、抓取成功耗费一条额度，抓取失败不耗费额度。</p>
            </div>
            <p class="flex justify-c"><el-button type="primary" style="width:120px">我知道了</el-button></p>
        </el-dialog>
    </div>
</template>

<script>
import PayRecord from './PayRecord.vue'
import Recharge from './Recharge.vue'
export default {
  data () {
    return {
      tabType: 'PayRecord',
      vislble: false
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
/deep/ .el-radio-button__inner {
        width: 100px !important;
    }
</style>
