<template lang="html">
    <div v-loading="loadingCnt">
        <div>
            <el-form ref="form" :model="search" :inline="true" style="text-align: left">
                <el-form-item label="标题">
                    <el-input v-model="search.key" size="small" @keyup.enter.native="handleFilterChange" style="width: 200px"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="search.status" placeholder="请选择" size="small" @change="handleFilterChange"
                               popper-class="select-long" style="width: 100px"
                    >
                        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="抓取时间">
                    <el-select v-model="captureId" placeholder="请选择" size="small" @change="handleCaptureChange"
                               popper-class="select-long" style="width: 175px"
                    >
                        <el-option-group>
                            <el-option v-for="item in captureOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                        </el-option-group>
                        <el-option-group v-if="isShowCaptureExtendOpt">
                            <el-option :key="capture.capture_id" :label="calendarTime(capture.create_time)"
                                       :value="capture.capture_id.toString()" disabled>
                            </el-option>
                        </el-option-group>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="handleFilterChange">搜索</el-button>
                </el-form-item>
                <br>
                <div v-if="shopCaptureOptionList.length">
                  <span style="font-size:14px;color: #606266;margin-right: 10px;">店铺抓取</span>
                  <el-button type="text" @click="handleCaptureChange(item.value)" v-for="item in shopCaptureOptions.slice(1,3)" :key="item.value">
                    <el-link :class="{isSelect: search.captureId === item.value}" style="font-weight: 400;">{{item.label}}
                    </el-link>
                  </el-button>
                  <el-form-item>
                      <el-select v-model="shopCaptureId" placeholder="请选择" size="small" @change="handleCaptureChange"
                                popper-class="select-long" style="width: 175px"
                      >
                          <el-option-group>
                              <el-option v-for="item in shopCaptureOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                          </el-option-group>
                      </el-select>
                  </el-form-item>
                </div>
            </el-form>
        </div>
        <div>
            <el-alert v-if="getMigrateInfo.length>0" :title=getMigrateInfo type="success" :closable="false"
                      center>
            </el-alert>
        </div>
        <el-alert v-if="capture.capture_id" type="success" :closable="false" center>
            <template slot='title'>
                <div>
                    <span v-if="isShopCapture">店铺<span v-if="this.capture.shop_name!=''">【{{capture.shop_name}}】</span>商品数量({{capture.total_num}}个) </span>
                    <span v-if="isShopCapture">—— 第{{pagination.index}}页【</span>
                    <span v-if="capture.status_statistics.length == 0 && capture.page_status !== 3">
                        {{ captureStatusMap[capture.status] }}
                    </span>
                    <span v-if="capture.status_statistics.length == 0 && capture.page_status === 3">
                        {{ captureStatusMap[capture.page_status] }}
                    </span>
                    <span v-if="capture.status_statistics.length > 0"
                          v-for="(item, index) in capture.status_statistics" :key="index"
                    >
                        {{ captureStatusMap[item.status] }} {{ item.count }} 条 &nbsp;&nbsp;
                    </span>
                    <span v-if="capture.status_statistics.length > 0">
                        总共 {{ capture.capture_num }} 条
                    </span>
                    <span v-if="isShopCapture">】</span>
                </div>
            </template>
            <el-tooltip v-show="getCaptureStatus ==='capture-item' && [0, 1].includes(this.capture.page_status)"
                        class="item" effect="light" placement="bottom"
                        :content="calcProgressText(capture)"
            >
                <div class="progress-bar blue stripes" style="width: 200px;margin: 5px auto;">
                    <span :style="{ width: calcProgressVal(capture) }"></span>
                </div>
            </el-tooltip>
        </el-alert>
        <product-list-view ref="productListView" :tpProductList="tpProductList">
            <template slot="upperRight" v-if="false">
                <router-link to="/productsSync">
                    <el-button size="small" @click="toProductsSync" style="right: 0px; margin-right: 10px;">商品源同步</el-button>
                </router-link>
            </template>
            <template slot="upperRight">
                <el-button size="small" @click="showBatchDeleteCapture" style="right: 0px;">批量删除</el-button>
            </template>
        </product-list-view>
        <br>
        <el-tooltip v-if="isShopCapture"  content="本页抓取完才能抓下一页" placement="top">
          <el-pagination :disabled="getCaptureStatus !== 'finish'"
                  v-show="loadingCnt == 0"
                  @current-change="handleCurrentChange"
                  :current-page="pagination.index"
                  :page-size="pagination.size"
                  layout="total, prev, pager, next, jumper"
                  :total="pagination.total">
          </el-pagination>
        </el-tooltip>
        <el-pagination v-else
                v-show="loadingCnt == 0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.index"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
        </el-pagination>
        <div  class="common-bottom">
            <el-button :disabled="selectIdList.length == 0" type="primary" @click="toMigrate">
                <span style="line-height:21px">准备搬家</span>
                <el-badge v-if="selectIdList.length > 0" :value="selectIdList.length"></el-badge>
            </el-button>
        </div>
        <div>
          <el-dialog
            title="淘宝登录验证"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="loginDialogVisible"
            width="30%">
            <p>由于淘宝原因，搜索复制店铺商品需先<span style="color: #dd6161; font-weight:bold; vertical-align:baseline;">登录淘宝</span>，<br/>请登陆成功后再返回当前页面继续操作。</p>
            <span slot="footer" class="dialog-footer">
              <el-button type="plain" @click="finishLogin">已完成验证，继续操作</el-button>
              <el-button type="primary" @click="gotoLoginPage">立即登录</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="滑动验证"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :visible.sync="slideDialogVisible"
            width="30%">
            <iframe id="slide" v-bind:src="slideUrl" style="width:100%; height: 350px;" scrolling="no" frameborder="0"></iframe>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="finishSlide">已完成验证，继续操作</el-button>
            </span>
          </el-dialog>
          <el-dialog
            title="删除选中的商品"
            :visible.sync="batchDeleteCaptureVisible"
            @opened="captureSelectAll()"
            width="40%">
            <p style="text-align: left;">*只删除软件的记录，对抖音商品没影响。</p>
            <el-table ref="selectCaptureTable" :data="tpProductList" row-key="tp_product_id" border style="width: 100%"
                  :row-style="{height:'68px'}" max-height="420"
                  @selection-change="handleCaptureSelectionChange"
            >
              <el-table-column type="selection">
              </el-table-column>
              <el-table-column label="图片" width="100" align="center">
                  <template slot-scope="scope">
                      <img style="height:60px" :src="scope.row.thumbnail">
                  </template>
              </el-table-column>
              <el-table-column label="标题">
                  <template slot-scope="scope">
                      <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">
                          {{ scope.row.title }}
                      </el-link><br>
                      <img style="width: 15px; height: 15px; margin-right: 2px;" class="icon" :src="getIcon(scope.row)">
                      <label style="font-size:12px; margin-right: 5px;">{{scope.row.source}}</label>
                      <label style="font-size:12px; margin-right: 5px;" v-if="scope.row.tp_outer_iid">商家编码: {{scope.row.tp_outer_iid}}</label>
                      <label style="font-size:12px">创建时间: {{scope.row.create_time}}</label>
                  </template>
              </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="batchDeleteCapture">确定</el-button>
              <el-button @click="batchDeleteCaptureVisible = false">取消</el-button>
            </span>
          </el-dialog>
        </div>
    </div>
</template>
<script>
import productListView from '@/components/ProductListView.vue'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import { mapActions } from 'vuex'
import moment from 'moment'
import utils from '@/common/utils'
export default {
  inject: ['reload'],
  mixins: [request],
  components: {
    productListView
  },
  data () {
    return {
      isMounted: false,
      tpProductList: [],
      captureOptionList: [],
      captureId: '-1',
      shopCaptureOptionList: [],
      shopCaptureId: '-1',
      search: {
        key: '',
        status: '-1',
        captureId: '-1'
      },
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      capture: {},
      pageData: {},
      triggerShopCaptureRunOnce: {},
      migrate: {
        'productStatusTimer': null,
        'migrateProductList': [],
        'statusStatistics': [],
        'statusStatisticsTimer': null
      },
      timer: null,
      isLoadProduct: false,
      migratingStatus: [1, 2, 9],
      loginDialogVisible: false,
      slideDialogVisible: false,
      loginUrl: '',
      slideUrl: '',
      batchDeleteCaptureVisible: false,
      captureSelection: []
    }
  },
  computed: {
    productStatusMap () {
      return common.productStatusMap
    },
    captureStatusMap () {
      return common.captureStatusMap
    },
    statusOptions () {
      let options = []
      for (let key in this.productStatusMap) {
        options.push({ value: key, label: this.productStatusMap[key] })
      }
      return options.sort((a, b) => a.value - b.value)
    },
    captureOptions () {
      let options = [{ value: '-1', label: '全部' }]
      for (let i in this.captureOptionList) {
        let capture = this.captureOptionList[i]
        let label = this.calendarTime(capture.create_time)
        if (parseInt(i) === 0) {
          label = '最近一次 (' + utils.calendarShort(capture.create_time) + ')'
        }
        options.push({
          value: capture.capture_id.toString(),
          label
        })
      }
      return options
    },
    isShowCaptureExtendOpt () {
      if (this.search.captureId.toString() === '-1' || !this.capture.capture_id) {
        return false
      }
      for (let i in this.captureOptionList) {
        let capture = this.captureOptionList[i]
        if (capture.capture_id.toString() === this.search.captureId.toString()) {
          return false
        }
      }
      return true
    },
    shopCaptureOptions () {
      let options = [{ value: '-1', label: '全部' }]
      for (let i in this.shopCaptureOptionList) {
        let capture = this.shopCaptureOptionList[i]
        options.push({
          value: capture.capture_id.toString(),
          label: capture.shop_name
        })
      }
      return options
    },
    selectIdList () {
      if (!this.isMounted) {
        return []
      }
      let retList = []
      for (let id in this.$refs.productListView.dicSelectId) {
        if (this.$refs.productListView.dicSelectId[id]) {
          retList.push(id)
        }
      }
      return retList
    },
    isShopCapture () {
      if (this.capture.capture_type_id === common.CAPTURE_SHOP) {
        return true
      }
      return false
    },
    getCaptureStatus () {
      if (this.isShopCapture) {
        if (this.capture.page_status === 4) {
          return 'capture-item-waiting'
        }
        if ([0, 1].includes(this.capture.status) && this.capture.page_status === 4) {
          return 'capture-list'
        }
        if (this.capture.page_status === 2 && this.capture.status === 2) {
          return 'finish'
        }
        if (this.capture.status === 3 || this.capture.page_status === 3) {
          return 'finish'
        }
        return 'capture-item'
      } else {
        if ([0, 1].includes(this.capture.status)) {
          return 'capture-item'
        }
        return 'finish'
      }
    },
    getMigrateInfo () {
      let info = ''
      let running = 0
      let check = 0
      this.migrate.statusStatistics.forEach(function (item) {
        let status = parseInt(item['status'])
        if ([1, 2].includes(status)) {
          running += item['count']
        }
        if (status === 9) {
          check += item['count']
        }
      })
      if (running) {
        info += running + '个商品正在搬家 '
      }
      if (check) {
        info += check + '个商品在后台审核'
      }
      return info
    }
  },
  created () {
    this.search.captureId = (this.$route.query.captureId || '-1').toString()
  },
  mounted () {
    let elementList = document.querySelectorAll('div.select-long div.el-select-dropdown__wrap')
    for (let i = 0; i < elementList.length; ++i) {
      elementList[i].style.maxHeight = '300px'
    }
    this.isMounted = true
  },
  activated () {
    if (this.$route.params.keepStatus) {
      if (this.$route.params.needRefresh) {
        this.$refs.productListView.clearSelect()
        this.updateInfo()
      }
      return
    }
    this.resetInfo()
    if (this.$route.query.captureId) {
      this.search.captureId = this.$route.query.captureId.toString()
    }
    this.$refs.productListView.clearSelect()
    this.getCaptureOptionList()
    this.updateInfo()
    this.updateQuery()
    this.getMigrateStatusStatistics()
  },
  deactivated () {
    this.$refs.productListView.dialogEditVisible = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  },
  beforeRouteLeave (to, from, next) {
    clearTimeout(this.migrate.productStatusTimer)
    this.migrate.productStatusTimer = null

    clearTimeout(this.migrate.statusStatisticsTimer)
    this.migrate.statusStatisticsTimer = null
    next()
  },
  methods: {
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    calendarTime (strTime) {
      return moment(strTime).calendar()
    },
    getCaptureOptionList () {
      this.request('getCaptureOptionList', {}, data => {
        this.captureOptionList = data.items
        this.shopCaptureOptionList = data.shop_capture_items
        this.handleCaptureOptionChange(this.search.captureId)
      }, undefined, true)
    },
    resetInfo () {
      this.captureId = '-1'
      this.shopCaptureId = '-1'
      this.pagination.index = 1
      this.pagination.size = 10
      this.pagination.total = 0
      this.search.key = ''
      this.search.status = '-1'
      this.search.captureId = '-1'
      this.capture = {}
      this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
      this.timer = null
      this.pageData = {}
      this.triggerShopCaptureRunOnce = {}
      this.resetProductList()
      this.resetValidProductList()
      this.migrate.migrateProductList = []
      clearTimeout(this.migrate.productStatusTimer)
      this.migrate.productStatusTimer = null
      clearTimeout(this.migrate.statusStatisticsTimer)
      this.migrate.statusStatisticsTimer = null
    },
    resetProductList () {
      this.tpProductList = []
    },
    resetValidProductList () {
      this.$refs.productListView.validProductIdsList = []
      this.$refs.productListView.dicSelectId = {}
    },
    resetPagination () {
      this.pagination.size = 10
      this.pagination.index = 1
    },
    resetPaginationIndex () {
      this.pagination.index = 1
    },
    updateInfo () {
      let captureId = this.search.captureId
      if (captureId.toString() === '-1') {
        this.capture = {}
        this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
        this.getProductList()
        this.getCaptureValidTPProductIdList()
      } else {
        this.getCapture()
      }
    },
    getProductList (isSilent = false) {
      this.isLoadProduct = true
      let params = {
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        keyword: this.search.key,
        status: this.search.status,
        capture_id: this.search.captureId
      }
      if (params['page_size'] === 0) {
        return
      }
      this.request('getTPProductList', params, data => {
        this.tpProductList = data.items
        this.pagination.total = data.total
        this.isLoadProduct = false
        let migrateProduct = []
        let self = this
        this.tpProductList.forEach(function (product, index) {
          product.isMigrating = false
          product.index = index
          product.isMouseOver = false
          if (self.migratingStatus.includes(parseInt(product.status))) {
            migrateProduct.push(product.tp_product_id)
            product.isMigrating = true
          }
        })
        this.migrate.migrateProductList = migrateProduct
        this.getTPProductByIds()
      }, undefined, isSilent)
    },
    getCapture (isSilent = false) {
      let captureId = this.search.captureId
      if (captureId.toString() === '-1') {
        this.capture = {}
        this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
        return
      }
      let params = {
        keyword: this.search.key,
        status: this.search.status,
        capture_id: this.search.captureId,
        page_index: this.pagination.index,
        page_size: this.pagination.size
      }
      this.request('getCapture', params, data => {
        this.capture = data
        this.shopCaptureType = data.shop_capture_type
        if (this.isShopCapture) { // 店铺抓取，上面的筛选都针对本页抓取
          this.pagination.size = data.page_size
          this.pagination.total = data.total_num
        }
        if (data.shop_capture_type === common.SHOP_CAPTURE_TYPE['client'] && ![2, 1].includes(data.page_status)) {
          if (!this.pageData.hasOwnProperty(data.page_id) || this.pageData[data.page_id] == null) {
            if (data.shop_async_link !== '') {
              this.requestJsonp(
                data.shop_async_link
              ).then(res => {
                if (res.hasOwnProperty('rgv587_flag')) {
                  if (res.url.indexOf('login.taobao.com') !== -1) {
                    this.loginUrl = res.url
                    this.loginDialogVisible = true
                  } else {
                    this.slideUrl = res.url
                    this.slideDialogVisible = true
                  }
                } else {
                  this.pageData[data.page_id] = res
                }
              })
            }
          }
        }
        this.checkProgress()
      }, undefined, isSilent)
    },
    getCaptureValidTPProductIdList (isSilent = false) {
      let captureId = this.search.captureId
      if (captureId.toString() === '-1') {
        this.$refs.productListView.validProductIdsList = []
        this.$refs.productListView.dicSelectId = {}
        return
      }
      if (parseInt(this.search.status) !== 0 && parseInt(this.search.status) !== -1) {
        this.$refs.productListView.validProductIdsList = []
        this.$refs.productListView.dicSelectId = {}
        return
      }
      let params = {
        keyword: this.search.key,
        capture_id: this.search.captureId,
        page_index: this.pagination.index,
        page_size: this.pagination.size
      }
      this.request('getCaptureValidTPProductIdList', params, data => {
        this.$refs.productListView.validProductIdsList = data.valid_tp_product_ids
        if (this.isLoadProduct) {
          let unwatch = this.$watch('isLoadProduct', function (newVal, oldVal) {
            if (newVal === false) {
              this.$refs.productListView.selectAll()
              unwatch()
            }
          })
        } else {
          this.$refs.productListView.selectAll()
        }
      }, undefined, isSilent)
    },
    triggerShopCapture (isSilent = false) {
      let captureId = this.search.captureId
      if (captureId.toString() === '-1') {
        return
      }
      let params = {
        capture_id: this.search.captureId,
        page_index: this.pagination.index,
        page_size: this.pagination.size
      }
      if (this.triggerShopCaptureRunOnce.hasOwnProperty(params['page_index']) &&
        this.triggerShopCaptureRunOnce[params['page_index']] === true) {
        return
      }
      if (this.pageData.hasOwnProperty(params['page_index']) && this.pageData[params['page_index']]) {
        params['page_data'] = this.pageData[params['page_index']]
        this.triggerShopCaptureRunOnce[params['page_index']] = true
      }
      if (this.shopCaptureType === common.SHOP_CAPTURE_TYPE['client'] && !params.hasOwnProperty('page_data')) {
        return
      }
      this.request('triggerShopCapture', params, data => {
      }, undefined, isSilent)
    },
    handleFilterChange () {
      this.$refs.productListView.clearSelect()
      if (!this.isShopCapture) { // 店铺抓取，上面的筛选都针对本页抓取
        this.resetPaginationIndex()
      }
      this.updateInfo()
    },
    checkProgress () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      if (this.loginDialogVisible || this.slideDialogVisible) {
        return
      }
      if (this.getCaptureStatus === 'finish') {
        this.getCaptureValidTPProductIdList(true)
        this.getProductList(true)
        return
      }
      let self = this
      if (this.getCaptureStatus !== 'finish') {
        this.timer = setTimeout(function () {
          if (self.isShopCapture && self.getCaptureStatus === 'capture-item-waiting') {
            self.triggerShopCapture()
          }
          if (self.getCaptureStatus === 'capture-item') {
            self.getCaptureValidTPProductIdList(true)
            self.getProductList(true)
          }
          self.getCapture(true)
        }, 3000)
      }
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.resetPaginationIndex()
      this.updateInfo()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.triggerShopCaptureRunOnce[val] = false
      this.pageData[val] = null
      this.resetProductList()
      if (this.isShopCapture) {
        this.resetValidProductList()
      }
      this.updateInfo()
    },
    handleCommonCaptureChange () {
      this.pageData = {}
      this.triggerShopCaptureRunOnce = {}
      this.resetPagination()
      this.resetProductList()
      this.handleFilterChange()
      this.updateQuery()
    },
    handleCaptureOptionChange (captureId) {
      if (this.captureOptions.map(a => a.value).indexOf(captureId) !== -1) {
        this.captureId = captureId
      } else {
        this.captureId = '-1'
      }
      if (this.shopCaptureOptions.map(a => a.value).indexOf(captureId) !== -1) {
        this.shopCaptureId = captureId
      } else {
        this.shopCaptureId = '-1'
      }
      this.search.captureId = captureId
    },
    handleCaptureChange (captureId) {
      this.handleCaptureOptionChange(captureId)
      this.handleCommonCaptureChange()
    },
    updateQuery () {
      let query = {
        ...this.$route.query,
        captureId: this.search.captureId
      }
      if (this.search.captureId.toString() === '-1') {
        delete query['captureId']
      }
      this.$router.replace({ query })
    },
    toMigrate () {
      this.setSelectTPProductIdList(this.selectIdList)
      this.$router.push({
        path: '/migrateSettingPrice'
      })
    },
    getTPProductByIds (isSilent = false) {
      clearTimeout(this.migrate.productStatusTimer)
      this.migrate.productStatusTimer = null

      if (this.migrate.migrateProductList.length === 0) {
        return
      }
      let params = {
        tp_product_ids: this.migrate.migrateProductList
      }

      this.request('getTPProductByIds', params, data => {
        let productList = data['items']
        let migrateProductList = []
        let self = this
        this.tpProductList.forEach(function (product, index) {
          productList.forEach(function (item, index) {
            let tpProductId = item['tp_product_id']
            if (parseInt(product.tp_product_id) === parseInt(tpProductId)) {
              if (self.migratingStatus.includes(item['status'])) {
                item.isMigrating = true
                migrateProductList.push(tpProductId)
              } else {
                item.isMigrating = false
              }
              product.dy_product_id = item['dy_product_id']
              product.status = item['status']
              product.isMigrating = item.isMigrating
              product.index = index
              product.isMouseOver = false
              product.migration_msg = []
              item.migration_msg.forEach(function (msg) {
                product.migration_msg.push(msg)
              })
              product.migrate_process = item.migrate_process
            }
          })
        })
        this.migrate.migrateProductList = migrateProductList
        if (this.migrate.productStatusTimer === null) {
          this.migrate.productStatusTimer = setTimeout(function () {
            self.getTPProductByIds()
          }, 3000)
        }
      }, undefined, isSilent)
    },
    getMigrateStatusStatistics (isSilent = false) {
      clearTimeout(this.migrate.statusStatisticsTimer)
      this.migrate.statusStatisticsTimer = null

      this.request('getMigrateStatusStatistics', {}, data => {
        this.migrate.statusStatistics = data['status_statistics']
        let self = this
        let isFinish = true
        this.migrate.statusStatistics.forEach(function (value) {
          if (self.migratingStatus.includes(parseInt(value.status))) {
            isFinish = false
          }
        })
        if (isFinish === false && this.migrate.statusStatisticsTimer === null) {
          this.migrate.statusStatisticsTimer = setTimeout(function () {
            self.getMigrateStatusStatistics()
          }, 5000)
        }
      }, undefined, isSilent)
    },
    calcProgressText (capture) {
      let count = 0
      for (let i in capture.status_statistics) {
        let item = capture.status_statistics[i]
        if (item.status === 2 || item.status === 3) { // 抓取完成 success or fail
          count += item.count
        }
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
        if (item.status === 2 || item.status === 3) {
          count += item.count
        }
      }
      return Math.min(100, count / capture.capture_num * 100) + '%'
    },
    toProductsSync () {
//      console.log('--- toProductsSync')
    },
    requestJsonp (url) {
      return new Promise((resolve, reject) => {
        // 动态创建script标签
        const script = document.createElement('script')
        // 接口返回的数据获取
        window.jsonpCb = (res) => {
          document.body.removeChild(script)
          delete window.jsonpCb
          resolve(res)
        }
        script.src = `${url}&callback=jsonpCb`
        document.body.appendChild(script)
      })
    },
    finishLogin () {
      this.loginDialogVisible = false
      this.reload()
    },
    gotoLoginPage () {
      window.open(this.loginUrl)
    },
    finishSlide () {
      this.slideDialogVisible = false
      this.reload()
    },
    batchDeleteCapture () {
      if (this.captureSelection.length === 0) {
        return
      }
      this.request('deleteTPProduct', { tp_product_ids: this.captureSelection.map(arr => arr.tp_product_id) }, data => {
        this.batchDeleteCaptureVisible = false
        this.reload()
      })
    },
    showBatchDeleteCapture () {
      this.batchDeleteCaptureVisible = true
    },
    getIcon (product) {
      if (product.source === '淘宝') {
        return require('@/assets/images/u72.png')
      } else if (product.source === '天猫') {
        return require('@/assets/images/u74.png')
      } else if (product.source === '1688') {
        return require('@/assets/images/1688.png')
      } else if (product.source === '京东') {
        return require('@/assets/images/jd.png')
      } else if (product.source === '苏宁') {
        return require('@/assets/images/sn.png')
      } else if (product.source === '网易考拉') {
        return require('@/assets/images/kaola.png')
      } else if (product.source === '唯品会') {
        return require('@/assets/images/vip.png')
      }
      return ''
    },
    handleCaptureSelectionChange (val) {
      this.captureSelection = val
    },
    captureSelectAll () {
      if (this.captureSelection.length !== 0) {
        return
      }
      this.tpProductList.forEach(row => {
        this.$refs.selectCaptureTable.toggleRowSelection(row)
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/progress.less';

    /deep/ .el-link.el-link--default.isSelect {
         color: #409EFF;
          border-bottom: 1px solid #409EFF;
    }
</style>
