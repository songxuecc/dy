<!-- 修改详情 -->
<template>
   <el-drawer
      :visible.sync="drawer"
      size="80%"
      class="drawer"
      :with-header="false">
      <div class="title center ">{{rowData.task_title}}修改详情 <hh-icon type="iconquxiaoanniu" class="close pointer" @click="close"></hh-icon></div>
      <div class="pl-30 pr-30">
        <el-alert
          center
          :closable="false"
          type="warning">
          <div slot="title" class="font-12 ">
            <span class="mr-20"> <span class="round"></span> 修改时间: {{rowData.create_time}}</span>
            <span> <span class="round"></span> 修改数量:共计{{rowData.total_nums}}个商品，成功{{rowData.success_nums}}个，失败{{rowData.fail_nums}}个</span>
          </div>
        </el-alert>
        <el-tabs v-model="activeName" @tab-click="tabClick">
            <el-tab-pane :label="tab.label" :name="tab.name" :key="tab.name" v-for="tab in tabs" >
              <div>
                  <el-table
                  :data="hhTaskProductPageTableData"
                  v-loading="loading"
                  :expand-row-keys="expands"
                  @expand-change="expandChange"
                  row-key="goods_id"
                  style="width: 100%;box-sizing:border-box;padding-right:20px">
                  <el-table-column type="expand" v-if="rowData.task_sub_type === 3">
                    <el-table-empty slot="empty"/>
                    <template slot-scope="props">
                      <el-table
                        style="width: 100%"
                        max-height="250"
                        :data="props.row.sku_list"
                        cell-class-name="expand-table-cell"
                      >
                        <el-table-column prop="spec_names" label="规格名称" />
                        <el-table-column
                          prop="old_step_stock_num"
                          label="修改前阶梯库存"
                          align="center"
                          width="180"
                        />
                        <el-table-column
                          prop="old_stock_num"
                          label="修改前库存"
                          align="center"
                          width="180"
                        />
                        <el-table-column
                          prop="new_step_stock_num"
                          label="修改后阶梯库存"
                          align="center"
                          width="180"
                        />
                        <el-table-column
                          prop="new_stock_num"
                          label="修改后库存"
                          align="center"
                          width="180"
                        />
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-column type="expand" v-if="rowData.task_sub_type === 4">
                    <el-table-empty slot="empty"/>
                    <template slot-scope="props">
                      <el-table
                        style="width: 100%"
                        max-height="250"
                        :data="props.row.sku_list"
                        cell-class-name="expand-table-cell"
                      >
                        <el-table-column prop="spec_names" label="规格名称" />
                        <el-table-column
                          prop="old_data"
                          label="修改前"
                          align="center">
                        </el-table-column>
                        <el-table-column
                          prop="new_data"
                          label="修改后"
                          align="center">
                        </el-table-column>
                      </el-table>
                    </template>
                  </el-table-column>
                  <el-table-empty slot="empty"/>
                   <el-table-column
                    prop="image_url"
                    label="商品图片"
                    width="120"
                    align="center">
                    <template slot-scope="scope">
                      <img :src="scope.row.image_url" style="height: 50px; max-width: 65px"/>
                    </template>
                  </el-table-column>
                   <el-table-column
                    prop="goods_name"
                    label="商品信息">
                  </el-table-column>
                  <el-table-column
                    prop="old_data"
                    label="修改前"
                    align="center">
                  </el-table-column>
                   <el-table-column
                    prop="new_data"
                    label="修改后"
                    align="center">
                  </el-table-column>
                  <el-table-column
                    prop="total_nums"
                    label="失败理由"
                    align="center"
                    v-if="activeName === 4">
                  </el-table-column>
                  <el-table-column
                    width="230"
                    align="center"
                    label="操作">
                    <template slot-scope="scope">
                      <a class="font-12 pointer primary mr-5" @click="handleView(scope.$index, scope.row)">前往后台</a>
                    </template>
                  </el-table-column>
                </el-table>

                <el-pagination
                  background
                  layout="total, sizes, prev, pager, next, jumper"
                  @current-change="handleCurrentChange"
                  :current-page="hhTaskProductPagePagination.page_index"
                  :page-size="hhTaskProductPagePagination.page_size"
                  :page-sizes="hhTaskProductPageSizes"
                  @size-change="handleSizeChange"
                  :total="hhTaskProductPageTotal">
                </el-pagination>
              </div>
            </el-tab-pane>
          </el-tabs>
      </div>
   </el-drawer>

</template>

<script>
import { mapState, mapActions } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'TableRecordDetail',
  props: {
  },
  data () {
    return {
      drawer: false,
      rowData: {},
      expands: [],
      activeName: 3,
      tabs: [{
        id: 0,
        label: '修改成功',
        name: 3
      },
      {
        id: 1,
        label: '修改失败',
        name: 4
      }]
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', ['hhTaskProductPageTableData', 'hhTaskProductPagePagination', 'hhTaskProductPageSizes', 'hhTaskProductPageTotal']),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/batchEdit/fetchHhTaskProductPage']
    })
  },
  watch: {
    activeName: debounce(function (newVal) {
      this.loading = true
      this.fetchHhTaskProductPage({
        filters: {
          status: newVal
        },
        pagination: {
          page_index: 1
        }
      })
    }, 100)
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchHhTaskProductPage']),
    async open (rowData) {
      this.rowData = rowData
      this.activeName = 3
      await this.fetchHhTaskProductPage({
        filters: {
          parent_id: rowData.task_id,
          status: 3
        }
      })
      this.drawer = true
    },
    handleCurrentChange (pageIndex) {
      if (this.loading) return
      this.fetchHhTaskProductPage({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    handleSizeChange (pageSize) {
      this.fetchHhTaskProductPage({
        pagination: {
          page_index: 1,
          page_size: pageSize
        }
      })
    },
    close () {
      this.drawer = false
    },
    handleView (index, product) {
      window.open('https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + product.goods_id)
    },
    confirm () {
      this.expands = []
    },
    expandChange (row, expandedRows, expanded) {
      this.expands = expandedRows.map((item) => item.goods_id)
    }
  }
}
</script>
<style lang="less" scoped>

.round {
  width: 4px;
  height: 4px;
  background: #FA6400;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: 2px;
}
.drawer {
  padding-left:30px;
}
.title {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4E4E4E;
  line-height: 30px;
  position: relative;
  padding: 24px 0;
  .close {
    position: absolute;
    right: 30px;
    top:30px;
    bottom: 0;
    margin:auto;
  }
}
</style>
