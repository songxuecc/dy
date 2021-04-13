<!--  -->
<template>
    <el-dialog :visible.sync="visible" :show-close="false">
        <div slot="title">
            <p class="bold font-18 center relative">一下id查询失败 <span @click="copy(ids)" :diabled="postCodeLoading"
                    class="pointer primary absolute">复制全部</span></p>
        </div>
        <p v-for="id in ids" :key="id" class="bold pointer " @click="copy(id)" @mouseover.stop="handleMousedown(id)"
            @mouseout.stop="handleMouseout">
            <span class="relative">
                {{id}}
                <hh-icon type="iconfuzhishangpin" v-show="activeId === parseInt(id)" class="absoluteCopy"></hh-icon>
            </span>
        </p>
        <div slot="footer" class="center">
            <el-button type="primary" plain style="width:120px" @click="cancel">暂不复制</el-button>
            <el-button type="primary" style="width:120px"  @click="confirm">继续复制</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
  name: 'ModalBindCopyIdSearch',
  props: {
    ids: Array
  },
  data () {
    return {
      visible: false,
      postCodeLoading: false,
      activeId: undefined
    }
  },
  methods: {
    cancel () {
      this.visible = false
    },
    confirm () {
      this.cancel()
      this.$emit('continueCopy', this.ids)
    },
    copy: async function (text) {
      try {
        this.postCodeLoading = true
        await this.$copyText(text)
        this.postCodeLoading = false
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } catch (err) {
        this.postCodeLoading = false
        this.$message({
          message: err,
          type: 'error'
        })
      }
    },
    handleMouseout () {
      this.activeId = undefined
    },
    handleMousedown (index) {
      this.activeId = parseInt(index)
    }
  }
}
</script>
<style lang="less" scoped>

.absolute {
    position:absolute;
    right:10px;
}
.absoluteCopy {
    position:absolute;
    right:-20px;
    top: 0;
    bottom: 0;
    margin:auto;
}
</style>
