<!-- sku导入详情 -->
<template>
  <div>
    <el-alert  type="warning" :closable ="false">
      <div slot="title" class="font-14">
        <span>·修改字段:导入修改sku编码</span>
        <span>·修改时间:2020-12-24 18:28:21</span>
        <span>·修改数量:共计1057条成功0条，失败0条</span>
      </div>
    </el-alert>
    <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.id" v-for="tab in tabs">
      <TableProductDetail />
    </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import TableProductDetail from './TableProductDetail'
export default {
  name: 'DetailSkuEdit',
  props: {
    msg: String
  },
  components: {TableProductDetail},
  data () {
    return {
      tabs: [{
        id: 0,
        label: '修改失败',
        name: 'fail'
      }, {
        id: 1,
        label: '修改成功',
        name: 'complete'
      }, {
        id: 2,
        label: '修改中',
        name: 'running'
      }, {
        id: 3,
        label: '终止',
        name: 'stop'
      }],
      activeName: 'complete'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
