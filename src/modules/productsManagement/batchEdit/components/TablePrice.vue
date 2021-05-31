<!--  -->
<template>
    <el-drawer
        :visible.sync="visible"
        :with-header="false"
        direction="rtl"
        @closed="toggleVisible"
        size="80%">
        <el-table
            :data="tableData"
            class="mt-10"
            ref="table"
            row-key="id"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            v-loading="loading"
            style="width: 100%">
            <el-table-column type="expand">
            <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="商品名称">
                    <span>{{ props.row.name }}</span>
                </el-form-item>
                <el-form-item label="所属店铺">
                    <span>{{ props.row.shop }}</span>
                </el-form-item>
                <el-form-item label="商品 ID">
                    <span>{{ props.row.id }}</span>
                </el-form-item>
                <el-form-item label="店铺 ID">
                    <span>{{ props.row.shopId }}</span>
                </el-form-item>
                <el-form-item label="商品分类">
                    <span>{{ props.row.category }}</span>
                </el-form-item>
                <el-form-item label="店铺地址">
                    <span>{{ props.row.address }}</span>
                </el-form-item>
                <el-form-item label="商品描述">
                    <span>{{ props.row.desc }}</span>
                </el-form-item>
                <span @click="confirm">confirm</span>
                </el-form>
            </template>
            </el-table-column>
            <el-table-column
            label="商品信息"
            prop="id">
            </el-table-column>
            <el-table-column
            label="修改前"
            prop="name">
            </el-table-column>
            <el-table-column
            label="修改后"
            prop="desc">
            </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :current-page="productListPagination.page_index"
          :page-size="productListPagination.page_size"
          @size-change="handleSizeChange"
          :total="productListTotal">
        </el-pagination>
        <div>
            <el-button type="primary" plain style="width:120px" @click="toggleVisible">暂不修改</el-button>
            <el-button type="primary" style="width:120px"  @click="toggleVisible">开始批量修改</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'component_name',
  props: {
    visible: Boolean
  },
  data () {
    return {
      expands: ['12987122'],
      tableData: [{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }]
    }
  },
  computed: {
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/batchEdit/productListFetch']
    }),
    ...mapState('productManagement/batchEdit', [
      'productListPagination',
      'productListSizes',
      'productListTableData',
      'productListTotal'
    ])
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchProductList']),
    toggleVisible (index) {
      this.$emit('update:visible', false)
    },
    confirm () {
      console.log('confirm')
      console.log(this.$refs.table)
      this.expands = []
    },
    expandChange (row, expandedRows, expanded) {
      console.log(row, expandedRows, expanded)

      this.expands = expandedRows.map(item => item.id)
    },
    handleCurrentChange (pageIndex) {
      this.fetchProductList({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    handleSizeChange (pageSize) {
      this.fetchProductList({
        pagination: {
          page_size: pageSize
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
