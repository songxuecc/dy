<!--  -->
<template>
  <el-dialog title="删除复制记录" :visible="visible" v-hh-modal width="30%" center>
    <p style="text-align:center">
      只删除软件的记录，对拼多多商品没影响，您确定要操作吗？
    </p>
    <span slot="footer">
      <el-button type="plain" style="width:120px;margin-right:10px" @click="batchDeleteCaptureVisible = false">取消
      </el-button>
      <el-button type="primary" style="width:120px" @click="batchDeleteCapture">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDelteRecord',
  props: {
    visible: Boolean
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped></style>
