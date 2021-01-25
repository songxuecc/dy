<!--  -->
<template>
  <el-dialog title="批量删除详情尾图"    :visible.sync="visible" v-hh-modal width="30%" center @close="close">
    <p style="text-align:center">
      所选商品的详情尾图都会被删除，确认操作吗
    </p>
    <span slot="footer">
      <el-button type="primary" style="width:120px" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditDelteDetailImage',
  props: {
    visible: String
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
