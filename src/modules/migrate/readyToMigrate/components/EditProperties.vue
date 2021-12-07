<!--  EditProperties -->
<template>
    <el-dialog title="批量修改属性" :visible="visible" v-hh-modal width="780px" center @close="close"
    :close-on-click-modal="false" :close-on-press-escape="false" >
        <div style="padding:10px">
            <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9fe9f49829a14df2beb6960ed1529565~tplv-k3u1fbpfcp-watermark.image?"
            style="width:708px" alt="">
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'EditProperties',
  props: {
    visible: Boolean
  },
  data () {
    return {
    }
  },
  methods: {
    close () {
      this.$emit('update:visible', false)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
