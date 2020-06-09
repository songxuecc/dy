<template lang="html">
  <div>
        <div style="text-align: left; margin-bottom: 10px;color: #606266;font-size: 14px; ">
          <span>全部(</span><el-button type="text" @click=handleChangeStatus(-1)>{{waterMarkProductStatusNum['1']+waterMarkProductStatusNum['2']}}</el-button><span>)</span>
          <span>成功(</span><el-button type="text" @click=handleChangeStatus(1)>{{waterMarkProductStatusNum['1']}}</el-button><span>)</span>
          <span>失败(</span><el-button type="text" @click=handleChangeStatus(2)>{{waterMarkProductStatusNum['2']}}</el-button><span>)</span>
        </div>
        <el-table :data="productList" row-key="goods_id" border style="width: 100%"
          :row-style="{height:'68px'}" :cell-style="{padding:0}"
        >
            <el-table-column label="图片" width="100" align="center">
                <template slot-scope="scope">
                    <img style="height:60px;max-width:79px;" :src="scope.row.image_url">
                </template>
            </el-table-column>
            <el-table-column label="标题">
                <template slot-scope="scope">
                    <a :href="'https://mobile.yangkeduo.com/goods.html?goods_id=' + scope.row.goods_id" target="_blank" >
                        {{ scope.row.goods_name }}
                    </a><br>
                    <div>
                        <label style="font-size:12px" v-if="scope.row.outer_goods_id">商家编码: {{scope.row.outer_goods_id}}</label>
                    </div>
                </template>
            </el-table-column>
             <el-table-column label="水印状态" width="120">
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
        </el-table>
        <br>
        <el-row>
          <el-col :span="9">
            <el-button @click="$router.go(-1)" size="small" type="primary">返回</el-button>
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
</template>
<script>

import request from '@/mixins/request.js'
import common from '@/common/common.js'
import utils from '@/common/utils.js'
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
    this.waterMarkProductStatusNum = this.$route.params.product_status_statistics
    this.productStatus = -1
    this.getWaterMarkActivityProductList(true)
  },
  data () {
    return {
      productList: [],
      productStatus: -1,
      waterMarkProductStatusNum: {
        '1': 0,
        '2': 0
      },
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      waterMarkProductStatusMap: {
        '1': '成功',
        '2': '失败',
        '3': '未开始'
      },
      waterMarkActivityStatusMap: {
        '2': '投放',
        '3': '卸载',
        '4': '中止'
      }
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
    getWaterMarkActivityProductList (isResetIndex = true, callback = undefined) {
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
      })
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
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
