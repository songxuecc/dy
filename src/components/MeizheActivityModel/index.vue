<!--  -->
<template>
    <el-dialog :visible.sync="dialogTableVisible" width="40%" @closed="closed">
    <div class="pointer relative"  v-loading="loading">
        <hh-icon type="iconguanbi2" class="icon pointer" @click.native.prevent="handleClose"></hh-icon>
        <img :src="image" alt="" style="width:100%" @click="handleClick">
    </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import request from '@/mixins/request.js'
import image from './image.png'
import Api from '@/api/apis'

export default {
  mixins: [request],
  name: 'MeizheActivityModel',
  props: {
    msg: String
  },
  data () {
    return {
      image,
      dialogTableVisible: false,
      loading: true,
      open: false
    }
  },
  created () {
    if (!this.isAuth) return false
    const hasShow = localStorage.getItem('hasShowMeizheActivityModel')
    if (!hasShow) {
      Api.hhgjAPIs.is_new_migrate().then((data) => {
        if (!data) {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '美折', '展示', '新用户弹窗展示'])
          }
          this.dialogTableVisible = true
        }
      }).finally(() => {
        this.loading = false
      })
    } else {
      this.loading = false
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    })
  },
  methods: {
    handleClose (e) {
      this.dialogTableVisible = false
    },
    handleClick () {
      this.open = true
      this.dialogTableVisible = false
    },
    closed () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '美折', '点击', '新用户弹窗点击'])
      }
      localStorage.setItem('hasShowMeizheActivityModel', 1)
      if (this.open) {
        const url = 'https://dx5.cn/YbqpPb'
        window.open(url)
      }
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
