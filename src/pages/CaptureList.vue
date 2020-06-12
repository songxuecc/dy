<template lang="html">
    <div>
        <div>
            <el-table v-loading="loadingCnt" :data="captureList" border
                      style="width: 100%" :row-style="{height:'68px'}" :cell-style="{padding:0}"
            >
                <el-table-column label="抓取类型" width="100">
                    <template slot-scope="scope">
                        {{ captureTypeMap[scope.row.capture_type_id] }}
                    </template>
                </el-table-column>
                <el-table-column label="商品">
                    <template slot-scope="scope">
                        <el-tooltip v-for="(item, index) in scope.row.detail_list.slice(0, 8)" :key="index"
                                    :content="item.title" placement="bottom" effect="light">
                            <img style="height:50px; padding-right:10px" :src="item.thumbnail">
                        </el-tooltip>
                        <i v-if="scope.row.detail_list.length > 8" class="el-icon-more"
                           style="font-size:20px; vertical-align:bottom;"
                        ></i>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="130">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status_statistics.length == 0">
                            {{ captureStatusMap[scope.row.status] }}
                        </span>
                        <span v-if="scope.row.status_statistics.length > 0"
                              v-for="(item, index) in scope.row.status_statistics" :key="index"
                        >
                            {{ captureStatusMap[item.status] }} {{ item.count }} 条 <br>
                        </span>
                        <el-tooltip v-show="scope.row.status == 1" class="item" effect="light" placement="bottom"
                                    :content="calcProgressText(scope.row)"
                        >
                            <div class="progress-bar blue stripes" style="width: 100px">
                                <span :style="{ width: calcProgressVal(scope.row) }"></span>
                            </div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="抓取时间" width="160"> </el-table-column>
                <el-table-column prop="" label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="captureWatch(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <br>
            <el-pagination
                    v-show="loadingCnt == 0"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.index"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pagination.size"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pagination.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import { mapActions } from 'vuex'
export default {
  mixins: [request],
  data () {
    return {
      captureList: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      timer: null
    }
  },
  computed: {
    captureTypeMap () {
      return common.captureTypeMap
    },
    captureStatusMap () {
      return common.captureStatusMap
    }
  },
  mounted () {
  },
  activated () {
    this.getCaptureList(false)
  },
  deactivated () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    getCaptureList (isResetIndex = true, isSilent = false) {
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let params = {
        page_index: this.pagination.index,
        page_size: this.pagination.size
      }
      this.request('getCaptureList', params, data => {
        this.captureList = data.items
        this.pagination.total = data.total
        this.checkProgress()
      }, undefined, isSilent)
    },
    checkProgress () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let self = this
      for (let i in this.captureList) {
        let capture = this.captureList[i]
        if (parseInt(capture.status) === 1 || parseInt(capture.status) === 0) {
          this.timer = setTimeout(function () {
            self.getCaptureList(false, true)
          }, 2000)
          break
        }
      }
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getCaptureList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getCaptureList(false)
    },
    calcProgressText (capture) {
      let count = 0
      for (let i in capture.status_statistics) {
        let item = capture.status_statistics[i]
        count += item.count
      }
      return count + ' / ' + capture.capture_num
    },
    calcProgressVal (capture) {
      if (parseInt(capture.capture_num) === 0) {
        return 0
      }
      let count = 0
      for (let i in capture.status_statistics) {
        let item = capture.status_statistics[i]
        count += item.count
      }
      return Math.min(100, count / capture.capture_num * 100) + '%'
    },
    captureWatch (capture) {
      this.setCaptureIdList(capture.detail_list.map(item => item.capture_id))
      this.$router.push({
        path: '/migrateList'
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/progress.less';
</style>
