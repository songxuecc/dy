<!-- 商品采集 -->
<template>
  <div class="productionCollection left">
    <div class="title ">
        <p> <hh-icon type="icontixing"></hh-icon> 什么是商品采集？</p>
        <p class="info ml-20 mt-5">安装虎虎采集助手，将想要采集的商品链接一键导出生成excel表格。采集完成后，前往 <span class="primary poniter underline">导入复制 </span>进行铺货。</p>
        <p class="info ml-20 mt-5">支持采集平台：
            <img src="@/assets/images/taobao.png" alt="" style="width:16px" />
            <img src="@/assets/images/tm.png" alt="" style="width:16px" />
        </p>
    </div>

    <div>
        <p class="color-4e mb-10">如何操作</p>
        <div class="card">
            <img src="@/assets/images/tm.png" alt="" style="width:40px" >
            <div>
                <span>若您是谷歌浏览器用户</span>
                <span>
                    <img src="@/assets/images/tm.png" alt="" style="width:40px" >
                    <span>下载插件</span>
                </span>
            </div>
        </div>
    </div>
    <el-container>
      <el-header>Header</el-header>
      <el-main>Main</el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  updated () {},
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
.title {
  background: #fff6ed;
  border-radius: 3px;
  border: 1px solid rgba(250, 100, 0, 0.2);
  padding: 14px 20px;
  margin-bottom: 30px;
}
.card {
    width: 452px;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: 1px solid #F2F2F2;
}
</style>
