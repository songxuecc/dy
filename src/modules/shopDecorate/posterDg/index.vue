<template lang="html">
<div>
  <el-menu :default-active='$route.path' mode="horizontal" router active-text-color="#409EFF">
    <el-menu-item index="/shopDecorate/poster/dg/list">
      <template slot="title">
        <span>详情海报模版</span></template>
    </el-menu-item>
    <el-menu-item index="/shopDecorate/poster/dg/activity">
      <template slot="title">
        <span>详情海报活动</span>
      </template>
    </el-menu-item>
    <span
      class="click mr-20"
      style="
        align-content:right;
        position: absolute;
        right: 10px;
        top: 5px;"
      v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/glhkuh'">使用教程</span>
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
  components: {},
  data () {
    return {}
  },

  mounted () {},
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
/deep/ .el-menu--horizontal > .el-submenu .el-submenu__title {
  height: 30px;
  line-height: 30px;
}
/deep/ .el-menu--horizontal > .el-menu-item {
  height: 30px;
  line-height: 30px;
}
</style>
