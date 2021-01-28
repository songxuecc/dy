<!--  -->
<template>
<el-dialog title="删除复制记录" :visible="visible" v-hh-modal width="30%" center @close="close"
:close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
  <p style="text-align:center">
    只删除软件的记录，对小店后台商品没影响，删除后已复制的商品可进行再次复制搬家，您确定要操作吗？
  </p>
  <div class="mt-10"><el-progress :percentage="percentage" :format="format" ></el-progress></div>
  <span slot="footer">
      <el-button style="width:120px" @click="close" v-if="!loading">取消</el-button>
      <el-button type="primary" style="width:120px" @click="confirm" v-if="!loading">确定</el-button>
      <div v-if="loading" class="flex column justify-c align-c "><el-button @click="shutdown">更新中，点击中止操作</el-button><div class="pl-10 info" style="margin-top:5px">已经更新的数据无法撤回</div></div>
    </span>
</el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'EditDelteRecord',
  props: {
    visible: Boolean,
    loading: Boolean,
    percentage: Number
  },
  data () {
    return {}
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    },
    confirm () {
      this.$emit('deleteRecord')
    },
    shutdown: debounce(function () {
      this.$emit('shutdown')
    }, 300),
    format (percentage) {
      return `已完成${percentage}%`
    }
  }
}
</script>
<style lang="less" scoped>

</style>
