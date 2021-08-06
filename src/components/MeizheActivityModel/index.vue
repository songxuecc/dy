<!--  -->
<template>
    <el-dialog :visible.sync="dialogTableVisible" width="40%" @closed="closed" >
    <div class="pointer relative" @click="handleClick" v-loading="loading">
        <hh-icon type="iconguanbi2" class="icon pointer"></hh-icon>
        <img :src="image" alt="" style="width:100%">
    </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import image from './image.png'
export default {
  name: 'MeizheActivityModel',
  props: {
    msg: String
  },
  data () {
    return {
      image,
      dialogTableVisible: false,
      loading: true
    }
  },
  created () {
    if (!this.isAuth) return false
    if (!this.currentSubsc) {
      return false
    }
    if (this.currentSubsc.is_newcomer) return false
    const hasShow = localStorage.getItem('hasShowMeizheActivityModel')
    if (!hasShow) {
      if (window._hmt) {
        console.log('000000')
        window._hmt.push(['_trackEvent', '美折', '展示', '新用户弹窗展示'])
      }
      this.dialogTableVisible = true
    }
    this.loading = false
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      currentSubsc: 'getCurrentSubsc'
    })
  },
  methods: {
    handleClick () {
      this.dialogTableVisible = false
    },
    closed () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '美折', '点击', '新用户弹窗点击'])
      }
      const url = 'https://dx5.cn/YbqpPb'
      localStorage.setItem('hasShowMeizheActivityModel', 1)
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-dialog__header {
    display: none;
}
/deep/  .el-dialog__body {
    padding: 0;
}
/deep/   .el-dialog {
    border-radius: 20px;
    overflow: hidden;
}

.icon {
    position:absolute;
    right:0px;
    top:0px;
    z-index: 99;
    width:30px;
    height:30px;
    font-size:30px;
    color:#666666;
    border:10px solid transparent;
    &:hover{
        color:#FF4745;
        cursor: pointer;
    }
}
</style>
