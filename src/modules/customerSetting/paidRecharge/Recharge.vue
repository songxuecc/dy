<!-- Recharge -->
<template>
    <div class="Recharge">
        <!-- <el-table-empty /> -->
         <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="时间"
               >
            </el-table-column>
            <el-table-column
                prop="name"
                label="记录">
            </el-table-column>
            </el-table>
    </div>
</template>

<script>
export default {
  components: { },
  name: 'recharge',
  props: {
    msg: String
  },
  data () {
    return {
      tableData: [{
        date: '2016-05-02',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        date: '2016-05-04',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        date: '2016-05-01',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        date: '2016-05-03',
        name: '订购7天-全免费版赠送额度10条'
      }]
    }
  }
}
</script>
<style lang="less" scoped>
.Recharge {
    width: 100%;
}
</style>
