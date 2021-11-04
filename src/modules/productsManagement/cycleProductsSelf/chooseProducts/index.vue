<!--  -->
<template>
  <div class="productsSync-TableProductList" ref="TableProductList">
    <Search  @filter="handleFilter" tipType="源同步" :originFilters="originFilters" :filters="filters" />
    <div class="left pr-10 click mb-10 pl-20 pt-10 flex align-c">
      <el-checkbox v-model="is_all" @change="handleAllSelectionChange">
        <span :class="[is_all?'color-primary':'']">一键全选所有商品</span> <span class="font-12 warning">仅能选择2021.10.9后搬家上线的商品</span>
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
      @select="handleSelection"
      highlight-current-row
      @select-all="handleSelectionAll"
      v-loading="loading || loadingPost || loadingSelected"
      row-key="goods_id"
    >
      <el-table-empty slot="empty">
        <div class="primary underline" style="font-size:16px" @click="gotoStartMigrate">您还没有通过虎虎上架商品，您可以先进行上货</div>
      </el-table-empty>
      <el-table-column
        type="selection"
        width="55" >
      </el-table-column>
      <el-table-column label="图片" width="70" align="center" prop="id">
        <template slot-scope="scope">
          <HhImage :src="scope.row.image_url" style="height:50px;max-width:65px;border-radius: 2px" />
        </template>
      </el-table-column>

      <el-table-column label="标题" width="">
        <template slot-scope="scope">
          <span>
            <el-link
            :underline="false"
            :href="
              'https://haohuo.jinritemai.com/views/product/detail?id=' +
              scope.row.goods_id
            "
            target="_blank"
          >
            {{ scope.row.goods_name }}
            </el-link>
            <hh-icon
              type="iconfuzhi "
              style="font-size: 12px"
              class="pointer "
              @click="
                copy(scope.row.goods_name, '商品名称 复制成功')
              "
            ></hh-icon>

          </span>
          <br />
          <div class="font-12 flex align-c color-999" style="margin-top: 3px">
            <span>商品ID: {{ scope.row.goods_id }}
                <hh-icon
                  type="iconfuzhi "
                  style="font-size: 12px"
                  class="pointer "
                  @click="
                    copy(scope.row.goods_id, '商品ID 复制成功')
                  "
                ></hh-icon>
              </span>
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
      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;margin-left:1px;display:flex;" class="flex justify-c ">
        <el-button type="primary" plain style="width: 120px" @click="handleCancel"
          >返回上一步</el-button
        >
        <el-button type="primary" :style="{width: loadingPost ? '150px':'120px'}" @click="handleConfirm" :loading="loadingPost" :disabled="loadingPost"
          >完成创建
          <span v-if="all">({{all}})</span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Search from './Search'
import services from '@servises'
import { mapActions, mapState, mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

export default {
  name: 'TableProductList',
  props: {
    prevStep: Number
  },
  components: {
    Search
  },
  data () {
    return {
      multipleSelection: [],
      is_all: false,
      startFixed: false,
      loadingPost: false,
      originFilters: undefined,
      multipleSelectionMap: new Map(),
      all: 0
    }
  },
  created () {
    this.fetch()
    this.is_all = false
    this.all = false
    this.multipleSelectionMap = new Map()
  },
  mounted () {
    this.scroll()
    this.bindScroll()
  },
  activated () {
    this.scroll()
    this.bindScroll()
    this.is_all = false
    this.all = false
    this.multipleSelectionMap = new Map()
  },
  deactivated () {
    this.unBindScroll()
  },
  beforeDestroy () {
    this.unBindScroll()
  },
  computed: {
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/cycleProductsSelf/chooseProducts/query']
    }),
    ...mapState('productManagement/cycleProductsSelf/chooseProducts', {
      originFiltersSearch: state => {
        return state.originFilters
      },
      multipleSelectionSearch: state => {
        return state.multipleSelection
      },
      task_id: state => {
        return state.task_id
      }
    }),
    ...mapState('productManagement/cycleProductsSelf/chooseProducts', [
      'tableData',
      'total',
      'pagination',
      'filters',
      'form'
    ]),
    getTabledata () {
      return this.tableData.map(item => {
        return this.multipleSelectionMap.get(item.goods_id)
      })
    }
  },
  watch: {
    // 一件全选时 数据请求初始化
    tableData: {
      handler: function (n) {
        n.forEach(row => {
          if (this.multipleSelectionMap.get(row.goods_id) && this.multipleSelectionMap.get(row.goods_id).handleSelection) {
            return
          }
          const oldData = this.multipleSelectionMap.get(row.goods_id)
          this.multipleSelectionMap.set(
            row.goods_id,
            {
              ...row,
              checked: oldData && oldData.checked ? oldData.checked : this.is_all
            }
          )
        })
        this.toggleRowSelection()
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('productManagement/cycleProductsSelf/chooseProducts', ['save']),
    ...mapActions('productManagement/cycleProductsSelf/chooseProducts', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear'
    ]),
    clearData () {
      this.clear()
      this.originFilters = undefined
      localStorage.removeItem('cycleProductsSelf_CreatePlan')
    },
    handleCancel () {
      this.$router.back()
    },
    handleConfirm () {
      if (this.all > 200) {
        return this.$message.error('商品最多200条！')
      }
      if (!this.all) {
        return this.$message.error('请选择商品')
      }

      const deleteGoodsIdList = ([...this.multipleSelectionMap.values()]).filter(row => !row.checked).map(row => row.goods_id)
      const goodsIdList = ([...this.multipleSelectionMap.values()]).filter(row => row.checked).map(row => row.goods_id)

      const goodsQueryParams = {
        ...this.filters,
        check_status: -1,
        status: -1,
        presell_type: -1,
        is_capture: -1,
        category_leaf_id_list: [],
        goods_id_list: goodsIdList,
        is_all: Number(this.is_all),
        delete_goods_id_list: deleteGoodsIdList
      }

      console.log(goodsQueryParams, 'goodsQueryParams')
      let formData = this.form
      const localForm = JSON.parse(localStorage.getItem('cycleProductsSelf_CreatePlan'))
      if (isEmpty(this.form)) {
        formData = localForm.params
      }
      const parmas = {
        ...formData,
        goods_query_params: JSON.stringify(goodsQueryParams)
      }
      this.loadingPost = true
      // 判断是二次修改还是首次创建
      if (this.selectParmasSearch) {
        parmas.task_id = this.task_id
        services.productAutoShelfUpdate(parmas)
          .then(data => {
          // 创建成功
            this.$message.success('修改成功！')
            this.clearData()
            this.$nextTick(() => {
              this.$router.replace({
                name: 'cycleProductsSelf_PlanList'
              })
            })
            this.save({
              form: {}
            })
          })
          .catch(err => {
            this.$message.error(`${err}`)
            this.save({
              form: {}
            })
          })
          .finally(() => {
            this.loadingPost = false
          })
      } else {
        services.productAutoShelfCreate(parmas)
          .then(data => {
          // 创建成功
            this.$message.success('创建成功')
            this.clearData()
            this.$router.replace({
              name: 'cycleProductsSelf_PlanList'
            })
            this.save({
              form: {}
            })
          })
          .catch(err => {
            this.$message.error(`${err}`)
            this.save({
              form: {}
            })
          })
          .finally(() => {
            this.loadingPost = false
          })
      }
    },
    // 保存查询的初始化数据
    handleFilter (filters, originFilters) {
      this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
      filters = {
        ...filters
      }
      this.is_all = false
      this.all = false
      this.multipleSelectionMap = new Map()
      this.setFilter({filters})
      this.originFilters = originFilters
    },
    // 表格多选禁用判断
    isSelectionEnable () {
      return !this.is_all
    },
    // 一件全选按钮回调
    handleAllSelectionChange (checked) {
      if (checked) {
        this.tableData.forEach(row => {
          this.multipleSelectionMap.set(row.goods_id, {
            ...row,
            checked,
            handleSelection: false
          })
        })
      } else {
        ([...this.multipleSelectionMap.values()]).forEach(row => {
          this.multipleSelectionMap.set(row.goods_id, {
            ...row,
            checked,
            handleSelection: false
          })
        })
      }
      this.toggleRowSelection()
    },
    toggleRowSelection () {
      this.tableData.forEach(row => {
        const checked = this.multipleSelectionMap.get(row.goods_id).checked
        const handleSelection = this.multipleSelectionMap.get(row.goods_id).handleSelection
        !handleSelection && this.$nextTick(() => {
          this.$refs.multipleTable && this.$refs.multipleTable.toggleRowSelection(row, checked)
        })
      })
      this.all = this.getSelect()
    },
    getSelect () {
      if (this.is_all) {
        const minute = ([...this.multipleSelectionMap.values()]).filter(row => !row.checked).length
        return this.total - minute
      } else {
        return ([...this.multipleSelectionMap.values()]).filter(row => row.checked).length
      }
    },
    handleSelection (selection, row, value) {
      const preSelect = this.tableData.filter(row => this.multipleSelectionMap.get(row.goods_id).checked)
      if (preSelect.length > selection.length) {
        this.multipleSelectionMap.set(row.goods_id, {
          ...row,
          checked: false,
          handleSelection: true
        })
      } else {
        this.multipleSelectionMap.set(row.goods_id, {
          ...row,
          checked: true,
          handleSelection: true
        })
      }
      this.toggleRowSelection()
    },
    // 一件全选时候 表格全选禁用
    handleSelectionAll (selection) {
      const preSelect = this.tableData.filter(row => this.multipleSelectionMap.get(row.goods_id).checked)
      if (preSelect.length > selection.length) {
        this.tableData.forEach(row => {
          this.multipleSelectionMap.set(row.goods_id, {
            ...row,
            checked: false,
            handleSelection: true
          })
        })
      } else {
        this.tableData.forEach(row => {
          this.multipleSelectionMap.set(row.goods_id, {
            ...row,
            checked: true,
            handleSelection: true
          })
        })
      }
      this.toggleRowSelection()
    },
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
    bindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl.addEventListener('scroll', this.scroll)
    },
    unBindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl && scrollEl.removeEventListener('scroll', this.scroll)
    },
    gotoStartMigrate () {
      this.$router.push({
        name: 'StartMigrate'
      })
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
<style lang="less">
.TableSyncRecord-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
  border-color: #1D8FFF;
  color: #1D8FFF;
  font-size: 14px;
}

.TableSyncRecord-confirmButtonClass{
  font-size: 12px;
  width: 140px;
  padding: 12px;
  font-size: 14px;
  background: #1D8FFF;
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
