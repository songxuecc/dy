<template lang="html">
    <el-row class="tac">
        <div class="sideBar">
            <el-menu :default-active='$route.path' router @select="handleSelect">
                <el-menu-item index="/info">
                    <i class="el-icon-guide"></i>
                    <span slot="title">软件介绍</span>
                </el-menu-item>
                <el-menu-item index="/migrate">
                    <i class="el-icon-document-copy"></i>
                    <span slot="title">开始抓取</span>
                </el-menu-item>
                <el-menu-item index="/productList">
                    <i class="el-icon-receiving"></i>
                    <span slot="title">抓取商品</span>
                </el-menu-item>
<!--                <el-menu-item index="/pddPoductList" :disabled="!isAuth() || !subsc().is_subsc">-->
<!--                    <i class="el-icon-files"></i>-->
<!--                    <span slot="title">商品管理</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/shopDecorate/whitebg" :disabled="!isAuth() || !subsc().is_subsc">-->
<!--                    <i class="el-icon-brush"></i>-->
<!--                    <span slot="title">店铺装修</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="/my" :disabled="!isAuth() || !subsc().is_subsc">-->
<!--                    <i class="el-icon-goods"></i>-->
<!--                    <span slot="title">订购记录</span>-->
<!--                </el-menu-item>-->
                <el-menu-item index="/service">
                    <i class="el-icon-chat-dot-round"></i>
                    <span slot="title">客服微信</span>
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
    }
  },
  computed: {
    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  }
}
</script>
