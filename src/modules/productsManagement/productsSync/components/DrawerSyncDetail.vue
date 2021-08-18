<!--  -->
<template>
    <div></div>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  name: 'component_name',
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
    ...mapActions('productManagement/productsSync/drawerSyncDetail', ['fetch'])
  }
}
</script>
<style lang="less" scoped>
</style>
