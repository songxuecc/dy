<template lang="html">
  <div v-loading="loadingCnt" class="readyToMigrate">
    <div>
      <div class="readyToMigrateContent" ref="readyToMigrateContent">
        <Search
          :capture="capture"
          @change="onSearchChange"/>
        <el-alert v-if="getMigrateInfo.length>0" :title="getMigrateInfo" type="success" :closable="false" center class="mt-5"/>
        <el-alert v-if="capture.capture_id && !isEmpty(capture)" type="success" :closable="false" center class="mt-5">
          <template slot='title'>
            <!-- 整店复制的提示语 -->
            <div v-if="isShopCapture" style="font-weight:normal">
              <span v-if="ShopsCaptureStatus === 6">
                {{ captureStatusMap[capture.page_status] }}
              </span>
              <span v-if="ShopsCaptureStatus === 1">【{{capture.shop_name}}】等待复制中...</span>
              <span v-if="ShopsCaptureStatus === 2">
                正在复制【{{capture.source}}】平台的【{{capture.shop_name}}】
                <span v-if="[2002,2004].includes(capture.tp_id)">
                  该平台现支持自动化抓取 <br/>已抓取{{capture.current_page_id === '' ? 0 : capture.current_page_id - 1}}页，正在抓取第{{capture.current_page_id}}页
                </span>
                <span v-else>
                  该平台暂不支持自动化抓取，需点击页码触发下一页的抓取~  <br/>已复制商品数{{capture.capture_num - (capture.left_seconds / 5)}}，待复制商品数{{capture.left_seconds / 5}}，本页复制完成预计需要{{getFormatLeftTime(capture.left_seconds)}}
                </span>
              </span>

              <span v-if="ShopsCaptureStatus === 3" >
                已复制【{{capture.shop_name}}】第{{pagination.index}}页:
                <span v-if="capture.status_statistics.length > 0">
                  共 {{ capture.capture_num }}条&nbsp;&nbsp;
                  <span v-for="(item, index) in capture.status_statistics" :key="index">
                    {{ captureStatusMap[item.status] }} {{ item.count }}条&nbsp;&nbsp;
                  </span>
                </span>
                (需手动点击页面底部的页码触发下一页的复制)
              </span>
              <span v-if="ShopsCaptureStatus === 4">【{{capture.shop_name}}】所有商品均复制完成！</span>
              <span v-if="ShopsCaptureStatus === 5">【{{capture.shop_name}}】无法继续复制，小虎猜测原因是：当前店铺所有商品已复制完成</span>
              <span v-if="ShopsCaptureStatus === 7">【{{capture.shop_name}}】已经抓取完成，共{{capture.total_num}}条数据，共{{Math.ceil(capture.total_num / capture.page_size)}}页，当前第{{pagination.index}}页</span>

              <!-- 淘宝自动抓取的状态逻辑判断 -->
              <span v-if="ShopsCaptureStatus === 10" >
                正在复制【{{capture.source}}】平台的<span v-if="capture.shop_name">【{{capture.shop_name}}】</span>店铺, 该平台现支持自动化抓取
                <br/><span> 等待复制中...</span>
                <div>
                  <hh-icon type="iconjinggao1"></hh-icon> 请勿关闭或操作本页面，如需进行操作请重新打开一个网页
                </div>
              </span>
              <span v-if="ShopsCaptureStatus === 11">
                正在复制【{{capture.source}}】平台的<span v-if="capture.shop_name">【{{capture.shop_name}}】</span>店铺, 该平台现支持自动化抓取
                <br/> <span v-if="capture.total_num ">共{{Math.ceil(capture.total_num / capture.page_size) }}页，正在抓取第{{capture.max_current_page_id}}页</span><span v-if="capture.left_seconds">，本页复制完成预计需要{{getFormatLeftTime(capture.left_seconds)}}</span>
                <div>
                  <hh-icon type="iconjinggao1"></hh-icon> 请勿关闭或操作本页面，如需进行操作请重新打开一个网页
                </div>
              </span>
              <span v-if="ShopsCaptureStatus === 12">
                【{{capture.source}}】平台的<span v-if="capture.shop_name">【{{capture.shop_name}}】</span>店铺, 抓取失败
              </span>

              <span v-if="ShopsCaptureStatus === 13">
                正在复制【{{capture.source}}】平台的<span v-if="capture.shop_name">【{{capture.shop_name}}】</span>店铺, 该平台现支持自动化抓取
                <br/> <span v-if="capture.total_num">共{{Math.ceil(capture.total_num / capture.page_size) }}页，第{{captureTaobaoShopPageIndex}}页抓取完成，正在准备抓取下一页中...</span>
                <div>
                  <hh-icon type="iconjinggao1"></hh-icon> 请勿关闭或操作本页面，如需进行操作请重新打开一个网页
                </div>
              </span>

            </div>
            <!-- 链接复制的提示语 -->
            <div v-else>
              <span v-if="capture.status_statistics.length == 0 && capture.status === 2 && capture.total_num === 0">
                本次抓取的总商品数为0
              </span>
              <span v-else-if="capture.status_statistics.length == 0">
                {{ captureStatusMap[capture.page_status] }}
              </span>
              <span v-if="capture.status_statistics.length > 0" v-for="(item, index) in capture.status_statistics"
                :key="index">
                {{ captureStatusMap[item.status] }} {{ item.count }} 条 &nbsp;&nbsp;
              </span>
              <span v-if="capture.status_statistics.length > 0">
                总共 {{ capture.capture_num }} 条
              </span>
            </div>
          </template>
          <!-- <el-tooltip
            class="item" effect="light" placement="bottom" :content="calcProgressText(capture)">

          </el-tooltip> -->

          <div class="progress-bar blue stripes" style="width: 200px;margin: 5px auto;" v-show="getCaptureStatus ==='capture-item' && ([0, 1].includes(this.capture.page_status) || [1].includes(this.capture.current_page_status))">
              <span :style="{ width: calcProgressVal(capture) }"></span>
            </div>
        </el-alert>
        <BatchEdit @onSizeChange="handleSizeChange" :pageSize="pagination.size"
          :selectIdBatchEditList="selectIdBatchEditList" @toggleLoadingCnt="toggleLoadingCnt"
          :tpProductList="tpProductList" @reload="getProductList" :isShopCapture="isShopCapture"
          v-if="search.child_shop_user_id == 0" />
        <product-list-view ref="productListView" :tpProductList="tpProductList"
          @sortByTime="sortByTime"
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
        <div v-if="isShopCapture">
          <!-- 非抖音淘宝店铺的整店抓取分页 -->
          <el-pagination :disabled="getCaptureStatus !== 'finish'" v-show="loadingCnt == 0" v-if="![2002,2004,1002,1001].includes(capture.tp_id)"
            @current-change="handleCurrentChange" :current-page="pagination.index" :page-size="pagination.size"
            layout="total, prev, pager, next, jumper" :total="pagination.total">
          </el-pagination>
          <!-- 淘宝、天猫 店铺的整店抓取分页 -->
          <el-pagination v-show="loadingCnt == 0" v-else-if="capture.tp_id === 1002 || capture.tp_id === 1001"
            @current-change="handleCurrentChangeTaobao" :current-page="pagination.index" :page-size="pagination.size"
            layout="total, prev, pager, next, jumper" :total="taoBaoPagination.total">
          </el-pagination>
          <!-- 自动抓取抖音店铺的分页 -->
          <el-pagination  v-show="loadingCnt == 0" v-else
            @current-change="handleCurrentChangeDy" :current-page="pagination.index" :page-size="pagination.size"
            layout="total, prev, pager, next, jumper" :total="getPageTotal">
          </el-pagination>
        </div>
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
      <div style="width:200px;" v-if="startMigrateBtnFixed"></div>
      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;margin-left:1px;">
        <div class="flex justify-c">
          <div v-if="currentSubsc.is_newcomer">
            <el-button :disabled="selectIdList.length == 0" type="primary" @click="toMigrate">
              <span style="line-height:21px">下一步: 修改价格</span>
              <el-badge v-if="selectIdList.length > 0" :value="selectIdList.length"></el-badge>
            </el-button>
            <NewComer type="下一步: 修改价格" ref="newComer" >
              <div class="left">
                <div style="width:180px " class="color-666 font-12">勾选待上线商品，并点击此处进行下一步操作</div>
                <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
              </div>
            </NewComer>
          </div>
          <el-tooltip popper-class="readyToMigrate-tooltip" :manual="true" ref="tooltip" effect="light"  placement="top-start" :value="tipShow" v-else>
            <div slot="content">
              <div style="width:172px" class="color-666 font-12 left mt-10" >
                勾选待上线商品，并点击此处进行下一步操作
              </div>
              <div @click="closeNewComerNext" class="right pointer underline primary mb-10">好的</div>
            </div>
            <el-button
              type="primary"
              @click="toMigrate"
              @mouseover.native="mouseover"
              @mouseout.native="mouseout">
              <span style="line-height:21px">下一步: 修改价格</span>
              <el-badge v-if="selectIdList.length > 0" :value="selectIdList.length"></el-badge>
            </el-button>
          </el-tooltip>

          <span v-if="is_migrate_new" style="display:inline-flex;flex-direction:column;">
            <el-popover
                width="200"
                style="text-align:left"
                trigger="hover">
                <h1>什么是极速搬家?</h1>
                <p>&nbsp;</p>
                <p>若点击此按钮，系统会自动跳过价格编辑页、模板编辑页</p>
                <p>&nbsp;</p>
                <p>价格和模板的填写设置与上一次搬家操作的设置保持一致</p>
                <span class="pointer" slot="reference" style="height:12px;">
                  <el-link type="primary" style="font-size: 10px;  margin-left: 10px;" :underline="false" @click="quickMigrate" :disabled="selectIdList.length == 0">跳过编辑，现在搬家</el-link>
                </span>
            </el-popover>
            <span class="pl-10 font-12">
              选择搬迁方式:
              <el-radio-group v-model="commit_type" class="pl-5" @change="onCommitType">
                  <el-radio :label="0">直接上线</el-radio>
                  <el-radio :label="1">草稿箱</el-radio>
                  <el-radio :label="2">仓库中</el-radio>
              </el-radio-group>
            </span>
          </span>
        </div>
        <div class="info flex filterOnlineProducts  align-c justify-c ">
          <span v-if="versionTipType === 'free_three_months' && userVersion && !userVersion.is_senior" class="pt-10">
            当前版本为试用版(每日搬家数限10个)。今日已搬 {{userVersion.today_cnt}}个，还能操作<span class="price bold"> {{ userVersion.left_cnt || 0  }} </span>个商品。建议您<a class="primary pointer bold" @click="versionTypeUp(versionTipType)"> 升级为高级版 </a>，升级后每日搬家数<span class="color-333 bold"> 无上限！ </span>
          </span>
          <span v-if="versionTipType === 'free_seven_days' && userVersion && !userVersion.is_senior" class="pt-10">
            当前版本为试用版(每日搬家数限10个)。今日已搬 {{userVersion.today_cnt}} 个，还能操作<span class="price bold"> {{ userVersion.left_cnt || 0  }} </span>个商品。建议您<a class="primary pointer bold" @click="versionTypeUp(versionTipType)"> 订购高级版 </a>，高级版每日搬家数<span class="color-333 bold"> 无上限！ </span>
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
      <div class="warning" style="font-size:16px">滑动到右侧后，如果滑块在加载转圈</div>
      <div class="warning" style="font-size:16px">可点击下方继续操作按钮</div>
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
    <ModalVersionUp ref="ModalVersionUp" />
    <ModalVersionUpOrder  ref="ModalVersionUpOrder" />
    <ModalPresellType  ref="ModalPresellType" />
  </div>
</template>
<script>
import productListView from '@/components/ProductListView'
import ModalVersionUp from '@migrate/readyToMigrate/components/ModalVersionUp'
import ModalVersionUpOrder from '@migrate/readyToMigrate/components/ModalVersionUpOrder'
import Search from '@migrate/readyToMigrate/components/Search'
import ModalPresellType from '@migrate/readyToMigrate/components/ModalPresellType'
import isEmpty from 'lodash/isEmpty'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
import { mapActions, mapState, mapGetters } from 'vuex'
import moment from 'moment'
import utils from '@/common/utils'
import debounce from 'lodash/debounce'
import Api from '@/api/apis'
import servises from '@servises'

export default {
  inject: ['reload'],
  mixins: [request],
  components: {
    productListView,
    BatchEdit: () => import('./components/BatchEdit'),
    ModalVersionUp,
    ModalVersionUpOrder,
    Search,
    ModalPresellType
  },
  data () {
    return {
      is_migrate_new: false,
      showTooltip: true,
      isMounted: false,
      bindShopList: [],
      tpProductList: [],
      captureOptionList: [],
      captureId: '-1',
      shopCaptureOptionList: [],
      isEmpty,
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
      taoBaoPagination: {
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
      order_by: 1,
      captureTaobaoShopPageIndex: undefined,
      commit_type: 1
    }
  },
  beforeRouteUpdate (to, from, next) {
    if (to.query.captureId) {
      this.search.captureId = (to.query.captureId || '-1').toString()
      this.$refs.productListView.clearSelect()
      this.updateInfo()
      this.getMigrateStatusStatistics()
    }
    next()
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    if (![10, 11, 13].includes(this.ShopsCaptureStatus)) {
      next()
    } else {
      const h = this.$createElement
      this.$confirm('', {
        message: h('p', null, [
          h('hh-icon', {
            props: {
              type: 'iconjinggao1'
            },
            style: 'margin-right:5px'
          }),
          h('span', null, '请勿关闭或操作本页面，如需进行操作请重新打开一个网页？ ')
        ]),
        confirmButtonText: '打开新页面',
        cancelButtonText: '留在本页面',
        type: 'warning',
        cancelButtonClass: 'readyToMigrate-cancelButtonClass',
        confirmButtonClass: 'readyToMigrate-confirmButtonClass',
        customClass: 'readyToMigrate-customClass'
      })
        .then(_ => {
          let routeData = this.$router.resolve({
            name: to.name
          })
          window.open(routeData.href, '_blank')
        })
        .catch(_ => {
          return false
        })
    }
  },
  watch: {
    tpProductList (newVal) {
      this.$nextTick(this.scroll)
    }

  },
  computed: {
    ...mapState('migrate/startMigrate', ['refresh']),
    ...mapState('migrate/readyToMigrate', [
      'migrateSetting',
      'userVersion',
      'versionTipType',
      'versionType'
    ]),
    ...mapGetters({
      isNew: 'getIsNew',
      currentSubsc: 'getCurrentSubsc'
    }),
    tipShow () {
      return this.tpProductList && this.tpProductList.length && this.selectIdList.length === 0 && this.showTooltip
    },
    getPageTotal () {
      let total = 10
      let currentPageId = this.capture.current_page_id
      if (currentPageId === '') {
        currentPageId = 0
      }

      if (this.capture.tp_id === 2002) {
        total = this.capture.total_num === 9999 ? parseInt(currentPageId) * 10 : this.capture.total_num
      }

      if (this.capture.tp_id === 2004) {
        total = this.capture.total_num === 9999 ? parseInt(currentPageId) * 20 : this.capture.total_num
      }
      return total
    },
    ShopsCaptureStatus () {
      if (!this.isShopCapture) return 0
      if (this.capture.tp_id === 1002 || this.capture.tp_id === 1001) {
        // 淘宝平台
        const captureTotalPageNumber = Math.ceil(this.capture.total_num / this.capture.page_size)
        // 总数据全部抓取完成
        const isShopFinish = this.getCaptureStatus === 'finish' && (captureTotalPageNumber === this.capture.max_current_page_id)
        // const isCurrentPage = this.pagination.index === this.capture.max_current_page_id
        // 抓取完成
        if (isShopFinish) {
          return 4
        } else {
          // 等待中
          if (this.getCaptureStatus === 'capture-item-waiting') {
            return 10
          // 抓取中
          } else if (this.getCaptureStatus === 'capture-item') {
            return 11
            //  失败
          } else if (this.capture.page_status === 3 && this.capture.status_statistics.length === 0) {
            return 12
            // 完成本页复制
          } else if (this.getCaptureStatus === 'finish') {
            return 13
          }
        }
      }
      if (this.capture.status_statistics.length === 0) {
        return 6
        // 等待抓取
      }

      if (this.capture.status === 2 && this.capture.page_status === 4) {
        return 1
        // 抓取中
      }

      if (this.capture.status === 2 && this.capture.page_status === 1) {
        return 2
        // 等待
      }
      if ([2002, 2004].includes(this.capture.tp_id)) {
        // 如果是抖音平台
        if (this.capture.current_page_status === 1) {
          // 等待
          return 2
        }
        if (this.capture.current_page_status === 2) {
          // 抖音全部抓取成功
          return 7
        }
      }
      if (this.capture.status === 2 && this.capture.page_status === 3 && [2002, 2004].includes(this.capture.tp_id)) {
        return 5
        // 失败
      }

      if (this.capture.status === 2 && this.capture.page_status === 3) {
        return 5
        // 失败
      }

      if (this.capture.status === 2 && this.capture.page_status === 2) {
        return 3
        // 本页抓取成功
      }

      if (this.capture.status === 2 && this.capture.page_status === 2) {
        if (this.capture.total_num && (this.capture.page_size * this.capture.page_id > this.capture.total_num)) {
          return 4
        }
        // 完成
      }
    },
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
        if (this.capture.current_page_id === '' && this.capture.page_status === 2 && this.capture.status === 2) {
          return 'finish'
        }

        if (this.capture.current_page_id === '' && (this.capture.status === 3 || this.capture.page_status === 3)) {
          return 'finish'
        }
        if (this.capture.current_page_id !== '' && this.capture.current_page_status === 2) {
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
    this.setCommitType()
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
    this.setCommitType()
  },
  beforeDestroy () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.removeEventListener('scroll', this.scroll)
  },
  activated () {
    this.setCommitType()
    if (this.$route.params.keepStatus) {
      if (this.$route.params.needRefresh) {
        this.$refs.productListView.clearSelect()
        this.updateInfo()
        this.getMigrateStatusStatistics()
      }
      return
    }
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.timer1) {
      clearTimeout(this.timer1)
      this.timer1 = null
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
    this.getNewMigrate()
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    this.$refs.productListView.dialogEditVisible = false
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.timer1) {
      clearTimeout(this.timer1)
      this.timer1 = null
    }
    if (this.productStatusSyncTimer) {
      clearTimeout(this.productStatusSyncTimer)
      this.productStatusSyncTimer = null
    }
    if (this.statusStatisticsTimer) {
      clearTimeout(this.statusStatisticsTimer)
      this.statusStatisticsTimer = null
    }
    window.removeEventListener('beforeunload', this.beforeunloadFn)
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
    ...mapActions('migrate/startMigrate', ['getCaptureShopCompleteList']),
    beforeunloadFn (e) {
      if ([10, 11, 13].includes(this.ShopsCaptureStatus)) {
        let msg = '您现在正在抓取淘宝店铺，离开就会停止抓取，在新页面操作即可继续抓取，点击确定打开新页面？'
        e = e || window.event
        if (e) {
          e.preventDefault()
          e.returnValue = msg
        }
        return msg
      }
      return false
    },
    getFormatLeftTime (seconds) {
      let minutes = parseInt(seconds / 60)
      seconds = seconds % 60
      let hours = parseInt(minutes / 60)
      minutes = minutes % 60
      if (hours > 0) {
        return hours + '小时' + minutes + '分钟' + seconds + '秒'
      } else if (minutes > 0) {
        return minutes + '分钟' + seconds + '秒'
      } else {
        return seconds + '秒'
      }
    },
    getNewMigrate () {
      this.request('is_new_migrate', {}, data => {
        this.is_migrate_new = data
      })
    },
    quickMigrate () {
      const self = this
      servises.migrateCreateCheck().then((data) => {
        // if (!data.is_valid) {
        //   self.$refs.ModalPresellType.open(data.template, self.selectIdList)
        // } else {
        //   self.request('migrate', {
        //     tp_product_ids: self.selectIdList,
        //     is_quick_migrate: 1,
        //     commit_type: self.commit_type
        //   }, (data) => {
        //     location.reload()
        //   })
        // }
        self.$refs.ModalPresellType.open(data.template, self.selectIdList)
      })
    },
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
        const readyToMigrateContent = this.$refs.readyToMigrateContent
        const clientHeight = scrollEl.clientHeight
        const rect = readyToMigrateContent.getBoundingClientRect()
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
      // const shopCaptureId = this.search.shopCaptureId
      // console.log(captureId, shopCaptureId, captureId.toString() === '-1' && shopCaptureId.toString() === '-1', 'shopCaptureId')
      // if (captureId.toString() === '-1' && shopCaptureId.toString() === '-1') {
      if (captureId.toString() === '-1') {
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
      // if (this.search.shopCaptureId.toString() !== '-1') {
      //   captureId = this.search.shopCaptureId
      // }
      let params = {
        order_by: this.order_by,
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
        }).catch(() => {})
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
            }).catch(() => {})
            self.reload()
          }
        )
      }
    },
    getCapture (isSilent = false, customPageIndex) {
      clearTimeout(this.timer)
      this.timer = null
      clearTimeout(this.timer1)
      this.timer1 = null
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
        page_index: customPageIndex || this.pagination.index,
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
                this.requestJsonp(data.shop_async_link + '&_ksTS=1630040629473_119&spm=a1z10.1-c.w5002-23138838278.1.1f782c8cPRyLED').then((res) => {
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
                }).catch(() => {
                  this.loginUrl = 'https://login.taobao.com/'
                  this.loginDialogVisible = true
                  this.isFinishLogin = false
                })
              }
            }
          }
          if (this.loginDialogVisible || this.slideDialogVisible) {
            return
          }

          if (this.getCaptureStatus === 'finish' && !(this.isShopCapture && [1002, 1001].includes(this.capture.tp_id))) {
            this.getProductList(isSilent)
            return
          }
          // 淘宝整店抓取
          if (this.isShopCapture && [1002, 1001].includes(this.capture.tp_id)) {
            const captureTotalPageNumber = Math.ceil(this.capture.total_num / this.capture.page_size)
            // 总数据全部抓取完成
            const isShopFinish = this.getCaptureStatus === 'finish' && (captureTotalPageNumber === this.capture.max_current_page_id)
            // 抓取页码为展示页码
            const isCurrentPage = this.pagination.index === this.capture.max_current_page_id
            // 总数据全部抓取完成 且 抓取页码为展示页码
            if (isShopFinish && isCurrentPage) {
              clearTimeout(this.timer)
              this.timer = null
              clearTimeout(this.timer1)
              this.timer1 = null
              this.taoBaoPagination.size = data.page_size
              this.taoBaoPagination.total = data.total_num
              this.getCaptureShopCompleteList({
                push: this.$router.push.bind(this.$router)
              })
              return this.getProductList(isSilent)
            // 总数据全部抓取完成 且 抓取页码非展示页码
            } else if (isShopFinish && !isCurrentPage) {
              clearTimeout(this.timer)
              this.timer = null
              clearTimeout(this.timer1)
              this.timer1 = null
              this.taoBaoPagination.size = data.page_size
              this.taoBaoPagination.total = data.total_num
              this.getCaptureShopCompleteList({
                push: this.$router.push.bind(this.$router)
              })
              return this.getProductList(isSilent)

            // 抓取失败
            } else if (this.ShopsCaptureStatus === 12) {
              clearTimeout(this.timer)
              this.timer = null
              clearTimeout(this.timer1)
              this.timer1 = null
              this.taoBaoPagination.size = data.page_size
              this.taoBaoPagination.total = data.total_num
              return false
            // 总数据未抓取完成
            } else {
              this.taoBaoPagination.size = data.page_size
              this.taoBaoPagination.total = data.max_current_page_id * data.page_size
              if (this.tpProductList && !this.tpProductList.length) {
                this.getProductList(true)
              }
              this.timer = setTimeout(() => {
                clearTimeout(this.timer)
                this.timer = null
                let pageIndex = this.capture.max_current_page_id || 1
                if (this.getCaptureStatus === 'capture-item-waiting' && isCurrentPage) {
                  console.log('等待中 且 抓取页码为展示页码')
                  if (this.shouldAddIndex) {
                    pageIndex = pageIndex + 1
                  } else {
                    this.resetProductList()
                  }
                  this.triggerTaobaoShopCapture(true, {
                    page_index: pageIndex,
                    page_size: data.page_size
                  })
                  this.shouldAddIndex = false
                  this.getProductList(true)
                } else if (this.getCaptureStatus === 'capture-item-waiting' && !isCurrentPage) {
                  console.log('等待中  且 抓取页码非展示页码')
                  if (this.shouldAddIndex) pageIndex = pageIndex + 1
                  this.triggerTaobaoShopCapture(true, {
                    page_index: pageIndex,
                    page_size: data.page_size
                  })
                  this.shouldAddIndex = false
                } else if (this.getCaptureStatus === 'capture-item' && isCurrentPage) {
                  console.log('抓取中  且 抓取页码为展示页码')
                  this.getProductList(true)
                } else if (this.getCaptureStatus === 'capture-item' && !isCurrentPage) {
                  console.log('抓取中  且 抓取页码非展示页码')
                } else if (this.getCaptureStatus === 'finish') {
                  console.log('本页抓取完成')
                  pageIndex = pageIndex + 1
                  // 表示是否triggerTaobaoShopCapture 下一页 如果trigger了 则 下一个getcapture的page_index + 1
                  this.shouldAddIndex = true
                  this.triggerTaobaoShopCapture(true, {
                    page_index: pageIndex,
                    page_size: data.page_size
                  })
                }
                this.timer1 = setTimeout(() => {
                  clearTimeout(this.timer1)
                  this.timer1 = null
                  this.getCapture(true, pageIndex)
                }, 2000)
              }, 5000)
              return false
            }
          } else {
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
                // self.triggerShopCaptureDy(true)
              }
              self.getCapture(true)
            }, 5000)
          }
        },
        undefined,
        isSilent
      )
    },
    triggerTaobaoShopCapture (isSilent = false, pagination) {
      console.log('执行 triggerTaobaoShopCapture')
      let captureId = this.search.captureId
      if (captureId.toString() === '-1') {
        return
      }
      let params = {
        capture_id: this.search.captureId,
        page_index: pagination.page_index,
        page_size: pagination.page_size
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

      if (!params.hasOwnProperty('page_data')) {
        return
      }
      this.captureTaobaoShopPageIndex = pagination.page_index
      this.request(
        'triggerShopCapture',
        params,
        (data) => {},
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
    handleCurrentChangeDy (val) {
      this.pagination.index = val
      this.triggerShopCaptureRunOnce[val] = false
      this.pageData[val] = null
      this.resetProductList()
      // this.capture = {}
      // this.shopCaptureType = common.SHOP_CAPTURE_TYPE['server']
      this.getProductList(false)
    },
    handleCurrentChangeTaobao (val) {
      this.pagination.index = val
      this.triggerShopCaptureRunOnce[val] = false
      this.pageData[val] = null
      this.resetProductList()
      this.getProductList(false)
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
    async toMigrate () {
      if (!this.selectIdList.length) {
        this.$message.warning('请选择商品！若商品状态是待修改，请先根据原因对商品进行修改')
        return false
      }
      this.onCommitType()
      const userVersion = this.userVersion || (await this.userVersionQuery())
      const isFreeUpgrate = userVersion.is_free_upgrate
      const isSenior = userVersion.is_senior
      const limit = 10
      const versionTipType = userVersion.version_type
      if (!isFreeUpgrate && this.selectIdList.length + userVersion.today_cnt > limit && !isSenior) {
        // 3个月试用引导内部升级
        // 7天试用引导在服务市场
        if (versionTipType === 'free_three_months') {
          this.$refs && this.$refs.ModalVersionUp.open()
        } else {
          this.$refs && this.$refs.ModalVersionUpOrder.open()
        }
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
            clearTimeout(this.statusStatisticsTimer)
            this.statusStatisticsTimer = null
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
    calcProgressVal () {
      if ([2002, 2004].includes(this.capture.tp_id)) {
        // 如果是抖音平台，进度条固定
        if (this.capture.current_page_status === 2) {
          return 100 + '%'
        } else {
          return parseInt((this.capture.current_page_id - 1) * 100 / this.capture.current_page_id) + '%'
        }
      }

      if (parseInt(this.capture.capture_num) === 0) {
        return 0
      }
      let count = 0
      for (let i in this.capture.status_statistics) {
        let item = this.capture.status_statistics[i]
        if (item.status === 2 || item.status === 3) {
          count += item.count
        }
      }
      return Math.min(100, (count / this.capture.capture_num) * 100) + '%'
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
      this.$refs.newComer && this.$refs.newComer.close && this.$refs.newComer.close()
    },
    closeNewComerNext () {
      this.showTooltip = false
    },
    mouseover () {
      this.showTooltip = true
    },
    mouseout () {
      this.showTooltip = false
    },
    closeShopCapture () {
      this.$refs.newComerShop.close && this.$refs.newComerShop.close()
    },
    async versionTypeUp (btnText) {
      if (btnText === 'free_seven_days') {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '试用限制优化20210507', '按钮点击', '7天试用限制_底部文案提示点击'])
        }
        await Api.hhgjAPIs.statisticsEventCreate({
          event_type: 'free_seven_days',
          action: 'readyToMigrate_text'
        })
        window.open('https://fuwu.jinritemai.com/detail/purchase?service_id=42&sku_id=863&from=fuwu_market_home')
      } else {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '试用限制优化20210507', '按钮点击', '3个月试用限制_底部文案提示点击'])
        }
        await Api.hhgjAPIs.statisticsEventCreate({
          event_type: 'free_three_months',
          action: 'readyToMigrate_text'
        })
        let routeData = this.$router.resolve({
          name: 'PaidRecharge',
          params: {
            active: 'VersionUp'
          }
        })
        window.open(routeData.href, '_blank')
      }
    },
    onSearchChange (data) {
      // 店铺选择 状态选择 标题搜索 clearSelect resetPaginationIndex updateInfo
      // 复制时间 整店复制-复制名 child_shop_user_id = 0 handleCommonCaptureChange
      this.search = {...this.search, ...data.search, ...data.filter}
      if (data.filter.shopCaptureId.toString() !== '-1') {
        this.search.captureId = data.filter.shopCaptureId
      }
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
    },
    sortByTime (orderBy) {
      this.order_by = orderBy
      this.updateInfo()
    },
    onCommitType () {
      localStorage.setItem('migrate_productList_commit_type', this.commit_type)
    },
    async setCommitType () {
      const commitType = localStorage.getItem('migrate_productList_commit_type')
      if (typeof commitType !== 'string') {
        const data = await Api.hhgjAPIs.getTemplate()
        this.commit_type = data.commit_type
        this.onCommitType()
      } else {
        this.commit_type = Number(commitType)
      }
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
<style lang="less">
.readyToMigrate-cancelButtonClass{
    padding: 10px;
    font-size: 12px;
    margin-right: 10px;
    width: 110px;

}

.readyToMigrate-confirmButtonClass{
    padding: 10px;
    font-size: 12px;
    width: 110px;
}

.readyToMigrate-customClass {
  padding-bottom: 25px;

  .el-message-box__btns {
    text-align: center;
  }
  .el-message-box__content {
    .el-message-box__message {
      padding-left: 0;
    }
    p {
      font-size: 18px;
      margin: 15px 0 10px;
      text-align: center;
    }
    .el-icon-warning {
      display: none;
    }
  }
}
</style>

<style lang="less">
    .readyToMigrate-tooltip.is-light {
        border:0;
        border-bottom: 10px solid #1D8FFF;
        position: relative;
        z-index: 1;
        box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
        width: 208px;
        padding:10px 14px 0;
    }
    .readyToMigrate-tooltip.is-light[x-placement^=top] .popper__arrow::after {
      position: absolute;
      content:"";
      width: 0;
      height: 0;
      border-top: 5px solid #ffffff;
      bottom:4px;
    }
    .readyToMigrate-tooltip[x-placement^=top] .popper__arrow {
      bottom: -15px;
      border-top-color: #1D8FFF;
      border-bottom-width: 0;
    }
    .readyToMigrate-tooltip.is-light[x-placement^=top] .popper__arrow {
        border-top-color: #1D8FFF;
    }
    .readyToMigrate-tooltip .popper__arrow {
        border-width: 9px;
    }

    .readyToMigrate-tooltip[x-placement^=top] .popper__arrow {
      bottom: -16px;
      border-top-color: #1D8FFF;
      border-bottom-width: 0;
    }
    .readyToMigrate-tooltip::after {
      content:"";
      position: absolute;
      left: 0;
      right: 0;
      bottom: -7px;
      top: 0;
      margin:auto;
      background:#fff;
      border-radius: 3px;
      z-index: -1;
    }

</style>
