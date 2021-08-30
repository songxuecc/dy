<!-- 记录 -->
<template>
    <div></div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'TableSyncRecord',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableSyncRecord', ['fetch'])
  }
}
</script>
<style lang="less" scoped>
</style>
