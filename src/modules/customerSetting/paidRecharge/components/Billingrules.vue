<!-- EvalRules -->
<template>
      <el-dialog title="额度计算规则" :visible="visible" @close="dialogEditClose" v-hh-modal width="500px" center>
          <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
              prop="name"
              label="充值条数">
            </el-table-column>
            <el-table-column
              prop="date"
              label="单价"
              width="180">
            </el-table-column>
          </el-table>
      </el-dialog>
</template>

<script>
export default {
  name: 'EvalRules',
  props: {
  },
  data () {
    return {
      visible: false,
      tableData: [{
        date: '0.025/条',
        name: '大于0小于等于100'
      }, {
        date: '0.020/条',
        name: '大于100小于等于500'
      }, {
        date: '0.018/条',
        name: '大于500小于等于1000'
      }, {
        date: '0.016/条',
        name: '大于1000'
      }]
    }
  },
  methods: {
    open () {
      this.visible = true
    },
    dialogEditClose () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>
