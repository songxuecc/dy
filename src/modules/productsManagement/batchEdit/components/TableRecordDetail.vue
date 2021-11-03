<!-- 修改详情 -->
<template>
  <el-drawer
    :visible.sync="drawer"
    size="80%"
    class="drawer"
    :with-header="false"
    :append-to-body="true"
    v-if="drawer"
  >
    <div class="title center">
      {{ rowData.task_title }}修改详情
      <hh-icon
        type="iconquxiaoanniu"
        class="close pointer"
        @click="close"
      ></hh-icon>
    </div>
    <div class="pl-30 pr-30">
      <el-alert center :closable="false" type="warning">
        <div slot="title" class="font-12">
          <span class="mr-20">
            <span class="round"></span> 修改时间:
            {{ rowData.create_time }}</span
          >
          <span>
            <span class="round"></span> 修改数量:共计{{
              rowData.total_nums
            }}个商品，成功{{ rowData.success_nums }}个，失败{{
              rowData.fail_nums
            }}个</span
          >
        </div>
      </el-alert>
      <span v-if="[3, 4].includes(rowData.task_sub_type)">点击表格每行数据的左侧箭头，可以查看修改详情</span>
      <el-tabs v-model="activeName" @tab-click="tabClick">
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
              :expand-row-keys="expands"
              @expand-change="expandChange"
              row-key="goods_id"
              height="calc(100vh - 225px)"
              style="width: 100%; box-sizing: border-box"
            >
              <el-table-column type="expand" v-if="rowData.task_sub_type === 3">
                <el-table-empty slot="empty" />
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
                <el-table-empty slot="empty" />
                <template slot-scope="props">
                  <el-table
                    style="width: 100%"
                    max-height="250"
                    :data="props.row.sku_list"
                    cell-class-name="expand-table-cell"
                  >
                    <el-table-column prop="spec_names" label="规格名称" />
                    <el-table-column
                      prop="old_price"
                      label="修改前"
                      align="center"
                    >
                      <template slot-scope="scope">
                        {{ (scope.row.old_price / 100).toFixed(2) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="new_price"
                      label="修改后"
                      align="center"
                    >
                      <template slot-scope="scope">
                        {{ (scope.row.new_price / 100).toFixed(2) }}
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-empty slot="empty" />
              <el-table-column
                prop="image_url"
                label="商品图片"
                :width="rowData.task_sub_type === 10 ? '80':undefined"
                align="center"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.image_url"
                    style="height: 50px; max-width: 65px"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="goods_name" label="商品信息" :width="rowData.task_sub_type === 10 ? '200':undefined">
              </el-table-column>
              <el-table-column align="center"  v-if="rowData.task_sub_type === 10" label="分类" prop="category_name" width="100">
              </el-table-column>
              <el-table-column
                prop="old_data"
                label="修改前"
                v-if="[1, 2, 3, 4, 5].includes(rowData.task_sub_type)"
                align="center"
              >
              </el-table-column>
              <!-- 商品属性 -->
              <el-table-column
                prop="old_data"
                label="修改前"
                v-else-if="rowData.task_sub_type === 10"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-for="data in scope.row.old_data"
                    :key="data.name"
                    class="left flex"
                  >
                    <span
                      style="
                        display: inline-block;
                        width: 100px;
                        text-align: right;
                        color: #999;
                        flex-shrink: 0;
                      "
                      >{{ data.name }}：</span
                    >
                    <span style="display: inline-block">{{ data.value }}</span>
                  </div>
                </template>
              </el-table-column>

              <el-table-column
                prop="new_data"
                label="修改后"
                v-if="![10, 16].includes(rowData.task_sub_type)"
                align="center"
              >
              </el-table-column>
              <!-- 商品属性 -->
              <el-table-column
                prop="new_data"
                label="修改后"
                v-else-if="[10].includes(rowData.task_sub_type)"
                align="center"
              >
                <template slot-scope="scope">
                  <div
                    v-for="data in scope.row.new_data"
                    :key="data.name"
                    class="left flex"
                  >
                    <span
                      style="
                        display: inline-block;
                        width: 100px;
                        text-align: right;
                        color: #999;
                        flex-shrink: 0;
                      "
                      >{{ data.name }}：</span
                    >
                    <span style="display: inline-block">{{ data.value }}</span>
                  </div>
                </template>
              </el-table-column>
              <!-- 详情首尾图 -->
              <el-table-column
                prop="new_data"
                label="修改后"
                v-else-if="[16].includes(rowData.task_sub_type)"
                align="center"
              >
                <template slot-scope="scope">
                  <HhImage :src="scope.row.img_url" style="height:50px;max-width:65px" />
                  <div>{{scope.row.new_data}}</div>
                </template>
              </el-table-column>

              <el-table-column
                prop="fail_reason"
                label="失败理由"
                align="center"
                v-if="activeName === 4"
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
              :current-page="hhTaskProductPagePagination.page_index"
              :page-size="hhTaskProductPagePagination.page_size"
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
import { mapState, mapActions, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
export default {
  name: 'TableRecordDetail',
  props: {},
  data () {
    return {
      drawer: false,
      rowData: {},
      expands: [],
      activeName: 3,
      tabs: [
        {
          id: 0,
          label: '修改成功',
          name: 3
        },
        {
          id: 1,
          label: '修改失败',
          name: 4
        }
      ]
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', [
      'hhTaskProductPageTableData',
      'hhTaskProductPagePagination',
      'hhTaskProductPageSizes',
      'hhTaskProductPageTotal'
    ]),
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/batchEdit/fetchHhTaskProductPage']
    })
  },
  watch: {
    activeName: debounce(function (newVal) {
      this.save({
        hhTaskProductPageTableData: []
      })
      this.fetchHhTaskProductPage({
        filters: {
          status: newVal
        },
        pagination: {
          page_index: 1
        }
      })
    },
    100,
    {
      leading: true
    })
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchHhTaskProductPage']),
    ...mapMutations('productManagement/batchEdit', ['save']),
    getData (data) {
      return Object.entries(JSON.parse(data)).map(([name, value]) => {
        return {
          name,
          value
        }
      })
    },
    async open (rowData) {
      this.rowData = rowData
      this.activeName = 3
      this.drawer = true
      await this.fetchHhTaskProductPage({
        filters: {
          parent_id: rowData.task_id,
          status: 3
        }
      })
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
      window.open(
        'https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' +
          product.goods_id
      )
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
  background: #fa6400;
  border-radius: 50%;
  display: inline-block;
  margin-bottom: 2px;
}
.drawer {
  padding-left: 30px;
}
.title {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4e4e4e;
  line-height: 30px;
  position: relative;
  padding: 24px 0;
  .close {
    position: absolute;
    right: 30px;
    top: 30px;
    bottom: 0;
    margin: auto;
  }
}
</style>
