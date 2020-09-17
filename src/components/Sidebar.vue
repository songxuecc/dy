<template lang="html">
    <el-row class="tac">
        <div class="sideBar">
            <el-menu :default-active='$route.path' router @select="handleSelect">
                <el-menu-item index="/info">
                    <i class="el-icon-user-solid"></i>
                    <span slot="title">关于我们</span>
                </el-menu-item>
                <el-menu-item index="/migrate" :disabled="!isAuth()">
                    <i class="el-icon-document-copy"></i>
                    <span slot="title">开始复制</span>
                </el-menu-item>
                <el-menu-item index="/productList" :disabled="!isAuth()">
                    <i class="el-icon-receiving"></i>
                    <span slot="title">复制商品</span>
                </el-menu-item>
                <el-menu-item index="/dyProductList" :disabled="!isAuth()">
                    <i class="el-icon-files"></i>
                    <span slot="title">商品管理</span>
                </el-menu-item>
                <el-menu-item index="/batchEdit/title" :disabled="!isAuth()">
                    <i class="el-icon-box"></i>
                    <span slot="title">批量处理</span>
                </el-menu-item>
                <el-menu-item index="/service">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">客服微信</span>
                </el-menu-item>
                <el-menu-item @click="openHelp">
                    <i class="el-icon-question"></i>
                    <span slot="title">搬家教程</span>
                </el-menu-item>
            </el-menu>
        </div>
    </el-row>
</template>
<script>
import { mapGetters } from 'vuex'
import common from '@/common/common.js'

export default {
  data () {
    return {
    }
  },
  inject: ['reload'],
  methods: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc'
    }),
    handleSelect (key, keyPath) {
      if (key === '/productList') {
        this.reload()
      }
    },
    openHelp () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')
    }
  },
  computed: {
    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  }
}
</script>
