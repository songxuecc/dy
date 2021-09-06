<!--  -->
<template>
  <div>
    <Search />
    <div class="right pr-10 click mb-10">一键全选所有商品
      <el-tooltip class="item" effect="dark" content="所有商品指所有页面商品总和" placement="top-end">
        <hh-icon type="iconxiangqing" class="pl-5"></hh-icon>
      </el-tooltip>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
       <el-table-column
          label="图片"
          width="70"
          align="center"
          prop="id">
        <template slot-scope="scope">
          <el-image
              style="height:50px;max-width:50px;border-radius:2px"
              :src="scope.row.image_url"
              fit="contain"
              :preview-src-list="[scope.row.image_url]"
              >
              <div slot="placeholder">
                  <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
              </div>
              <div slot="error" class="flex align-c" style="height:100%">
                  <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
              </div>
          </el-image>
        </template>
      </el-table-column>

      <el-table-column
        label="标题"
        width="">
        <template slot-scope="scope">
            <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
              {{ scope.row.goods_name }}
              </el-link><br>
            <div class="font-12 flex align-c color-999" style="margin-top:3px">
                  <span >商品ID: {{ scope.row.goods_id }}</span>
                  <span class="ml-10 mr-10 presell_type jieti" v-if="scope.row.presell_type === 2">阶梯发货</span>
                  <span class="ml-10 mr-10 presell_type xianhuo" v-if="scope.row.presell_type === 0">现货发货</span>
                  <span class="ml-10 mr-10 presell_type yushou" v-if="scope.row.presell_type === 1">预售发货</span>
              </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="category_show"
        label="类目"
        width="120">
      </el-table-column>
      <el-table-column
        prop="min_price"
        label="售卖价"
        width="120">
        <template slot-scope="scope">
          {{ (scope.row.min_price / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="market_price"
        label="市场价"
        width="120">
        <template slot-scope="scope">
          {{ (scope.row.market_price / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="销售状态"
        width="120">
      </el-table-column>
    </el-table>

    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="pagination.page_index" class=" pt-20 right mr-20" :page-size="pagination.page_size"  :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <div class="pb-20">
      <el-button type="primary" plain style="width:120px" @click="handleCancel">取消选择</el-button>
      <el-button type="primary" style="width:120px" @click="handleConfirm">确认选择</el-button>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import {
  mapActions,
  mapState
} from 'vuex'

export default {
  name: 'component_name',
  props: {},
  components: {
    Search
  },
  data () {
    return {
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/productsSync/tableProductList/query']
    }),
    ...mapState('productManagement/productsSync/tableProductList', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ])
  },
  created () {
    this.fetch()
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableProductList', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange'
    ]),
    handleCancel () {
      this.$emit('goback')
    },
    handleConfirm () {
      this.$emit('goback')
    }
  }
}
</script>
<style lang="less" scoped>
</style>
