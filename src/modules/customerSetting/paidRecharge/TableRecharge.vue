<!-- Recharge -->
<template>
    <div class="Recharge">
         <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-empty slot="empty"/>
            <el-table-column
                prop="remark"
                label="时间"
                align="center"
               >
            </el-table-column>
            <el-table-column
                prop="name"
                label="记录"
                align="center"
                >
            </el-table-column>
            </el-table>
    </div>
</template>

<script>
import Api from '@/api/apis'

export default {
  components: { },
  name: 'recharge',
  props: {
    msg: String
  },
  data () {
    return {
      tableData: [{
        remark: '2016-05-02',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        remark: '2016-05-04',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        remark: '2016-05-01',
        name: '订购7天-全免费版赠送额度10条'
      }, {
        remark: '2016-05-03',
        name: '订购7天-全免费版赠送额度10条'
      }]
    }
  },
  created () {
    this.init()
  },
  activated () {
    this.init()
  },
  methods: {
    async init () {
      const data = await Api.hhgjAPIs.userAccountQuery()
      // this.tableData = data.version_list
      // this.available_pdd_capture_nums = data.available_pdd_capture_nums
      // this.total_pdd_capture_nums = data.total_pdd_capture_nums
    }
  }

}
</script>
<style lang="less" scoped>
.Recharge {
    width: 100%;
}
</style>
