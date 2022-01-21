<template lang="html">
  <div style="position: relative;">
    <!-- <help-tips v-if="activeName === 'shop'" helpLink="captureShop" words="怎么获取店铺链接？" positionT="10" positionR="10">
    </help-tips> -->
    <SettingAlert/>
    <span
      class="click mr-20 pointer"
      v-if="activeName === 'single'"
      style="
        align-content:right;
        position: absolute;
        left: 450px;
        top: 56px;
        z-index:1" @click="gobind('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')"><hh-icon type="icontishi-dengpao" ></hh-icon>多商品复制教程</span>
    <span
      class="click mr-20 pointer"
      v-if="activeName === 'shop'"
      style="
        align-content:right;
        position: absolute;
        left: 450px;
        top: 56px;
        z-index:1" @click="gobind('https://www.yuque.com/huxiao-rkndm/ksui6u/tm5odl')"><hh-icon type="icontishi-dengpao" ></hh-icon>整店复制教程</span>
    <span
      class="click mr-20 pointer"
      v-if="activeName === 'bindCopy'"
      style="
        align-content:right;
        position: absolute;
        left: 450px;
        top: 56px;
        z-index:1" @click="gobind('https://www.yuque.com/huxiao-rkndm/ksui6u/dsibrc')"><hh-icon type="icontishi-dengpao" ></hh-icon>绑定复制教程</span>
    <el-tabs v-model="activeName">
      <el-tab-pane v-loading="loadingCnt" label="多商品复制" name="single">
        <el-input type="textarea" :rows="10" :placeholder="`输入其他平台的商品链接地址，换行分隔多个链接，最多不超过${limit}个`" class="mb-20"
          @input="changeCaptureUrl" v-model="textCaptureUrls">
        </el-input>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt" label="整店复制" name="shop" class="relative" style="height:320px ">
        <el-input type="textarea" :rows="4" placeholder="输入其他平台的店铺地址" v-model="textCaptureShopUrls" class="my-textarea mb-20 shopCopyTexteare" style="resize: none;" @focus="handleFocus">
        </el-input>
        <TablemigrateHistory class="TablemigrateHistory"  ref="TablemigrateHistory" @change="handleTablemigrateHistory"/>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt" label="导入复制" name="file">
        <div style="width: 640px; margin: auto;margin-bottom:20px">
          <el-upload
            class="capture-file-upload"
            @click.native="clearFiles"
            :action="uploadAction"
            :headers="getTokenHeaders"
            :data="{'upload_type': 'local'}"
            :before-upload="uploadBeforeUpload"
            :on-progress="uploadOnProgress"
            :on-success="uploadOnSuccess"
            :on-change="uploadChange"
            style=""
            :limit=1
            :show-file-list="false"
            ref="upload"
            :auto-upload="false"
            :multiple="false"
            :on-preview="handlePreview"
            :disabled="!this.isAuth">
            <hh-icon type="iconshangchuanxiazai" class="el-icon-upload"
              style="font-size:52px; margin-top: 60px; margin-bottom: 18px;" />
            <div class="el-upload__text">点击此处，上传需要的文件</div>
            <div class="el-upload__tip left" slot="tip"><span style="color: #E02020;">*</span>
              <span>只能上传CSV文件，且不超过100KB，一次最多 200条，一天最多支持 10000 条<span class="click" style="margin-left: 10px" @click="downloadCSV">下载示例文件</span></span>
              <div class="info mt-5 color-success">导入复制前可以通过<span class="click" @click="openProductCollection">商品采集功能</span>采集商品链接</div>
              <PayCharge  class="mt-5"/>
            </div>
          </el-upload>
          <div class="mt-20 font-16 color-success" v-if="fileList.length">{{fileList[0].name}} 上传成功，请点击 下一步：复制设置</div>
        </div>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt"  name="bindCopy" class="left " style="min-height:120px">
        <span slot="label" class="relative">绑定复制 <span class="tutorials" style="position:absolute;right:-65px;top:-10px;transform:scale(0.8)">多店铺必备</span></span>
        <div class="flex column align-c" v-if="!userBindList.length ">
          <ElTableEmpty msg="您还未进行店铺绑定，无法操作哦～" />
          <el-link type="primary" size="mini" @click="gotoBindShop" :underline="false" class="prompt-link underline"
            style="margin-top:10px;">去绑定店铺</el-link>
        </div>
        <el-radio-group v-model="binCopyActiveName" size="small" class="mb-10 bindCopyRadio" v-if="userBindList.length" @change="handleBinCopyActiveNameChange">
          <el-radio-button label="status">按状态
          </el-radio-button>
          <el-radio-button label="id" >按ID
          </el-radio-button>
        </el-radio-group>
        <div style="padding-top:4px;display:inline-block"  v-if="userBindList.length "></div>

        <el-form :inline="true" :model="modelBindCopy" class="start-migrate-setting flex wrap" size="medium" ref="modelCopyForm" :rules="modelBindCopyRules"
              v-if="userBindList.length">
              <el-form-item label="被复制的店铺" :style="{position:'relative','padding-bottom': '45px','margin-right':'30px'}" required >
                <el-select v-model="target_user_id" placeholder="请选择店铺" style="width:290px;margin-right:5px" clearable @clear="clearTargetUserId">
                  <el-option :label="item.shop_name" :value="item.user_id" v-for="item in userBindList" :key="item.user_id" :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-button type="text" @click="gotoBindShop" size="small">绑定新店铺</el-button>
                <div class="info" v-if="target_user_id" style="position:absolute;left:0;bottom:-12px;width:500px;transform: translateY(100%);">
                  <div  class="font-12">
                      <div class="font-12" style="width:350px;word-break:break-all;line-height:18px">{{bandShopTip.shop_name}}&nbsp;最近更新时间{{bandShopTip.last_goods_sync_time}}
                        <p  v-if="!syncText" v-loading="syncLoading" @click="handleSyncProducts(target_user_id)">
                          <span class="fail"><hh-icon type="iconjingshi1"></hh-icon>复制前需进行店铺数据同步，</span> <span class="primary">点击开始同步</span>
                        </p>
                        <p class="primary" v-if="syncText" v-loading="syncLoading"  :style="syncText && syncText.includes('同步中')? '':''">{{syncText}}
                          <span v-if="syncText === '同步中'"><i class="el-icon-loading"></i></span>
                        </p>
                      </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="状态选择" v-show="binCopyActiveName === 'status'" >
                <el-select v-model="modelBindCopy.status" placeholder="商品状态选择" style="width:257px;margin-right:30px">
                  <el-option label="全部商品" :value="0"></el-option>
                  <el-option label="在售中商品" :value="1"></el-option>
                  <el-option label="仓库中商品" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="form-textarea" label="商品ID" v-show="binCopyActiveName === 'id'"  prop="goods_ids">
                <el-input
                  :value="modelBindCopy.goods_ids"
                  @input="formatGoods_ids($event)"
                  type="textarea"
                  :autosize="{ minRows: 2,maxRows: 15}"
                  resize="none"
                  size="small"
                  :placeholder="placeholder"
                  style="width: 357px;margin-right:30px"/>
              </el-form-item>
              <el-form-item label="是否过滤已复制商品" >
                <el-select v-model="modelBindCopy.filter_copied_product" placeholder="商品状态选择" style="width:263px;" >
                  <el-option label="过滤" :value="1"></el-option>
                  <el-option label="不过滤" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
      </el-tab-pane>
    </el-tabs>

    <!-- 多商品复制 -->
    <div v-if="activeName === 'single'">
      <SupportPlatForm :list="platformIconsUrl" />
      <PayCharge  class="mt-10"/>
      <div class="startCopyBtn flex align-c" >
        <div style="height:50px" >
          <el-button type="primary" @click="gotoSetting(onCaptureUrls,captureUrlNums)"  style="height:50px;font-size:16px" >
            <span >下一步：复制设置</span>
            <el-badge :value="captureUrlNums" v-if="captureUrlNums"></el-badge>
          </el-button>
        </div>
        <el-popover trigger="hover" width="200" style="text-align:left" placement="top-start">
          <div class="left font-12" effect="light">
            <div>若点击此按钮，系统会自动跳过复制设置，直接复制商品</div>
            <br/>
            <div>商品的复制设置与上一次复制的操作保持一致</div>
          </div>
           <el-button type="text"  class="click ml-10" slot="reference" @click="onCaptureUrls" :disabled="isStartCapture || settingDataLoading">跳过设置，直接复制</el-button>
        </el-popover>
      </div>
    </div>
    <!-- 整店复制 -->
    <div v-if="activeName === 'shop'">
      <SupportPlatForm :list="platformIconsStore"  class="shopCopySupportPlatForm"/>
      <PayCharge  class="mt-10"/>
      <div class="startCopyBtn flex align-c" >
        <div style="height:50px" >
          <el-button type="primary" @click="gotoSetting(onCaptureShops,textCaptureUrls)"   style="height:50px;font-size:16px" >下一步：复制设置</el-button>
        </div>

        <el-popover trigger="hover" width="200" style="text-align:left" placement="top-start">
          <div class="left font-12" effect="light">
            <div>若点击此按钮，系统会自动跳过复制设置，直接复制商品</div>
            <br/>
            <div>商品的复制设置与上一次复制的操作保持一致</div>
          </div>
          <el-button type="text"  class="click ml-10" slot="reference" @click="onCaptureShops" :disabled="isStartCapture || settingDataLoading">跳过设置，直接复制</el-button >
        </el-popover>

      </div>
    </div>
     <!-- 导入复制 -->
    <div class="startCopyBtn flex align-c" v-if="activeName === 'file'">
      <div style="height:50px">
        <el-button type="primary" @click="gotoSettingFile(onCaptureBindCopy,true)"  style="height:50px;font-size:16px" class="ralative" >下一步：复制设置
          <span v-if="productListCheckLoading" class="info" style="position:absolute;right:-114px;top:12px">正在查询，请稍后...</span>
        </el-button>
        <el-popover trigger="hover" width="200" style="text-align:left" placement="top-start">
          <div class="left font-12" effect="light">
            <div>若点击此按钮，系统会自动跳过复制设置，直接复制商品</div>
            <br/>
            <div>商品的复制设置与上一次复制的操作保持一致</div>
          </div>
          <el-button type="text" class="click ml-10"  slot="reference" @click="onCaptureFile" :disabled="isStartCapture || settingDataLoading || productListCheckLoading" :loading="productListCheckLoading">跳过设置，直接复制</el-button>
        </el-popover>
      </div>
    </div>
    <!-- 绑定复制 -->
    <div class="startCopyBtn flex align-c" v-if="activeName === 'bindCopy' && userBindList.length ">
      <div style="height:50px">
        <el-button type="primary" @click="gotoSetting(onCaptureBindCopy,true)"  style="height:50px;font-size:16px" class="ralative">下一步：复制设置
          <span v-if="productListCheckLoading" class="info" style="position:absolute;right:-114px;top:12px">正在查询，请稍后...</span>
        </el-button>
        <el-popover trigger="hover" width="200" style="text-align:left" placement="top-start">
          <div class="left font-12" effect="light">
            <div>若点击此按钮，系统会自动跳过复制设置，直接复制商品</div>
            <br/>
            <div>商品的复制设置与上一次复制的操作保持一致</div>
          </div>
          <el-button type="text" class="click ml-10"  slot="reference" @click="onCaptureBindCopy" :disabled="isStartCapture || settingDataLoading || productListCheckLoading" :loading="productListCheckLoading">跳过设置，直接复制</el-button>
        </el-popover>
      </div>
    </div>
    <BindCopyTip v-if="activeName === 'bindCopy'"/>
    <el-dialog title="安装及使用教程" :show-close="true" :visible.sync="importFilePromptVisibe" width="60%">
      <iframe
        v-bind:src="'https://view.officeapps.live.com/op/embed.aspx?wdAccPdf=1&ui=zh-cn&rs=zh-cn&src=https://hhgj-manual.oss-cn-shanghai.aliyuncs.com/怎么安装及使用虎虎复制助手插件？.docx'"
        width='100%' height='800px;' frameborder='0'></iframe>
    </el-dialog>
    <ModalBindCopyIdSearch :ids="lostGoodsIds" ref="ModalBindCopyIdSearch" @continueCopy="continueCopy"/>
    <ModalCharge ref="ModalCharge" />
    <ModalChargeOrder  ref="ModalChargeOrder" />
    <ModalChargeTip  ref="ModalChargeTip" />
  </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions, mapMutations, createNamespacedHelpers, mapState } from 'vuex'
import common from '@/common/common.js'
import helpTips from '@/components/HelpTips.vue'
import SupportPlatForm from '@migrate/startMigrate/components/SupportPlatForm'
import BindCopyTip from '@migrate/startMigrate/components/BindCopyTip'
import ModalBindCopyIdSearch from '@migrate/startMigrate/components/ModalBindCopyIdSearch'
import StartCopyTips from '@migrate/startMigrate/components/StartCopyTips'
import BindCopyTips from '@migrate/startMigrate/components/BindCopyTips'
import SettingAlert from '@migrate/startMigrate/components/SettingAlert'
import { platformIconsUrl, platformIconsStore } from '@migrate/startMigrate/config'
import Api from '@/api/apis'
import TablemigrateHistory from '@migrate/startMigrate/components/TablemigrateHistory'
import ModalCharge from '@migrate/startMigrate/components/ModalCharge'
import ModalChargeOrder from '@migrate/startMigrate/components/ModalChargeOrder'
import ModalChargeTip from '@migrate/startMigrate/components/ModalChargeTip'
import PayCharge from '@migrate/startMigrate/components/PayCharge'
import debounce from 'lodash/debounce'

const {
  mapActions: mapActionsPaidRecharge
} = createNamespacedHelpers('customerSetting/paidRecharge')

export default {
  mixins: [request],
  data () {
    return {
      fileList: [],
      syncText: '',
      syncTimer: null,
      syncLoading: false,
      limit: 200,
      textCaptureUrls: '',
      textCaptureShopUrls: '',
      activeName: 'single',
      placeholder: `商品ID查询,多个查询请换行或空格依次输入\n最多支持1000个id查询`,
      captureUrlNums: 0,
      uploadAction: '/api/importCaptureFile',
      importFilePromptVisibe: false,
      isStartCapture: false,
      platformIconActive: '',
      platformIconsUrl,
      platformIconsStore,
      props: { multiple: true, expandTrigger: 'hover' },
      modelBindCopy: {
        status: 0,
        goods_ids: '',
        filter_copied_product: 0
      },
      userBindList: [],
      target_user_id: '',
      bandShopTip: {},
      binCopyActiveName: 'status',
      ModalBindCopyIdSearchShow: false,
      lostGoodsIds: [],
      productListCheckLoading: false,
      showStartCopyTips: false,
      showBindCopyTips: false
    }
  },
  components: {
    helpTips,
    SupportPlatForm,
    BindCopyTip,
    ModalBindCopyIdSearch,
    StartCopyTips,
    BindCopyTips,
    SettingAlert,
    TablemigrateHistory,
    ModalCharge,
    ModalChargeOrder,
    PayCharge,
    ModalChargeTip
  },
  activated () {
    this.getUserBindList()
    this.getUserAccountQuery()
    // this.$refs.setting.getMigrateSetting()
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName || 'single'
    }

    if (this.target_user_id) {
      this.syncText = ''
      clearTimeout(this.syncTimer)
      this.syncTimer = null
      // this.getSyncStatus(this.target_user_id)
    }
    if (this.activeName === 'file') {
      this.$refs.upload && this.$refs.upload.clearFiles()
      this.fileList = []
    }

    // 点击其他区域时, 隐藏店铺复制的 列表记录
    // document.addEventListener('click', event => {
    //   var shopCopyTexteare = document.querySelector('.shopCopyTexteare')
    //   var shopCopyHistory = document.querySelector('.shopCopyHistory')
    //   var otherDom = event.target
    //   if (shopCopyHistory && shopCopyTexteare) {
    //     if (shopCopyTexteare === otherDom || shopCopyTexteare.contains(otherDom) || shopCopyHistory === otherDom || shopCopyHistory.contains(otherDom)) {
    //     } else {
    //       this.handleBlur()
    //     }
    //   }
    // })
  },
  deactivated () {
    this.syncText = ''
    clearTimeout(this.syncTimer)
    this.syncTimer = null
  },
  beforeDestroy () {
    this.syncText = ''
    clearTimeout(this.syncTimer)
    this.syncTimer = null
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    }),
    ...mapGetters(['getTokenHeaders', 'getCaptureIdList', 'getUserId']),
    ...mapState('migrate/readyToMigrate', [
      'userVersion'
    ]),
    subscItemLevelMap () {
      return common.subscItemLevelMap
    },
    modelBindCopyRules () {
      if (this.binCopyActiveName !== 'id') return null
      const checkLength = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入商品ID,且商品ID只可以是数字'))
        } else {
          const reg = /[^\d\n\s]/g
          const regValue = value.replace(reg, '')
          const goodsIds = regValue.split(/[\s\n]/).filter(item => item).map(item => item.trim())
          const goodsIdsSet = [...new Set(goodsIds)]
          const limit = 1000
          if (goodsIdsSet.length > limit) {
            callback(new Error(`最多支持${limit}个商品ID`))
          } else {
            callback()
          }
        }
      }
      return {
        goods_ids: [
          {required: true, message: '请输入ID', trigger: 'blur'},
          {validator: checkLength, trigger: ['blur', 'change']}
        ]
      }
    }
  },
  watch: {
    activeName (newVal) {
      if (newVal === 'bindCopy') {
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '开始复制', '绑定复制', 'tabs'])
        }
      }
      if (newVal === 'file') {
        this.$refs.upload && this.$refs.upload.clearFiles()
        this.fileList = []
      }
    },
    target_user_id (newVal) {
      if (newVal) {
        this.syncText = ''
        clearTimeout(this.syncTimer)
        this.syncTimer = null
        // this.getSyncStatus(newVal)
        const bandShopTip = this.userBindList.find(item => this.target_user_id === item.user_id)
        this.bandShopTip = bandShopTip
        const children = (bandShopTip.first_category_list || []).map(item => {
          return {
            value: item.category_id,
            label: `${item.category_name}`
          }
        })
        this.cascaderOptions = [{
          value: 'all',
          label: '全选',
          children
        }]
      } else {
        this.bandShopTip = {}
      }
    }
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    ...mapActions('migrate/startMigrate', ['getCaptureShopCompleteList']),
    ...mapActionsPaidRecharge(['getUserAccountQuery', 'availablePddCaptureNums']),
    ...mapActions('migrate/readyToMigrate', [
      'userVersionQuery'
    ]),
    ...mapMutations('migrate/migrateSetting', ['save']),
    clearTargetUserId () {
      this.target_user_id = undefined
    },
    settingLoading (value) {
      this.settingDataLoading = value
    },
    getSelfShopId (data) {
      let selfShopId = ''
      data.map(item => {
        if (item.is_self) {
          selfShopId = item.user_id
          item.name = ''
        } else {
          item.user_list.forEach(child => {
            if (child.is_self) {
              selfShopId = child.user_id
            }
          })
        }
      })
      return selfShopId
    },
    async getUserBindList () {
      const data = await Api.hhgjAPIs.getUserBindList({need_first_category: 1})
      let arr = []
      let selfUserId = this.getUserId
      if (!selfUserId) {
        selfUserId = this.getSelfShopId(data)
      }
      let bandShopsMap = new Map()
      data.forEach(item => {
        if (item.user_list) {
          arr = [...arr, ...item.user_list]
        }
      })
      // 去重
      arr.forEach(item => {
        if (!bandShopsMap.get(item.user_id)) {
          if (item.user_id === selfUserId) {
            item.shop_name = `${item.shop_name}(本店铺)`
          }
          item.disabled = item.auth_status === 'expire' || item.auth_status === 'un_login'
          item.shop_name = item.auth_status === 'expire' ? `${item.shop_name}(订购过期)` : item.shop_name
          item.shop_name = item.auth_status === 'un_login' ? `${item.shop_name}(登录过期)` : item.shop_name
          bandShopsMap.set(item.user_id, item)
        }
      })
      this.userBindList = [...bandShopsMap.values()]

      if (this.target_user_id) {
        const bandShopTip = this.userBindList.find(item => this.target_user_id === item.user_id)
        this.bandShopTip = bandShopTip
      }
    },

    changeCaptureUrl () {
      let urls = this.textCaptureUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      this.captureUrlNums = urls.length
    },
    // 多商品复制
    async onCaptureUrls () {
      if (this.isStartCapture) { // 当前有复制请求
        return
      }
      let textUrls = ''
      let limit = 1
      let message = ''
      textUrls = this.textCaptureUrls
      limit = this.limit
      message = '多商品复制超过' + limit + '条限制'
      let urls = textUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      if (urls.length === 0) {
        this.$alert('复制链接未填写', '警告', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
          }
        })
        return
      } else if (urls.length > limit) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
          }
        })
        return
      }
      this.capture({ urls, capture_type: 0 })
    },
    confirmShopsCapture (urls) {
      this.capture({ urls, capture_type: 1 })

      if (urls.every(url => url.indexOf('jinritemai') > -1)) {
        this.getCaptureShopCompleteList({
          push: this.$router.push.bind(this.$router)
        })
      }

      if (urls.every(url => url.indexOf('youzan.com') > -1)) {
        this.getCaptureShopCompleteList({
          push: this.$router.push.bind(this.$router)
        })
      }
    },

    // 整店复制
    onCaptureShops () {
      if (this.isStartCapture) { // 当前有复制请求
        return
      }

      let textUrls = ''
      let limit = 1
      let message = ''
      textUrls = this.textCaptureShopUrls
      message = '整店复制超过' + limit + '条限制'
      let urls = textUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      if (urls.length === 0) {
        this.$alert('复制链接未填写', '警告', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
          }
        })
      } else if (urls.length > limit) {
        this.$alert(message, '警告', {
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
          }
        })
      }
      // 查询是否重复
      this.request('captureIsExistShopCapture', {
        urls: JSON.stringify(urls)
      }, data => {
        if (data.result && data.capture_id) {
          const h = this.$createElement
          this.$confirm('', {
            confirmButtonText: '查看上次复制记录',
            cancelButtonText: '重新复制',
            message: h('div', null, [
              h('div', {
                class: 'center'
              }, [
                h('hh-icon', {
                  props: {
                    type: 'icontishi'
                  },
                  class: 'startMigrate-icon'
                }),
                h('span', {
                  props: {
                    type: 'icontishi'
                  },
                  class: 'startMigrate-title'
                },
                '链接重复复制提示')
              ]),
              h('div', {
                class: 'startMigrate-text'
              }, [
                h('div', null, `该链接于 ${data.capture_detail.create_time} 被您复制过。您希望`),
                h('div', null, '系统帮您重新复制还是查看上次的复制记录？')
              ])
            ]),
            customClass: 'startMigrate-customClass',
            cancelButtonClass: 'startMigrate-cancelButtonClass',
            confirmButtonClass: 'startMigrate-confirmButtonClass',
            showClose: false

          })
            .then(() => {
              this.handleTablemigrateHistory(data.capture_id)
            })
            .catch(action => {
              this.confirmShopsCapture(urls)
            })
        } else {
          this.confirmShopsCapture(urls)
        }
      })

      // Api.hhgjAPIs.getCaptureShopCompleteList()
    },
    // 绑定复制
    async onCaptureBindCopy () {
      // check_status  -1  status  -1   全部商品
      // check_status  3   status  0     在售中
      // check_status  1   status   1      仓库中
      if (!this.target_user_id) {
        return this.$message({
          message: '请选择被复制的店铺',
          type: 'warning'
        })
      }
      try {
        const obj = {
          0: { check_status: -1, status: -1 },
          1: { check_status: 3, status: 0 },
          2: { check_status: 1, status: 1 }
        }
        const status = obj[this.modelBindCopy.status]
        const targetUserId = this.target_user_id

        if (this.binCopyActiveName === 'id') {
          if (!this.modelBindCopy.goods_ids) {
            return this.$message({
              message: '请输入商品id',
              type: 'error'
            })
          }

          const goodsIds = this.modelBindCopy.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
          const goodsIdsSet = [...new Set(goodsIds)]

          const valid = await this.$refs.modelCopyForm.validate()
          if (!valid) {
            return this.$message({
              message: '请根据提示仔细填写～',
              type: 'error'
            })
          }
          this.productListCheckLoading = true
          const idsCheck = await Api.hhgjAPIs.productListCheck({
            goods_id_list: JSON.stringify(goodsIdsSet),
            target_user_id: targetUserId
          })
          this.productListCheckLoading = false
          if (idsCheck && idsCheck.lost_goods_id_list.length) {
            const lostGoodsIds = idsCheck.lost_goods_id_list
            this.lostGoodsIds = lostGoodsIds
            const lostGoodsIdsSet = new Set(lostGoodsIds)
            const unionSets = goodsIdsSet.filter(item => !lostGoodsIdsSet.has(item))
            if (unionSets.length) {
              // 弹出弹窗
              this.$refs.ModalBindCopyIdSearch.visible = true
              return false
            } else {
              // 所有id都不能用
              return this.$message({
                message: '您输入的所有商品id都不能存在，请仔细核对重新输入～',
                type: 'error'
              })
            }
          // 有id可以用
          } else if (idsCheck && !idsCheck.lost_goods_id_list.length) {
            const parmas = {
              ...status,
              capture_type: 2,
              target_user_id: targetUserId,
              goods_id_list: JSON.stringify(goodsIdsSet),
              filter_copied_product: this.modelBindCopy.filter_copied_product
            }
            this.capture(parmas, false)
          }
        } else {
          // 直接复制
          const parmas = {
            ...status,
            target_user_id: targetUserId,
            capture_type: 2,
            filter_copied_product: this.modelBindCopy.filter_copied_product
          }
          this.capture(parmas, false)
        }
      } catch (err) {
        return this.$message({
          message: `${err}`,
          type: 'error'
        })
      }
    },
    // 绑定复制 选择id筛选 再次复制
    continueCopy (ids) {
      const obj = {
        0: { check_status: -1, status: -1 },
        1: { check_status: 3, status: 0 },
        2: { check_status: 1, status: 1 }
      }
      const lostGoodsIdsSet = new Set(this.lostGoodsIds)
      const goodsIds = this.modelBindCopy.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      const unionSets = goodsIdsSet.filter(item => !lostGoodsIdsSet.has(item))
      const status = obj[this.modelBindCopy.status]
      const targetUserId = this.target_user_id
      const parmas = {
        ...status,
        capture_type: 2,
        target_user_id: targetUserId,
        goods_id_list: JSON.stringify(unionSets)
      }
      this.capture(parmas, false)
    },
    async capture (parmas, needUpdateMigrateSetting = true) {
      try {
        let self = this
        this.isStartCapture = true
        this.request('capture', parmas, async (data) => {
          // 试用用户判断抓取是否有限制
          const userVersion = this.userVersion || (await this.userVersionQuery())
          console.log(userVersion, 'userVersion')
          const isFreeUpgrate = userVersion.is_free_upgrate
          const isSenior = userVersion.is_senior
          const versionTipType = userVersion.version_type
          if (!isFreeUpgrate && !isSenior && data.left_capture_nums_not_enough) {
            // 3个月试用引导内部升级
            // 7天试用引导在服务市场
            if (versionTipType === 'free_three_months') {
              this.$refs && this.$refs.ModalCharge.open(data)
            } else {
              this.$refs && this.$refs.ModalChargeOrder.open(data)
            }
            this.isStartCapture = false
            return false
          }
          // 高级版 充值限制
          if (data.left_capture_nums_not_enough) {
            this.$refs && this.$refs.ModalChargeTip.open(data)
            this.isStartCapture = false
            return false
          }

          this.isStartCapture = false
          let captureId = data.capture_id
          this.$router.push({
            path: '/migrate/productList',
            query: {
              captureId: captureId
            }
          }).catch(() => {})
          if (this.userBindList.length) {
            this.$refs.modelCopyForm && this.$refs.modelCopyForm.resetFields && this.$refs.modelCopyForm.resetFields()
          }
        }, err => {
          let el = ''
          if (this.activeName === 'bindCopy') {
            el = `<br/><a href='https://www.yuque.com/huxiao-rkndm/ksui6u/tm5odl' target='_blank' style="color:#1D8FFF;font-size:12px">点击查看帮助</a>`
          }
          this.$alert(`${err.message}` + el, '警告', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
            type: 'error',
            callback: action => {
              self.isStartCapture = false
            }
          })
        }, true)
      } catch (err) {
        console.log(err)
      }
    },
    async uploadBeforeUpload (file) {
      // let type = file.type
      let size = file.size / 1024
      // if (type !== 'text/csv' && type !== 'application/vnd.ms-excel') {
      //   this.$message.error('只能上传 csv 文件')
      //   return false
      // }
      if (size > 100) {
        this.$message.error('上传文件太大')
        return false
      }

      //   this.$refs.upload.abort()
      //   return false
      // }
      // 修改搬家配置
      // const updateResult = await this.$refs.setting.updateMigrateSetting()
      // if (updateResult === 'error') {
      //   return false
      // }
      this.isStartCapture = true
    },
    uploadOnProgress (file, fileList) {
      this.uploading = true
      this.showProcess = true
      this.processLength = file.percent
      this.fileList = fileList
    },
    // todo
    uploadOnError: function () {
      this.isStartCapture = false
      this.processLength = 100
      this.showProcess = false
      this.$refs.upload.clearFiles()
    },
    uploadOnSuccess: async function (response, file, fileList) {
      this.fileList = fileList
      this.isStartCapture = false
      this.processLength = 100
      this.showProcess = false
      this.$refs.upload.clearFiles()
      let code = parseInt(response.code)
      // 导入复制 弹窗限制
      const userVersion = this.userVersion || (await this.userVersionQuery())
      const isFreeUpgrate = userVersion.is_free_upgrate
      const isSenior = userVersion.is_senior
      const versionTipType = userVersion.version_type
      if (!isFreeUpgrate && !isSenior && response.data.left_capture_nums_not_enough) {
            // 3个月试用引导内部升级
            // 7天试用引导在服务市场
        if (versionTipType === 'free_three_months') {
          this.$refs && this.$refs.ModalCharge.open(response.data)
        } else {
          this.$refs && this.$refs.ModalChargeOrder.open(response.data)
        }
        this.isStartCapture = false
        return false
      }
      if (response.data.left_capture_nums_not_enough) {
        this.$refs && this.$refs.ModalChargeTip.open(response.data)
        this.isStartCapture = false
        return false
      }

      if (code !== 0) {
        this.uploading = false
        if (code === 205) { // 体验版功能受限
          // eslint-disable-next-line no-undef
          this.requestFail(new MyError.FeatureLimitError(response.msg))
        } else {
          this.requestFail(new Error(response.msg))
        }
      } else {
        let captureId = response.data.capture_id
        this.$router.push({
          path: '/migrate/productList',
          query: {
            captureId: captureId
          }
        }).catch(() => {})
      }
    },
    uploadChange: function (file, fileList) {
      if (file.status === 'ready') {
        this.showProcess = true
        this.fileList = fileList
        console.log(fileList, 'fileList')
        this.$message.success(`${fileList[0].name} 上传成功，请点击下一步`)
      }
    },
    downloadCSV () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '开始复制', '下载', '下载模板'])
      }
      let str = `商品链接\n`
      str += `${'https://detail.tmall.com/item.htm?id=627467441239\t'},`
      str += `\n`
      str += `${'https://detail.tmall.com/item.htm?id=613995850749\t'},`
      str += `\n`
      str += `${'https://detail.tmall.hk/hk/item.htm?id=608529032990\t'},`
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
      let link = document.createElement('a')
      link.href = uri
      link.download = 'product.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    // downloadZip () {
    //   if (window._hmt) {
    //     window._hmt.push(['_trackEvent', '开始复制', '下载', '下载Chrome浏览器安装包'])
    //   }
    //   let link = document.createElement('a')
    //   link.href = 'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.zip'
    //   link.download = 'huhuPlug.zip'
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // },
    // downloadCrx () {
    //   if (window._hmt) {
    //     window._hmt.push(['_trackEvent', '开始复制', '下载', '下载360浏览器安装包'])
    //   }
    //   let link = document.createElement('a')
    //   link.href = 'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.crx'
    //   link.download = 'huhuPlug.crx'
    //   document.body.appendChild(link)
    //   link.click()
    //   document.body.removeChild(link)
    // },
    // navToHelp () {
    //   this.importFilePromptVisibe = true
    // },
    setActive (val) {
      this.platformIconActive = val
    },
    moveActive (val) {
      this.platformIconActive = ''
    },
    gotoBindShop () {
      this.$router.push({
        name: 'ShopsBand'
      })
    },
    goCharge () {
      this.$router.push({
        name: 'PaidRecharge',
        params: {
          active: 'PayRecord'
        }
      })
    },
    formatGoods_ids: function (target) {
      const reg = /[^\d\n\s]/g
      const value = target.replace(reg, '')
      this.modelBindCopy.goods_ids = value
    },
    handleBinCopyActiveNameChange (value) {
      if (value === 'status') {
        this.$refs.modelCopyForm.clearValidate()
      }
    },
    openProductCollection () {
      this.$router.push({
        name: 'ProductionCollection'
      })
    },
    toggleStartCopyTips () {
      this.showStartCopyTips = !this.showStartCopyTips
    },
    toggleBindCopyTips () {
      this.showBindCopyTips = !this.showBindCopyTips
    },
    handleFocus () {
      // this.$refs.TablemigrateHistory && this.$refs.TablemigrateHistory.open()
    },
    handleBlur () {
      // this.$refs.TablemigrateHistory && this.$refs.TablemigrateHistory.close()
    },
    // 调转整店复制查看历史记录
    handleTablemigrateHistory (captureId) {
      this.$router.push({
        path: '/migrate/productList',
        query: {
          captureId: captureId
        }
      }).catch(() => {})
      // this.textCaptureShopUrls = url
    },
    async handleSyncProducts (id) {
      if (this.syncText === '同步中') {
        return
      }
      await Api.hhgjAPIs.syncProducts({
        target_user_id: id
      })
      this.getSyncStatus(id)
    },
    gobind (url) {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '打开新网址链接', '点击', url])
      }
      window.open(url)
    },
    async getSyncStatus (id) {
      this.syncLoading = true
      const data = await Api.hhgjAPIs.getSyncStatus({
        target_user_id: id
      })
      this.syncLoading = false
      if (data.status === 'complete') {
        this.syncText = ''
        clearTimeout(this.syncTimer)
        this.syncTimer = null
        this.$message.success('选中店铺商品已同步成功！')
        this.getUserBindList()
      } else {
        if (data.status === 'ready') {
          this.syncText = '同步中'
          this.syncTimer = setTimeout(() => {
            clearTimeout(this.syncTimer)
            this.syncTimer = null
            this.getSyncStatus(id)
          }, 5000)
        }
        if (data.status === 'running' && data.cur !== data.total) {
          this.syncText = `商品同步中....${data.cur}/${data.total}`
          this.syncTimer = setTimeout(() => {
            clearTimeout(this.syncTimer)
            this.syncTimer = null
            this.getSyncStatus(id)
          }, 5000)
        }
      }
    },
    clearFiles: debounce(function () {
      this.$refs.upload.clearFiles()
    }, 100),
    gotoSettingFile () {
      if (!this.fileList.length) {
        return this.$message.warning('请导入文件')
      }
      this.$router.push({
        name: 'MigrateSetting',
        params: {
          isCapturing: 'isCapturing'
        }
      })
      this.save({
        captureCallBack: this.$refs.upload.submit
      })
    },
    onCaptureFile () {
      if (!this.fileList.length) {
        return this.$message.warning('请导入文件')
      }
      this.$refs.upload.submit()
    },
    handlePreview (file) {
      console.log(file, 'file')
    },
    gotoSetting (cb, url) {
      if (url) {
        this.$router.push({
          name: 'MigrateSetting',
          params: {
            isCapturing: 'isCapturing'
          }
        })
        this.save({
          captureCallBack: cb
        })
      } else {
        this.$message.warning('请输入链接')
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-tabs__content {
  overflow: auto;
}
.left {
  text-align: left;
}
.categorySelect {
  margin-right:0 !important;
}
.bindCopyRadio {
  /deep/ .el-radio-button__inner {
  width: 80px;
}
}
.startCopyBtn {
  margin:30px 0;
  text-align: center;
  display: flex;
  justify-content: center;
}

/deep/ .my-textarea {
    height: 90px;
    textarea {
      resize: none !important;
      outline: none;
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 100%;
      background: #fff;
      font-size: 14px;
      font-weight: 400;
      color: #19191a;
      line-height: 16px;
      padding: 10px;
      overflow: auto;
      touch-action: manipulation;
      cursor: text;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      column-count: initial !important;
      flex-direction: column;
      letter-spacing: normal;
      word-spacing: normal;
      text-transform: none;
      text-indent: 0px;
      text-shadow: none;
      display: inline-block;
      text-align: start;
      text-rendering: auto;
      transition: none;
    }
    textarea:active {
      border: 1px solid @color-primary;
      /deep/ .TablemigrateHistory {
        display: block !important;
      }
    }
    textarea:hover {
      border: 1px solid @color-primary;
      /deep/ .TablemigrateHistory {
        display: block !important;
      }
    }
    textarea:focus {
      border: 1px solid @color-primary;
      /deep/ .TablemigrateHistory {
        display: block !important;
      }
    }

  }

  .shopCopySupportPlatForm {
    // position: absolute;
    // top:250px;
  }
/deep/ .capture-file-upload {
  .el-upload {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 360px;
    height: 180px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
}
</style>
<style lang="less">

.startMigrate-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
  border-color: #1D8FFF;
  color: #1D8FFF;
  font-size: 14px;
}

.startMigrate-confirmButtonClass{
  font-size: 12px;
  width: 140px;
  padding: 12px;
  font-size: 14px;
  background: #1D8FFF;
}

.startMigrate-icon {
  width: 20px;
  height: 20px;
  font-size: 20px;
  margin-right: 5px;
}

.startMigrate-title {
  height: 30px;
  font-size: 20px;
  font-family: MicrosoftYaHei;
  font-weight: 500;
  color: #4E4E4E;
  line-height: 30px;
  margin-bottom: 15px;
}

.startMigrate-text {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  padding-top: 15px;
  margin-bottom: 10px;
}

.startMigrate-customClass {
    padding-bottom: 29px;
    .el-message-box__header {
      padding-top: 11px;
    }
    .el-message-box__btns {
      text-align: center;
      padding-top: 14px;
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
