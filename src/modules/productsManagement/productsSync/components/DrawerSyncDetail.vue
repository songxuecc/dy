<!-- 详情 -->
<template>
    <el-drawer
    :visible.sync="drawer"
    size="80%"
    class="drawer"
    :with-header="false"
    :append-to-body="true"
  >
    <ModalDataCompared ref="ModalDataCompared" />

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
              :data="tableData"
              v-loading="loading"
              row-key="goods_id"
              height="calc(100vh - 225px)"
              style="width: 100%; box-sizing: border-box"
            >
              <el-table-empty slot="empty" />
              <el-table-column prop="task_title" label="计划名称" >
              </el-table-column>
              <el-table-column prop="task_title" label="计划类型" >
              </el-table-column>
              <el-table-column prop="success_nums" label="商品数">
              </el-table-column>
              <el-table-column prop="date" label="同步结果" >
              </el-table-column>
              <el-table-column prop="create_time" label="状态" >
              </el-table-column>

              <el-table-column width="300" label="操作">
                <template slot-scope="scope">
                  <a class="pramiry pointer " @click="handleSync(scope.row)">发布到抖音</a>
                  <a class="pramiry pointer pl-5" @click="handleDetail(scope.row)">查看详情</a>
                  <a class="pramiry pointer pl-5" @click="handleRevert(scope.row)">还原</a>
                  <a class="fail pointer pl-5" @click="on(scope.row)">重新同步</a>
                </template>
              </el-table-column>
            </el-table>

            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="handleCurrentChange"
              :current-page="pagination.page_index"
              :page-size="pagination.page_size"
              :page-sizes="[10, 20, 50, 100]"
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
import ModalDataCompared from './ModalDataCompared'
export default {
  name: 'DrawerSyncDetail',
  props: {
  },
  components: {
    ModalDataCompared
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
    },
    handleDetail () {
      this.$refs.ModalDataCompared && this.$refs.ModalDataCompared.open()
    },
    handleSync () {
      console.log(this, 'this')
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'TableSyncRecord-icon'
            })
          ]),
          h('div', {
            class: 'TableSyncRecord-text'
          }, '您所选中的同步数据将更新到抖店，您确定要操作吗？?')
        ]),
        type: 'warning',
        customClass: 'TableSyncRecord-customClass',
        cancelButtonClass: 'TableSyncRecord-cancelButtonClass',
        confirmButtonClass: 'TableSyncRecord-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
          console.log('00000')
        })
        .catch(_ => {
          return false
        })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
<style lang="less">
.TableSyncRecord-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
}

.TableSyncRecord-confirmButtonClass{
  font-size: 12px;
  width: 120px;
  padding: 12px;
}

.TableSyncRecord-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.TableSyncRecord-text {
  width: 364px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 20px;
}

.TableSyncRecord-customClass {
    padding-bottom: 20px;
    .el-message-box__header {
      padding-top: 0;
    }
    .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__content {
      .el-message-box__message {
        padding-left: 0;
      }
      p {
        font-size: 18px;
        margin: 15px 0 10px;
        text-align: center;
      }
      .el-icon-warning {
        display: none;
      }
    }
}
</style>
