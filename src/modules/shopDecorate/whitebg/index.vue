<template lang="html">
    <div>
        <el-menu :default-active='$route.path'  mode="horizontal" router active-text-color="#409EFF">
          <el-menu-item index="/shopDecorate/whitebg">
            <template slot="title">
              <span>白底图</span></template>
          </el-menu-item>
          <el-submenu index="/shopDecorate/wm/activity" :disabled="subsc().item_level<subscItemLevelMap['advanced']">
            <template slot="title">
              <span>水印</span>
            </template>
              <el-menu-item index="/shopDecorate/wm/activity">活动列表</el-menu-item>
              <el-menu-item index="/shopDecorate/wm/list">水印列表</el-menu-item>
          </el-submenu>
        </el-menu>
       <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>

import { mapGetters } from 'vuex'
import common from '@/common/common.js'

export default {
  mixins: [],
  components: {
  },
  data () {
    return {
    }
  },

  mounted () {
  },
  methods: {
    ...mapGetters({
      subsc: 'getCurrentSubsc'
    })
  },
  computed: {
    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  }
}
</script>
<style lang="less" scoped>
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title{
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-menu--horizontal>.el-menu-item{
      height: 30px;
      line-height: 30px;
    }
</style>
