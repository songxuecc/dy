<template lang="html">
    <div class="content-relative">
      <help-tips helpLink="waterList" positionT="6" positionR="10"></help-tips>
      <el-menu :default-active='$route.path'  mode="horizontal" router active-text-color="#409EFF">
        <el-menu-item index="/wm/list">
          <template slot="title">
            <span>水印模版</span></template>
        </el-menu-item>
        <el-menu-item index="/wm/activity">
          <template slot="title">
            <span>水印活动</span></template>
        </el-menu-item>
      </el-menu>
       <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
import helpTips from '@/components/HelpTips.vue'
import { mapGetters } from 'vuex'
import common from '@/common/common.js'

export default {
  mixins: [],
  components: {
    helpTips
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
    @import '~@/assets/css/base.less';
    /deep/ .el-menu--horizontal>.el-submenu .el-submenu__title{
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-menu--horizontal>.el-menu-item{
      height: 30px;
      line-height: 30px;
    }
</style>
