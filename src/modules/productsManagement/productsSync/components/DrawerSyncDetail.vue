<!-- 详情 -->
<template>
    <el-drawer
      :visible.sync="drawer"
      size="80%"
      class="drawer left"
      :with-header="false"
      :append-to-body="false"
  >
    <ModalDataCompared ref="ModalDataCompared" />

    <div class="pl-30 pr-30">
      <el-tabs v-model="activeName" @tab-click="handleChangeTabs">
        <el-tab-pane
          :label="tab.label"
          :name="tab.name"
          :key="tab.name"
          v-for="tab in tabs"
        >
          <div class="left">
            <el-form :model="filters" size="small" inline label-width="45px" label-position="left" class="ml-20">
              <el-form-item label="标题" >
                <el-input
                  v-model="filters.goods_name"
                  style="width:350px"
                  placeholder="请填写标题"
                  clearable
                  @clear="handleClear('goods_name')"
                 ></el-input>
              </el-form-item>
              <el-form-item label="商品ID" class="ml-20">
                <el-input
                  clearable @clear="handleClear('goods_id_list')"
                  v-model="filters.goods_id_list"
                  class="mr-20"
                  style="width:250px"
                  placeholder="请填写商品ID"
                ></el-input>
              </el-form-item>
              <el-form-item  size="medium">
                <el-button type="primary" @click="handleSearch"> 搜索</el-button>
              </el-form-item>
            </el-form>

            <div class="left pr-10 click mb-10 pl-20 pt-10 flex align-c">
              <el-checkbox v-model="is_all" @change="handleAllSelectionChange">
                <span :class="[is_all?'color-primary':'']">一键全选所有商品</span>
              </el-checkbox>
              <el-tooltip
                class="item"
                effect="dark"
                content="所有商品指所有页面商品总和"
                placement="right"
              >
                <hh-icon type="iconxiangqing" class="pl-5"></hh-icon>
              </el-tooltip>
            </div>

            <el-table
              :data="tableData"
              v-loading="loading"
              row-key="goods_id"
              height="calc(100vh - 225px)"
              style="width: 100%; box-sizing: border-box"
              @selection-change="handleSelectionChange"
              highlight-current-row
              :header-cell-class-name="getHeaderCellClassName"
              @select-all="handleSelectionAll"
              ref="multipleTableDetail"
            >
              <el-table-empty slot="empty" />
              <el-table-column
                type="selection"
                width="55"
                :selectable="isSelectionEnable"
                :reserve-selection="true">
              </el-table-column>
              <el-table-column prop="task_title" label="商品信息" width="300px">
                <template slot-scope="scope">
                  <div class="flex">

                    <el-image
                      style="height: 50px; max-width: 50px; border-radius: 2px;margin-right:20px"
                      :src="scope.row.image_url"
                      fit="contain"
                      :preview-src-list="[scope.row.image_url]"
                    >
                      <div slot="placeholder">
                        <hh-icon type="iconwuzhaopian" style="font-size: 50px" />
                      </div>
                      <div slot="error" class="flex align-c" style="height: 100%">
                        <hh-icon
                          type="icontupianjiazaishibai03"
                          style="font-size: 30px"
                        />
                      </div>
                    </el-image>

                    <div >
                      <div class="title color-4e font-13">{{scope.row.goods_name}}<hh-icon type="iconfuzhi " style="font-size:12px" class="pointer ml-5 mr-10" @click="copy(scope.row.goods_name,'商品名称 复制成功')"></hh-icon></div>
                      <div class="id color-999 font-12"> 商品ID: {{scope.row.goods_id}}<hh-icon type="iconfuzhi " style="font-size:12px" class="pointer ml-5 mr-10" @click="copy(scope.row.goods_id,'商品ID 复制成功')"></hh-icon></div>
                    </div>

                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sync_content_list" label="检测变化情况" v-if="activeName !== 3"  width="380px" align="center">
                <template slot-scope="scope">
                  <span v-for="(content,idx) in scope.row.sync_content_list" :key="idx">
                    <span >标题<span :class="[content.title?'color-warning':'color-999','ml-5','mr-10']">{{content.title?'改变':'未改变'}}</span></span>
                    <span >价格<span :class="[content.price?'color-warning':'color-999','ml-5','mr-10']">{{content.price?'改变':'未改变'}}</span></span>
                    <span >上下架<span :class="[content.shelf?'color-warning':'color-999','ml-5','mr-10']">{{content.shelf?'改变':'未改变'}}</span></span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="publish_status"
                label="修改结果"
                v-if="activeName !== 3" align="center"
                :filters="tableFilters"
                :filter-method="filterHandler"
                :filter-multiple="false"
                filter-placement="bottom-end"
                column-key="publish_status"
              >
                <template slot-scope="scope">
                  <span class="color-4e" v-if="scope.row.publish_status === 0">未提交修改</span>
                  <span class="color-4e" v-if="scope.row.publish_status === 1">修改中</span>
                  <span class="color-4e" v-if="scope.row.publish_status === 2">成功</span>
                  <span class="color-4e" v-if="scope.row.publish_status === 3">失败</span>
                  <span class="color-4e" v-if="scope.row.publish_status === 4">抖音审核中</span>
                </template>
              </el-table-column>
               <el-table-column prop="sync_time" label="检测时间" v-if="activeName === 3" align="center">
              </el-table-column>
              <el-table-column prop="fail_reason" label="原因" v-if="activeName === 3" align="center">
              </el-table-column>

              <el-table-column :width="activeName !== 3 ? 200 : 100" label="操作" align="center">
                <template slot-scope="scope">
                  <!-- 发布抖音 -->
                  <a class="pramiry pointer " @click="handleSync(scope.row)" v-if="activeName !== 3">提交修改</a>
                  <a class="pramiry pointer pl-5" @click="handleDetail(scope.row)" v-if="activeName !== 3">查看详情</a>
                  <!-- 开始检测商品(同步)  goods_id_list -->
                  <a class="pramiry pointer pl-5" @click="handleRevert(scope.row)" >重新检测</a>
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
              :total="total"
            >
            </el-pagination>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;display:flex;" class="flex justify-c ">
        <el-button type="primary" plain style="width:160px" @click="handleCancel"
          >重新检测选中商品</el-button
        >
        <el-button type="primary" style="width: 160px" @click="handleConfirm"
          >提交修改选中商品({{ is_all ? total : multipleSelection.length}})</el-button>
      </div>

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
      activeName: 2,
      tableDataMap: new Map(),
      is_all: false,
      multipleSelection: [],
      tabs: [
        {
          id: 0,
          label: '检测成功',
          name: 2
        },
        {
          id: 1,
          label: '检测失败',
          name: 3
        }
      ],
      tableFilters: [
        {value: 0, text: '修改中'},
        {value: 1, text: '未提交修改'},
        {value: 2, text: '修改成功'},
        {value: 3, text: '修改失败'},
        {value: 4, text: '抖音审核中'}
      ]
    }
  },
  created () {
  },

  computed: {
    ...mapState('productManagement/productsSync/drawerSyncDetail', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/productsSync/drawerSyncDetail/query']
    })
  },
  watch: {
    // 一件全选时 数据请求初始化
    tableData: {
      handler: function (n) {
        const tableDataMap = this.tableDataMap
        n.forEach(row => {
          const rowMap = tableDataMap.get(row.goods_id)
          if (this.is_all) {
            const hasSelected = rowMap && this.multipleSelection.map(item => item.goods_id).includes(rowMap.goods_id)
            if (!rowMap || (rowMap && !hasSelected)) {
              console.log(this.$refs.multipleTableDetail, this.activeName, 'this.$refs.multipleTableDetail')
              const index = this.tabs.find(item => this.activeName === item.name).id
              this.$refs.multipleTableDetail[index].toggleRowSelection(row)
            }
          }
          tableDataMap.set(`${row.goods_id}`, row)
        })
        this.tableDataMap = tableDataMap
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('productManagement/productsSync/drawerSyncDetail', ['fetch', 'setFilter']),
    open (rowData) {
      this.rowData = rowData
      this.activeName = 2
      this.drawer = true
      this.fetch({
        filters: {
          status: this.activeName
        }
      })
    },
    // 一件全选按钮回调
    handleAllSelectionChange (val) {
      if (val) {
        const tableDataMap = this.tableDataMap
        this.tableData.forEach(row => {
          const rowMap = tableDataMap.get(`${row.goods_id}`)
          const hasSelected = this.multipleSelection.map(item => item.goods_id).includes(rowMap.goods_id)
          if (!hasSelected) {
            const index = this.tabs.find(item => this.activeName === item.name).id
            this.$refs.multipleTableDetail[index].toggleRowSelection(row)
          }
        })
      }
    },
    // 表格多选禁用判断
    isSelectionEnable () {
      return !this.is_all
    },
    // 表格多选禁用表头样式
    getHeaderCellClassName ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0 && this.is_all) return 'checkedRow'
      return ''
    },
    // 一件全选时候 表格全选禁用
    handleSelectionAll () {
      if (this.is_all) return false
    },
    // 表格多选 选项修改回调事件
    handleSelectionChange (val) {
      console.log(val, 'handleSelectionChange')
      this.multipleSelection = val
    },
    filterHandler (value, row, column) {
      const status = value
      console.log(value, 'value')
      this.setFilter({
        filters: {
          goods_name: this.filters.goods_name || '',
          goods_id_list: this.filters.goods_id_list || '',
          publish_status: status,
          status: this.activeName
        }
      })
    },
    copy: async function (id, text) {
      console.log(id, 'id')
      try {
        await this.$copyText(id)
        this.$message({
          message: text,
          type: 'success'
        })
      } catch (err) {
        this.$message({
          message: err,
          type: 'error'
        })
      }
    },
    handleChangeTabs () {
      this.setFilter({
        filters: {
          status: this.activeName
        }
      })
    },
    handleSearch () {
      this.setFilter({
        filters: {
          goods_name: this.filters.goods_name || '',
          goods_id_list: this.filters.goods_id_list || '',
          status: this.activeName
        }
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
    handleDetail (data) {
      this.$refs.ModalDataCompared && this.$refs.ModalDataCompared.open(data)
    },
    handleClear (key) {
      this.filters[key] = ''
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
/deep/ .el-form-item__label {
  padding-right: 0px;
  margin-right: 0px;
  flex-shrink: 0;
}
/deep/ .el-form-item {
  margin-bottom: 2px;
}
/deep/ .checkedRow {
  .el-checkbox__inner {
      background-color: #F9F9F9;
      border-color: #E5E5E5;
  }

  .el-checkbox__inner::after {
      border-color: #999;
  }
}
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

.el-table-filter {
  text-align: left;
}
.el-table-filter__list-item {
  font-size: 12px;
  height: 30px;
}

</style>
