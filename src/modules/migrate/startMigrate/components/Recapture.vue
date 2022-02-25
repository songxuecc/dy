<!-- 重新复制 -->
<template>
    <div>
      <Search @change="onSearchChange"/>
      <el-table
        v-loading="loading"
        @select-all="handleSelectAll"
        @select="handleSelect"
        @selection-change="handleSelectionChange"
        :data="tableData"
        style="width: 100%"
        class="mt-10">
        <el-table-empty/>
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
          label="基本信息">
          <template slot-scope="scope">
              <div>
                <el-link  :href="scope.row.url" target="_blank" :underline="false"  class="font-13">
                    {{ scope.row.title }}
                </el-link>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="分类" align="center">
            <template slot-scope="scope">
                <span>{{ scope.row.category_show}}</span>
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

        <div class="btn">akshdkahskd</div>
    </div>
</template>

<script>
import Search from './Search'
import { mapActions, mapState } from 'vuex'
import common from '@/common/common.js'
import getSourceIcon from '@/common/getSourceIcon'

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
      taskResultStatus: common.taskResultStatus
    }
  },
  activated () {
    this.init()
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
      'handleSizeChange'
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
    // 搜索
    onSearchChange (data) {
      // 店铺选择 状态选择 标题搜索 clearSelect resetPaginationIndex updateInfo
      // 复制时间 整店复制-复制名 child_shop_user_id = 0 handleCommonCaptureChange
      let search = {...data.search, ...data.filter}
      if (data.filter.shopCaptureId.toString() !== '-1') {
        search.captureId = data.filter.shopCaptureId
      }
      console.log(search, 'search')
    },

    handleSelectAll () {

    },
    handleSelect () {

    },
    handleSelectionChange () {

    }
  }
}
</script>
<style lang="less" scoped>

.btn {
  position: fixed;
  bottom:0;
  left:0;
}
</style>
