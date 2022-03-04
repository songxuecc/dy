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
      class="click mr-20 pointer"
      style="
        align-content:right;
        position: absolute;
        right: 10px;
        top: 5px;"
      v-hh-open="'https://meideng.yuque.com/books/share/0b65c4cb-9f2a-4099-bb6e-9415844b7ccf/glhkuh'"><hh-icon type="icontishi" ></hh-icon>点我查看教程视频</span>
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
