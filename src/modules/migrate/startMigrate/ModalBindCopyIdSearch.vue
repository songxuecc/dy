<!--  -->
<template>
  <el-dialog :visible.sync="visible" :show-close="false" width="520px">
    <div slot="title">
      <p class="bold center relative flex column align-c font-12">
        <hh-icon type="iconjinggao1" style="font-size:40px" class="mb-5"></hh-icon>
        以下商品id未查询到
        <span @click="copy(ids)" :diabled="postCodeLoading" class="pointer primary absolute">
          复制全部id<hh-icon type="iconfuzhi"></hh-icon>
        </span>
      </p>
    </div>
    <div style="height:220px;overflow-y:scroll">
      <p v-for="id in ids" :key="id" class="bold pointer font-12 left pl-40" @click="copy(id)" @mouseover.stop="handleMousedown(id)"
        @mouseout.stop="handleMouseout">
        <span class="relative">
          {{id}}
          <hh-icon type="iconfuzhishangpin" v-show="activeId === parseInt(id)" class="absoluteCopy"></hh-icon>
        </span>
      </p>
    </div>
    <div slot="footer" class="center">
      <el-button type="primary" plain style="width:120px" @click="cancel">暂不复制</el-button>
      <el-button type="primary" style="width:120px" @click="confirm">继续复制</el-button>
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
/deep/ .el-dialog .el-dialog__body {
  padding: 0;
}
/deep/ .el-dialog .el-dialog__header{
  margin-bottom: 0;
  box-shadow: 0 5px 10px 2px #c5c5c567;
  padding-top: 20px;
}
/deep/ .el-dialog {
  overflow: hidden;
}
/deep/ .el-dialog__footer{
  box-shadow: 0 -5px 10px 2px #c5c5c567;
  border-radius: 0 0 10px 10px;
  overflow: hidden;
  padding-bottom: 20px;
}

.pl-40 {
  padding-left: 40px;
  width: 220px;
}
</style>
