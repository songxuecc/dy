<!-- https://meideng.yuque.com/huhuguanjia/fe92x6/lsv3r9 -->
<template>
    <div>
        <el-dialog
            :visible.sync="visible"
            width="579px"
            :close-on-click-modal="false"
        >
            <div class="relative">
                <img :src="image" alt="" style="width:100%">
                <div class="add" @click="add"></div>
                <div class="preview" @click="preview"></div>
                <div class="close" @click="close"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import image from './image.png'
import { mapGetters } from 'vuex'

export default {
  name: 'ModalNewUserActivity',
  props: {
  },
  data () {
    return {
      visible: false,
      image
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      isNew: 'getIsNew'
    })
  },
  watch: {
    isAuth (n) {
      if (n) {
        const hasShowModalNewUserActivity = localStorage.getItem('hasShowModalNewUserActivity')
        if (this.isNew && !hasShowModalNewUserActivity) {
          this.visible = true
        }
      }
    }
  },
  methods: {
    add (e) {
      localStorage.setItem('hasShowModalNewUserActivity', 1)
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '引导添加客服弹窗', '点击', '去使用'])
      }
      this.visible = false
    },
    preview () {
      localStorage.setItem('hasShowModalNewUserActivity', 1)
      const url = 'https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l'
      window.open(url)
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '引导添加客服弹窗', '点击', '观看教程'])
      }
      this.visible = false
    },
    close () {
      localStorage.setItem('hasShowModalNewUserActivity', 1)
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '引导添加客服弹窗', '点击', '关闭按钮'])
      }
      this.visible = false
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
    background: rgba(0,0,0,0);
}
/deep/  .el-dialog {
    border-radius: 20px;
    overflow: hidden;
    background: none;
    box-shadow: none;
}

.add {
    position: absolute;
    width: 300px;
    height: 60px;
    bottom: 120px;
    left: 0;
    right: 0;
    margin:auto;
    cursor: pointer;

    border-radius: 25px;
}

.preview {
    position: absolute;
    width: 80px;
    height: 30px;
    bottom: 80px;
    left: 0;
    right: 0;
    margin:auto;
    cursor: pointer;
}

.close {
    position: absolute;
    width: 40px;
    height: 40px;
    bottom: 0px;
    left: 6px;
    right: 0;
    margin:auto;
    cursor: pointer;
    border-radius: 50%;
}

</style>
