<template lang="html">
  <div>
    <div style="width:400px; margin-top:20px;" v-show="createStep==1">
      <el-form ref="form" :model="waterMarkActivity" label-width="80px">
        <el-form-item label="水印名称">
          <el-input v-model="waterMarkActivity.name"></el-input>
        </el-form-item>
        <el-form-item label="水印素材">
          <!-- <div v-html="waterMarkActivity.water_mark.svg"></div> -->
          <div>
            <img :src="waterMarkActivity.water_mark.image_url" style="width:200px;height:200px" />
          </div>
        </el-form-item>
        <el-form-item label="使用范围" >
          <el-checkbox-group v-model="waterMarkActivity.effect_object">
              <el-checkbox-button border :label=1 >主轮播图</el-checkbox-button>
              <el-checkbox-button :label=2 >其他轮播</el-checkbox-button>
              <el-checkbox-button :label=4 >SKU图</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="waterMarkActivity.start_time" type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker v-model="waterMarkActivity.end_time" type="datetime">
          </el-date-picker>
          <div style="color:red">（* 结束时间不填表示水印一直存在）</div>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="saveToDraft()">取消</el-button>
      <el-button type="primary" @click="changeCreateStep(2)">下一步: 选择商品</el-button>
    </div>
    <div v-show="createStep==2" v-loading="loadingCnt">
        <pdd-search-filter-view ref="pddSearchFilterView" @filterChange="onSearchChange"></pdd-search-filter-view>
        <div style="text-align: left;margin-top:-15px;">
          <el-checkbox v-model="isIgnoreWMProduct" @change="onSearchChange">忽略已有水印（已有水印商品不可选）</el-checkbox></div>
        <pdd-product-list-view ref="pddProductListView"
                :pddProductList="pddProductList"
                :isProductEnableEdit="false"
                :isSelectMultiPage="true"
                :selectAllProductList="selectAllProductList"
                @selectProductList="updateAllSelectProduct">
        </pdd-product-list-view>
        <br>
        <el-pagination
                v-show="loadingCnt == 0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.index"
                :page-size="pagination.size"
                layout="total, prev, pager, next, jumper"
                :total="pagination.total">
        </el-pagination>
        <br>
        <el-button type="primary" @click="changeCreateStep(1)">上一步</el-button>
        <el-button type="primary" @click="updateWaterMarkActivity()" >确认投放
        </el-button>
    </div>
  </div>
</template>
<script>

import request from '@/mixins/request.js'
import moment from 'moment'
import pddProductListView from '@/components/PddProductListView.vue'
import pddSearchFilterView from '@/components/PddSearchFilterView.vue'
export default {
  mixins: [request],
  components: {
    pddProductListView,
    pddSearchFilterView
  },
  activated () {
    this.createStep = 1
    this.selectAllProductList = []
    if (this.$route.params.waterMarkActivity) {
      let tmp = this.$route.params.waterMarkActivity
      this.waterMarkActivity = {
        'wm_activity_id': tmp.wm_activity_id,
        'name': tmp.name,
        'water_mark': tmp.water_mark,
        'effect_object': [],
        'start_time': tmp.start_time,
        'end_time': tmp.end_time,
        'product_list': []
      }
      let self = this
      this.getWaterMarkActivityProductList(tmp.wm_activity_id, function (data) {
        self.waterMarkActivity.product_list = data['items']
        self.selectAllProductList = data['items']
      })
      tmp.effect_object.forEach(effectObject => {
        self.waterMarkActivity.effect_object.push(effectObject)
      })
    } else if (this.$route.params.waterMark) {
      this.waterMarkActivity = {
        'wm_activity_id': -1,
        'name': this.getDefaultName(),
        'water_mark': this.$route.params.waterMark,
        'effect_object': [1],
        'start_time': moment().add(1, 'd'),
        'end_time': moment().add(8, 'd'),
        'product_list': []
      }
    }
  },
  mounted () {
  },
  data () {
    return {
      waterMarkActivity: {
        'wm_activity_id': -1,
        'name': this.getDefaultName(),
        'water_mark': {
          'image_url': '',
          'water_mark_id': -1,
          'water_mark_type': 0
        },
        'effect_object': [1],
        'start_time': new Date(),
        'end_time': moment().add(7, 'd'),
        'product_list': []
      },
      createStep: 1,
      pddProductList: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      isIgnoreWMProduct: true,
      selectAllProductList: []
    }
  },
  computed: {
  },
  methods: {
    getDefaultName () {
      return moment(new Date()).format('YYYYMMDDHHmm') + '-' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10)
    },
    changeCreateStep (step) {
      this.createStep = step
      if (step === 2) {
        this.getProductList(false)
      }
    },
    getWaterMarkActivityProductList (wmActivityId, callback = undefined) {
      let params = {
        wm_activity_id: wmActivityId,
        status: -1
      }
      this.request('getWMActivityProductList', params, data => {
        if (callback !== undefined) {
          callback(data)
        }
      })
    },
    getProductList (isResetIndex = true, isSilent = false) {
      // if (this.$refs.pddProductListView) {
      //   this.$refs.pddProductListView.changeSelectAllData()
      // }
      this.isLoadProduct = true
      if (isResetIndex) {
        this.pagination.index = 1
      }

      let params = this.$refs.pddSearchFilterView.getParams()
      params['page_index'] = this.pagination.index
      params['page_size'] = this.pagination.size

      params['is_ignore_wm_product'] = this.isIgnoreWMProduct
      params['wm_activity_id'] = this.waterMarkActivity.wm_activity_id
      this.request('getWaterMarkProductList', params, data => {
        this.pddProductList = data.items
        this.pagination.total = data.total
      }, undefined, isSilent)
    },
    onSearchChange () {
      this.getProductList()
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getProductList(false)
    },
    updateAllSelectProduct (data) {
      this.waterMarkActivity.product_list = data
    },
    saveToDraft () {
      // 新活动，或者草稿箱的活动才重新进入草稿箱
      if (this.waterMarkActivity.wm_activity_id === -1 || this.waterMarkActivity.status === 7) {
        this.updateWaterMarkActivity(7)
      } else {
        this.$router.go(-1)
      }
    },
    updateWaterMarkActivity (status = undefined) {
      let params = {
        wm_activity_id: this.waterMarkActivity.wm_activity_id,
        name: this.waterMarkActivity.name,
        effect_object: this.waterMarkActivity.effect_object,
        start_time: moment(this.waterMarkActivity.start_time).format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.waterMarkActivity.end_time ? moment(this.waterMarkActivity.end_time).format('YYYY-MM-DD HH:mm:ss') : '',
        water_mark_id: this.waterMarkActivity.water_mark.water_mark_id,
        water_mark_type: this.waterMarkActivity.water_mark.water_mark_type,
        product_list: []
      }
      if (status !== undefined) {
        params['status'] = status
      }
      this.waterMarkActivity.product_list.forEach(product => {
        params.product_list.push(product.goods_id)
      })

      this.request('updateWaterMarkActivity', params, data => {
        this.$router.push({
          name: 'WaterMarkActivityList',
          params: {
            refresh: true
          }})
      }, undefined, false)
    },
    isSelectionEnable (product) {
      return !product.is_exist_water_mark
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
</style>
