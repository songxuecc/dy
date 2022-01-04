<!-- 额度消耗记录-->
<template>
    <el-dialog title="额度消耗记录" :visible.sync="visible"  v-hh-modal width="800px" center  v-if="visible" style="margin-top:-50px">
        <div class="">
          <el-table
            :data="tableData"
            v-loading="loading"
            height="500"
            style="width: 100%;">
            <el-table-empty slot="empty" />
            <el-table-column
              prop="create_time"
              label="复制时间"
              width="180">
            </el-table-column>
            <el-table-column
              prop="url"
              label="复制链接">
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pagination.page_index"
            class="pt-20 right mr-20"
            :page-size="pagination.page_size"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'ConsumptionRecord',
  data () {
    return {
      visible: false
    }
  },
  computed: {
    ...mapState('customerSetting/paidRecharge/consumptionRecord', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['customerSetting/paidRecharge/consumptionRecord/fetch']
    })
  },
  methods: {
    ...mapActions('customerSetting/paidRecharge/consumptionRecord', [
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear',
      'fetch'
    ]),
    open () {
      this.toggleVisible()
      this.fetch({
        pagination: {
          page_size: 10,
          page_index: 1
        }
      })
    },
    toggleVisible () {
      this.visible = !this.visible
    }
  }
}
</script>
<style lang="less" scoped>

</style>
