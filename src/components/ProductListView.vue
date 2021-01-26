<template lang="html">
    <div>
        <!-- <div class="text-left" style="padding: 10px 0">
            <el-row>
                <el-col :span="16">
                    商品列表&nbsp;&nbsp;
                    <el-checkbox v-if="validProductIdsList.length > 0"
                                 :indeterminate="isSelectIndeterminate" v-model="isCheckboxSelect"
                                 @change="toggleSelectAll"
                    >
                        全选可上传商品 ({{ validProductIdsList.length }})
                    </el-checkbox>
                </el-col>
                <el-col :span="8" style="text-align: right;">
                    <slot name="upperRight"></slot>
                </el-col>
            </el-row>
        </div> -->
        <el-table ref="productListTable" :data="tpProductList" row-key="tp_product_id" border style="width: 100%"
                  :row-style="{height:'68px'}"
                  @select-all="handleSelectAll" @select="handleSelect"
                  @selection-change="handleSelectionChange" :cell-style="cellStyle" @cell-mouse-enter="handleMouseEnter" @cell-mouse-leave="handleMouseOut"
        >
            <el-table-column width="12">
            </el-table-column>
            <el-table-column type="selection" :selectable="isSelectionEnable">
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
            <el-table-column label="价格" width="70">
                <template slot-scope="scope">
                    {{ scope.row.max_price / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="类目" width="120">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" placement="top" :content="scope.row.category_show">
                        <span> {{ getLastCategory(scope.row.category_show) }} </span>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column v-if="isSyncSource" label="最近同步" width="100">
                <template slot-scope="scope">
                    {{ getSyncStatus(scope.row) }}
                    <i v-if="scope.row.sync_source_status.status == taskResultStatus['running'] ||
                        scope.row.sync_source_status.status == taskResultStatus['ready']"
                       class="el-icon-loading"
                    ></i>
                    <el-tooltip manua="true" v-if="scope.row.sync_source_status.status == taskResultStatus['fail']"
                                class="item" effect="dark" placement="top" :content="scope.row.sync_source_status.msg"
                    >
                        <i class="el-icon-question"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column v-if="!isSyncSource" label="状态" width="120">
                <template slot-scope="scope">
                    <el-button type="info" size="mini" round v-if="[0,1].includes(scope.row.capture_status)">复制中</el-button>
                    <el-button :type="getStatusType(scope.row.status)" size="mini" round v-else-if="scope.row.status!==2" @click="productEdit(scope.row, true)" :disabled="scope.row.status === 9">
                      {{ productStatusMap[scope.row.status] }}
                      <i v-if="scope.row.isMigrating && scope.row.status!==2" class="el-icon-loading"></i>
                      <el-tooltip manual :value="scope.row.index === mouseOverIndex"  v-if="[productStatus.FAILED, productStatus.WAIT_MODIFY, productStatus.REJECT].includes(scope.row.status)" :disabled="![productStatus.FAILED, productStatus.WAIT_MODIFY, productStatus.REJECT].includes(scope.row.status)" class="item" effect="dark" placement="top">
                        <div slot="content" style="max-width: 180px;" v-if="scope.row.migration_msg[0].indexOf('发生未知错误') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">搬家失败可能是接口不稳定导致。建议15分钟后重新进行搬家，若再次失败请联系客服解决</ul>
                        </div>
                        <div slot="content" style="max-width: 180px;" v-else-if="scope.row.migration_msg[0].indexOf('商品创建失败31,承诺发货时间不在合理范围内') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p>当前选择的发货模式或承诺发货时间不符合官方规定，请根据官方规则进行调整。规则查询：</p>
                              <p><a style="color: navajowhite;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/105695">https://school.jinritemai.com/doudian/web/article/105695</a>（点击链接是可跳转的）</p>
                            </ul>
                        </div>

                        <div slot="content" style="max-width: 180px;" v-else-if="scope.row.migration_msg[0].indexOf('商品创建失败31,请重新选择品牌') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              <p>根据官方规定，该类目需要填写品牌，请上传品牌</p>
                              <p>查询哪些类目需填品牌：<a style="color: navajowhite;" target="view_window" href="https://school.jinritemai.com/doudian/web/article/101810">https://school.jinritemai.com/doudian/web/article/101810</a>（点击链接是可跳转的）</p>
                            </ul>
                        </div>
                        <div slot="content" style="max-width: 180px;" v-else-if="scope.row.migration_msg[0].indexOf('商品创建失败31,上传产品详情有缺失') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              商品详情图中有空白图，建议将空白图删除后再次搬家
                            </ul>
                        </div>
                        <div slot="content" style="max-width: 180px;" v-else-if="scope.row.migration_msg[0].match('规格值不能重复') && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              {{getSkuDuplicateFormatText(scope.row.migration_msg[0])}}
                            </ul>
                        </div>
                        <div slot="content" style="max-width: 180px;" v-else-if="scope.row.migration_msg[0].indexOf('创建商品失败30-2,transImgToLocal failed') > -1 && scope.row.status === 5"  >
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" :key="0">
                              轮播图+详情图+sku图不能超过50张
                            </ul>
                        </div>
                        <div slot="content" style="max-width: 180px;" v-else>
                            <ul style="padding: 0; margin: 0; margin-top: 6px;" v-for="(v,i) in scope.row.migration_msg" :key="i">
                              <span v-html="v">{{v}}</span>
                            </ul>
                        </div>
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                      <el-tooltip style="max-width: 50px;" manual :value="scope.row.index === mouseOverIndex" v-if="scope.row.status === 7" :disabled="scope.row.status !== 7" class="item" effect="dark" placement="top">
                          <div slot="content" style="max-width: 180px;">
                            <ul v-if="scope.row.migration_msg.length!=0" style="padding: 0; margin: 0;" v-for="(v,i) in scope.row.migration_msg" :key="i">{{v}}</ul>
                            <ul v-if="scope.row.migration_msg.length===1 && scope.row.migration_msg[0].length===0" style="padding: 0; margin: 0;">如需帮助请 <a href="/service" style="color: white;">联系客服</a>。</ul>
                          </div>
                          <i class="el-icon-question"></i>
                      </el-tooltip>
                    </el-button>
                    <div v-else>
                      {{ productStatusMap[scope.row.status] }}
                      <el-progress  :text-inside="true" :stroke-width="14" :percentage="scope.row.migrate_process" status="success"></el-progress>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" :width="isSyncSource ? 140 : 120" align="center">
                <template slot-scope="scope">
                    <div v-if="[0,1].includes(scope.row.capture_status)"></div>
                    <div v-else-if="isSyncSource">
                        <el-dropdown split-button type="primary" trigger="click" v-if="scope.row.sync_setting" size="small" @click="btnSyncClick(scope.row)" @command="handleCommand">
                          立即同步
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item :command="beforeHandleCommand('btnSettingClick', scope.row)" size="small">查看设置</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                        <el-button type="primary" v-if="!scope.row.sync_setting" size="small" @click="btnSettingClick(scope.row)"> 设置同步 </el-button>
                    </div>
                    <div v-else>
                      <el-button type="primary" size="small" v-if="isModifyEnable(scope.row) && [3, 4].includes(scope.row.status)" @click="productEdit(scope.row, false, false)">{{getButtonName(scope.row)}}</el-button>
                      <el-dropdown split-button type="primary" trigger="click" v-if="isModifyEnable(scope.row) && ![3, 4].includes(scope.row.status)" size="small" @click="productEdit(scope.row, false, false)" @command="handleCommand">
                        {{getButtonName(scope.row)}}
                        <el-dropdown-menu slot="dropdown" v-if="![3, 4].includes(scope.row.status)">
                          <el-dropdown-item :command="beforeHandleCommand('deleteProduct', scope.row)" size="small">删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                </template>
            </el-table-column>
        </el-table>

<!--        <el-dialog title="商品编辑" class="product-dialog" :visible.sync="dialogEditVisible" @opened="dialogOpened" @close="dialogClose" :before-close="dialogBeforeClose">-->
<!--            <product-edit-view ref="productEditView" @changeProduct="onChangeProduct" @closeDialog="closeDialog"></product-edit-view>-->
<!--        </el-dialog>-->
        <el-drawer
          title="商品编辑"
          :visible.sync="dialogEditVisible"
          :with-header="false"
          size="80%"
          @opened="dialogOpened"
          @close="dialogClose"
          :before-close="dialogBeforeClose"
        >
          <product-edit-new-view ref="productEditNewView" @changeProducts="onChangeProducts" @triggerDialogClose="triggerDialogClose"></product-edit-new-view>
        </el-drawer>
        <el-dialog
          title="删除复制记录"
          :show-close="false"
          :visible.sync="deleteProductVisible"
          width="30%">
          <p>只删除软件的记录，对小店后台商品没影响，删除后已复制的商品可进行再次复制搬家，您确定要操作吗？</p>
          <span slot="footer" class="dialog-footer">
            <el-button type="plain" @click="deleteProductVisible=false">取消</el-button>
            <el-button type="primary" @click="confirmDeleteProduct">确定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import productEditNewView from '@/components/ProductEditNewView.vue'
import common from '@/common/common.js'
import utils from '@/common/utils.js'
import request from '@/mixins/request.js'
export default {
  inject: ['reload'],
  mixins: [request],
  components: {
    productEditNewView
  },
  props: {
    tpProductList: Array,
    isSyncSource: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      deleteProductId: -1,
      deleteProductVisible: false,
      dialogEditVisible: false,
      curTPProduct: {},
      dicSelectId: {},
      validProductIdsList: [],
      isCheckboxSelect: false,
      isSelectAll: false,
      mouseOverIndex: -1
    }
  },
  computed: {
    productStatus () {
      return common.productStatus
    },
    productStatusMap () {
      return common.productStatusMap
    },
    taskResultStatus () {
      return common.taskResultStatus
    },
    isSelectIndeterminate () {
      let selectCnt = 0
      for (let id in this.dicSelectId) {
        if (this.dicSelectId[id]) {
          selectCnt++
        }
      }
      return selectCnt !== this.validProductIdsList.length && selectCnt !== 0
    },
    showTooltip (idx) {
      return idx === this.mouseOverIndex
    }
  },
  watch: {
    tpProductList: function (arrNew, arrOld) {
      this.$nextTick(function () {
        for (let i in arrNew) {
          let product = arrNew[i]
          if (this.dicSelectId[product.tp_product_id]) {
            this.$refs.productListTable.toggleRowSelection(product, true)
          } else {
            this.$refs.productListTable.toggleRowSelection(product, false)
          }
        }
      })
    }
  },
  methods: {
    getSkuDuplicateFormatText (msg) {
      msg = msg.replace('添加规格失败err=', '')
      msg = msg.replace('对应的规格值不能重复，请核对', '')
      return msg + '对应的sku名称重复，建议删除重复规格'
    },
    getLastCategory (category) {
      return utils.getLastCategory(category)
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
    beforeHandleCommand (command, product) {
      return {
        'command': command,
        'product': product
      }
    },
    handleCommand (command) {
      if (command.command === 'deleteProduct') {
        this.deleteProductVisible = true
        this.deleteProductId = command.product.tp_product_id
      } else if (command.command === 'btnSettingClick') {
        this.$emit('btnSettingClick', command.product)
      }
    },
    confirmDeleteProduct () {
      if (this.deleteProductId !== -1) {
        this.request('deleteTPProduct', { tp_product_ids: [this.deleteProductId] }, data => {
          // this.reload()
          // 删除操作不刷新页面
          let idx = this.tpProductList.findIndex(item => item.tp_product_id === this.deleteProductId)
          if (idx !== -1) {
            this.tpProductList.splice(idx, 1)
          }
        })
      }
      this.deleteProductVisible = false
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
      } else if (product.source === '一起做网店17zwd') {
        return require('@/assets/images/17.jpg')
      } else if (product.source === '抖音') {
        return require('@/assets/images/douyin.jpg')
      } else if (product.source === '拼多多') {
        return require('@/assets/images/yangkeduo.png')
      }
      return ''
    },
    getButtonName (product) {
      if (product.status === 8) {
        return '处理'
      } else if (product.status === 9) {
        return '查看'
      } else if (product.status === 7) {
        return '重试'
      } else if (product.status === 0 || product.status === 10) {
        return '编辑'
      } else if (product.status === 3 || product.status === 4) {
        return '删除'
      } else {
        return '修改'
      }
    },
    getSyncStatus (product) {
      if (parseInt(product.sync_source_status.status) === common.taskResultStatus['success']) {
        return product.sync_source_status.complete_time
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['fail']) {
        return '同步任务失败'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['ready']) {
        return '同步任务准备中'
      } else if (parseInt(product.sync_source_status.status) === common.taskResultStatus['running']) {
        return '同步任务进行中'
      }
      return ''
    },
    productEdit (product, isStatus = false, needJump = true) {
      if ([this.productStatus.CAPTURE_FAILED, this.productStatus.DELETED].includes(product.status) && isStatus) {
        return true
      } else if ([this.productStatus.REJECT, this.productStatus.DY_APPROVING].includes(product.status)) {
        if (product.status === this.productStatus.REJECT && !isStatus) {
          this.curTPProduct = product
          this.dialogEditVisible = true
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '复制商品', '点击', '编辑复制商品'])
          }
        } else {
          if (window._hmt) {
            window._hmt.push(['_trackEvent', '复制商品', '点击', '前往抖音后台查看提交的商品'])
          }
          if (product.goods_commit_id) {
            window.open('https://fxg.jinritemai.com/index.html#/ffa/goods/create?product_id=' + product.goods_commit_id)
          }
        }
      } else if (product.status === this.productStatus.CAPTURE_FAILED) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '重新复制新商品'])
        }
        let self = this
        this.request('capture', { urls: [product.url], capture_type: 0, tp_product_id: product.tp_product_id }, data => {
          let params = {}
          if (data.parent_id !== 0 && data.page_id !== 0) {
            params['captureId'] = data.parent_id
            params['pageId'] = data.page_id
          } else {
            params['captureId'] = data.capture_id
          }
          self.$router.push({
            path: '/productList',
            query: params
          })
          self.reload()
        })
      } else if ([3, 4].includes(product.status)) {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '删除复制商品'])
        }
        if (needJump === true) {
          window.open('https://fxg.jinritemai.com/index.html#/ffa/g/create?product_id=' + product.goods_commit_id)
        } else if ([this.productStatus.ONLINE, this.productStatus.SAVE_DRAFT].includes(product.status)) {
          this.deleteProductVisible = true
          this.deleteProductId = product.tp_product_id
        }
      } else {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '复制商品', '点击', '编辑复制商品'])
        }
        this.curTPProduct = product
        this.dialogEditVisible = true
      }
    },
    isSelectionEnable (row) {
      if (this.isSyncSource) {
        return true
      }
      // if (parseInt(row.status) === 0) {
      //   return true
      // }
      // if (parseInt(row.check) === 0 && (parseInt(row.status) === 5 || parseInt(row.status) === 10)) {
      //   return true
      // }
      return true
    },
    isModifyEnable (row) {
      // 兼容之前数据
      // if (row.status === 8 && !row.goods_commit_id) {
      //   return false
      // }
      if (row.status === 9) {
        return false
      }
      if ([1, 2].includes(parseInt(row.status))) {
        return false
      }
      return true
    },
    handleSelectionChange (selection) {
      this.$nextTick(function () {
        this.$emit('selectChange')
      })
    },
    handleSelect (selection, row) {
      let isSelect = false
      for (let i in selection) {
        if (selection[i].tp_product_id === row.tp_product_id) {
          isSelect = true
          break
        }
      }
      if (isSelect) {
        this.$set(this.dicSelectId, row.tp_product_id, 1)
      } else {
        this.$set(this.dicSelectId, row.tp_product_id, 0)
      }
    },
    handleSelectAll (selection) {
      if (selection.length === 0) {
        for (let i in this.tpProductList) {
          let id = this.tpProductList[i].tp_product_id
          this.$set(this.dicSelectId, id, 0)
        }
      } else {
        for (let i in selection) {
          let id = selection[i].tp_product_id
          this.$set(this.dicSelectId, id, 1)
        }
      }
    },
    toggleSelectAll (isSelect) {
      this.isSelectAll = !this.isSelectAll
      if (this.isSelectIndeterminate) {
        this.isSelectAll = true
//        this.isCheckboxSelect = true
      }
      if (this.isCheckboxSelect !== this.isSelectAll) {
        this.isCheckboxSelect = this.isSelectAll
      }
      for (let id in this.dicSelectId) {
        this.$set(this.dicSelectId, id, 0)
      }
      this.$refs.productListTable.clearSelection()
      if (this.isSelectAll) {
        for (let i in this.validProductIdsList) {
          let id = this.validProductIdsList[i]
          this.$set(this.dicSelectId, id, 1)
        }
        if (this.tpProductList.length > 0) { // 以免和 watch 中 tpProductList 冲突
          this.$refs.productListTable.toggleAllSelection()
        }
      }
    },
    clearSelect () {
      this.dicSelectId = {}
    },
    selectAll () {
      this.$nextTick(function () {
        this.isCheckboxSelect = true
        this.isSelectAll = true
        let dicProduct = {}
        for (let i in this.tpProductList) {
          let product = this.tpProductList[i]
          dicProduct[product.tp_product_id] = product
        }
        // 选中新商品，保持旧商品状态
        let dicValidProductId = {}
        for (let i in this.validProductIdsList) {
          let id = this.validProductIdsList[i]
          dicValidProductId[id] = 1
          if (!(id in this.dicSelectId)) {
            this.$set(this.dicSelectId, id, 1)
            if (id in dicProduct) {
              this.$refs.productListTable.toggleRowSelection(dicProduct[id], true)
            }
          }
        }
        // 处理本来在 validProductIdsList 中，后来不在的情况
        for (let id in this.dicSelectId) {
          if (this.dicSelectId[id] && !(id in dicValidProductId)) {
            this.$set(this.dicSelectId, id, 0)
          }
        }
      })
    },
    dialogOpened () {
      if (this.curTPProduct.tp_product_id) {
        this.$refs.productEditNewView.initList(this.curTPProduct, this.tpProductList.filter(product => [0, 5, 6, 8, 10].includes(product.status)))
      }
    },
    dialogClose () {
      this.$refs.productEditNewView.onClose()
    },
    triggerDialogClose () {
      this.dialogEditVisible = false
      this.$refs.productEditNewView.onClose()
    },
    dialogBeforeClose (done) {
      let self = this
      if (this.$refs.productEditNewView.isProductChange()) {
        this.$confirm('有未保存的修改，是否保存?', '提示', {
          confirmButtonText: '保存',
          cancelButtonText: '不保存'
        }).then(_ => {
          self.$refs.productEditNewView.closeAfterSave = true
          self.$refs.productEditNewView.onSaveProduct()
          // 保存完成后再触发关闭
          // done()
        }).catch(_ => { done() })
      } else {
        done()
      }
    },
    onChangeProduct (data) {
      let dicKeys = {
        status: 'status',
        migration_msg: 'migration_msg',
        price: 'max_price',
        title: 'title',
        category_id: 'category_id',
        category_show: 'category_show'
      }
      for (let key in data) {
        if (!data.hasOwnProperty(key)) continue
        if (key in dicKeys) {
          this.curTPProduct[ dicKeys[key] ] = data[key]
        }
      }
    },
    onChangeProducts (data) {
      let dicProduct = {}
      for (let i in this.tpProductList) {
        dicProduct[this.tpProductList[i].tp_product_id] = this.tpProductList[i]
      }
      let dicKeys = {
        status: 'status',
        migration_msg: 'migration_msg',
        check_error_msg_static: 'check_error_msg_static',
        price: 'max_price',
        title: 'title',
        category_id: 'category_id',
        category_show: 'category_show'
      }
      for (let i in data) {
        let dataItem = data[i]
        for (let key in dataItem) {
          if (!dataItem.hasOwnProperty(key)) continue
          if (key in dicKeys && dataItem.tp_product_id in dicProduct) {
            dicProduct[dataItem.tp_product_id][ dicKeys[key] ] = dataItem[key]
          }
        }
      }
    },
    btnSyncClick (item) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '商品源立即同步'])
      }
      this.$emit('btnSyncClick', item)
    },
    btnSettingClick (item) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '复制商品', '点击', '设置商品源同步'])
      }
      this.$emit('btnSettingClick', item)
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        var status = this.tpProductList[rowIndex].status
        var captureStatus = this.tpProductList[rowIndex].capture_status
        if ([0, 1].includes(captureStatus)) {
          return 'background-color:#909399; padding:0;'
        } else if ([5, 7, 8].includes(status)) {
          return 'background-color:#F56C6C; padding:0;'
        } else if (status === 6) {
          return 'background-color:#E6A23C; padding:0;'
        } else if ([3, 4].includes(status)) {
          return 'background-color:#67C23A; padding:0;'
        } else if (status === 10) {
          return 'background-color:#909399; padding:0;'
        }
      }
      return 'padding:0;'
    },
    handleMouseEnter (row, column, cell, event) {
      if (this.mouseOverIndex === row.index) {
        return
      }
      this.mouseOverIndex = row.index
    },
    handleMouseOut (row, column, cell, event) {
      this.mouseOverIndex = -1
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    /deep/ .el-drawer__body {
      height: 100%;
    }
</style>
