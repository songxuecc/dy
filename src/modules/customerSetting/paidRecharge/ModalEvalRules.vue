<!-- EvalRules -->
<template>
      <el-dialog title="额度计算规则" :visible="visible" @close="dialogEditClose" v-hh-modal width="500px" center>
          <ol>
              <li class="color-4e font-14">订购免费版赠送10条额度，订购1个月版赠送100条额度，订购3个月版赠送300条额度，订购了6个月版赠送600条额度，订购12个月版赠送1200条额度；</li>
              <li class="color-4e font-14">可通过付费充值增加额度，收费标准：100条=10元、300条=25元、500条=35元、1000条=60元；</li>
              <li class="color-4e font-14">赠送额度、充值额度均可累计且在任何场景下不会被清空；</li>
              <li class="color-4e font-14">抓取成功耗费一条额度，抓取失败不耗费额度。</li>
              <li class="color-4e font-14">以上规则自2021年3月X日生效。</li>
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
