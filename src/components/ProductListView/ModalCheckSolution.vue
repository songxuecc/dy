<!--  -->
<template>
    <el-dialog
        class="ModalCheckSolution"
        @close="dialogClose"
        title="搬迁失败如何操作"
        :visible.sync="visible"
        width="780px">
    <img :src="url" alt="" style="width:100%">
</el-dialog>
</template>

<script>
export default {
  name: 'ModalCheckSolution',
  data () {
    return {
      visible: false,
      url: 'https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8b48d2610cf4fe8a2383c13c82382f1~tplv-k3u1fbpfcp-watermark.image?'
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    dialogClose () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.ModalCheckSolution {
    /deep/ .el-dialog {
        margin-top: 8vh !important;
    }
}
</style>
