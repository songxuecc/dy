<template lang="html">
  <div style="margin-top:20px;">
    <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>

import request from '@/mixins/request.js'

export default {
  mixins: [request],
  components: {

  },
  mounted () {
  },
  data () {
    return {
    }
  },
  computed: {
  },
  methods: {
    getShow (data) {
      this.show = data.show
      if (this.show === 'watermark_activity_create') {
        this.selectWaterMarkActivity = data.waterMarkActivity
      }
    }
  }
}
</script>
<style lang="less" scoped>
    // @import '~@/assets/css/base.less';
    // /deep/ .el-checkbox-button .el-checkbox-button__inner {
    //   height:100px;
    //   width:100px;
    //   font-size: 14px;
    //   line-height: 74px;
    // }
    // /deep/ .el-checkbox-button.is-focus .el-checkbox-button__inner{
    //   border-color:#DCDFE6
    // }
    // /deep/ .el-checkbox-button.is-checked .el-checkbox-button__inner{
    //   background-color:#FFF;
    //   color: #409EFF;
    //   border-color:#409EFF;
    // }

</style>
