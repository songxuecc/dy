<template lang="html">
  <div v-loading="loadingCnt" style="margin-top: 20px;">
    <div v-if="isEmptyActivity" style="height:300px;margin-top:150px">
      <div style="font-size:16px;">您还没有创建活动，快来创建吧！</div><br>
      <el-button @click="goWaterMarkList()" type="primary">asdasdas</el-button>
    </div>
    <div v-else>
      <el-form ref="form" :model="search" :inline="true" style="text-align: left">
        <el-form-item label="">
            <el-input v-model="search.name"  placeholder="活动名称" @keyup.enter.native="handleWMSearchFilterChange" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input v-model="search.productTitle"  placeholder="商品名称、ID" @keyup.enter.native="handleSearchFilterChange" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item >
            <el-select v-model="search.status" placeholder="请选择"  @change="handleStatusFilterChange"
                        popper-class="select-long" style="width: 200px"
            >
                <el-option v-for="item in waterMarkStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleFilterChange" style="width: 40px; height: 40px; padding: 0px;">
               搜索
              </el-button>
        </el-form-item>
        <el-form-item>
            <el-button  @click="goWaterMarkList()" type="primary">创建活动</el-button>
        </el-form-item>
      </el-form>
      <el-alert
          show-icon
          :closable="false"
          title="删除活动”仅用于记录删除，与'中止活动'效果不同。若水印未正常还原，请查看还原失败原因进行处理或咨询客服，切勿删除记录导致水印无法还原！"
          type="warning"
          style="margin-bottom:5px;"></el-alert>
      <el-table ref="waterMarkActivityListTable" :data="waterMarkActivityList" row-key="wm_activity_id"  style="width: 100%"
                  :row-style="{height:'68px'}"
                  @selection-change="handleSelectionChange"
        >
          <el-table-empty slot="empty"></el-table-empty>
            <el-table-column width="50" type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column width="25" label="全选"  header-align="right" ></el-table-column>
            <el-table-column label="素材" width="100" align="center">
                <template slot-scope="scope">
                    <div>
                      <img :src="scope.row.water_mark.image_url" style="width:60px;height:60px; border-radius:4px;border:1px solid #D8D8D8;" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="活动信息" width="400" >
                <template slot-scope="scope">
                    <div><div>活动名称: {{scope.row.name}}</div>
                    <div>活动使用范围:
                      <span v-for="item in scope.row.effect_object" :key="item">
                        {{effectObjectMap[posterType][item]}}
                      </span>
                    </div>
                    <div>开始:{{scope.row.start_time}} ~ 结束:{{scope.row.end_time? scope.row.end_time:"不结束"}}</div></div>
                </template>
            </el-table-column>
            <el-table-column label="状态" >
                <template slot-scope="scope">
                    <div>
                      <span>{{waterMarkStatusMap[scope.row.status]}}
                        <i v-if="scope.row.status===5" class="el-icon-loading"></i>
                      </span>
                      <span v-if="[1,2,3,4,5,7].indexOf(scope.row.status)!==-1">
                        <span v-for="status in [4,3,1,2]" :key="status">
                          <span v-if="scope.row.product_status_statistics[status]">
                            <el-button
                              type="text"
                              style="text-decoration: underline;font-size: 18px;font-weight: 800;"
                              @click="waterMarkShow(scope.row,status)">
                              {{scope.row.product_status_statistics[status]}}
                            </el-button>
                            个{{wmActivityProductStatusMap[status]}}
                          </span>
                        </span>
                      </span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-link style="margin-right:5px" type="primary" v-if='[1,7].includes(scope.row.status)' :underline="false" @click="waterMarkEdit(scope.row)">编辑</el-link>
                    <el-tooltip content="提前结束活动活动" placement="top">
                      <el-link style="margin-right:5px" type="primary" v-if='[2].includes(scope.row.status)' :underline="false" @click="stopWaterMarkActivity([scope.row])">中止</el-link>
                    </el-tooltip>
                    <!-- <el-tooltip content="复制该活动的模版及商品进行重新投放，默认开始时间为明天" placement="top">
                      <el-link style="margin-right:5px" type="primary" v-if='[3,4].includes(scope.row.status)' :underline="false" @click="copyWaterMarkActivity([scope.row])">复制</el-link>
                    </el-tooltip> -->
                    <el-link type="primary" v-if='![2,5].includes(scope.row.status)' :underline="false" @click="beforeDeleteWaterMarkActivity([scope.row])">删除</el-link>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="pagination.index"
          :page-size="pagination.size"
          prev-text="上一页"
          next-text="下一页"
          layout="total,prev,pager,next,jumper,slot"
          :total="pagination.total">
          <el-button type="info" @click="handleCurrentChange" class="pagination-btn-ok">确定</el-button>
        </el-pagination>
        <div style="padding-top:40px">
          <el-tooltip content="投放中的活动不能删除" placement="top" >
              <el-button  @click="beforeDeleteWaterMarkActivity(selectActivity)" style="width:120px">批量删除</el-button>
          </el-tooltip>
          <el-tooltip content="投放中的活动才能中止" placement="top">
          <el-button  type="primary" @click="stopWaterMarkActivity(selectActivity)" style="width:120px">批量中止</el-button>
            </el-tooltip>
          <!-- <el-button size='small' @click="copyWaterMarkActivity(selectActivity)">批量复制</el-button> -->
        </div>
    </div>
  </div>
</template>
<script>

import request from '@/mixins/request.js'
import common from '@/common/common.js'
export default {
  mixins: [request],
  components: {

  },
  mounted () {
    if (this.$route.name === 'PosterDgActivityList') {
      this.posterType = 'PosterDg'
    } else {
      this.posterType = 'WaterMark'
    }
    this.getWaterMarkActivityList()
  },
  activated () {
    if (this.$route.name === 'PosterDgActivityList') {
      common.PosterType[this.posterType] = 1
      this.posterType = 'PosterDg'
    } else {
      common.PosterType[this.posterType] = 0
      this.posterType = 'WaterMark'
    }
    this.getWaterMarkActivityList()
  },
  deactivated () {
    if (this.syncTimer) {
      clearTimeout(this.syncTimer)
      this.syncTimer = null
    }
  },
  data () {
    return {
      isEmptyActivity: true,
      posterType: 'WaterMark',
      waterMarkActivityList: [],
      selectActivity: [],
      settingActivityList: [], // 本页显示的活动处于设置中的活动
      syncTimer: null,
      search: {
        name: '',
        effect_object: -1,
        productTitle: '',
        status: -1
      },
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      waterMarkStatusOptions: [
        {value: -1, label: '状态'},
        {value: 1, label: '未开始'},
        {value: 2, label: '投放中'},
        {value: 3, label: '已结束'},
        {value: 4, label: '已中止'},
        {value: 7, label: '草稿箱'}
        // {value: 5, label: '设置中'},
      ],
      waterMarkStatusMap: {
        '1': '未开始',
        '2': '投放中',
        '3': '已结束',
        '4': '已中止',
        '5': '设置中',
        '0': '已删除',
        '6': '失败',
        '7': '草稿箱'
      },
      effectObjectMap: {
        'WaterMark': {
          '1': '主轮播图',
          '2': '其它轮播图',
          '4': 'SKU图'
        },
        'PosterDg': {
          '1': '详情页第一张',
          '2': '详情页最后一张'
        }
      },
      wmActivityProductStatusMap: {
        '0': '删除',
        '1': '成功',
        '2': '失败',
        '3': '审核中',
        '4': '等待'
      },
      baiduTjMap: {
        'WaterMark': '水印',
        'PosterDg': '详情海报'
      }
    }
  },
  computed: {
  },
  methods: {
    isEmptyFilter () {
      if (this.pagination.index === 1 &&
       this.search.name === '' &&
       this.search.status === -1 &&
       this.search.productTitle === '' &&
       this.search.effect_object === -1) {
        return true
      }
      return false
    },
    goWaterMarkList () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '创建活动'])
      }
      this.$router.push({'name': this.posterType + 'List'})
    },
    getWaterMarkActivityList (isResetIndex = true, isSilent = false) {
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let params = {
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        name: this.search.name,
        status: this.search.status,
        product_title: this.search.productTitle,
        effect_object: this.search.effect_object,
        poster_type: common.PosterType[this.posterType]
      }
      this.request('getWaterMarkActivityList', params, data => {
        this.isEmptyActivity = false
        if (this.isEmptyFilter() && data.items.length === 0) {
          this.isEmptyActivity = true
        }
        this.waterMarkActivityList = data.items
        this.pagination.total = data.total
        this.settingActivityList = []
        this.waterMarkActivityList.forEach((activity, index) => {
          if (activity.status === 5) {
            this.settingActivityList.push(activity.wm_activity_id)
          }
        })
        if (this.settingActivityList.length > 0) {
          this.syncTimer = setTimeout(this.syncActivityStatus, 3000)
        }
      }, undefined, isSilent)
    },
    syncActivityStatus (isSilent = true) {
      clearTimeout(this.syncTimer)
      if (this.settingActivityList.length === 0) {
        return
      }
      let params = {
        wm_activity_ids: this.settingActivityList
      }
      this.request('syncWaterMarkActivityStatus', params, data => {
        let ids = []
        let self = this
        for (let i = 0; i < data.length; i++) {
          let id = parseInt(data[i].wm_activity_id)
          if (data[i].status === 5) {
            ids.push(id)
          }
          for (let j = 0; j < self.waterMarkActivityList.length; j++) {
            if (self.waterMarkActivityList[j].wm_activity_id === id) {
              self.waterMarkActivityList[j].status = data[i].status
              self.waterMarkActivityList[j].product_status_statistics = data[i].product_status_statistics
              break
            }
          }
        }
        this.settingActivityList = ids
        if (this.settingActivityList.length > 0) {
          let self = this
          if (self && !self._isDestroyed) {
            this.syncTimer = setTimeout(self.syncActivityStatus, 3000)
          }
        }
      }, undefined, isSilent)
    },
    handleSelectionChange (selection) {
      this.selectActivity = selection
    },
    handleWMSearchFilterChange () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '活动名称搜索'])
      }
      this.getWaterMarkActivityList()
    },
    handleSearchFilterChange () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '商品名称搜索'])
      }
      this.getWaterMarkActivityList()
    },
    handleWayFilterChange () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '使用范围搜索'])
      }
      this.getWaterMarkActivityList()
    },
    handleStatusFilterChange () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '状态搜索'])
      }
      this.getWaterMarkActivityList()
    },
    handleFilterChange () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '搜索按钮'])
      }
      this.getWaterMarkActivityList()
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getWaterMarkActivityList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getWaterMarkActivityList(false)
    },
    waterMarkEdit (row) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '编辑活动活动'])
      }
      this.$router.push({
        name: this.posterType + 'ActivityCreate',
        params: {'waterMarkActivity': row}
      })
    },
    waterMarkShow (row, status = -1) {
      this.$router.push({
        name: this.posterType + 'Activity',
        params: {'id': row.wm_activity_id, 'status': status}
      })
    },
    beforeDeleteWaterMarkActivity (selectActivity) {
      if (window._hmt) {
        if (selectActivity.length === 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '删除活动活动'])
        } else if (selectActivity.length > 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '批量删除活动'])
        }
      }
      let ids = []
      let iswarning = false
      selectActivity.forEach(wmActivity => {
        if (wmActivity.status !== common.wmActivityStatus['RUNNING'] &&
           wmActivity.status !== common.wmActivityStatus['DEPLOYING']) { // 投放中的活动不能删除
          ids.push(wmActivity.wm_activity_id)
        } else {
          iswarning = true
        }
      })
      if (iswarning) {
        this.$alert('投放中的活动不能删除，请先中止活动', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (ids.length === 0) {
        this.$message.error('请先选中要删除的活动')
        return
      }
      let self = this
      this.$confirm('只删除该活动记录，不会进行水印删除操作。如果有水印设置失败的商品，请先重新设置成功后再删除！')
        .then(_ => {
          self.deleteWaterMarkActivity(ids)
        })
        .catch(_ => {})
    },
    deleteWaterMarkActivity (ids) {
      let params = {
        wm_activity_ids: ids
      }
      this.request('deleteWaterMarkActivity', params, data => {
        this.$message({
          message: '删除完成',
          type: 'success'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        let self = this
        ids.forEach((id) => {
          let idx = self.waterMarkActivityList.findIndex(item => item.wm_activity_id === id)
          if (idx !== -1) {
            self.waterMarkActivityList.splice(idx, 1)
          }
        })
        // this.getWaterMarkActivityList(true)
      })
    },
    stopWaterMarkActivity (selectActivity) {
      if (window._hmt) {
        if (selectActivity.length === 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '中止活动活动'])
        } else if (selectActivity.length > 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '批量中止活动'])
        }
      }
      let ids = []
      let iswarning = false
      selectActivity.forEach(wmActivity => {
        if (wmActivity.status !== common.wmActivityStatus['RUNNING']) { // 投放中的活动才能中止
          iswarning = true
        } else {
          ids.push(wmActivity.wm_activity_id)
        }
      })
      if (iswarning) {
        this.$alert('投放中中的活动才能中止，请重新选择', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      if (ids.length === 0) {
        this.$message.error('请先选中要中止的活动')
        return
      }
      let params = {
        wm_activity_ids: ids
      }
      this.request('stopWaterMarkActivity', params, data => {
        // this.$alert('已完成', '信息', {
        //   confirmButtonText: '确定'
        // })
        this.$message({
          message: '开始中止',
          type: 'success'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        this.getWaterMarkActivityList(true)
      })
    },
    copyWaterMarkActivity (selectActivity) {
      if (window._hmt) {
        if (selectActivity.length === 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '复制活动活动'])
        } else if (selectActivity.length > 1) {
          window._hmt.push(['_trackEvent', this.baiduTjMap[this.posterType], '点击', '批量复制活动'])
        }
      }
      let ids = []
      let iswarning = false
      selectActivity.forEach(wmActivity => {
        if (wmActivity.status !== common.wmActivityStatus['FINISH'] &&
            wmActivity.status !== common.wmActivityStatus['STOP']) { // 已中止已结束的活动才能中止
          iswarning = true
        } else {
          ids.push(wmActivity.wm_activity_id)
        }
      })
      if (iswarning) {
        this.$alert('已中止/已结束的活动才能复制，请重新选择', '警告', {
          confirmButtonText: '确定'
        })
        return
      }
      let params = {
        wm_activity_ids: ids
      }
      this.request('copyWaterMarkActivity', params, data => {
        this.$message({
          message: '复制完成',
          type: 'success'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        this.getWaterMarkActivityList(true)
      })
    }
  }
}
</script>
<style lang="less" scoped>
    /deep/ .el-table {
      .el-table__header th:nth-child(2) .cell {
        padding-left: 0px;
        padding-right: 0px;
      }
    }
   /deep/ svg {
      width:200px;
      height:200px;
    }
</style>
