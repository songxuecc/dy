<!--  -->
<template>
  <el-drawer
    :visible.sync="drawer"
    size="80%"
    class="drawer"
    :with-header="false"
    :append-to-body="true"
  >
    <Search />
  </el-drawer>
</template>

<script>
import Search from './Search'
export default {
  name: 'component_name',
  props: {},
  components: {
    Search
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
</style>
