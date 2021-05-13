<!--  -->
<template>
  <div>
    <el-table :data="skuExcelDetailTableData" stripe style="width: 100%;" row-key="dy_product_id" class="TableProductDetail getProductSkuExcelDetailPage">
      <el-table-empty slot="empty" />
      <el-table-column prop="sku_img_url" label="图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.sku_img_url" alt="sku图片" class="product-img">
        </template>
      </el-table-column>
      <el-table-column v-if="productSkuExcelFilters.file_type === 0" prop="goods_name" label="商品信息" width="200"></el-table-column>
      <el-table-column v-if="productSkuExcelFilters.file_type === 0" prop="sku_spec_names" label="SKU名称"></el-table-column>
      <el-table-column v-if="productSkuExcelFilters.file_type === 1" prop="goods_name" label="商品id" width="200"></el-table-column>
      <el-table-column v-if="productSkuExcelFilters.file_type === 1" prop="sku_spec_names" label="sku id"></el-table-column>
      <el-table-column prop="sku_code" label="SKU编码"></el-table-column>
      <el-table-column prop="sku_stock" label="SKU库存"></el-table-column>
      <el-table-column prop="sku_step_stock" label="SKU阶梯库存"></el-table-column>
      <el-table-column prop="sku_price" label="SKU价格"></el-table-column>
      <el-table-column prop="fail_reason" label="理由" v-if="activeName === 'fail'"></el-table-column>
      <el-table-column prop="edit" label="操作" width="100" v-if="activeName === 'success'">
        <template slot-scope="scope">
          <a class="pramiry pointer" @click="open(scope.row.dy_goods_id)">查看</a>
        </template>
      </el-table-column>
    </el-table>
    <div style="width: 100%;margin-bottom:100px;text-align:center" class="pt-10" v-if="skuExcelDetailTableData && skuExcelDetailTableData.length">滚动到底部～</div>
    <div style="position:absolute;bottom:0;right:0;width:100%;text-align:right;background:#ffffff">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="skuExcelDetailPagination.page_index" class=" pt-20 right mr-20" :page-sizes="skuExcelDetailSizes"
        :page-size="skuExcelDetailPagination.page_size" layout="total, sizes, prev, pager, next, jumper"
        :total="skuExcelDetailTotal">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('productManagement/skuImport')

export default {
  name: 'TableProductDetail',
  props: {
    activeName: String,
    parentId: String,
    currentName: String
  },
  data () {
    return {
    }
  },
  mounted () {
    const data = {status: this.activeName, parent_id: this.parentRowData.id}
    this.fetchDetail({
      filters: data,
      pagination: {
        page_size: 10,
        page_index: 1
      }
    })
  },
  computed: {
    ...mapState(['productSkuExcelFilters', 'skuExcelDetailTableData', 'skuExcelDetailSizes', 'skuExcelDetailTotal', 'skuExcelDetailPagination', 'parentRowData', 'skuExcelDetailTotalFilters']),
    filters: function () {
      if (!this.currentName || !this.parentRowData) return false
      const data = {status: this.currentName, parentRowData: this.parentRowData.id}
      return data
    }
  },
  watch: {
    filters: function (newval) {
      this.fetchDetail({
        filters: newval,
        pagination: {
          page_size: 10,
          page_index: 1
        }
      })
    }
  },
  methods: {
    ...mapActions(['fetchDetail']),
    handleSizeChange (pageSize) {
      this.fetchDetail({
        pagination: {
          page_size: pageSize
        }
      })
    },
    handleCurrentChange (pageIndex) {
      this.fetchDetail({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    open (id) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', 'SKU导入', '详情', '前往抖音后台查看提交的商品'])
      }
      if (id) {
        window.open('https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=' + id)
      } else {
        console.log(id)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
