<!-- sku导入详情 -->
<template>
<div>
  <el-alert type="warning" :closable="false">
    <div slot="title" class="font-14 flex">
      <span><b>·</b>修改字段:&nbsp;导入修改sku编码</span>
      <span><b>·</b>修改时间:&nbsp;{{parentRowData.create_time}}</span>
      <span><b>·</b>修改数量:&nbsp;共计{{parentRowData.total_nums}}条成功{{parentRowData.success_nums}}条，失败{{parentRowData.fail_nums}}条</span>
    </div>
  </el-alert>
  <el-tabs v-model="activeName" >
    <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name" v-for="tab in tabs">
      <TableProductDetail :activeName="activeName" :currentName="tab.name" v-if="tab.name === activeName"/>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import TableProductDetail from './TableProductDetail'
const {
  mapState
} = createNamespacedHelpers('moving/skuImport')
export default {
  name: 'DetailSkuEdit',
  props: {
  },
  components: {TableProductDetail},
  data () {
    return {
      tabs: [{
        id: 0,
        label: '修改失败',
        name: 'fail'
      },
      {
        id: 1,
        label: '修改成功',
        name: 'success'
      },
      {
        id: 2,
        label: '修改中',
        name: 'running'
      }
      // {
      //   id: 3,
      //   label: '终止',
      //   name: 'stop'
      // }
      ],
      activeName: 'fail'
    }
  },
  watch: {
    activeName: function (params) {
      console.log(params)
    }
  },
  computed: {
    ...mapState(['tableDataProductDetail', 'paginationProductDetail', 'parentRowData'])
  }
}
</script>
<style lang="less" scoped>
</style>
