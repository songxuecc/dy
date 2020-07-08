<template lang="html">
    <div>
        <el-tabs type="border-card" v-model="activeName">
          <el-tab-pane label="关于我们" class="my-info" name="company">
            虎虎搬家助手属于上海虎正奔信息科技有限公司旗下品牌。
            <br/>
            上海虎正奔信息科技有限公司是一家为电商企业提供创新型店铺经营管理工具的互联网公司。致力于帮助企业降低运营成本、提升运营效率、促进交易转化。
            <br/>
            <br/>
            公司名称：上海虎正奔信息科技有限公司
            <br/>
            地址：上海浦东软件园15号楼504
            <br/>
            联系方式：huhu_yunying@taofengcai.com
            <br>
            <br>
            <br>
            <div style="max-width: 70%; float:left; font-size: 14px;">
              如有问题，可以联系客服：<img src="@/assets/images/wxpic.jpg" style="max-height: 100px;">
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="padding-top: 20px">
            <el-link href="http://www.beian.miit.gov.cn" target="_blank" >沪ICP备16034003号</el-link>
        </div>
      <br>
      <br>
    </div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'company'
    }
  }
}
</script>
<style lang="less" scoped>
    .my-info {
      line-height: 30px;
      text-align: left;
      padding: 20px;
    }
</style>
