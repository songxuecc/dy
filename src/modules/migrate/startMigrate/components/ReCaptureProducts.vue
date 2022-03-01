<!-- 重新复制 -->
<template>
    <div class="relative">
      <Search @change="onSearchChange"/>
      <el-table
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="tableData"
        style="width: 100%"
        class="mt-10">
        <el-table-empty slot="empty"/>
          <el-table-column type="selection">
          </el-table-column>
        <el-table-column
          align="center"
          label="图片"
          width="75">
            <template slot-scope="scope">
              <div class="flex align-c">
                <HhImage :src="scope.row.thumbnail" style="height:50px;max-width:65px;"/>
              </div>
            </template>
        </el-table-column>
         <el-table-column
          prop="id"
          label="基本信息"
          width="275">
          <template slot-scope="scope">
              <div>
                <el-link  :href="scope.row.url" target="_blank" :underline="false"  class="font-13" style="    display: inline;">
                    {{ scope.row.title }}
                </el-link>
                <hh-icon @click="copy(scope.row.title)" type="iconfuzhi" style="display:inline;font-size:14px" class="pointer"></hh-icon>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.category_show || '-'}}</span>
            </template>
        </el-table-column>

        <el-table-column label="抓取平台" align="center">
            <template slot-scope="scope">
                <span class="flex align-c justify-c">
                  <img style="width: 16px; height: 16px;margin-right:2px;" :src="getSourceIcon(scope.row.source)">
                  <span class="color-999" style="font-size:14px">{{scope.row.source}}</span>
                </span>
            </template>
        </el-table-column>

        <el-table-column label="源sku售价" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.price_range}}</span>
            </template>
        </el-table-column>

           <el-table-column  style="overflow:auto"  align="center" class-name="cell-class">
                <template slot="header" slot-scope="scope">
                    <span>
                      状态
                      <span class="right click" style="margin-left:auto;margin-right:10px;font-weight: 400; font-size: 12px;" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/ut7l6p'">
                        <hh-icon type="icontishi-dengpao" ></hh-icon>
                        状态含义
                      </span>
                    </span>
                </template>
                <template slot-scope="scope">
                    <el-link :underline="false" style="text-decoration:none;" type="info" size="mini" round v-if="[0,1].includes(scope.row.capture_status)">复制中</el-link>
                    <el-link :underline="false" style="text-decoration:none;"  :type="getStatusType(scope.row.status)" size="mini" round v-else-if="scope.row.status!==2" :disabled="scope.row.status === 9">
                      {{ productStatusMap[scope.row.status] }}
                      <i v-if="scope.row.isMigrating && scope.row.status!==2" class="el-icon-loading"></i>
                    </el-link>
                    <el-link v-else :underline="false"  style="text-decoration:none;;display:block" type="warning">
                      {{ productStatusMap[scope.row.status] }}
                      <el-progress  :text-inside="true" :stroke-width="14" :percentage="scope.row.migrate_process" status="success"></el-progress>
                    </el-link>
                </template>
            </el-table-column>

             <el-table-column prop="" align="center">
               <template slot="header" slot-scope="scope">
                   <el-dropdown trigger="click" @command="handleCommandSort">
                      <span class="font-12">
                        {{commandSortText}}<i class="el-icon-arrow-down el-icon--right"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="a" class="font-12">按复制时间降序</el-dropdown-item>
                        <el-dropdown-item command="b" class="font-12">按复制时间升序</el-dropdown-item>
                        <el-dropdown-item command="c" class="font-12">按搬家时间降序</el-dropdown-item>
                        <el-dropdown-item command="d" class="font-12" >按搬家时间升序</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                </template>
              <template slot-scope="scope">
                {{['按复制时间降序','按复制时间升序'].includes(commandSortText) ? scope.row.create_time:(scope.row.migrate_time || '无')}}
              </template>
            </el-table-column>
      </el-table>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page_index"
          class=" pt-20 right mr-20 pagination"
          :page-size="pagination.page_size"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

        <div class="btn flex align-c justify-c" :style="{'margin-right': (40 + scrollWidth)  + 'px'}">
        <el-button type="primary" class="relative" @click="gotoSetting" :disabled="!selection.length">
          下一步：商品属性设置
        </el-button>
        <el-button type="text" class="relative" @click="handleCapture" :disabled="!selection.length">
        跳过设置，直接复制
        </el-button>
      </div>

    </div>
</template>

<script>
import Search from './Search'
import { mapActions, mapState } from 'vuex'
import common from '@/common/common.js'
import getSourceIcon from '@/common/getSourceIcon'
import debounce from 'lodash/debounce'

export default {
  name: 'Recapture',
  components: {
    Search
  },
  props: {
  },
  data () {
    return {
      commandSortText: '按复制时间降序',
      productStatus: common.productStatus,
      productStatusMap: common.productStatusMap,
      taskResultStatus: common.taskResultStatus,
      selection: []
    }
  },
  activated () {
    this.init()
  },
  mounted () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.removeEventListener('scroll', this.scroll)
  },
  computed: {
    ...mapState('migrate/startMigrate/reCapture', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    ...mapState({
      loading: state => state['@@loading'].effects['migrate/startMigrate/reCapture/query']
    })
  },
  methods: {
    ...mapActions('migrate/startMigrate/reCapture', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter'
    ]),
    init () {
      this.fetch()
    },
    getSyncStatus (product) {
      if (parseInt(product.sync_source_status.status) === common.taskResultStatus['success']) {
        return product.sync_source_status.complete_time
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['fail']) {
        return '同步任务失败'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['ready']) {
        return '同步任务准备中'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['running']) {
        return '同步任务进行中'
      }
      return ''
    },
    getStatusType (status) {
      if (status === 5 || status === 7 || status === 8) {
        return 'danger'
      } else if (status === 6) {
        return 'warning'
      } else if (status === 3 || status === 4) {
        return 'success'
      } else if (status === 10) {
        return 'info'
      }
    },
    handleCommandSort (command) {
      const obj = {
        a: {
          text: '按复制时间降序',
          order_by: 1
        },
        b: {
          text: '按复制时间升序',
          order_by: 3
        },
        c: {
          text: '按搬家时间降序',
          order_by: 2
        },
        d: {
          text: '按搬家时间升序',
          order_by: 4
        }
      }
      const text = obj[command].text
      this.commandSortText = text
      this.order_by = obj[command].order_by
      this.$emit('sortByTime', obj[command].order_by)
    },
    getSourceIcon,

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
      if (isScroll) {
        const scrollWidth = getScrollbarWidth(scrollEl)
        this.scrollWidth = scrollWidth
      }
    }, 30),

    // 搜索
    onSearchChange (data) {
      // 店铺选择 状态选择 标题搜索 clearSelect resetPaginationIndex updateInfo
      // 复制时间 整店复制-复制名 child_shop_user_id = 0 handleCommonCaptureChange
      let filters = {...data.search, ...data.filter}
      this.setFilter({
        filters
      })
    },
    handleSelectionChange (selection) {
      this.selection = selection
    },
    gotoSetting () {
      if (this.selection.length) {
        const urls = this.selection.map(item => item.url)
        this.$emit('onGotoSetting', urls)
      } else {
        this.$message.warning('请输入链接')
      }
    },
    copy: async function (title) {
      try {
        await this.$copyText(title)
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } catch (err) {
        this.$message({
          message: err,
          type: 'error'
        })
      }
    },
    handleCapture () {
      const urls = this.selection.map(item => item.url)
      this.$emit('onReCaptureProducts', urls)
    }
  }
}
</script>
<style lang="less" scoped>
.pagination {
        margin-bottom: 80px;
    }
.btn {
      position: fixed;
      left: 0px;
      bottom: 20px;
      right: 0;
      margin: auto;
      margin-left: 240px;
      margin-right: 55px;
      background-color: #fff;
      height: 64px;
      padding-bottom: 10px;
      padding-right: 40px;
      box-shadow: 0 -1px 3px 0 rgba(218, 215, 215, 0.611);
      z-index: 1;
  }
</style>
