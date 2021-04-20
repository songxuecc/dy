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
    <p class="color-4e mb-10">如何操作？</p>
    <div class="flex justify-a">
        <div class="card">
            <div class="flex" style="margin-bottom:30px">
                <img src="./images/chrome.png" alt="" class="size mr-15" >
                  <div>
                      <p class="color-4e font-14" style="margin-bottom:28px">若您是谷歌浏览器用户</p>
                      <div class="flex">
                        <div class="flex column align-c mr-5">
                            <img src="./images/download.png" alt="" class="size mb-5" >
                            <span class="color-767989 font-12">下载插件</span>
                        </div>
                        <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                        <div class="flex column align-c mr-5 ml-5">
                            <img src="./images/unzip.png" alt="" class="size mb-5" >
                            <span class="color-767989 font-12">解压安装包</span>
                        </div>
                        <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                        <div class="flex column align-c mr-5 ml-5">
                            <img src="./images/install.png" alt="" class="size mb-5" >
                            <span class="color-767989 font-12">添加安装包</span>
                        </div>
                        <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                        <div class="flex column align-c mr-5 ml-5">
                            <img src="./images/plugin.png" alt="" class="size mb-5" >
                            <span class="color-767989 font-12">开启插件</span>
                        </div>
                        <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                        <div class="flex column align-c mr-5 ml-5">
                            <img src="./images/collection.png" alt="" class="size mb-5" >
                            <span class="color-767989 font-12">开始采集</span>
                        </div>
                      </div>
                  </div>
              </div>

              <p>
                <span class="pr-10">第一步：</span>
                <span class="click">点击下载插件</span>
              </p>

              <p>
                <span class="pr-10">第一步：</span>
                <span class="click">点击下载插件</span>
              </p>

        </div>

        <div class="card flex">
            <img src="./images/chrome.png" alt="" class="size mr-15" >
            <div>
                <p class="color-4e font-14" style="margin-bottom:28px">若您是谷歌浏览器用户</p>
                <div class="flex">
                  <div class="flex column align-c mr-5">
                      <img src="./images/download.png" alt="" class="size mb-5" >
                      <span class="color-767989 font-12">下载插件</span>
                  </div>
                  <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                  <div class="flex column align-c mr-5 ml-5">
                      <img src="./images/unzip.png" alt="" class="size mb-5" >
                      <span class="color-767989 font-12">解压安装包</span>
                  </div>
                  <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                  <div class="flex column align-c mr-5 ml-5">
                      <img src="./images/install.png" alt="" class="size mb-5" >
                      <span class="color-767989 font-12">添加安装包</span>
                  </div>
                  <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                  <div class="flex column align-c mr-5 ml-5">
                      <img src="./images/plugin.png" alt="" class="size mb-5" >
                      <span class="color-767989 font-12">开启插件</span>
                  </div>
                  <hh-icon type="iconjindujiantou" class="font-12 mt-15" ></hh-icon>
                  <div class="flex column align-c mr-5 ml-5">
                      <img src="./images/collection.png" alt="" class="size mb-5" >
                      <span class="color-767989 font-12">开始采集</span>
                  </div>
                </div>
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
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    border: 1px solid #F2F2F2;
    padding: 26px 25px 29px 28px;
}

.mr-15 {
  margin-right: 15px;
}

.ml-2 {
  margin-left: 2px;
}

.mt-15 {
  margin-top: 15px;
}.size {
  width:40px;
  height: 40px;
}
</style>
