<!-- sku上传文件 -->
<template>
<div class="left uploadFile pb-10">
  <p class="font-12 ">1、上传前确保已进行过商品同步&nbsp;&nbsp;<a class="pramiry">同步商品</a> <span class="info">&nbsp;最近同步时间 2020-12-05</span></p>
  <p class="font-12 ">2、每次支持3000个sku编码修改，文件格式支持.xlsx &nbsp;<a class="pramiry">示例文件</a> </p>
  <p class="font-12 ">3、保证导入的商品标题、规格名与抖店后台一致 </p>
  <el-upload class="upload-demo mt-10" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
    :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="3" :on-exceed="handleExceed" :show-file-list="false"
    :file-list="fileList">
    <el-button size="small" type="primary"><i class="el-icon-upload"></i>&nbsp;&nbsp;点击上传</el-button>
  </el-upload>
</div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    msg: String
  },
  data () {
    return {
      fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
    }
  },
  methods: {
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>
<style lang="less" scoped>
.uploadFile {
  background: #FFF6ED;
  border-radius: 3px;
  border: 1px solid rgba(250, 100, 0, 0.2);
  padding-top: 12px;
  padding-left: 17px;
}
</style>
