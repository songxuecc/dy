<template lang="html">
  <div v-loading="loadingCnt" style="margin-top: 20px;">
        <!-- <div style="text-align: left; margin-bottom: 10px;color: #606266;font-size: 14px; ">
          <span>全部(</span><el-button type="text" @click=handleChangeStatus(-1)>{{waterMarkProductStatusNum['1']+waterMarkProductStatusNum['2']}}</el-button><span>)</span>
          <span>等待投放(</span><el-button type="text" @click=handleChangeStatus(4)>{{waterMarkProductStatusNum['4']}}</el-button><span>)</span>
          <span>成功(</span><el-button type="text" @click=handleChangeStatus(1)>{{waterMarkProductStatusNum['1']}}</el-button><span>)</span>
          <span>失败(</span><el-button type="text" @click=handleChangeStatus(2)>{{waterMarkProductStatusNum['2']}}</el-button><span>)</span>
        </div> -->
        <el-row style="margin-bottom: 10px;text-align:left;">
          <el-col :span="15">
          <el-radio-group v-model="productStatus"
          @change="handleChangeStatus">
            <el-radio-button label="-1">全部({{waterMarkProductStatusNum['-1']}})</el-radio-button>
            <el-radio-button label="4">等待({{waterMarkProductStatusNum['4']}})</el-radio-button>
            <el-radio-button label="1">成功({{waterMarkProductStatusNum['1']}})</el-radio-button>
            <el-radio-button label="2">失败({{waterMarkProductStatusNum['2']}})</el-radio-button>
          </el-radio-group>
          </el-col>
           <el-col :span="9" style="text-align: right;">
            <el-button @click="$router.go(-1)"  style="width:120px" type="primary">返回</el-button>
          </el-col>
        </el-row>

        <el-table :data="productList" row-key="goods_id"  style="width: 100%"
          :row-style="{height:'68px'}"
        >
          <el-table-empty slot="empty"></el-table-empty>
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="scope">
                    <img style="height:60px;max-width:79px;border-radius:4px" :src="scope.row.image_url">
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                        {{ scope.row.goods_name }}
                    </el-link>
                    <div>
                        <label style="font-size:12px" v-if="scope.row.outer_goods_id">商品编码: {{scope.row.outer_goods_id}}</label>
                    </div>
                    <div>
                        <label style="font-size:12px" >商品ID: {{scope.row.goods_id}}</label>
                    </div>
                </template>
            </el-table-column>
             <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                  <div>
                    {{ waterMarkProductStatusMap[scope.row.wm_activity_product_status] }}
                  </div>
                  <!-- <div v-else>未开始</div> -->
                </template>
            </el-table-column>
             <el-table-column label="说明" width="150">
                <template slot-scope="scope">
                    {{ scope.row.fail_reason }}
                </template>
            </el-table-column>
             <!-- <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                  <el-tooltip placement="top" style="margin-right:10px" v-if="parseInt(scope.row.wm_activity_product_status) ===2">
                    <div slot="content">
                        如果因为商品属性问题，请先编辑商品属性<el-link type="text" :underline="false" @click="gotoProductEdit(scope.row.goods_id)">编辑</el-link>
                    </div>
                    <el-link :underline="false" type="primary" @click="retryDeployProduct(scope.row)">重新操作</el-link>
                  </el-tooltip>
                  <el-link
                    v-if="parseInt(wmActivity['status'])=== 2 && parseInt(scope.row.wm_activity_product_status) ===1"
                    :underline="false" type="primary"
                    @click="stopProductWaterMarkActivity(scope.row)"
                  >中止商品水印</el-link>
                </template>
            </el-table-column> -->
        </el-table>
        <br>
        <el-row>
          <el-col style="text-align: right">
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
          </el-col>
        </el-row>

  </div>
</template>
<script>

import request from '@/mixins/request.js'
import common from '@/common/common.js'
import utils from '@/common/utils.js'
import { Loading } from 'element-ui'

export default {
  mixins: [request],
  components: {
  },
  props: {

  },
  created () {
  },
  mounted () {

  },
  activated () {
    this.wmActivityId = this.$route.params.id
    this.productStatus = -1
    if (this.$route.params.status) {
      this.productStatus = this.$route.params.status
    }
    this.getWaterMarkActivity()
    this.getWaterMarkActivityProductList(true)
  },
  deactivated () {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  data () {
    return {
      productList: [],
      productStatus: -1,
      wmActivity: {
        'name': ''
      },
      wmActivityName: '',
      waterMarkProductStatusNum: {
        '-1': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0
      },
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      waterMarkProductStatusMap: {
        '0': '已删除',
        '1': '成功',
        '2': '失败',
        '4': '等待'
      },
      waterMarkActivityStatusMap: {
        '2': '投放',
        '3': '卸载',
        '4': '中止'
      },
      timer: null
    }
  },
  computed: {
    pddProductStatusMap () {
      return common.pddProductStatusMap
    }
  },
  methods: {
    getLastCategory (category) {
      return utils.getLastCategory(category)
    },
    getWaterMarkActivity () {
      clearTimeout(this.timer)
      this.timer = null
      let params = {
        wm_activity_id: this.wmActivityId
      }
      this.request('getWaterMarkActivity', params, data => {
        this.wmActivityName = data['name']
        this.wmActivity = {
          'name': data['name'],
          'status': data['status']
        }
        this.waterMarkProductStatusNum = data['product_status_statistics']
        this.waterMarkProductStatusNum['-1'] = 0
        for (let key in this.waterMarkProductStatusNum) {
          if (key !== '-1') {
            this.waterMarkProductStatusNum['-1'] += this.waterMarkProductStatusNum[key]
          }
        }
        if (this.wmActivity['status'] === common.wmActivityStatus['DEPLOYING']) {
          let self = this
          if (self && !self._isDestroyed) {
            this.timer = setTimeout(function () {
              self.getWaterMarkActivity()
              self.getWaterMarkActivityProductList(true)
            }, 3000)
          }
        }
      })
    },
    getWaterMarkActivityProductList (isResetIndex = true, callback = undefined, isSilent = false) {
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let params = {
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        wm_activity_id: this.wmActivityId,
        status: this.productStatus
      }
      this.request('getWMActivityProductList', params, data => {
        this.productList = data.items
        this.pagination.total = data.total
        if (callback !== undefined) {
          callback()
        }
      }, undefined, isSilent)
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getWaterMarkActivityProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getWaterMarkActivityProductList(false)
    },
    handleChangeStatus (val) {
      this.productStatus = val
      this.getWaterMarkActivityProductList(true)
    },
    retryDeployProduct (row) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '水印', '水印详情', '重新设置水印'])
      }
      let params = {
        wm_activity_id: this.wmActivityId,
        goods_id: row.goods_id
      }
      let loadingInstance = Loading.service({
        lock: true,
        text: '正在设置，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let self = this
      this.request('retryDeloyWaterMarkProduct', params, data => {
        row.wm_activity_product_status = data.status
        row.fail_reason = data.fail_reason
        if (parseInt(data.status) === 1) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          if (this.waterMarkProductStatusNum['2'] > 0) {
            this.waterMarkProductStatusNum['2'] -= 1
          }
          this.waterMarkProductStatusNum['1'] += 1
        } else if (parseInt(data.status) === 2) {
          this.$message.error('设置失败')
        }
        loadingInstance.close()
      }, function () { self.$message.error('设置失败'); loadingInstance.close() }, true)
    },
    gotoProductEdit (goodsId) {
      this.$router.push({ // 判断登录成功路由
        path: '/pddPoductList/normal',
        query: {
          'goods_id': goodsId
        }
      })
    },
    stopProductWaterMarkActivity (row) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '水印', '水印详情', '中止商品水印'])
      }
      let params = {
        wm_activity_id: this.wmActivityId,
        goods_id: row.goods_id
      }
      let loadingInstance = Loading.service({
        lock: true,
        text: '正在设置，请稍等',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let self = this
      this.request('stopProductWaterMarkActivity', params, data => {
        row.wm_activity_product_status = data.status
        row.fail_reason = data.fail_reason
        if (parseInt(data.status) === 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          if (this.waterMarkProductStatusNum['1'] > 0) {
            this.waterMarkProductStatusNum['1'] -= 1
          }
        } else {
          this.$message.error('删除失败')
        }
        loadingInstance.close()
      }, function () { self.$message.error('删除失败'); loadingInstance.close() }, true)
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/var.less';

</style>
