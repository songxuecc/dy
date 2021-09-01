<!-- 详情 -->
<template>
    <el-drawer
    :visible.sync="drawer"
    size="80%"
    class="drawer"
    :with-header="false"
    :append-to-body="true"
  >
    <div class="pl-30 pr-30">
      <el-tabs v-model="activeName">
        <el-tab-pane
          :label="tab.label"
          :name="tab.name"
          :key="tab.name"
          v-for="tab in tabs"
        >
          <div>
            <el-table
              :data="hhTaskProductPageTableData"
              v-loading="loading"
              row-key="goods_id"
              height="calc(100vh - 225px)"
              style="width: 100%; box-sizing: border-box"
            >
              <el-table-empty slot="empty" />
              <el-table-column
                prop="image_url"
                label="商品图片"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image_url"
                    style="height: 50px; max-width: 65px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="goods_name" label="商品信息" >
              </el-table-column>
              <el-table-column align="center" label="分类" prop="category_name" width="100">
              </el-table-column>
              <el-table-column
                prop="old_data"
                label="修改前"
                align="center"
              >
              </el-table-column>

              <el-table-column width="100" align="center" label="操作">
                <template slot-scope="scope">
                  <a
                    class="font-12 pointer primary mr-5"
                    @click="handleView(scope.$index, scope.row)"
                    >前往后台</a
                  >
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              :current-page="pagination.page_index"
              :page-size="pagination.page_size"
              :page-sizes="hhTaskProductPageSizes"
              @size-change="handleSizeChange"
              :total="hhTaskProductPageTotal"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-drawer>
</template>

<script>
import {mapActions, mapState} from 'vuex'
// import debounce from 'lodash/debounce'

export default {
  name: 'DrawerSyncDetail',
  props: {
  },
  data () {
    return {
      drawer: false,
      activeName: 3,
      tabs: [
        {
          id: 0,
          label: '成功',
          name: 3
        },
        {
          id: 1,
          label: '失败',
          name: 4
        }
      ]
    }
  },
  created () {
    this.fetch()
  },

  computed: {
    ...mapState('productManagement/productsSync/drawerSyncDetail', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ])
  },
  methods: {
    ...mapActions('productManagement/productsSync/drawerSyncDetail', ['fetch']),
    async open (rowData) {
      this.rowData = rowData
      this.activeName = 3
      this.drawer = true
      await this.fetch({
      })
    },

    handleCurrentChange (pageIndex) {
      if (this.loading) return
      // this.fetchHhTaskProductPage({
      //   pagination: {
      //     page_index: pageIndex
      //   }
      // })
    },
    handleSizeChange (pageSize) {
      // this.fetchHhTaskProductPage({
      //   pagination: {
      //     page_index: 1,
      //     page_size: pageSize
      //   }
      // })
    },
    close () {
      this.drawer = false
    },
    handleView (index, product) {
      window.open(
        'https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' +
          product.goods_id
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
