<!-- 商品分优化表格 -->
<template>
    <div>
        <el-table
        :data="tableData"
        style="width: 100%"
        v-loading="loading">
        <el-table-empty slot="empty"/>
        <el-table-column
            prop="product_name"
            label="商品名称">
            <template slot-scope="scope">
                <div>{{scope.row.product_name}}</div>
                <div>{{scope.row.product_id}}</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="problem_num_to_improve"
            label="待优化数量"
            align="center">
        </el-table-column>
        <el-table-column
            prop="problem_type_distribution"
            label="优化类型">
            <template slot-scope="scope">
                <div v-for="(list,idx) in scope.row.problem_type_distribution" :key="idx">{{list.type_name}}-{{list.num}}</div>
            </template>
        </el-table-column>
        <el-table-column
            prop="base_score"
            align="center"
            label="基础分">
        </el-table-column>
        <el-table-column
            prop="meet_standard"
            label="商品状态">
            <template slot-scope="scope">
                <span v-if="scope.row.meet_standard === 1">达标</span>
                <span v-if="scope.row.meet_standard === 2">不达标</span>
            </template>
        </el-table-column>
        <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
                <span class="click" @click="go(scope.row.product_id)">立即优化</span>
                <span class="click" @click="open(scope.row.product_id)">详情</span>
            </template>
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
        <DialogProductScoreDetail ref="DialogProductScoreDetail" />
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import DialogProductScoreDetail from '../DialogProductScoreDetail'

export default {
  components: {
    DialogProductScoreDetail
  },
  name: 'TableProductList',
  props: {
    id: Number
  },
  data () {
    return {
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/productQualityScore/tableProductList/query']
    }),
    ...mapState('productManagement/productQualityScore/tableProductList', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ])
  },
  methods: {
    ...mapMutations('productManagement/productQualityScore/tableProductList', ['save']),
    ...mapActions('productManagement/productQualityScore/tableProductList', [
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear',
      'fetch'
    ]),
    open (id) {
      this.$refs.DialogProductScoreDetail.open(id)
    },
    go (id) {
      this.$refs.DialogProductScoreDetail.open(id)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
