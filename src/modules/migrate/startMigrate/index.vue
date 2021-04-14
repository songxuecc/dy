<template lang="html">
  <div style="position: relative;">
    <help-tips v-if="activeName === 'shop'" helpLink="captureShop" words="怎么获取店铺链接？" positionT="10" positionR="10">
    </help-tips>
    <el-tabs v-model="activeName">
      <el-tab-pane v-loading="loadingCnt" label="多商品复制" name="single">
        <el-input type="textarea" :rows="10" :placeholder="`输入其他平台的商品链接地址，换行分隔多个链接，最多不超过${limit}个`" class="mb-20"
          @input="changeCaptureUrl" v-model="textCaptureUrls">
        </el-input>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt" label="整店复制" name="shop">
        <el-input type="textarea" :rows="10" placeholder="输入其他平台的店铺地址" v-model="textCaptureShopUrls" class="mb-20">
        </el-input>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt" label="导入复制" name="file">
        <div style="width: 435px; margin: auto;">
          <el-upload class="capture-file-upload" drag :action="uploadAction" :headers="getTokenHeaders"
            :data="{'upload_type': 'local'}" :before-upload="uploadBeforeUpload" :on-progress="uploadOnProgress"
            :on-success="uploadOnSuccess" :on-change="uploadChange" :limit=1 ref="upload" :show-file-list="false"
            :multiple="false" :disabled="!this.isAuth">
            <hh-icon type="iconshangchuanxiazai" class="el-icon-upload"
              style="font-size:52px; margin-top: 60px; margin-bottom: 18px;" />
            <div class="el-upload__text">将需要上传的文件拖到此处，或点击上传</div>
            <div class="el-upload__tip" slot="tip"><span style="color: #E02020;">*</span>
              只能上传CSV文件，且不超过100KB，一次最多 200
              条，一天最多支持 1200 条</div>
            <el-progress v-show="showProcess" :percentage="processLength" :stroke-width="2"></el-progress>
          </el-upload>
        </div>
        <div style="text-align: left; margin-top: 50px;margin-bottom:20px">
          <span class="prompt">使用方式:</span>
          <div class="prompt-content">方式1：下载导入模板，自行添加商品链接
            <el-link type="primary" size="mini" @click="downloadCSV()" :underline="false" class="prompt-link">
              下载模板
            </el-link>
          </div>
          <span class="prompt-content">方式2（推荐）：安装网页插件选取商品，然后下载并上传导入文件
            <el-link type="primary" size="mini" @click="navToHelp" :underline="false" class="prompt-link">
              安装及使用教程
            </el-link>
          </span>
          <span class="prompt-content" style="margin-left: 40px;">插件下载（暂不支持 IE 浏览器）：360浏览器、搜狗浏览器安装包
            <el-link class="prompt-link" type="primary" href="" target="_blank" :underline="false"
              @click="downloadCrx()" style="margin-right: 16px;">
              下载
            </el-link>
            Chrome 浏览器安装包
            <el-link class="prompt-link" type="primary" href="" target="_blank" :underline="false"
              @click="downloadZip()">
              下载
            </el-link>
          </span>
          <span class="prompt-content" style="margin-left: 40px;">插件支持平台：
            <div style="display: inline-block;">
              <img class="icon" src="@/assets/platformImg/taobao-tiny.png" style="width: 14px; height: 14px;">
            </div>
            <div style="display: inline-block;">
              <img class="icon" src="@/assets/platformImg/tmall-tiny.png" style="width: 14px; height: 14px;">
            </div>
          </span>
        </div>
      </el-tab-pane>
      <el-tab-pane v-loading="loadingCnt"  name="bindCopy" class="left " style="min-height:120px">
        <span slot="label">绑定复制</span>
        <div class="flex column align-c" v-if="!userBindList.length ">
          <ElTableEmpty msg="您还未进行店铺绑定，无法操作哦～" />
          <el-link type="primary" size="mini" @click="gotoBindShop" :underline="false" class="prompt-link underline"
            style="margin-top:10px;">去绑定店铺</el-link>
        </div>
        <el-radio-group v-model="binCopyActiveName" size="small" class="mb-10 bindCopyRadio" v-if="userBindList.length" >
          <el-radio-button label="status">按状态
          </el-radio-button>
          <el-radio-button label="id" >按ID
          </el-radio-button>
        </el-radio-group>
        <div style="padding-top:4px;display:inline-block">
            <NewFeatureTips type="绑定复制ID"/>
          </div>

        <el-form :inline="true" :model="modelBindCopy" class="start-migrate-setting flex " size="medium" ref="modelCopyForm" :rules="modelBindCopyRules"
              v-if="userBindList.length">
              <el-form-item label="被复制的店铺" :style="{position:'relative','padding-bottom': '45px','margin-right':'83px'}" required >
                <el-select v-model="target_user_id" placeholder="请选择店铺" style="width:290px;margin-right:5px" clearable @clear="clearTargetUserId">
                  <el-option :label="item.shop_name" :value="item.user_id" v-for="item in userBindList" :key="item.user_id" :disabled="item.disabled">
                  </el-option>
                </el-select>
                <el-button type="text" @click="gotoBindShop" size="small">绑定新店铺</el-button>
                <div class="info" v-if="target_user_id" style="position:absolute;left:0;bottom:-12px;width:500px;transform: translateY(100%);">
                  <div  class="font-12">
                      <p class="font-12" style="width:350px;word-break:break-all">{{bandShopTip.shop_name}}&nbsp;最近更新时间{{bandShopTip.last_goods_sync_time}}，复制的是更新时间当下的商品详情，登录该店铺，点击上方导航栏【同步后台商品】即可更新一次</p>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="状态选择" v-if="binCopyActiveName === 'status'">
                <el-select v-model="modelBindCopy.status" placeholder="商品状态选择" style="width:257px;" >
                  <el-option label="全部商品" :value="0"></el-option>
                  <el-option label="在售中商品" :value="1"></el-option>
                  <el-option label="仓库中商品" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="form-textarea" label="商品ID" v-if="binCopyActiveName === 'id'"  prop="goods_ids">
                <el-input
                  :value="modelBindCopy.goods_ids"
                  @input="formatGoods_ids($event)"
                  type="textarea"
                  :autosize="{ minRows: 2,maxRows: 15}"
                  resize="none"
                  size="small"
                  placeholder="商品ID查询,多个查询请换行或空格依次输入"
                  style="width: 357px;"/>
              </el-form-item>
            </el-form>
      </el-tab-pane>
    </el-tabs>

    <Setting v-show="['single','shop','file'].includes(activeName)" ref="setting" @loading="settingLoading"/>
    <!-- 多商品复制 -->
    <SupportPlatForm :list="platformIconsUrl" v-if="activeName === 'single'" />
    <p class="left font-12 mt-20 bold"  v-if="activeName === 'single'">拼多多抓取额度有限制(其他平台无限制)，剩余额度 <span class="fail">{{availablePddCaptureNums}} 条</span> <span class="color-primary ml-10 underline pointer" @click="goCharge">去充值</span></p>
    <div class="common-bottom" v-if="activeName === 'single'">
      <el-button type="primary" @click="onCaptureUrls" :disabled="isStartCapture || settingDataLoading">
        <span style="width:120px">开始复制</span>
        <el-badge :value="captureUrlNums"></el-badge>
      </el-button>
    </div>
    <!-- 整店复制 -->
    <SupportPlatForm :list="platformIconsStore" v-if="activeName === 'shop'" />
    <div class="common-bottom" v-if="activeName === 'shop'">
      <el-button type="primary" @click="onCaptureShops" :disabled="isStartCapture || settingDataLoading"  style="width:120px">开始复制</el-button>
    </div>
    <!-- 绑定复制 -->
    <div class="common-bottom" v-if="activeName === 'bindCopy' && userBindList.length ">
      <el-button type="primary" @click="onCaptureBindCopy" :disabled="isStartCapture || settingDataLoading" style="width:120px">开始复制
      </el-button>
    </div>
    <BindCopyTip v-if="activeName === 'bindCopy'"/>
    <el-dialog title="安装及使用教程" :show-close="true" :visible.sync="importFilePromptVisibe" width="60%">
      <iframe
        v-bind:src="'https://view.officeapps.live.com/op/embed.aspx?wdAccPdf=1&ui=zh-cn&rs=zh-cn&src=https://hhgj-manual.oss-cn-shanghai.aliyuncs.com/怎么安装及使用虎虎复制助手插件？.docx'"
        width='100%' height='800px;' frameborder='0'></iframe>
    </el-dialog>
    <ModalBindCopyIdSearch :ids="lostGoodsIds" ref="ModalBindCopyIdSearch" @continueCopy="continueCopy"/>
  </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions, createNamespacedHelpers } from 'vuex'
import common from '@/common/common.js'
import helpTips from '@/components/HelpTips.vue'
import Setting from '@migrate/startMigrate/Setting'
import SupportPlatForm from '@migrate/startMigrate/SupportPlatForm'
import BindCopyTip from '@migrate/startMigrate/BindCopyTip'
import ModalBindCopyIdSearch from '@migrate/startMigrate/ModalBindCopyIdSearch'

import { platformIconsUrl, platformIconsStore } from '@migrate/startMigrate/config'
import Api from '@/api/apis'

const {
  mapActions: mapActionsPaidRecharge,
  mapState: mapStatePaidRecharge
} = createNamespacedHelpers('customerSetting/paidRecharge')

export default {
  mixins: [request],
  data () {
    return {
      limit: 100,
      textCaptureUrls: '',
      textCaptureShopUrls: '',
      activeName: 'bindCopy',
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
        category_root_id_list: [],
        goods_ids: []
      },
      userBindList: [],
      target_user_id: '',
      bandShopTip: {},
      binCopyActiveName: 'id',
      ModalBindCopyIdSearchShow: false,
      lostGoodsIds: []
    }
  },
  components: {
    helpTips,
    Setting,
    SupportPlatForm,
    BindCopyTip,
    ModalBindCopyIdSearch
  },
  activated () {
    this.getUserBindList()
    this.getUserAccountQuery()
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName || 'single'
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    }),
    ...mapStatePaidRecharge(['availablePddCaptureNums']),
    ...mapGetters(['getTokenHeaders', 'getCaptureIdList', 'getUserId']),
    subscItemLevelMap () {
      return common.subscItemLevelMap
    },
    modelBindCopyRules () {
      if (this.binCopyActiveName !== 'id') return {}
      const checkLength = (rule, value, callback) => {
        if (value === '') {
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
    },
    target_user_id (newVal) {
      if (newVal) {
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
        const ids = (children || []).map(item => item.value)
        this.modelBindCopy.category_root_id_list = [['all', ...ids]]
      } else {
        this.modelBindCopy.category_root_id_list = []
        this.bandShopTip = {}
      }
    }
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    ...mapActionsPaidRecharge(['getUserAccountQuery']),
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
          item.disabled = item.auth_status === 'expire'
          item.shop_name = item.auth_status === 'expire' ? `${item.shop_name}(过期)` : item.shop_name
          bandShopsMap.set(item.user_id, item)
        }
      })
      this.userBindList = [...bandShopsMap.values()]
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
      this.capture({ urls, capture_type: 1 })
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
      // id 查询 先告诉他要查询的id
        const goodsIds = this.modelBindCopy.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
        const goodsIdsSet = [...new Set(goodsIds)]
        if (this.binCopyActiveName === 'id' && !goodsIds.length) {
          return this.$message({
            message: '请输入商品id',
            type: 'error'
          })
        }
        const obj = {
          0: { check_status: -1, status: -1 },
          1: { check_status: 3, status: 0 },
          2: { check_status: 1, status: 1 }
        }
        const status = obj[this.modelBindCopy.status]
        const targetUserId = this.target_user_id

        if (this.binCopyActiveName === 'id') {
          const valid = await this.$refs.modelCopyForm.validate()
          if (!valid) {
            return this.$message({
              message: '请根据提示仔细填写～',
              type: 'error'
            })
          }
          const idsCheck = await Api.hhgjAPIs.productListCheck({
            goods_id_list: JSON.stringify(goodsIdsSet),
            target_user_id: targetUserId
          })
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
              return this.$message({
                message: '您输入的所有商品id都不能存在，请仔细核对重新输入～',
                type: 'error'
              })
            }
          // 所有id都不能用
          // 有id可以用
          } else if (idsCheck && !idsCheck.lost_goods_id_list.length) {
            const parmas = {
              category_root_id_list: JSON.stringify([]),
              ...status,
              capture_type: 2,
              target_user_id: targetUserId,
              goods_id_list: JSON.stringify(goodsIdsSet)
            }
            this.capture(parmas, false)
          }
        } else {
          // 直接复制
          if (!this.modelBindCopy.category_root_id_list.length) {
            return this.$message({
              message: '请选择类目',
              type: 'warning'
            })
          }
          const parmas = {
            category_root_id_list: JSON.stringify([]), ...status, target_user_id: targetUserId, capture_type: 2
          }
          this.capture(parmas, false)
        }
      } catch (err) {
        return this.$message({
          message: '请根据提示仔细填写～',
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
        category_root_id_list: JSON.stringify([]),
        ...status,
        capture_type: 2,
        target_user_id: targetUserId,
        goods_id_list: JSON.stringify(unionSets)
      }
      this.capture(parmas, false)
    },
    async capture (parmas, needUpdateMigrateSetting = true) {
      try {
        if (needUpdateMigrateSetting) {
          const updateResult = await this.$refs.setting.updateMigrateSetting()
          if (updateResult === 'error') {
            return false
          }
        }
        let self = this
        this.isStartCapture = true
        this.request('capture', parmas, data => {
          this.isStartCapture = false
          let captureId = data.capture_id
          this.$router.push({
            path: '/productList',
            query: {
              captureId: captureId
            }
          })
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
      // 修改搬家配置
      const updateResult = await this.$refs.setting.updateMigrateSetting()
      if (updateResult === 'error') {
        return false
      }
      this.isStartCapture = true
    },
    uploadOnProgress (file, fileList) {
      this.uploading = true
      this.showProcess = true
      this.processLength = file.percent
    },
    // todo
    uploadOnError: function () {
      this.isStartCapture = false
      this.processLength = 100
      this.showProcess = false
      this.$refs.upload.clearFiles()
    },
    uploadOnSuccess: function (response, file, fileList) {
      this.isStartCapture = false
      this.processLength = 100
      this.showProcess = false
      this.$refs.upload.clearFiles()
      let code = parseInt(response.code)
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
          path: '/productList',
          query: {
            captureId: captureId
          }
        })
      }
    },
    uploadChange: function (file, fileList) {
      if (file.status === 'ready') {
        this.processLength = 0
        this.showProcess = true
      }
    },
    downloadCSV () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '开始复制', '下载', '下载模板'])
      }
      let str = `商品链接\n`
      str += `${'https://detail.tmall.com/item.htm?id=602661002260\t'},`
      str += `\n`
      str += `${'https://item.jd.com/100008348542.html\t'},`
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str)
      let link = document.createElement('a')
      link.href = uri
      link.download = 'product.csv'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    downloadZip () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '开始复制', '下载', '下载Chrome浏览器安装包'])
      }
      let link = document.createElement('a')
      link.href = 'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.zip'
      link.download = 'huhuPlug.zip'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    downloadCrx () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '开始复制', '下载', '下载360浏览器安装包'])
      }
      let link = document.createElement('a')
      link.href = 'https://plugin-file.oss-cn-shanghai.aliyuncs.com/huhuPlug.crx'
      link.download = 'huhuPlug.crx'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    navToHelp () {
      this.importFilePromptVisibe = true
    },
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

      // const goodsIds = value.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      // const goodsIdsSet = [...new Set(goodsIds)]

      // if (goodsIdsSet.length > 1000) {
      //   this.modelBindCopyError = '最多支持1000个商品ID'
      // }
    }

  }
}
</script>
<style lang="less" scoped>
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

</style>
