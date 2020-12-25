<!-- 店铺绑定列表 -->
<template>
    <div>
    <button @click="handleClick">testBtn</button>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="日期"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('moving/shopsBand')

export default {
  name: 'TableShopManagement',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions(['getTPProductByIds']),
    async handleClick  () {
      const items = await this.getTPProductByIds({})
      console.log('handleClick')
      console.log(items)
    }
  },
  computed: {
    ...mapState(['items', 'captureIdList', 'tableData'])
  }

}
</script>
<style lang="less" scoped>
</style>
