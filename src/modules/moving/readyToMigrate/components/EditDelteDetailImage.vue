<!--  -->
<template>
  <el-dialog title="批量删除详情尾图"    :visible.sync="visible" v-hh-modal width="30%" center @close="close"
  :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
    <p style="text-align:center">
      所选商品的详情尾图都会被删除，确认操作吗
    </p>
    <div class="mt-10"  v-if="loading"><el-progress :percentage="percentage" :format="format" ></el-progress></div>
    <span slot="footer">
      <el-button style="width:120px" @click="close" v-if="!loading">取消</el-button>
      <el-button type="primary" style="width:120px" @click="confirm" v-if="!loading">确定</el-button>
      <div v-if="loading" class="flex column justify-c align-c "><el-button @click="onShutdown" :loading="shutdown">更新中，点击中止操作</el-button><div class="pl-10 info" style="margin-top:5px">已经更新的数据无法撤回</div></div>
    </span>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'EditDelteDetailImage',
  props: {
    visible: String,
    loading: Boolean,
    percentage: Number,
    shutdown: Boolean
  },
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$emit('batchUpdate', {detailImage: true})
    },
    onShutdown: debounce(function () {
      this.$emit('onShutdown')
    }, 300),
    format (percentage) {
      return `已完成${percentage}%`
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-progress{
  width:100%;
  display: flex;
  justify-content: center;
}
</style>
