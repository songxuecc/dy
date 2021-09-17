<!--  -->
<template>
  <div class="productsSync-TableProductList" ref="TableProductList">
    <Search  @filter="handleFilter" tipType="源同步" :originFilters="originFilters" />
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
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      highlight-current-row
      :header-cell-class-name="getHeaderCellClassName"
      @select-all="handleSelectionAll"
      v-loading="loading || loadingPost"
      row-key="goods_id"
    >
      <el-table-empty slot="empty"/>
      <el-table-column
        type="selection"
        width="55"
        :selectable="isSelectionEnable"
        :reserve-selection="true">
      </el-table-column>
      <el-table-column label="图片" width="70" align="center" prop="id">
        <template slot-scope="scope">
          <el-image
            style="height: 50px; max-width: 50px; border-radius: 2px"
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
        </template>
      </el-table-column>

      <el-table-column label="标题" width="">
        <template slot-scope="scope">
          <el-link
            :underline="false"
            :href="
              'https://haohuo.jinritemai.com/views/product/detail?id=' +
              scope.row.goods_id
            "
            target="_blank"
          >
            {{ scope.row.goods_name }} </el-link
          ><br />
          <div class="font-12 flex align-c color-999" style="margin-top: 3px">
            <span>商品ID: {{ scope.row.goods_id }}</span>
            <span
              class="ml-10 mr-10 presell_type jieti"
              v-if="scope.row.presell_type === 2"
              >阶梯发货</span
            >
            <span
              class="ml-10 mr-10 presell_type xianhuo"
              v-if="scope.row.presell_type === 0"
              >现货发货</span
            >
            <span
              class="ml-10 mr-10 presell_type yushou"
              v-if="scope.row.presell_type === 1"
              >预售发货</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="category_show" label="类目" width="120">
      </el-table-column>
      <el-table-column prop="min_price" label="售卖价" width="120">
        <template slot-scope="scope">
          {{ (scope.row.min_price / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="market_price" label="市场价" width="120">
        <template slot-scope="scope">
          {{ (scope.row.market_price / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="销售状态" width="120">
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page_index"
      class="pt-20 right mr-20"
      :page-size="pagination.page_size"
      :page-sizes="[10, 20, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <div v-if="startFixed" style="height:102px;width:100%"></div>
    <div
      ref="startMigrateBtn"
      :style="{'margin-right': startFixed ? `${scrollWidth + 40}px` : 0}"
      :class="[startFixed ? 'start-migrate-btn-fadeIn':'start-migrate-btn-fadeOut' ,'flex' ,'justify-c'] ">
      <div style="width:200px;margin-right:10px" v-if="startFixed"></div>
      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;display:flex;" class="flex justify-c ">
        <el-button type="primary" plain style="width: 120px" @click="handleCancel"
          >返回上一步</el-button
        >
        <el-button type="primary" :style="{width: loadingPost ? '150px':'120px'}" @click="handleConfirm" :loading="loadingPost" :disabled="loadingPost"
          >完成创建({{ is_all ? total : multipleSelection.length}})</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import services from '@servises'
import { mapActions, mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'

export default {
  name: 'TableProductList',
  props: {},
  components: {
    Search
  },
  data () {
    return {
      multipleSelection: [],
      is_all: false,
      currentRow: null,
      startFixed: false,
      tableDataMap: new Map(),
      loadingPost: false,
      originFilters: undefined
    }
  },
  computed: {
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/productsSync/tableProductList/query']
    }),
    ...mapState('productManagement/productsSync/tableProductList', {
      selectParmasSearch: state => {
        return state.selectParmas
      },
      originFiltersSearch: state => {
        return state.originFilters
      },
      tableDataMapSearch: state => {
        return state.tableDataMap
      },
      multipleSelectionSearch: state => {
        return state.multipleSelection
      },
      task_id: state => {
        return state.task_id
      }
    }),
    ...mapState('productManagement/productsSync/tableProductList', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    multipleSelectionId () {
      let obj = {}
      this.multipleSelection.forEach(item => {
        obj[item.goods_id] = item
      })
      return obj
    },
    selectParmas () {
      const parmas = {
        is_all: Number(this.is_all),
        delete_goods_id_list: JSON.stringify([]),
        goods_id_list: JSON.stringify([])
      }
      if (!this.is_all) {
        parmas.goods_id_list = JSON.stringify(this.multipleSelection.map(row => row.goods_id))
      }
      return parmas
    }
  },
  created () {
    // 进入列表 查询数据的初始化
    if (this.selectParmasSearch) {
      this.is_all = Boolean(this.selectParmasSearch.is_all)
      this.goods_id_list = JSON.parse(this.selectParmasSearch.goods_id_list)
      this.delete_goods_id_list = JSON.parse(this.selectParmasSearch.delete_goods_id_list)
      this.originFilters = {
        ...this.filters,
        ...this.originFiltersSearch
      }
    }
  },
  mounted () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.addEventListener('scroll', this.scroll)
    this.scroll()

    // 再次进入修改商品时候 默认选中回显
    if (this.selectParmasSearch && !this.is_all) {
      this.tableDataMap = this.tableDataMapSearch
      this.multipleSelection = this.multipleSelectionSearch
      const tableDataMap = this.tableDataMap
      this.tableData.forEach(row => {
        const rowMap = tableDataMap.get(row.goods_id)
        const hasSelected = rowMap && this.multipleSelection.map(item => item.goods_id).includes(rowMap.goods_id)
        if (rowMap && hasSelected) {
          this.$refs.multipleTable.toggleRowSelection(row)
        }
      })
    }
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
              this.$refs.multipleTable.toggleRowSelection(row)
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
    ...mapMutations('productManagement/productsSync/tableProductList', ['save']),
    ...mapActions('productManagement/productsSync/tableProductList', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear'
    ]),
    clearData () {
      this.clear()
      this.originFilters = undefined
    },
    strMapToObj (strMap) {
      let obj = Object.create(null)
      for (let [k, v] of strMap) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v
      }
      return obj
    },
    handleCancel () {
      this.clearData()
      this.$emit('goback')
    },
    handleConfirm () {
      if (this.selectParmas.length > 200) {
        return this.$message.error('商品最多200条！')
      }
      const parmas = {}
      const style = {
        form: this.form,
        selectParmas: this.selectParmas,
        filters: this.filters,
        originFilters: this.originFilters,
        tableDataMap: this.strMapToObj(this.tableDataMap),
        multipleSelection: this.multipleSelection
      }
      parmas.style = JSON.stringify(style)
      this.loadingPost = true
      // 判断是二次修改还是首次创建
      if (this.selectParmasSearch) {
        parmas.task_id = this.task_id
        services.productSourceSyncUpdate(parmas)
          .then(data => {
          // 创建成功
            this.$message.success('修改成功！')
            this.clearData()
            this.$emit('go', null, 1)
          })
          .catch(err => {
            this.$message.error(`${err}`)
          })
          .finally(() => {
            this.loadingPost = false
          })
      } else {
        services.productSourceSyncCreate(parmas)
          .then(data => {
          // 创建成功
            this.$message.success('创建成功')
            this.clearData()
            this.$emit('go', null, 1)
          })
          .catch(err => {
            this.$message.error(`${err}`)
          })
          .finally(() => {
            this.loadingPost = false
          })
      }
    },
    // 一件全选按钮回调
    handleAllSelectionChange (val) {
      if (val) {
        const tableDataMap = this.tableDataMap
        this.tableData.forEach(row => {
          const rowMap = tableDataMap.get(`${row.goods_id}`)
          const hasSelected = this.multipleSelection.map(item => item.goods_id).includes(rowMap.goods_id)
          if (!hasSelected) {
            this.$refs.multipleTable.toggleRowSelection(row)
          }
        })
      }
    },
    // 保存查询的初始化数据
    handleFilter (filters, originFilters) {
      this.setFilter({filters})
      this.originFilters = originFilters
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
      // console.log(val, 'handleSelectionChange')
      this.multipleSelection = val
    },
    // 底部按钮滚动定位
    scroll: debounce(function () {
      // 判断是否有滚动条的方法
      function hasScrolled (el, direction = 'vertical') {
        if (direction === 'vertical') {
          return el.scrollHeight > el.clientHeight
        } else if (direction === 'horizontal') {
          return el.scrollWidth > el.clientWidth
        }
      }
      function getScrollbarWidth (el) {
        el = el || document.body
        var scrollDiv = document.createElement('div')
        scrollDiv.style.cssText =
          'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
        el.appendChild(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        el.removeChild(scrollDiv)
        return scrollbarWidth
      }
      const scrollEl = document.querySelector('.page-component__scroll')
      const isScroll = hasScrolled(scrollEl)
      const TableProductList = this.$refs.TableProductList
      if (isScroll && scrollEl && TableProductList) {
        const scrollWidth = getScrollbarWidth(scrollEl)
        this.scrollWidth = scrollWidth
        const clientHeight = scrollEl.clientHeight
        const rect = TableProductList.getBoundingClientRect()
        const height = rect.height
        const dist = 5
        const disdance = height - clientHeight - dist
        const scrollTop = scrollEl.scrollTop
        if (scrollTop < disdance) {
          this.startFixed = true
        } else {
          this.startFixed = false
        }
      }
    }, 300)
  }
}
</script>
<style lang="less" scoped>
.presell_type {
  width: 58px;
  height: 18px;
  display: inline-block;
  color:#fff;
  text-align: center;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  border-radius: 8px 0px 8px 0px;
}
.jieti {
  background: linear-gradient(205deg, #f2d1c2 0%, #dc9e85 100%);
}

.xianhuo {
  background: linear-gradient(180deg, #757bc4 0%, #adb7ed 100%);
}
.yushou {
  background: linear-gradient(180deg, #f9d6af 0%, #d9a779 100%);
  border-radius: 8px 0px 8px 0px;
}
</style>
<style lang='less' scoped>
//@import url(); 引入公共css类

.start-migrate-btn-fadeIn {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 2;
  animation: fadeIn ease 0.3s;
  margin: 0 40px;
}

.start-migrate-btn-fadeOut {
  transition: none;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
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
