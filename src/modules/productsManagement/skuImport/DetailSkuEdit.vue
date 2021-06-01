<!-- SKU导入详情 -->
<template>
<div>
  <el-alert type="warning" :closable="false" @tab-click="handleClick">
    <div slot="title" class="font-12 flex">
<!--      <span><b>·</b>修改字段:&nbsp;导入修改sku编码</span>-->
      <span><b>·</b>修改时间:&nbsp;{{parentRowData.create_time}}</span>
      <span style="margin-left: 30px;"><b>·</b>修改数量:&nbsp;共计{{parentRowData.total_nums}}条成功{{parentRowData.success_nums}}条，失败{{parentRowData.fail_nums}}条</span>
    </div>
  </el-alert>
  <el-tabs v-model="activeName" >
    <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name" v-for="tab in tabs" >
      <div style="position:relative">
        <TableProductDetail :activeName="activeName" style="height:75vh;min-height:75vh;overflow:auto;" :currentName="tab.name" v-if="tab.name === activeName"/>
      </div>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

import TableProductDetail from '@productsManagement/skuImport/TableProductDetail'
const {
  mapState
} = createNamespacedHelpers('productManagement/skuImport')
export default {
  name: 'DetailSkuEdit',
  props: {
  },
  components: {TableProductDetail},
  data () {
    return {
      activeName: 'fail'
    }
  },
  computed: {
    ...mapState('productManagement/skuImport', ['productSkuExcelFilters']),
    ...mapState(['parentRowData']),
    tabs () {
      const tabs = [{
        id: 0,
        label: '无法修改',
        name: 'fail'
      },
      {
        id: 1,
        label: '已修改，提交官方审核',
        name: 'success'
      }
      // {
      //   id: 2,
      //   label: '审核驳回',
      //   name: 'bohui',
      //   visible: (type) => [].includes(type)
      // },
      // {
      //   id: 3,
      //   label: '审核通过',
      //   name: 'os',
      //   visible: (type) => [].includes(type)
      // }
      ]
      if (this.parentRowData.status === 'running') {
        tabs.push(
          {
            id: 2,
            label: '修改中',
            name: 'running',
            visible: (type) => [].includes(type)
          })
      }
      return tabs
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-alert__content {
  width:100%;
  box-sizing: border-box;
  .el-alert__title {
    display: block;
  }
}
</style>
