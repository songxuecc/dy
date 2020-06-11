<template lang="html">
    <el-row class="tac">
        <div class="sideBar">
            <el-menu :default-active='$route.path' router @select="handleSelect">
                <el-menu-item index="/info">
                    <i class="el-icon-guide"></i>
                    <span slot="title">软件介绍</span>
                </el-menu-item>
                <el-menu-item index="/migrate" :disabled="!isBind()">
                    <i class="el-icon-document-copy"></i>
                    <span slot="title">开始抓取</span>
                </el-menu-item>
                <el-menu-item index="/productList" :disabled="!isBind()">
                    <i class="el-icon-receiving"></i>
                    <span slot="title">抓取商品</span>
                </el-menu-item>
                <el-menu-item index="/service">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">客服微信</span>
                </el-menu-item>
            </el-menu>
        </div>
      <bind-box :isShowBind="isShowBind"></bind-box>
    </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import common from '@/common/common.js'
import BindBox from './BindBox'

export default {
  components: {BindBox},
  data () {
    return {
      isShowBind: false
    }
  },
  inject: ['reload'],
  methods: {
    ...mapGetters({
      isBind: 'getIsBind'
    }),
    handleSelect (key, keyPath) {
      let isBind = localStorage.getItem('is_bind')
      if (!isBind) {
        this.isShowBind = true
      } else {
        this.isShowBind = false
      }
      if (key === '/productList') {
        this.reload()
      }
    }
  },
  computed: {
    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  }
}
</script>
