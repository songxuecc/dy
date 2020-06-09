<template lang="html">
  <div>
    <div v-if="isEmptyFilter() && waterMarkActivityList.length === 0" style="height:300px;margin-top:150px">
      <div style="font-size:16px;">您还没有创建水印，快来创建吧！</div><br>
      <el-button @click="goWaterMarkList()" type="primary">创建水印</el-button>
    </div>
    <div v-else>
      <el-form ref="form" :model="search" :inline="true" style="text-align: left">
        <el-form-item label="">
            <el-input v-model="search.name" size="small" placeholder="水印名称" @keyup.enter.native="handleFilterChange" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item>
            <el-select v-model="search.effect_object" placeholder="请选择" size="small" @change="handleFilterChange"
                        popper-class="select-long" style="width: 110px"
            >
                <el-option v-for="item in effectObjectOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>
        <el-form-item >
          <el-input v-model="search.productTitle" size="small" placeholder="商品名称、ID" @keyup.enter.native="handleFilterChange" style="width: 160px"></el-input>
        </el-form-item>
        <el-form-item style="width: 100px">
            <el-select v-model="search.status" placeholder="请选择" size="small" @change="handleFilterChange"
                        popper-class="select-long" style="width: 90px"
            >
                <el-option v-for="item in waterMarkStatusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" size="small" @click="handleFilterChange">搜索</el-button>
        </el-form-item>
        &nbsp;&nbsp;
        <el-form-item>
            <el-button size="small" @click="goWaterMarkList()" type="primary">创建水印</el-button>
        </el-form-item>
      </el-form>
      <el-table ref="waterMarkActivityListTable" :data="waterMarkActivityList" row-key="wm_activity_id" border style="width: 100%"
                  :row-style="{height:'68px'}" :cell-style="{padding:0}"
                  @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" :reserve-selection="true"></el-table-column>
            <el-table-column label="素材" width="200" align="center">
                <template slot-scope="scope">
                    <!-- <div v-html="scope.row.water_mark.svg"></div> -->
                    <div>
                      <img :src="scope.row.water_mark.image_url" style="width:200px;height:200px" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="水印信息">
                <template slot-scope="scope">
                    <div><div>水印名称:{{scope.row.name}}</div>
                    <div>水印使用范围:
                      <span v-for="item in scope.row.effect_object" :key="item">
                        {{effectObjectMap[item]}}
                      </span>
                    </div>
                    <div>开始时间:{{scope.row.start_time}}</div>
                    <div>结束时间:{{scope.row.end_time? scope.row.end_time:"不结束"}}</div></div>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="200">
                <template slot-scope="scope">
                    <div><div>状态:{{waterMarkStatusMap[scope.row.status]}}
                      <i v-if="scope.row.status===5" class="el-icon-loading"></i>
                    </div>
                    <div>商品(成功/总数):{{scope.row.product_status_statistics['1'] + "/" + (scope.row.product_status_statistics['1'] + scope.row.product_status_statistics['2'])}}</div>
                    <!-- <div v-else>投放商品(总数):{{ scope.row.product_list.length}}</div> -->
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" width="120">
                <template slot-scope="scope">
                    <div>
                      <el-button class="action-button" v-if='[1,7].includes(scope.row.status)' size="mini" @click="waterMarkEdit(scope.row)">编辑</el-button>
                      <el-button class="action-button" v-if='[2].includes(scope.row.status)' size="mini" @click="stopWaterMarkActivity([scope.row])">中止</el-button>
                      <el-button class="action-button" v-if='[3,4].includes(scope.row.status)' size="mini" @click="copyWaterMarkActivity([scope.row])">复制</el-button>
                      <el-button class="action-button" v-if='![2,5].includes(scope.row.status)' size="mini" @click="deleteWaterMarkActivity([scope.row])">删除</el-button>
                      <el-button class="action-button" v-if='scope.row.status != 7' size="mini" @click="waterMarkShow(scope.row)" style="margin-top:5px;">详情</el-button>
                    </div>

                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-row>
          <el-col :span="9" style="text-align: left">
            <el-button size='small' @click="deleteWaterMarkActivity(selectActivity)">批量删除</el-button>
            <el-button size='small' @click="stopWaterMarkActivity(selectActivity)">批量中止</el-button>
            <el-button size='small' @click="copyWaterMarkActivity(selectActivity)">批量复制</el-button>
          </el-col>
          <el-col :span="15" style="text-align: right">
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
          </el-col>
        </el-row>

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
    this.getWaterMarkActivityList()
  },
  activated () {
    if (this.$route.params.refresh) {
      this.getWaterMarkActivityList()
    }
  },
  data () {
    return {
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
        {value: 4, label: '中止'},
        {value: 7, label: '草稿箱'}
        // {value: 5, label: '设置中'},
      ],
      waterMarkStatusMap: {
        '1': '未开始',
        '2': '投放中',
        '3': '已结束',
        '4': '中止',
        '5': '设置中',
        '0': '已删除',
        '6': '失败',
        '7': '草稿箱'
      },
      effectObjectOptions: [
        {value: -1, label: '使用范围'},
        {value: 1, label: '主轮播图'},
        {value: 2, label: '其它轮播图'},
        {value: 4, label: 'SKU图'}
      ],
      effectObjectMap: {
        '1': '主轮播图',
        '2': '其它轮播图',
        '4': 'SKU图'
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
      this.$router.push({'name': 'WaterMarkList'})
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
        effect_object: this.search.effect_object
      }
      if (this.syncTimer) {
        clearInterval(this.syncTimer)
        this.syncTimer = null
      }
      this.request('getWaterMarkActivityList', params, data => {
        this.waterMarkActivityList = data.items
        this.pagination.total = data.total
        this.settingActivityList = []
        this.waterMarkActivityList.forEach((activity, index) => {
          if (activity.status === 5) {
            this.settingActivityList.push(activity.wm_activity_id)
          }
        })
        if (this.settingActivityList.length > 0 && this.syncTimer === null) {
          this.syncTimer = setInterval(this.syncActivityStatus, 3000)
        }
      }, undefined, isSilent)
    },
    syncActivityStatus (isSilent = true) {
      if (this.settingActivityList.length === 0) {
        return
      }
      let params = {
        wm_activity_ids: this.settingActivityList
      }
      this.request('syncWaterMarkActivityStatus', params, data => {
        let ids = []
        let self = this
        for (let id in data) {
          id = parseInt(id)
          if (data[id] === 5) {
            ids.push(id)
          }
          for (let i = 0; i < self.waterMarkActivityList.length; i++) {
            if (self.waterMarkActivityList[i].wm_activity_id === id) {
              self.waterMarkActivityList[i].status = data[id]
              break
            }
          }
        }
        if (ids.length === 0) {
          clearInterval(this.syncTimer)
        }
        this.settingActivityList = ids
      }, undefined, isSilent)
    },
    handleSelectionChange (selection) {
      this.selectActivity = selection
    },
    handleFilterChange () {
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
      this.$router.push({
        name: 'WaterMarkActivityCreate',
        params: {'waterMarkActivity': row}
      })
    },
    waterMarkShow (row) {
      this.$router.push({
        name: 'WaterMarkActivity',
        params: {'id': row.wm_activity_id, 'product_status_statistics': row.product_status_statistics}
      })
    },
    deleteWaterMarkActivity (selectActivity) {
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
      let params = {
        wm_activity_ids: ids
      }
      this.request('deleteWaterMarkActivity', params, data => {
        this.$alert('已完成', '信息', {
          confirmButtonText: '确定'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        this.getWaterMarkActivityList(true)
      })
    },
    stopWaterMarkActivity (selectActivity) {
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
      let params = {
        wm_activity_ids: ids
      }
      this.request('stopWaterMarkActivity', params, data => {
        this.$alert('已完成', '信息', {
          confirmButtonText: '确定'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        this.getWaterMarkActivityList(true)
      })
    },
    copyWaterMarkActivity (selectActivity) {
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
        this.$alert('已完成', '信息', {
          confirmButtonText: '确定'
        })
        this.$refs.waterMarkActivityListTable.clearSelection()
        this.getWaterMarkActivityList(true)
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    /deep/ svg {
      width:200px;
      height:200px;
    }
    .action-button{
      display: block;
    margin-bottom: 5px;
    margin-left: 20px;
    }
</style>
