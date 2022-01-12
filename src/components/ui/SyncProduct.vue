<!--  -->
<template>
    <span style="margin-left:5px;font-weight:normal" class="syncProducts flex align-c">
        <span v-if="getSyncButtonStatus === 'ready'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在准备同步后台商品... <i class="el-icon-loading"></i></span>
        <span v-else-if="getSyncButtonStatus === 'running'"><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先同步后台商品，正在同步后台商品...<span class="bold">{{getSyncButtonText}}</span> <i class="el-icon-loading"></i></span>
        <span v-else><hh-icon type="iconjingshi1"></hh-icon> 在操作前请先<span class="underline pointer" @click="handleSyncProducts">同步后台商品</span>（最近同步时间：<span class="bold">{{getSyncButtonText}}</span>），待商品更新至最新再操作</span>
    </span>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'SyncProduct',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['getSyncButtonText', 'getSyncButtonStatus'])
  },
  methods: {
    ...mapActions(['handleSyncProducts'])
  }
}
</script>
<style lang="less" scoped>
.syncProducts {
    height: 30px;
    background: #EAEDFA;
    border-radius: 15px;
    line-height: 30px;
    font-size: 12px;
    color: #999999;
    padding: 0 12px;
  }
</style>
