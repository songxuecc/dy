<!-- PayRecord -->
<template>
    <div>
        <div class="mb-10">抓取拼多多剩余额度数：10条 <el-link class="font-12" :underline="false" type="primary">额度计算规则</el-link></div>
        <div class="mb-10">拼多多抓取充值：<span v-for="(tag,idx) in tags" :key="idx" :class="['tag',idx === active?'active' :'']" @click="handleChange(idx)">{{tag}}条</span></div>
        <div class="mb-10">价格：10</div>
        <el-button type="primary">立即充值</el-button>
    </div>
</template>

<script>
export default {
  name: 'payRecord',
  props: {
    msg: String
  },
  data () {
    return {
      active: 0,
      tags: [100, 300, 500, 1000]
    }
  },
  methods: {
    handleChange (active) {
      this.active = active
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
        border: 1px solid #999999;
        font-size: 12px;
        color:#999999;
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
</style>
