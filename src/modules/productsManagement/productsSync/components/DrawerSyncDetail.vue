<!-- 详情 -->
<template>
  <el-drawer
    :visible.sync="drawer"
    size="80%"
    class="drawer left"
    :with-header="false"
    :append-to-body="false"
    v-if="drawer"
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
            <el-form
              :model="filters"
              size="small"
              inline
              label-width="45px"
              label-position="left"
              class="ml-20"
            >
              <el-form-item label="标题">
                <el-input
                  v-model="filters.keyword"
                  style="width: 350px"
                  placeholder="请填写标题"
                  clearable
                  @clear="handleClear('keyword')"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="region"
                class="product-id relative ml-20"
                style="width: 325px"
                label="商品ID"
              >
                <el-input
                  type="textarea"
                  autosize
                  placeholder="输入多个商品ID,以换行分隔，最多可输入5000个"
                  v-model="goods_id_list"
                  style="width: 235px"
                  class="mb-10 textarea-id"
                >
                </el-input>
              </el-form-item>

              <el-form-item size="medium">
                <el-button type="primary" @click="handleSearch">
                  搜索</el-button
                >
              </el-form-item>
            </el-form>

            <div class="left pr-10 click mb-10 pl-20 pt-10 flex align-c">
              <el-checkbox v-model="is_all" @change="handleAllSelectionChange">
                <span :class="[is_all ? 'color-primary' : '']"
                  >一键全选所有商品</span
                >
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

            <div style="height:calc(100vh - 245px)" v-loading="loading || loadingPost">
              <el-table
                :data="tableData"
                v-if="!loading"
                row-key="goods_id"
                height="calc(100vh - 245px)"
                style="width: 100%; box-sizing: border-box"
                @selection-change="handleSelectionChange"
                highlight-current-row
                :header-cell-class-name="getHeaderCellClassName"
                @select-all="handleSelectionAll"
                ref="multipleTableDetail"
                :class="activeName === 3 && 'noFilter'"
              >
                <el-table-empty slot="empty" />
                <el-table-column
                  type="selection"
                  width="55"
                  :selectable="isSelectionEnable"
                  :reserve-selection="true"
                >
                </el-table-column>
                <el-table-column prop="task_title" label="商品信息">
                  <template slot-scope="scope">
                    <div class="flex">
                      <el-image
                        style="
                          height: 50px;
                          width: 50px;
                          max-width: 50px;
                          border-radius: 2px;
                          margin-right: 20px;
                        "
                        :src="scope.row.image_url"
                        fit="contain"
                        :preview-src-list="[scope.row.image_url]"
                      >
                        <div slot="placeholder">
                          <hh-icon
                            type="iconwuzhaopian"
                            style="font-size: 50px;"
                          />
                        </div>
                        <div
                          slot="error"
                          class="flex align-c"
                          style="height: 100%;width: 50px;"
                        >
                          <hh-icon
                            type="icontupianjiazaishibai03"
                            style="font-size: 30px;width: 50px;"
                          />
                        </div>
                      </el-image>

                      <div>
                        <div class="title color-4e font-13">
                          {{ scope.row.goods_name
                          }}<hh-icon
                            type="iconfuzhi "
                            style="font-size: 12px"
                            class="pointer ml-5 mr-10"
                            @click="
                              copy(scope.row.goods_name, '商品名称 复制成功')
                            "
                          ></hh-icon>
                        </div>
                        <div class="id color-999 font-12">
                          商品ID: {{ scope.row.goods_id
                          }}<hh-icon
                            type="iconfuzhi "
                            style="font-size: 12px"
                            class="pointer ml-5 mr-10"
                            @click="copy(scope.row.goods_id, '商品ID 复制成功')"
                          ></hh-icon>
                        </div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="sync_content_list"
                  label="检测变化情况"
                  v-if="activeName !== 3"
                  width="200"
                  align="center"
                >
                  <template slot-scope="scope">
                    <div
                      v-for="(content, idx) in scope.row.sync_content_list"
                      :key="idx"
                    >
                      <span v-if="typeof content.title !== 'undefined'" >
                        <span style="width:50px;display:inline-block;text-align: right;">标题</span>
                        <span
                          :class="[
                            content.title ? 'color-warning' : 'color-999',
                            'ml-5',
                            'mr-10',
                          ]"
                          style="width:50px;display:inline-block;text-align: left;"
                          >
                            {{ content.title ? '改变' : '未改变' }}
                          </span>
                      </span>

                      <span v-if="typeof content.price !== 'undefined'">
                        <span style="width:50px;display:inline-block;text-align: right;">价格</span>
                        <span
                          :class="[
                            content.price ? 'color-warning' : 'color-999',
                            'ml-5',
                            'mr-10',
                          ]"
                          style="width:50px;display:inline-block;text-align: left;"
                          >
                            {{ content.price ? '改变' : '未改变' }}
                          </span>
                      </span>

                      <span v-if="typeof content.shelf !== 'undefined'">
                        <span style="width:50px;display:inline-block;text-align: right;">上下架</span>
                        <span
                          :class="[
                            content.shelf ? 'color-warning' : 'color-999',
                            'ml-5',
                            'mr-10',
                          ]"
                          style="width:50px;display:inline-block;text-align: left;"
                          >
                            {{ content.shelf ? '改变' : '未改变' }}
                          </span>
                      </span>

                      <span v-if="typeof content.stock !== 'undefined'">
                        <span style="width:50px;display:inline-block;text-align: right;">库存</span>
                        <span
                          :class="[
                            content.stock ? 'color-warning' : 'color-999',
                            'ml-5',
                            'mr-10',
                          ]"
                          style="width:50px;display:inline-block;text-align: left;"
                          >
                            {{ content.stock ? '改变' : '未改变' }}
                          </span>
                      </span>

                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="publish_status"
                  v-if="activeName !== 3"
                  align="center"
                  width="250"
                >
                <template slot="header" slot-scope="scope">
                  <el-dropdown @command="handleCommand" class="DrawerSyncDetail-filter">
                    <span class="pointer font-12">修改结果 <i class="el-icon-arrow-down el-icon--right"></i> </span>
                    <el-dropdown-menu slot="dropdown" class="DrawerSyncDetail-filter ">
                    <el-dropdown-item :command="-1">全部</el-dropdown-item>
                    <el-dropdown-item :command="1">修改中</el-dropdown-item>
                    <el-dropdown-item :command="0">未提交修改</el-dropdown-item>
                    <el-dropdown-item :command="2">修改成功</el-dropdown-item>
                    <el-dropdown-item :command="3">修改失败</el-dropdown-item>
                    <el-dropdown-item :command="4">抖音审核中</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                </template>
                <template slot-scope="scope">
                  <span class="color-4e" v-if="scope.row.publish_status === 0"
                    >未提交修改</span
                  >
                  <span class="color-4e" v-if="scope.row.publish_status === 1"
                    >修改中</span
                  >
                  <span class="color-4e" v-if="scope.row.publish_status === 2"
                    >修改成功</span
                  >
                  <span class="color-4e" v-if="scope.row.publish_status === 3"
                    >{{scope.row.fail_reason}}</span
                  >
                  <span class="color-4e" v-if="scope.row.publish_status === 4"
                    >抖音审核中</span
                  >
                </template>
              </el-table-column>
                <el-table-column
                  prop="sync_time"
                  label="检测时间"
                  width="150"
                  align="center"
                  v-if="activeName === 3"
                >
                </el-table-column>
                <el-table-column prop="fail_reason" label="原因" align="center" v-if="activeName === 3">
                    <template slot-scope="scope">
                      {{scope.row.fail_reason|| '建议重新检测'}}
                  </template>
                </el-table-column>

                <el-table-column
                  :width="activeName !== 3 ? 250 : 150"
                  label="操作"
                  align="center"
                >
                  <template slot-scope="scope">
                    <!-- 发布抖音 -->
                    <a
                      class="pramiry pointer"
                      @click="handleSync(scope.row)"
                      v-if="activeName !== 3 && rowData.sync_type === 2"
                      >提交修改</a
                    >
                    <a
                      class="pramiry pointer pl-5"
                      @click="handleDetail(scope.row)"
                      v-if="activeName !== 3"
                      >查看详情</a
                    >
                    <!-- 开始检测商品(同步)  goods_id_list -->
                    <a
                      class="pramiry pointer pl-5"
                      @click="handleRevert(scope.row)"
                      >重新检测</a
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>

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

      <div
        style="
          box-sizing: border-box;
          background: #ffffff;
          flex: 1;
          padding: 10px;
          display: flex;
        "
        class="flex justify-c"
      >
        <el-button
          type="primary"
          plain
          :style="{width: loadingPost ? '190px':'160px'}"
          @click="handleReStartSync"
          :loading="loadingPost"
          :disabled="!(is_all ? total : multipleSelection.length) || loadingPost"
          >重新检测选中商品
          <span v-if="is_all ? total : multipleSelection.length">({{is_all ? total : multipleSelection.length}})</span>
        </el-button>
        <el-button
          type="primary"
          :style="{width: loadingPost ? '190px':'160px'}"
          @click="handlePublish"
          :loading="loadingPost"
          :disabled="!(is_all ? total : multipleSelection.length) || loadingPost"
          v-if="activeName === 2"
          >提交修改选中商品
          <span v-if="is_all ? total : multipleSelection.length">({{is_all ? total : multipleSelection.length}})</span>
        </el-button >
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ModalDataCompared from './ModalDataCompared'
import services from '@servises'
import debounce from 'lodash/debounce'

export default {
  name: 'DrawerSyncDetail',
  props: {},
  components: {
    ModalDataCompared
  },
  data () {
    return {
      loadingPost: false,
      drawer: false,
      activeName: 2,
      tableDataMap: new Map(),
      is_all: false,
      multipleSelection: [],
      goods_id_list: '',
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
        { value: 0, text: '修改中' },
        { value: 1, text: '未提交修改' },
        { value: 2, text: '修改成功' },
        { value: 3, text: '修改失败' },
        { value: 4, text: '抖音审核中' }
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
      loading: (state) =>
        state['@@loading'].effects[
          'productManagement/productsSync/drawerSyncDetail/query'
        ]
    })
  },
  watch: {
    // 一件全选时 数据请求初始化
    tableData: {
      handler: function (n) {
        n.forEach((row) => {
          // 如果全选商品 没看到选择此商品 加入选择
          if (this.is_all && !this.multipleSelection.includes(row.goods_id)) {
            const index = this.tabs.find(
              (item) => this.activeName === item.name
            ).id
            this.$refs.multipleTableDetail[index] &&
              this.$refs.multipleTableDetail[index].toggleRowSelection(row)
          }
        })
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('productManagement/productsSync/tableSyncRecord', {
      tableSyncRecord_fetch: 'fetch'
    }),
    ...mapActions('productManagement/productsSync/drawerSyncDetail', [
      'fetch',
      'setFilter',
      'handleCurrentChange',
      'handleSizeChange',
      'clearFilters'
    ]),
    open (rowData) {
      this.rowData = rowData
      this.activeName = 2
      this.multipleSelection = []
      this.clearFilters()
      this.goods_id_list = ''
      this.is_all = ''
      this.drawer = true
      console.log(rowData, 'rowData')
      const filters = {
        task_id: rowData.task_id || '',
        status: rowData.status || ''
      }
      this.fetch({
        filters
      })
    },
    // 一件全选按钮回调
    handleAllSelectionChange (val) {
      if (val) {
        this.tableData.forEach((row) => {
          const hasSelected = this.multipleSelection.includes(row.goods_id)
          if (!hasSelected) {
            const index = this.tabs.find(
              (item) => this.activeName === item.name
            ).id
            this.$refs.multipleTableDetail[index] &&
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
    getHeaderCellClassName ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && this.is_all) return 'checkedRow'
      return ''
    },
    // 一件全选时候 表格全选禁用
    handleSelectionAll () {
      if (this.is_all) return false
    },
    // 表格多选 选项修改回调事件
    handleSelectionChange (val) {
      val = val.map((item) => item.goods_id)
      this.multipleSelection = [...new Set(val)]
    },
    handleCommand: debounce(function (status) {
      this.setFilter({
        filters: {
          ...this.filters,
          publish_status: status
        }
      })
    },
    100,
    {
      leading: true
    }),
    copy: async function (id, text) {
      try {
        await this.$copyText(id)
        this.$message({
          message: text,
          type: 'success',
          duration: 1000
        })
      } catch (err) {
        this.$message({
          message: err,
          type: 'error',
          duration: 1000
        })
      }
    },
    handleChangeTabs: debounce(function () {
      this.setFilter({
        filters: {
          status: this.activeName,
          task_id: this.rowData.task_id
        }
      })
    },
    100,
    {
      leading: true
    }),
    handleSearch () {
      const limit = 100
      const goodsIds = this.goods_id_list
        .split(/[\s\n]/)
        .filter((item) => item)
        .map((item) => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      if (goodsIdsSet.length > limit) {
        this.loading = false
        return this.$message.error(`搜索id不可以超过${limit}条！`)
      }

      this.setFilter({
        filters: {
          keyword: this.filters.keyword || '',
          goods_id_list: JSON.stringify(goodsIdsSet.length ? goodsIdsSet : ''),
          status: this.activeName,
          task_id: this.rowData.task_id || ''
        }
      })
    },
    close () {
      this.multipleSelection = []
      this.clearFilters()
      this.goods_id_list = ''
      this.is_all = ''
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

    // 重新检测
    handleReStartSync: debounce(
      function (row) {
        const select = this.is_all ? this.total : this.multipleSelection.length
        if (!select) {
          return false
        }
        const parmas = {
          task_id: this.rowData.task_id,
          is_all: Number(this.is_all),
          goods_id_list: this.filters.goods_id_list,
          delete_goods_id_list: JSON.stringify([]),
          keyword: this.filters.goods_keywordid_list,
          status: this.filters.status
        }
        console.log(parmas, 'parmas')
        this.loadingPost = true
        services.productSourceSyncDetailRun(parmas)
          .then(data => {
            this.$message.success('开始检测了！')
            this.tableSyncRecord_fetch()
            this.close()
          })
          .catch(err => {
            this.$message.error(`${err}`)
          })
          .finally(() => {
            this.loadingPost = false
          })
      },
      1000,
      {
        leading: true
      }
    ),
    handlePublish: debounce(
      function (row) {
        const select = this.is_all ? this.total : this.multipleSelection.length
        if (!select) {
          return false
        }
        const h = this.$createElement
        this.$confirm('', {
          message: h('div', null, [
            h(
              'div',
              {
                class: 'center'
              },
              [
                h('hh-icon', {
                  props: {
                    type: 'iconjinggao1'
                  },
                  class: 'TableSyncRecord-icon'
                })
              ]
            ),
            h(
              'div',
              {
                class: 'TableSyncRecord-text'
              },
              '商品将按照检测结果进行修改，确定要操作？'
            )
          ]),
          type: 'warning',
          customClass: 'TableSyncRecord-customClass',
          cancelButtonClass: 'TableSyncRecord-cancelButtonClass',
          confirmButtonClass: 'TableSyncRecord-confirmButtonClass',
          showClose: false
        })
          .then((_) => {
            const parmas = {
              task_id: this.rowData.task_id,
              is_all: Number(this.is_all),
              goods_id_list: this.filters.goods_id_list,
              delete_goods_id_list: JSON.stringify([]),
              keyword: this.filters.goods_keywordid_list,
              status: this.filters.status
            }
            console.log(parmas, 'parmas')
            this.loadingPost = true
            services.productSourceSyncPublish(parmas)
              .then(data => {
                this.$message.success('发布抖音中....')
                this.tableSyncRecord_fetch()
                this.close()
              })
              .catch(err => {
                this.$message.error(`${err}`)
              })
              .finally(() => {
                this.loadingPost = false
              })
          })
          .catch((_) => {
            return false
          })
      },
      1000,
      {
        leading: true
      }
    ),
    // 单个重新检测
    handleRevert: debounce(
      function (row) {
        const parmas = {
          task_id: this.rowData.task_id,
          is_all: 0,
          goods_id_list: JSON.stringify([row.goods_id]),
          delete_goods_id_list: JSON.stringify([]),
          keyword: '',
          status: this.filters.status
        }
        console.log(parmas, 'parmas')
        this.loadingPost = true
        services.productSourceSyncDetailRun(parmas)
          .then(data => {
            this.$message.success('开始检测了！')
            this.tableSyncRecord_fetch()
            this.close()
          })
          .catch(err => {
            this.$message.error(`${err}`)
          })
          .finally(() => {
            this.loadingPost = false
          })
      },
      1000,
      {
        leading: true
      }
    ),
    // 单个发布抖音
    handleSync (row) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h(
            'div',
            {
              class: 'center'
            },
            [
              h('hh-icon', {
                props: {
                  type: 'iconjinggao1'
                },
                class: 'TableSyncRecord-icon'
              })
            ]
          ),
          h(
            'div',
            {
              class: 'TableSyncRecord-text'
            },
            '商品将按照检测结果进行修改，确定要操作？'
          )
        ]),
        type: 'warning',
        customClass: 'TableSyncRecord-customClass',
        cancelButtonClass: 'TableSyncRecord-cancelButtonClass',
        confirmButtonClass: 'TableSyncRecord-confirmButtonClass',
        showClose: false
      })
        .then((_) => {
          const parmas = {
            task_id: this.rowData.task_id,
            is_all: 0,
            goods_id_list: JSON.stringify([row.goods_id]),
            delete_goods_id_list: JSON.stringify([]),
            keyword: '',
            status: this.filters.status
          }
          console.log(parmas, 'parmas')
          this.loadingPost = true
          services.productSourceSyncPublish(parmas)
            .then(data => {
              this.$message.success('发布抖音中....')
              this.tableSyncRecord_fetch()
              this.close()
            })
            .catch(err => {
              this.$message.error(`${err}`)
            })
            .finally(() => {
              this.loadingPost = false
            })
        })
        .catch((_) => {
          return false
        })
    }
  }
}
</script>
<style lang="less" scoped>

/deep/ .noFilter {
  .el-table__column-filter-trigger {
    display: none;
  }
}
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
    background-color: #f9f9f9;
    border-color: #e5e5e5;
  }

  .el-checkbox__inner::after {
    border-color: #999;
  }
}

/deep/ .product-id {
  .el-form-item__label {
    padding-right: 0px;
    margin-right: 0px;
    flex-shrink: 0;
  }
}
.textarea-id {
  position: absolute;
  z-index: 1;
}

/deep/ .el-table-filter__list-item {
  font-size: 12px;
  height: 30px;
}

</style>
<style lang="less">
.TableSyncRecord-cancelButtonClass {
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
}

.TableSyncRecord-confirmButtonClass {
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
  color: #4e4e4e;
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
.DrawerSyncDetail-filter {
  text-align: left;
  .el-dropdown-menu__item  {
    font-size: 12px;
    height: 30px;
  }
}
</style>
