<!--  -->
<template>
  <el-dialog title="删除复制记录" :visible="visible" v-hh-modal width="30%" center @close="close">
    <p style="text-align:center">
      只删除软件的记录，对小店后台商品没影响，删除后已复制的商品可进行再次复制搬家，您确定要操作吗？
    </p>
    <span slot="footer">
      <el-button type="plain" style="width:120px;margin-right:10px" @click="close">取消
      </el-button>
      <el-button type="primary" style="width:120px" @click="confirm">确定</el-button>
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
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      this.close()
    }
  }
}
</script>
<style lang="less" scoped></style>
