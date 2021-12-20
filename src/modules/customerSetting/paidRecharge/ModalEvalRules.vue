<!-- EvalRules -->
<template>
      <el-dialog title="额度计算规则" :visible="visible" @close="dialogEditClose" v-hh-modal width="500px" center>
          <ol>
              <li class="color-4e font-14">订购1个月赠送500条，订购3个月赠送1500条，订购了6个月赠送3000条，订购12个月赠送6000条；</li>
              <li class="color-4e font-14">试用版升级高级版，升级费用0-5元赠送150条，升级费用5-10元赠送300条，升级费用10-15元赠送500条，升级费用15-22.5元赠送600条；</li>
              <li class="color-4e font-14">赠送额度用完后可通过额外付费充值增加额度；</li>
              <li class="color-4e font-14">赠送额度、充值额度均可累计且在任何场景下不会被清空；抓取成功1个商品消耗1条额度，抓取失败不消耗额度；</li>
              <li class="color-4e font-14">此规则从2021.12.X日开始生效，在此前产生的充值费用不支持退差价。</li>
          </ol>
          <div slot="footer"> <el-button @click="visible = false" type="primary" style="width:120px">我知道了</el-button></div>
      </el-dialog>
</template>

<script>
export default {
  name: 'EvalRules',
  props: {
    visible: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    dialogEditClose () {
      this.$emit('toggleVisible')
    }
  }
}
</script>
<style lang="less" scoped>
li {
  list-style:decimal;
  margin-bottom: 5px;
  line-height: 19px;
  font-family: MicrosoftYaHei;
}
ol {
  margin: 0 40px;
}

</style>
