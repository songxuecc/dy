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
import image from './image.png'
import Api from '@/api/apis'
import moment from 'moment'

export default {
  name: 'MeizheActivityModel',
  props: {
    msg: String
  },
  data () {
    return {
      image,
      dialogTableVisible: false,
      loading: true,
      open: false,
      localStorageKey: 'hasShowMeizheActivityModel2'
    }
  },
  created () {
    if (!this.isAuth) {
      return false
    }
    const current = moment(new Date())
    const timeShowIsAfter = moment(current).isAfter('2021-09-26')
    const timeShowIsBefore = moment(current).isBefore('2021-09-20')
    // 9月20~26
    if (timeShowIsAfter || timeShowIsBefore) {
      return false
    }
    localStorage.removeItem('hasShowMeizheActivityModel')
    const hasShow = localStorage.getItem(this.localStorageKey)
    if (!hasShow) {
      Api.hhgjAPIs.is_new_migrate().then((data) => {
        if (data) {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '美折', '展示', '美折-送一年'])
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
      localStorage.setItem(this.localStorageKey, 1)
      if (this.open) {
        const url = 'https://dx5.cn/YXEtBg'
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
