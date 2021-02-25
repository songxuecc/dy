<!-- EvalRules -->
<template>

      <el-dialog title="额度计算规则" class="product-dialog" :visible.sync="vislble" @close="dialogEditClose" >
            <div>
                <p>1、订购免费版赠送10条额度，订购1个月版赠送100条额度，订购3个月版赠送300条额度，订购了6个月版赠送600条额度，订购12个月版赠送1200条额度；</p>
                <p>2、可通过付费充值增加额度，收费标准：100条=10元、300条=25元、500条=35元、1000条=60元；</p>
                <p>3、赠送额度、充值额度均可累计且在任何场景下不会被清空；</p>
                <p>4、抓取成功耗费一条额度，抓取失败不耗费额度。</p>
            </div>
        </el-dialog>

</template>

<script>
export default {
  name: 'EvalRules',
  props: {
    msg: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
</style>
