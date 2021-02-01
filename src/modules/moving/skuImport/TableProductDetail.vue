<!--  -->
<template>
  <div class="TableProductDetail" >
    <el-table :data="tableDataProductDetail" stripe style="width: 100%;"  row-key="dy_product_id">
      <el-table-empty slot="empty"/>
      <el-table-column prop="sku_img_url" label="图片" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.sku_img_url" alt="图片" class="product-img">
        </template>
      </el-table-column>
      <el-table-column prop="goods_name" label="商品信息" width="200">
      </el-table-column>
      <el-table-column prop="sku_spec_names" label="SKU名称">

      </el-table-column>
      <el-table-column prop="sku_code" label="SKU编码" >
      </el-table-column>
      <el-table-column prop="fail_reason" label="理由">
      </el-table-column>
      <el-table-column prop="edit" label="操作" width="100">
        <template slot-scope="scope">
          <a class="pramiry" @click="open('onDetail',scope.row.id)">查看</a>
        </template>
      </el-table-column>
    </el-table>
     <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="paginationProductDetail.page_index"
      class=" pt-20 right mr-20" :page-sizes="sizes" :page-size="paginationProductDetail.page_size"
      layout="total, sizes, prev, pager, next, jumper" :total="totalProductDetail">
    </el-pagination>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapState,
  mapActions
} = createNamespacedHelpers('moving/skuImport')

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
    this.getProductSkuExcelDetailPage({
      filtersProductDetail: data,
      paginationProductDetail: this.paginationProductDetail
    })
  },
  computed: {
    ...mapState(['tableDataProductDetail', 'sizes', 'totalProductDetail', 'paginationProductDetail', 'parentRowData']),
    filters: function () {
      console.log(this.parentRowData)
      if (!this.active || !this.parentRowData) return false
      const data = {status: this.active, parentRowData: this.parentRowData.id}
      return data
    }
  },
  watch: {
    filters: function (newval) {
      this.getProductSkuExcelDetailPage({
        filtersProductDetail: newval,
        paginationProductDetail: this.paginationProductDetail
      })
    }
  },
  methods: {
    ...mapActions(['getProductSkuExcelDetailPage']),
    handleSizeChange (pageSize) {
      this.getProductSkuExcelDetailPage({
        paginationProductDetail: {
          page_size: pageSize
        }
      })
    },
    handleCurrentChange (pageIndex) {
      this.getProductSkuExcelDetailPage({
        paginationProductDetail: {
          page_index: pageIndex
        }
      })
    },
    open (id) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', 'sku导入', '详情', '前往抖音后台查看提交的商品'])
      }
      if (id) {
        window.open('https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=' + id)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
