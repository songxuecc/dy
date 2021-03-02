<!-- PayRecord -->
<template>
    <div>
        <div class="mb-10 color-333 font-12">抓取拼多多剩余额度数：10条 <el-link class="font-12" :underline="false" type="primary" @click="toggleVisible">额度计算规则</el-link></div>
        <div class="mb-10 color-333 font-12">拼多多抓取充值：<span v-for="(tag,idx) in tags" :key="idx" :class="['tag',idx === active?'active' :'']" @click="handleChange(idx)">{{tag}}条</span></div>
        <div class="mb-20 color-333 font-12">价格：<span class="price font-24">10</span><span class="price">元</span></div>
        <el-button type="primary" style="width:120px" @click="onCharge">立即充值</el-button>
        <ModalEvalRules :visible.sync="visible" @toggleVisible="toggleVisible"/>
    </div>
</template>

<script>
import Api from '@/api/apis'

import ModalEvalRules from './ModalEvalRules'
export default {
  name: 'payRecord',
  props: {
  },
  components: {ModalEvalRules},
  data () {
    return {
      active: 0,
      tags: [100, 300, 500, 1000],
      visible: false
    }
  },
  methods: {
    handleChange (active) {
      this.active = active
    },
    toggleVisible () {
      this.visible = !this.visible
    },
    async onCharge () {
      try {
        const price = this.tags[this.active]
        const data = await Api.hhgjAPIs.userAccountFlowCreate()
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .tag {
        text-align: center;
        line-height: 24px;
        width: 60px;
        height: 24px;
        border-radius: 4px;
        border: 1px solid @border-color-light;
        font-size: 12px;
        color:@border-color-light;
        margin-right: 10px;
        display: inline-block;
        font-family: MicrosoftYaHei;
    }
    .active {
        position: relative;
        transition: all 0.5s ease;
        color:#1D8FFF;
        border: 1px solid #1D8FFF;
        &::after {
            content: '✓';
            display: block;
            height: 0px;
            width: 0px;
            position: absolute;
            bottom: 0;
            right: 0;
            color:#fff;
            font-size: 4px;
            line-height: 4px;
            text-align: left;
            border-style: solid;
            border-bottom-width:8px;
            border-right-width:10px;
            border-top-width:8px;
            border-left-width:10px;
            border-color: transparent #1D8FFF #1D8FFF transparent;;
        }
    }
    .price{
      color:#DC4041
    }
    .font-24 {
      font-size: 24px;
      font-family: FZLTTHK--GBK1-0, FZLTTHK--GBK1;
    }

</style>
