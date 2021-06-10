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
                  style="width: 100%;box-sizing:border-box;padding-right:20px">
                  <el-table-empty slot="empty"/>
                   <el-table-column
                    prop="image_url"
                    label="商品信息"
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
                      <a class="font-12 pointer primary mr-5" @click="handleEdit(scope.$index, scope.row)">查看详情</a>
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
  data () {
    return {
      drawer: false,
      rowData: {},
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
    open (rowData) {
      this.drawer = true
      this.rowData = rowData
      this.fetchHhTaskProductPage({
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
