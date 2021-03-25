<template lang="html">
  <div>
    <div style=" margin-top:20px;text-align: left" v-show="createStep==1">
      <el-form ref="form" :model="waterMarkActivity" label-width="80px">
        <el-form-item label="活动名称" style="width:400px;">
          <el-input v-model="waterMarkActivity.name" size="small"></el-input>
          <span class="explain">仅在虎虎搬家助手内展示，方便进行活动管理及筛选</span>
        </el-form-item>
        <el-form-item label="活动素材">
          <div>
            <img :src="waterMarkActivity.water_mark.image_url" style="width:200px;height:200px" />
          </div>
        </el-form-item>
        <el-form-item label="使用范围" v-if="posterType === 'WaterMark'">
          <el-checkbox-group v-model="waterMarkActivity.effect_object" >
              <el-checkbox-button border :label=1 >主轮播图</el-checkbox-button>
              <el-checkbox-button :label=2 >其他轮播</el-checkbox-button>
              <el-checkbox-button :label=4 >SKU图</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="使用范围" v-else>
          <el-radio-group  v-model="waterMarkActivity.effect_object[0]">
              <el-radio :label=1 >详情页第一张</el-radio>
              <el-radio :label=2 >详情页最后一张</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="活动时间">
           <el-radio-group v-model="dateRangeType">
              <el-radio :label="1">特定时间范围</el-radio>
              <el-radio :label="2">不结束</el-radio>
            </el-radio-group><br>
             <el-date-picker v-if="dateRangeType === 1"
                :clearable="false"
                size="small"
                v-model="daterange"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
              <div v-else>
                <span>开始时间</span>
                <el-date-picker
                :clearable="false"
                size="small"
                v-model="daterange[0]"
                type="datetime"
                placeholder="开始日期">
              </el-date-picker>
              </div>

           <div class="explain">软件到期后，进行中的活动将无法自动结束，可提前结束或续订后手动结束活动</div>
        </el-form-item>
      </el-form>
      <div style="margin-left:80px;">
        <el-button type="primary" @click="saveToDraft()" style="width:120px">取消</el-button>
        <el-button type="primary" @click="changeCreateStep(2)" style="width:120px">下一步</el-button>
      </div>
    </div>
    <div v-show="createStep==2" v-loading="loadingCnt">
        <el-form ref="form" :model="search" :inline="true" style="text-align: left; margin-top:10px">
          <el-form-item>
                <el-select v-model="search.status" placeholder="请选择"  @change="onSearchChange"
                           popper-class="select-long" style="width: 200px"
                >
                    <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="search.keyword"  placeholder="商品名称、ID" @keyup.enter.native="onSearchChange" style="width: 300px"></el-input>
            </el-form-item>
            <el-form-item>
            <span class="color-666">(已忽略已有活动的商品)</span>
            </el-form-item>

        </el-form>
       <!-- <el-alert
          show-icon
          :closable="false"
          title="拼多多规定参与促销活动中的商品不可修改, 请确认水印投放时商品未参加活动, 否则将导致投放失败。"
          type="warning"
          style="margin-bottom:5px;"></el-alert> -->
        <el-table ref="pddProductListTable" :data="pddProductList" row-key="goods_id" style="width: 100%;cursor: pointer;"
                  :row-style="{height:'68px'}"
                  @selection-change="handleSelectionChange"
                  @cell-click="onCellClick" @select="onSelect"
        >
          <el-table-empty slot="empty"/>
            <el-table-column width="50" type="selection" :reserve-selection="true" :selectable="isSelectionEnable">
            </el-table-column>
            <el-table-column width="30" label="全选"  header-align="right" :selectable="isSelectionEnable"></el-table-column>
            <el-table-column label="商品" >
              <template slot="header" slot-scope="scope">
               <span>已选择商品({{ selectProductList.length}})</span>&nbsp;
              <el-button v-if="selectProductList.length" size="mini" @click="showSelectProduct" type="primary">查看 </el-button>
            </template>
                <template slot-scope="scope">
                  <div style="display: flex;align-items:center">
                    <div style="margin-right:10px">
                      <el-image v-if="scope.row.goods_id in dicSelectGoodIds" :src="scope.row.preview"  :fit="fit" style="width:60px;height:60px;border-radius:4px"></el-image>
                      <el-image v-else :src="scope.row.image_url"  :fit="fit" style="width:60px;height:60px;border-radius:4px"></el-image>
                    </div>
                    <div>
                      <p>{{ scope.row.goods_name }}</p>
                      <span class="goods-id" :underline="false">商品ID: {{scope.row.goods_id}}</span>
                    </div>
                  </div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="团购价" width="140">
                <template slot-scope="scope">
                    {{ scope.row.min_multi_price / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="自定义价格" width="140">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.custom_price" placeholder="" size="mini"
                    @change="changeCustomPrice(scope.row)"></el-input>
                    <div style="font-size: 12px;color: red;" v-if="scope.row.custom_price !== '' && !checkNum(scope.row.custom_price)">必须为数字</div>
                </template>
            </el-table-column> -->
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
        <br>
        <el-button style="width:120px" @click="changeCreateStep(1)" >上一步</el-button>
        <el-button type="primary" style="width:120px" @click="updateWaterMarkActivity()" >确认投放
        </el-button>

        <el-drawer
          title=""
          :visible.sync="drawerSelectProductListVisible"
          :direction="rtl" :show-close="false"
          size="800px">
           <template slot="title" slot-scope="scope">
            <span>已选商品</span>
          </template>
           <el-table :data="selectProductList" row-key="goods_id" style="width: 100%"
                  :row-style="{height:'68px'}"  :show-header=false
          >
            <el-table-column label="商品">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="6">
                      <el-image :src="scope.row.preview"  :fit="fit" style="width:120px;height:120px"></el-image>
                    </el-col>
                    <el-col :span="18">
                      <p>{{ scope.row.goods_name }}</p>
                      <span class="goods-id" :underline="false">商品ID: {{scope.row.goods_id}}</span></el-col>
                  </el-row>
                </template>
            </el-table-column>
            <!-- <el-table-column label="团购价" width="140">
                <template slot-scope="scope">
                  <span v-if="scope.row.custom_price !== ''">{{ scope.row.custom_price }}</span>
                  <span v-else>{{ scope.row.min_multi_price / 100 }}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="" label="操作" width="90">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="cancelSelect(scope.row)" >取消</el-button>
                </template>
            </el-table-column>
        </el-table>
        </el-drawer>
    </div>
  </div>
</template>
<script>

import request from '@/mixins/request.js'
import moment from 'moment'
import fabric from 'fabric'
import common from '@/common/common'
import { mapGetters } from 'vuex'
import utils from '@/common/utils'

export default {
  mixins: [request],
  components: {
  },
  activated () {
    if (this.$route.name === 'PosterDgActivityCreate') {
      this.posterType = 'PosterDg'
    } else {
      this.posterType = 'WaterMark'
    }
    this.createStep = 1
    this.selectProductList = []
    this.$refs.pddProductListTable.clearSelection()
    this.pagination.index = 1

    if (this.$route.params.waterMarkActivity) {
      let tmp = this.$route.params.waterMarkActivity
      this.waterMarkActivity = {
        'wm_activity_id': tmp.wm_activity_id,
        'name': tmp.name,
        'water_mark': tmp.water_mark,
        'str_json': tmp.str_json,
        'effect_object': [],
        'start_time': tmp.start_time,
        'end_time': tmp.end_time,
        'product_list': [],
        'status': tmp.status
      }
      if (this.waterMarkActivity.end_time === '') {
        this.dateRangeType = 2
      }
      let self = this
      this.getWaterMarkActivityProductList(tmp.wm_activity_id, function (data) {
        data.items.forEach((item) => {
          item.preview = ''
          self.$refs.pddProductListTable.toggleRowSelection(item, true)
          if (item.custom_price !== -1) {
            item.custom_price = item.custom_price / 100
          } else {
            item.custom_price = ''
          }
          self.dicWMProduct[item.goods_id] = item
        })
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
        'start_time': moment().add(0, 'd'),
        'end_time': moment().add(8, 'd'),
        'product_list': []
      }
    }
    if (this.waterMarkActivity.end_time === '') {
      this.daterange = [this.waterMarkActivity.start_time, moment().add(8, 'd')]
    } else {
      this.daterange = [this.waterMarkActivity.start_time, this.waterMarkActivity.end_time]
    }
    let waterMarkType = this.waterMarkActivity.water_mark.water_mark_type
    let waterMarkId = this.waterMarkActivity.water_mark.water_mark_id
    this.getWaterMark(waterMarkType, waterMarkId)
  },
  mounted () {
    if (this.$route.name === 'PosterDgActivityCreate') {
      this.posterType = 'PosterDg'
    } else {
      this.posterType = 'WaterMark'
    }
    fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
        propertiesToInclude = (propertiesToInclude || []).concat(
          ['isPrice']
        )
        return toObject.apply(this, [propertiesToInclude])
      }
    })(fabric.Object.prototype.toObject)
  },
  data () {
    return {
      posterType: 'WaterMark',
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
      daterange: '',
      dateRangeType: 1, // 1 特定时间范围 2 不结束
      createStep: 2,
      pddProductList: [],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      isIgnoreWMProduct: false,
      selectProductList: [],
      selectAllProductList: [],
      dicSelectGoodIds: {},
      waterMarkCanvas: null,
      drawerSelectProductListVisible: false,
      search: {
        keyword: '',
        status: '0-3'
      },
      // statusOptions: [
      //   {value: -1, label: '全部商品'},
      //   {value: 0, label: '在售中'},
      //   {value: 1, label: '已下架'}
      // ],
      dicWMProduct: [] // 编辑未开始的活动，原活动选中的商品
    }
  },
  computed: {
    ...mapGetters({
      // projectConfig: 'getProjectConfig'
    }),
    statusOptions () {
      let options = []
      for (let key in common.dyProductStatusMap) {
        let label = common.dyProductStatusMap[key] === '全部' ? '商品状态' : common.dyProductStatusMap[key]
        options.push({ value: key, label: label })
      }
      console.log(options)
      console.log(this.search.status)
      // return options.sort((a, b) => a.value - b.value)
      return options
    }
  },
  methods: {
    getWaterMark (waterMarkType, waterMarkId) {
      let params = {
        water_mark_type: waterMarkType,
        water_mark_id: waterMarkId
      }
      this.request('getWaterMark', params, data => {
        this.waterMarkActivity.water_mark = data
        this.loadWaterMarkCanvas()
      })
    },
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
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let params = {
        'keyword': this.search.keyword
      }
      let arrStatus = this.search.status.split('-')
      let status = -1
      let checkStatus = -1
      if (arrStatus.length > 1 && arrStatus[0]) {
        status = parseInt(arrStatus[0])
      }
      if (arrStatus.length > 1 && arrStatus[1]) {
        checkStatus = parseInt(arrStatus[1])
      }
      params['status'] = status
      params['check_status'] = checkStatus
      params['page_index'] = this.pagination.index
      params['page_size'] = this.pagination.size

      params['is_ignore_wm_product'] = this.isIgnoreWMProduct
      params['wm_activity_id'] = this.waterMarkActivity.wm_activity_id
      params['poster_type'] = common.PosterType[this.posterType]
      let self = this
      this.request('getWaterMarkProductList', params, data => {
        data.items.forEach((item) => {
          if (item.goods_id in self.dicWMProduct) {
            item.custom_price = self.dicWMProduct[item.goods_id].custom_price
          } else {
            item.custom_price = ''
          }
          item.preview = ''
          item.preview = self.getPreviewWaterMarkImage(item)
        })
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
    saveToDraft () {
      // 新活动，或者草稿箱的活动才重新进入草稿箱
      if (this.waterMarkActivity.wm_activity_id === -1 || this.waterMarkActivity.status === 7) {
        this.updateWaterMarkActivity(7)
      } else {
        this.$router.go(-1)
      }
    },
    updateWaterMarkActivity (status = undefined) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '水印', '点击', '确认投放水印'])
      }
      let params = {
        wm_activity_id: this.waterMarkActivity.wm_activity_id,
        name: this.waterMarkActivity.name,
        effect_object: this.waterMarkActivity.effect_object,
        start_time: moment(this.daterange[0]).format('YYYY-MM-DD HH:mm:ss'),
        end_time: this.dateRangeType === 1 ? moment(this.daterange[1]).format('YYYY-MM-DD HH:mm:ss') : '',
        water_mark_id: this.waterMarkActivity.water_mark.water_mark_id,
        water_mark_type: this.waterMarkActivity.water_mark.water_mark_type,
        product_list: [],
        poster_type: common.PosterType[this.posterType]
      }
      if (params['end_time'] === 'Invalid date') {
        this.$alert('请选择结束日期')
        return
      }
      if (status !== undefined) {
        params['status'] = status
      }
      let self = this
      let isError = false
      this.selectProductList.forEach(product => {
        if (product.custom_price !== '' && !self.checkNum(product.custom_price)) {
          isError = true
        }
        params.product_list.push({
          'goods_id': product.goods_id,
          'custom_price': product.custom_price === '' ? -1 : parseInt(product.custom_price * 100)
        })
      })
      if (isError) {
        this.$alert('自定义价格必须为数字')
        return
      }
      params.product_list = JSON.stringify(params.product_list)
      if (this.waterMarkActivity.wm_activity_id === -1) {
        this.request('addWaterMarkActivity', params, data => {
          if (status === 7) { // 草稿箱
            this.$message('已经将当前活动保存到草稿箱，您可以继续修改')
          } else {
            this.$message({
              message: '水印活动投放成功',
              type: 'success'
            })
          }
          this.$router.push({
            name: this.posterType + 'ActivityList',
            params: {
              refresh: true
            }})
        }, undefined, false)
      } else {
        this.request('updateWaterMarkActivity', params, data => {
          if (status === 7) { // 草稿箱
            this.$message('已经将当前活动保存到草稿箱，您可以继续修改')
          } else {
            this.$message({
              message: '水印活动投放成功',
              type: 'success'
            })
          }
          this.$router.push({
            name: this.posterType + 'ActivityList',
            params: {
              refresh: true
            }})
        }, undefined, false)
      }
    },
    isSelectionEnable (product) {
      return !product.is_exist_water_mark
    },
    loadWaterMarkCanvas () {
      if (this.posterType !== 'WaterMark') {
        return
      }
      let strJson = this.waterMarkActivity.water_mark.json
      let objects = JSON.parse(strJson)
      objects.objects.forEach((obj) => {
        if (obj.type === 'image') {
          obj.crossOrigin = 'anonymous'
        }
      })
      strJson = JSON.stringify(objects)
      this.waterMarkCanvas = new fabric.Canvas(null, {width: 600, height: 600})
      let self = this
      this.waterMarkCanvas.loadFromJSON(strJson, function () {
        self.waterMarkCanvas.renderAll.bind(self.waterMarkCanvas)
      })
    },
    getPreviewWaterMarkImage (product) {
      if (this.posterType !== 'WaterMark') {
        return product.image_url
      }
      // if (product.preview) {
      //   return product.preview
      // }
      let price = product.min_multi_price / 100
      if (product.custom_price !== '') {
        price = product.custom_price
      }
      let objects = this.waterMarkCanvas.getObjects()
      objects.forEach((obj) => {
        if (obj.type === 'text' && obj.isPrice === true) {
          obj.text = '' + price
        }
      })
      let wmBase64 = this.waterMarkCanvas.toDataURL()
      let previewCanvas = document.createElement('canvas')
      previewCanvas.width = previewCanvas.height = 600

      let previewCanvasCtx = previewCanvas.getContext('2d')
      let canvasWidth = previewCanvas.width // 获取canvas宽度
      let canvasHeight = previewCanvas.height // 获取canvas高度
      let previewImage = new Image()
      previewImage.setAttribute('crossOrigin', 'Anonymous')
      previewImage.src = product.image_url
      previewImage.onload = function () {
        previewCanvasCtx.drawImage(this, 0, 0, canvasWidth, canvasHeight)
        let wmImage = new Image()
        wmImage.src = wmBase64
        wmImage.onload = function () {
          previewCanvasCtx.drawImage(this, 0, 0, canvasWidth, canvasHeight)
          product.preview = previewCanvas.toDataURL()
          return product.preview
        }
      }
    },
    handleSelectionChange (selection) {
      this.selectProductList = selection
      this.dicSelectGoodIds = {}
      let self = this
      this.selectProductList.forEach((item) => {
        self.dicSelectGoodIds[item.goods_id] = 1
      })
    },
    showSelectProduct () {
      this.drawerSelectProductListVisible = true
    },
    onCellClick (row, column, cell, event) {
      if (column.label === '自定义价格') {
        return
      }
      this.$refs.pddProductListTable.toggleRowSelection(row)
    },
    cancelSelect (row) {
      this.$refs.pddProductListTable.toggleRowSelection(row)
    },
    checkNum (value) {
      return utils.isNumber(value)
    },
    changeCustomPrice (item) {
      if (item.goods_id in this.dicSelectGoodIds) {
        this.getPreviewWaterMarkImage(item)
      }
    }
  }
}
</script>

<style lang="less">
  .el-date-range-picker{
       .el-picker-panel__footer{
          .el-button:first-child{
            display: none
          }
        }
    }
</style>
<style lang="less" scoped>

    /deep/ .el-table {
      .el-table__header th:nth-child(2) .cell {
        padding-left: 0px;
        padding-right: 0px;
      }
    }
    /deep/ .el-drawer__body{
      overflow-y: auto;
    }
    /deep/ .el-form-item {
      margin-bottom: 10px;
    }
    .explain{
      font-size:12px;
      color:rgba(0,0,0,0.45)
    }
    /deep/ .el-radio-button__inner {
      width: 120px;
    }
    /deep/ .el-radio-group .el-radio-button {
      .el-radio-button__inner {
        border-radius: 0 ;
        font-weight: 500;
        border-color: #1D8FFF;
        color:#1D8FFF;
      }
    }

    /deep/ .el-radio-group .el-radio-button__orig-radio:checked+.el-radio-button__inner{
      background-color:#1D8FFF;
      color: #FFFFFF
    }
    .goods-id {
      color: #999999;
      font-size: 12px
    }
</style>
