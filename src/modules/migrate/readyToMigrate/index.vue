<template lang="html">
  <div v-loading="loadingCnt" class="readyToMigrate">
    <div>
      <div class="test" ref="test">
        <Search
          @change="onSearchChange"/>
        <!-- <el-form ref="form" :model="search" :inline="true" style="text-align: left;" class="flex align-c wrap">
          <el-form-item>
            <el-select v-model="search.child_shop_user_id" placeholder="请选择" size="small"
              @change="handleShopFilterChange" popper-class="select-long" style="width: 195px">
              <el-option v-for="item in bindShopList" :key="item.user_id" :label="item.shop_name" :value="item.user_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search.key" size="small" placeholder="商品标题" @keyup.enter.native="handleFilterChange"
              style="width: 195px">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.status" placeholder="商品状态" size="small" @change="handleStatusFilterChange"
              popper-class="select-long" style="width: 195px">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="captureId" placeholder="复制时间" size="small" @change="handleCaptureChange"
              popper-class="select-long" style="width: 195px">
              <el-option-group>
                <el-option v-for="item in captureOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
              <el-option-group v-if="isShowCaptureExtendOpt">
                <el-option :key="capture.capture_id" :label="calendarTime(capture.create_time)"
                  :value="capture.capture_id.toString()" disabled>
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="shopCaptureId" placeholder="请选择" size="small" @change="handleShopCaptureChange"
              popper-class="select-long" style="width: 195px">
              <el-option-group>
                <el-option v-for="item in shopCaptureOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
          <el-form-item style="margin-right:0;margin-bottom:5px">
            <el-button type="primary" size="medium" @click="handleFilterChange">
              <hh-icon type="iconsousuo1" style="font-size:16px"></hh-icon>
            </el-button>
          </el-form-item>
        </el-form> -->
        <el-alert v-if="getMigrateInfo.length>0" :title="getMigrateInfo" type="success" :closable="false" center>
        </el-alert>
        <el-alert v-if="capture.capture_id" type="success" :closable="false" center>
          <template slot='title'>
            <div>
              <span v-if="isShopCapture">店铺<span v-if="capture.shop_name!=''">【{{capture.shop_name}}】</span>
                {{captureShopStatusMap[capture.status]}}, 商品数量({{captureNum}}个) </span>
              <span v-if="isShopCapture">—— 第{{pagination.index}}页【</span>
              <span v-if="capture.status_statistics.length == 0">
                {{ captureStatusMap[capture.page_status] }}
              </span>
              <span v-if="capture.status_statistics.length > 0" v-for="(item, index) in capture.status_statistics"
                :key="index">
                {{ captureStatusMap[item.status] }} {{ item.count }} 条 &nbsp;&nbsp;
              </span>
              <span v-if="capture.status_statistics.length > 0">
                总共 {{ capture.capture_num }} 条
              </span>
              <span v-if="isShopCapture">】</span>
            </div>
          </template>
          <el-tooltip v-show="getCaptureStatus ==='capture-item' && [0, 1].includes(this.capture.page_status)"
            class="item" effect="light" placement="bottom" :content="calcProgressText(capture)">
            <div class="progress-bar blue stripes" style="width: 200px;margin: 5px auto;">
              <span :style="{ width: calcProgressVal(capture) }"></span>
            </div>
          </el-tooltip>
        </el-alert>
        <BatchEdit @onSizeChange="handleSizeChange" :pageSize="pagination.size"
          :selectIdBatchEditList="selectIdBatchEditList" @toggleLoadingCnt="toggleLoadingCnt"
          :tpProductList="tpProductList" @reload="getProductList" :isShopCapture="isShopCapture"
          v-if="search.child_shop_user_id == 0" />
        <product-list-view ref="productListView" :tpProductList="tpProductList"
          :showOperate="search.child_shop_user_id == 0" :hasShowOperate="true">
          <template slot="upperRight" v-if="isShopCapture && (capture.page_status===3 || capture.status===3)">
            <el-button
              size="small"
              type="danger"
              @click="forceGetCapture"
              style="right: 0px; margin-right: 10px"
              >重新复制本页
            </el-button>
          </template>
          <template slot="upperRight">
            <el-button size="small" @click="showBatchDeleteCapture" style="right: 0px"
              >批量删除</el-button
            >
          </template>
        </product-list-view>
        <br>
        <el-tooltip v-if="isShopCapture" content="本页复制完才能复制下一页" placement="top">
          <el-pagination :disabled="getCaptureStatus !== 'finish'" v-show="loadingCnt == 0"
            @current-change="handleCurrentChange" :current-page="pagination.index" :page-size="pagination.size"
            layout="total, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
        </el-tooltip>
        <el-pagination v-else v-show="loadingCnt == 0" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" :current-page="pagination.index" :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
        </el-pagination>

      </div>
    </div>

    <div v-if="startMigrateBtnFixed" style="height:102px;width:100%"></div>
    <div :class="[startMigrateBtnFixed ? 'start-migrate-btn-fadeIn':'start-migrate-btn-fadeOut' ,'flex'] "
      ref="startMigrateBtn" v-if="!loadingCnt"
      :style="{'margin-right': startMigrateBtnFixed ? `${scrollWidth + 40}px` : 0}">
      <div style="width:200px;margin-right:10px" v-if="startMigrateBtnFixed"></div>
      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;">
        <div>
          <el-button :disabled="selectIdList.length == 0" type="primary" @click="toMigrate">
            <span style="line-height:21px">下一步: 修改价格</span>
            <el-badge v-if="selectIdList.length > 0" :value="selectIdList.length"></el-badge>
          </el-button>
          <NewComer type="下一步: 修改价格" ref="newComer">
            <div class="left">
              <div style="width:180px " class="color-666 font-12">勾选待上线商品，并点击此处进行下一步操作</div>
              <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
            </div>
          </NewComer>
        </div>
        <div class="info flex filterOnlineProducts  align-c justify-c ">
          <span v-if="versionTipType === 'free_three_months' && userVersion && !userVersion.is_senior" class="pt-10">
            提示：当前版本为试用版(每日搬家数限制10个)。今日已搬 {{userVersion.today_cnt}}个，还能操作<span class="price bold"> {{ userVersion.left_cnt || 0  }} </span>个商品。建议您<a class="primary pointer bold" @click="versionTypeUp(versionType.btn)"> 升级为高级版 </a>，升级后每日搬家数<span class="color-333 bold"> 无上限 </span>
          </span>
          <span v-if="versionTipType === 'free_seven_days' && userVersion && !userVersion.is_senior" class="pt-10">
            提示：当前版本为试用版(每日搬家数限制10个)。今日已搬 {{userVersion.today_cnt}} 个，还能操作<span class="price bold"> {{ userVersion.left_cnt || 0  }} </span>个商品。建议<a class="primary pointer bold" @click="versionTypeUp(versionType.btn)"> 订购高级版 </a>，升级后每日搬家数<span class="color-333 bold"> 无上限 </span>
          </span>
        </div>
      </div>
    </div>

    <el-dialog title="淘宝登录验证" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="loginDialogVisible" width="30%">
      <p>由于淘宝原因，搜索复制店铺商品需先<span
          style="color: #dd6161; font-weight:bold; vertical-align:baseline;">登录淘宝</span>，<br />请登陆成功后再返回当前页面继续操作。</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" @click="finishLogin">已完成验证，继续操作</el-button>
        <el-button type="primary" @click="gotoLoginPage">立即登录</el-button>
      </span>
    </el-dialog>
    <el-dialog title="滑动验证" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="slideDialogVisible" width="30%">
      <iframe id="slide" v-bind:src="slideUrl" style="width:100%; height: 350px;" scrolling="no"
        frameborder="0"></iframe>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="finishSlide">已完成验证，继续操作</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="batchDeleteCaptureVisible" @opened="captureSelectAll()">
      <span slot="title">删除选中的商品</span>
      <div style="margin-top: -30px;">
        <p style="text-align: left;">*只删除软件的记录，对抖音商品没影响。</p>
        <el-table ref="selectCaptureTable" :data="tpProductList" row-key="tp_product_id" border style="width: 100%"
          :row-style="{height:'30px'}" max-height="320" @selection-change="handleCaptureSelectionChange">
          <el-table-empty slot="empty" />
          <el-table-column type="selection">
          </el-table-column>
          <el-table-column label="图片" width="100" align="center">
            <template slot-scope="scope">
              <img style="height:30px" :src="scope.row.thumbnail">
            </template>
          </el-table-column>
          <el-table-column label="标题">
            <template slot-scope="scope">
              <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">
                {{ scope.row.title }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-button type="info" size="mini" round v-if="[0,1].includes(scope.row.capture_status)">复制中</el-button>
              <el-button :type="getStatusType(scope.row.status)" size="mini" round v-else-if="scope.row.status!==2">
                {{ productStatusMap[scope.row.status] }}
              </el-button>
              <div v-else>
                {{ productStatusMap[scope.row.status] }}
                <el-progress :text-inside="true" :stroke-width="14" :percentage="scope.row.migrate_process"
                  status="success"></el-progress>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDeleteCapture">确定</el-button>
        <el-button @click="batchDeleteCaptureVisible = false">取消</el-button>
      </span>
    </el-dialog>
    <ModalVersionUp :visible="visibleModalVersionUp" @visibleModalVersionUpChange="visibleModalVersionUpChange" />
  </div>
</template>
<script>
import productListView from '@/components/ProductListView'
import BatchEdit from '@migrate/readyToMigrate/components/BatchEdit'
import ModalVersionUp from '@migrate/readyToMigrate/components/ModalVersionUp'
import Search from '@migrate/readyToMigrate/components/Search'

import NewComer from '@/components/NewComer.vue'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import { mapActions, mapState } from 'vuex'
import moment from 'moment'
import utils from '@/common/utils'
import debounce from 'lodash/debounce'

export default {
  inject: ['reload'],
  mixins: [request],
  components: {
    productListView,
    BatchEdit,
    NewComer,
    ModalVersionUp,
    Search
  },
  data () {
    return {
      isMounted: false,
      bindShopList: [],
      tpProductList: [],
      captureOptionList: [],
      captureId: '-1',
      shopCaptureOptionList: [],

      search: {
        key: '',
        status: '-1',
        captureId: '-1',
        child_shop_user_id: 0,
        shopCaptureId: '-1'
      },
      pagination: {
        index: 1,
        size: 100,
        total: 0
      },
      capture: {},
      pageData: {},
      triggerShopCaptureRunOnce: {},
      statusStatistics: [],
      statusStatisticsTimer: null,
      migrateProductList: [],
      productStatusSyncTimer: null,
      timer: null,
      isLoadProduct: false,
      migratingStatus: [1, 2, 9],
      loginDialogVisible: false,
      slideDialogVisible: false,
      loginUrl: '',
      slideUrl: '',
      isForceGetCapture: 0,
      batchDeleteCaptureVisible: false,
      captureSelection: [],
      isFinishLogin: false,
      common,
      startMigrateBtnFixed: false,
      scrollWidth: 0,
      visibleModalVersionUp: false
    }
  },
  watch: {
    tpProductList (newVal) {
      this.$nextTick(this.scroll)
    }
  },
  computed: {
    ...mapState('migrate/readyToMigrate', [
      'migrateSetting',
      'userVersion',
      'versionTipType',
      'versionType'
    ]),
    productStatusMap () {
      return common.productStatusMap
    },
    captureStatusMap () {
      return common.captureStatusMap
    },
    captureShopStatusMap () {
      return common.captureShopStatusMap
    },
    statusOptions () {
      let options = []
      for (let key in this.productStatusMap) {
        options.push({
          value: key,
          label:
            this.productStatusMap[key] === '全部'
              ? `商品状态: ${this.productStatusMap[key]}`
              : this.productStatusMap[key]
        })
      }
      return options.sort((a, b) => a.value - b.value)
    },
    captureOptions () {
      let options = [{ value: '-1', label: '复制时间: 全部' }]
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
    captureNum () {
      if (this.capture.total_num === 999) {
        return '个数未知，请逐页复制'
      }
      return this.capture.total_num
    },
    isShowCaptureExtendOpt () {
      if (
        this.search.captureId.toString() === '-1' ||
        !this.capture.capture_id
      ) {
        return false
      }
      for (let i in this.captureOptionList) {
        let capture = this.captureOptionList[i]
        if (
          capture.capture_id.toString() === this.search.captureId.toString()
        ) {
          return false
        }
      }
      return true
    },
    shopCaptureOptions () {
      let options = [{ value: '-1', label: '被复制的店铺: 全部' }]
      for (let i in this.shopCaptureOptionList) {
        let capture = this.shopCaptureOptionList[i]
        options.push({
          value: capture.capture_id.toString(),
          label: `${capture.shop_name}`
        })
      }
      return options
    },
    selectIdList () {
      if (!this.isMounted) {
        return []
      }
      let retList = []
      const tpProductList = this.tpProductList || []
      for (let id in this.$refs.productListView.dicSelectId) {
        const product = tpProductList.find(
          (item) => Number(item.tp_product_id) === Number(id)
        )
        const filterOnlineProducts =
          this.migrateSetting.able_migrate_status_list || []
        // 对上线商品进行配置
        if (
          product &&
          this.$refs.productListView.dicSelectId[id] &&
          filterOnlineProducts.includes(product.status)
        ) {
          retList.push(id)
        }
      }
      return retList
    },
    selectIdBatchEditList () {
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
        if (
          [0, 1].includes(this.capture.status) &&
          this.capture.page_status === 4
        ) {
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
      // let check = 0
      this.statusStatistics.forEach(function (item) {
        let status = parseInt(item['status'])
        if ([1, 2].includes(status)) {
          running += item.count
        }
        // if (status === 9) {
        //   check += item['count']
        // }
      })
      if (running) {
        info += running + '个商品在搬家, 虎虎正在快马加鞭'
      }
      // if (check) {
      //   info += check + '个商品在后台审核'
      // }
      return info
    }
  },
  created () {
    this.search.captureId = (this.$route.query.captureId || '-1').toString()
  },
  mounted () {
    let elementList = document.querySelectorAll(
      'div.select-long div.el-select-dropdown__wrap'
    )
    for (let i = 0; i < elementList.length; ++i) {
      elementList[i].style.maxHeight = '300px'
    }
    this.isMounted = true
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.addEventListener('scroll', this.scroll)
  },
  beforeDestroy () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.removeEventListener('scroll', this.scroll)
  },
  activated () {
    if (this.$route.params.keepStatus) {
      if (this.$route.params.needRefresh) {
        this.$refs.productListView.clearSelect()
        this.updateInfo()
        this.getMigrateStatusStatistics()
      }
      return
    }
    this.resetInfo()
    if (this.$route.query.captureId) {
      this.search.captureId = this.$route.query.captureId.toString()
      if (
        this.$route.query.hasOwnProperty('pageId') &&
        this.$route.query.pageId !== 0
      ) {
        this.pagination.index = this.$route.query.pageId
      }
    }
    this.$refs.productListView.clearSelect()
    // this.getCaptureOptionList()
    // this.getBindShopList()
    this.updateInfo()
    this.updateQuery()
    this.getMigrateStatusStatistics()
    this.getMigrateSetting()
    this.userVersionQuery()
  },
  deactivated () {
    this.$refs.productListView.dialogEditVisible = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.productStatusSyncTimer) {
      clearTimeout(this.productStatusSyncTimer)
      this.productStatusSyncTimer = null
    }
    if (this.statusStatisticsTimer) {
      clearTimeout(this.statusStatisticsTimer)
      this.statusStatisticsTimer = null
    }
  },
  methods: {
    ...mapActions(['setSelectTPProductIdList']),
    ...mapActions('migrate/migrateSettingTemplate', [
      'removeTempTemplate',
      'migrateSetting'
    ]),
    ...mapActions('migrate/readyToMigrate', [
      'userVersionQuery',
      'getMigrateSetting'
    ]),
    calendarTime (strTime) {
      return moment(strTime).calendar()
    },
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
        const test = this.$refs.test
        const clientHeight = scrollEl.clientHeight
        const rect = test.getBoundingClientRect()
        const height = rect.height
        const dist = 5
        const disdance = height - clientHeight - dist
        const scrollTop = scrollEl.scrollTop
        if (scrollTop < disdance) {
          this.startMigrateBtnFixed = true
        } else {
          this.startMigrateBtnFixed = false
        }
      }
    }, 30),
    getBindShopList () {
      // 查询绑定店铺列表
      let self = this
      self.bindShopList = [{ shop_name: '多店铺切换:本店铺', user_id: 0 }]
      this.request('getUserBindList', {}, (data) => {
        let userDict = {}
        data.forEach((item) => {
          item['user_list'].forEach((user) => {
            if (!user['is_self']) {
              userDict[user['user_id']] = user
            }
            userDict[user['shop_name']] = `${user['shop_name']}`
          })
        })
        for (let userId in userDict) {
          self.bindShopList.push(userDict[userId])
        }
      })
    },
    // getCaptureOptionList () {
    //   this.request(
    //     'getCaptureOptionList',
    //     {},
    //     (data) => {
    //       this.captureOptionList = data.items
    //       this.shopCaptureOptionList = data.shop_capture_items
    //       this.handleCaptureOptionChange(this.search.captureId)
    //     },
    //     undefined,
    //     true
    //   )
    // },
    resetInfo () {
      this.captureId = '-1'
      this.pagination.index = 1
      this.pagination.size = 100
      this.pagination.total = 0
      this.search.key = ''
      this.search.status = '-1'
      this.search.captureId = '-1'
      this.search.child_shop_user_id = 0
      this.search.shopCaptureId = '-1'

      this.capture = {}
      this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
      clearTimeout(this.timer)
      this.timer = null
      this.pageData = {}
      this.triggerShopCaptureRunOnce = {}
      this.resetProductList()
      this.resetValidProductList()
      this.migrateProductList = []
      clearTimeout(this.productStatusSyncTimer)
      this.productStatusSyncTimer = null
      clearTimeout(this.statusStatisticsTimer)
      this.statusStatisticsTimer = null
    },
    resetProductList () {
      this.tpProductList = []
    },
    resetValidProductList () {
      this.$refs.productListView.validProductIdsList = []
      this.$refs.productListView.dicSelectId = {}
    },
    resetPagination () {
      this.pagination.size = 100
      this.pagination.index = 1
    },
    resetPaginationIndex () {
      this.pagination.index = 1
    },
    updateInfo () {
      let captureId = this.search.captureId
      const shopCaptureId = this.search.shopCaptureId

      console.log(captureId, shopCaptureId, captureId.toString() === '-1' && shopCaptureId.toString() === '-1', 'shopCaptureId')
      if (captureId.toString() === '-1' && shopCaptureId.toString() === '-1') {
        this.capture = {}
        this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
        this.getProductList(false)
      } else {
        this.getCapture(false)
      }
    },
    getProductList (isSilent = false) {
      this.isLoadProduct = true
      let captureId = this.search.captureId
      if (this.search.shopCaptureId.toString() !== '-1') {
        captureId = this.search.shopCaptureId
      }
      let params = {
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        keyword: this.search.key,
        status: this.search.status,
        capture_id: captureId,
        child_shop_user_id: parseInt(this.search.child_shop_user_id)
      }
      if (params['page_size'] === 0) {
        return
      }
      this.request(
        'getTPProductList',
        params,
        (data) => {
          this.tpProductList = data.items
          this.pagination.total = data.total
          this.isLoadProduct = false
          let migrateProduct = []
          let self = this
          let validTpProductIds = []
          this.tpProductList.forEach(function (product, index) {
            product.isMigrating = false
            product.index = index
            product.isMouseOver = false
            self.$set(product, 'isEdit', false)
            if (self.migratingStatus.includes(parseInt(product.status))) {
              migrateProduct.push(product.tp_product_id)
              product.isMigrating = true
            }
            if (parseInt(product.status) === 0) {
              validTpProductIds.push(product.tp_product_id)
            }
          })
          this.$refs.productListView.validProductIdsList = validTpProductIds
          this.$refs.productListView.selectAll()
          this.migrateProductList = migrateProduct
          this.getTPProductByIds()
          this.userVersionQuery()
        },
        undefined,
        isSilent
      )
    },
    forceGetCapture () {
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '复制商品',
          '点击',
          '店铺重新复制本页'
        ])
      }
      this.isForceGetCapture = 1
      if (this.capture.status === 2 && this.capture.page_status === 3) {
        let params = {}
        params['captureId'] = this.capture.capture_id
        params['pageId'] = this.pagination.index
        this.$router.push({
          path: '/migrate/productList',
          query: params
        })
        this.reload()
      } else if (this.capture.status === 3) {
        let self = this
        this.request(
          'capture',
          { urls: [this.capture.url], capture_type: 1 },
          (data) => {
            let params = {}
            params['captureId'] = data.capture_id
            self.$router.push({
              path: '/migrate/productList',
              query: params
            })
            self.reload()
          }
        )
      }
    },
    getCapture (isSilent = false) {
      clearTimeout(this.timer)
      this.timer = null
      let captureId = this.search.captureId

      if (this.search.shopCaptureId.toString() !== '-1') {
        captureId = this.search.shopCaptureId
      }

      if (captureId.toString() === '-1') {
        this.capture = {}
        this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
        return
      }

      let params = {
        keyword: this.search.key,
        status: this.search.status,
        capture_id: captureId,
        page_index: this.pagination.index,
        page_size: this.pagination.size,
        force: this.isForceGetCapture
      }
      this.request(
        'getCapture',
        params,
        (data) => {
          this.isForceGetCapture = 0
          this.capture = data
          this.shopCaptureType = data.shop_capture_type
          if (this.isShopCapture) {
            // 店铺抓取，上面的筛选都针对本页抓取
            this.pagination.size = data.page_size
            this.pagination.total = data.total_num
          }
          if (
            data.shop_capture_type === common.SHOP_CAPTURE_TYPE['client'] &&
            ![2, 1].includes(data.page_status)
          ) {
            if (
              !this.pageData.hasOwnProperty(data.page_id) ||
              this.pageData[data.page_id] == null
            ) {
              if (data.shop_async_link !== '') {
                this.requestJsonp(data.shop_async_link).then((res) => {
                  if (res.hasOwnProperty('rgv587_flag')) {
                    if (res.url.indexOf('login.taobao.com') !== -1) {
                      if (this.isFinishLogin) {
                        this.request(
                          'logCaptureShopFailure',
                          params,
                          (data) => {},
                          undefined,
                          true
                        )
                      }
                      this.loginUrl = res.url
                      this.loginDialogVisible = true
                    } else {
                      this.slideUrl = res.url
                      this.slideDialogVisible = true
                    }
                  } else {
                    this.pageData[data.page_id] = res
                  }
                  this.isFinishLogin = false
                })
              }
            }
          }
          if (this.loginDialogVisible || this.slideDialogVisible) {
            return
          }
          if (this.getCaptureStatus === 'finish') {
            this.getProductList(isSilent)
            return
          }
          // 定时任务的 isSilent = true
          let self = this
          this.timer = setTimeout(function () {
            if (
              self.isShopCapture &&
              self.getCaptureStatus === 'capture-item-waiting'
            ) {
              self.triggerShopCapture(true)
            }
            if (self.getCaptureStatus === 'capture-item') {
              self.getProductList(true)
            }
            self.getCapture(true)
          }, 5000)
        },
        undefined,
        isSilent
      )
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
      if (
        this.triggerShopCaptureRunOnce.hasOwnProperty(params['page_index']) &&
        this.triggerShopCaptureRunOnce[params['page_index']] === true
      ) {
        return
      }
      if (
        this.pageData.hasOwnProperty(params['page_index']) &&
        this.pageData[params['page_index']]
      ) {
        params['page_data'] = this.pageData[params['page_index']]
        this.triggerShopCaptureRunOnce[params['page_index']] = true
      }
      if (
        this.shopCaptureType === common.SHOP_CAPTURE_TYPE['client'] &&
        !params.hasOwnProperty('page_data')
      ) {
        return
      }
      this.request(
        'triggerShopCapture',
        params,
        (data) => {},
        undefined,
        isSilent
      )
    },
    handleFilterMigrateShop () {
      this.$refs.productListView.clearSelect()
      this.search.key = ''
      this.search.status = '-1'
      this.search.captureId = '-1'
      this.search.shopCaptureId = '-1'
      this.captureId = '-1'
      this.resetPaginationIndex()
      this.updateInfo()
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
      // this.handleFilterChange()
      this.updateQuery()
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
    visibleModalVersionUpChange () {
      this.visibleModalVersionUp = !this.visibleModalVersionUp
    },
    async toMigrate () {
      const userVersion = this.userVersion || (await this.userVersionQuery())
      const isFreeUpgrate = userVersion.is_free_upgrate
      const isSenior = userVersion.is_senior
      const limit = 10
      if (!isFreeUpgrate && this.selectIdList.length + userVersion.today_cnt > limit && !isSenior) {
        this.visibleModalVersionUp = true
      } else {
        this.removeTempTemplate()
        this.closeNewComer()
        this.setSelectTPProductIdList(this.selectIdList)
        this.$router.push({
          name: 'MigrateSettingPrice'
        })
      }
    },
    getTPProductByIds () {
      clearTimeout(this.productStatusSyncTimer)
      this.productStatusSyncTimer = null

      if (this.migrateProductList.length === 0) {
        return
      }
      let params = {
        tp_product_ids: this.migrateProductList,
        child_shop_user_id: Number(this.search.child_shop_user_id)
      }
      this.request(
        'getTPProductByIds',
        params,
        (data) => {
          // 筛选子店铺，请求延后返回导致状态不对，因此将这种请求丢掉
          if (params['child_shop_user_id'] !== Number(this.search.child_shop_user_id)) {
            return
          }
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
                product.goods_commit_id = item['goods_commit_id']
                product.status = item['status']
                product.isMigrating = item.isMigrating
                product.index = index
                product.isMouseOver = false
                product.migration_msg = []
                self.$set(product, 'isEdit', false)
                item.migration_msg.forEach(function (msg) {
                  product.migration_msg.push(msg)
                })
                product.migrate_process = item.migrate_process
              }
            })
          })
          this.migrateProductList = migrateProductList
          if (this.productStatusSyncTimer === null) {
            this.productStatusSyncTimer = setTimeout(function () {
              self.getTPProductByIds()
            }, 3000)
          }
        },
        undefined,
        true
      )
    },
    getMigrateStatusStatistics () {
      clearTimeout(this.statusStatisticsTimer)
      this.statusStatisticsTimer = null
      this.request(
        'getMigrateStatusStatistics',
        {},
        (data) => {
          this.statusStatistics = data.status_statistics
          let isFinish = true
          this.statusStatistics.forEach(function (value) {
            if ([1, 2].includes(parseInt(value.status))) {
              isFinish = false
            }
          })
          if (isFinish) {
            return
          }
          let self = this
          this.statusStatisticsTimer = setTimeout(function () {
            self.getMigrateStatusStatistics()
          }, 5000)
        },
        undefined,
        true
      )
    },
    calcProgressText (capture) {
      let count = 0
      for (let i in capture.status_statistics) {
        let item = capture.status_statistics[i]
        if (item.status === 2 || item.status === 3) {
          // 抓取完成 success or fail
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
      return Math.min(100, (count / capture.capture_num) * 100) + '%'
    },
    toProductsSync () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '商品源同步'])
      }
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
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '复制商品',
          '点击',
          '店铺复制完成登录'
        ])
      }
      this.isFinishLogin = true
      this.loginDialogVisible = false
      this.reload()
    },
    gotoLoginPage () {
      window.open(this.loginUrl)
    },
    finishSlide () {
      if (window._hmt) {
        window._hmt.push([
          '_trackEvent',
          '复制商品',
          '点击',
          '店铺复制完成滑动解锁'
        ])
      }
      this.slideDialogVisible = false
      this.reload()
    },
    batchDeleteCapture () {
      if (this.captureSelection.length === 0) {
        return
      }
      this.request(
        'deleteTPProduct',
        {
          tp_product_ids: this.captureSelection.map((arr) => arr.tp_product_id)
        },
        (data) => {
          this.batchDeleteCaptureVisible = false
          this.reload()
          if (window._hmt) {
            window._hmt.push([
              '_trackEvent',
              '复制商品',
              '点击',
              '完成批量删除'
            ])
          }
        }
      )
    },
    showBatchDeleteCapture () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '批量删除'])
      }
      this.batchDeleteCaptureVisible = true
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
    handleCaptureSelectionChange (val) {
      this.captureSelection = val
    },
    captureSelectAll () {
      if (this.captureSelection.length !== 0) {
        return
      }
      this.tpProductList.forEach((row) => {
        this.$refs.selectCaptureTable.toggleRowSelection(row)
      })
    },
    onOpenedCate () {
      this.$refs.categorySelectView.initCate()
    },
    toggleLoadingCnt (value) {
      this.loadingCnt = value
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    },
    versionTypeUp (btnText) {
      let routeData = this.$router.resolve({
        name: 'PaidRecharge',
        params: {
          active: 'VersionUp'
        }
      })
      window.open(routeData.href, '_blank')
    },
    onSearchChange (data) {
      // 店铺选择 状态选择 标题搜索 clearSelect resetPaginationIndex updateInfo
      // 复制时间 整店复制-复制名 child_shop_user_id = 0 handleCommonCaptureChange
      console.log(data, 'data')

      this.search = {...this.search, ...data.search, ...data.filter}
      console.log(this.search, 'this.search')

      this.pageData = {}
      this.triggerShopCaptureRunOnce = {}
      this.resetPagination()
      this.resetProductList()
      this.$refs.productListView.clearSelect()
      if (!this.isShopCapture) {
        // 店铺抓取，上面的筛选都针对本页抓取
        this.resetPaginationIndex()
      }
      this.updateInfo()
      this.updateQuery()
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/css/progress.less';

/deep/ .el-link.el-link--default.isSelect {
  color: #409eff;
  border-bottom: 1px solid #409eff;
}
/deep/ .el-form--inline .el-form-item {
  display: inline-block;
  margin-right: 10px;
  vertical-align: top;
  margin-bottom: 10px;
}

.ml-5 {
  margin-left: 5px;
}

.start-migrate-btn-fadeIn {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 2;
  animation: fadeIn ease 0.3s;
  margin: 0 40px;
}

.start-migrate-btn-fadeOut {
  transition: none;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
/deep/ .el-button--medium {
  padding: 7px 7px;
}
.price {
    color: #dc4041;
    font-weight: bold;
  }
</style>
