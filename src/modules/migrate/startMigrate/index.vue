<template lang="html">
  <div style="position: relative;">
    <help-tips v-if="activeName === 'shop'" helpLink="captureShop" words="怎么获取店铺链接？" positionT="10" positionR="10">
    </help-tips>
    <el-tabs v-model="activeName">
      <el-tab-pane v-loading="loadingCnt" label="多商品复制" name="single">
        <el-input type="textarea" :rows="10" placeholder="输入其他平台的商品链接地址，换行分隔多个链接，最多不超过50个" class="mb-20"
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
        <div style="text-align: left; margin-top: 50px;">
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
      <el-tab-pane v-loading="loadingCnt" label="绑定复制" name="bindCopy" class="left">
        <div class="flex column align-c" v-if="!userBindList.length ">
          <ElTableEmpty msg="您还未进行店铺绑定，无法操作哦～" />
          <el-link type="primary" size="mini" @click="gotoBindShop" :underline="false" class="prompt-link"
            style="margin-top:10px;">去绑定店铺</el-link>
        </div>
        <el-form :inline="true" :model="model" class="start-migrate-setting" size="medium" v-if="userBindList.length ">
          <el-form-item label="被复制的店铺">
            <el-select v-model="model.bandShop" placeholder="请选择店铺" style="width:220px;margin-right:5px">
              <el-option :label="item.shop_name" :value="item.user_id" v-for="item in userBindList"
                :key="item.user_id"></el-option>
            </el-select>
            <el-button type="text" @click="gotoBindShop" size="small">绑定新店铺</el-button>
            <div class="info" style="height:12px"><span v-if="model.bandShop">注：{{bandShopTip.shop_name}}最近更新时间{{bandShopTip.auth_deadline}}</span></div>
          </el-form-item>
          <el-form-item label="状态选择">
            <el-select v-model="model.brandId" placeholder="商品状态选择" style="width:220px;margin-right:5px">
              <el-option label="全部商品" value="shanghai"></el-option>
              <el-option label="在售中商品" value="beijing"></el-option>
              <el-option label="仓库中商品" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="类目选择">
            <el-cascader v-model="model.user" placeholder="请选择复制后的选择" style="width:220px;margin-right:5px;"
              :options="cascaderOptions" :props="props" clearable :show-all-levels="false"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <Setting v-if="['single','shop'].includes(activeName) || (activeName === 'bindCopy' && userBindList.length)" />
    <!-- 链接抓取 -->
    <SupportPlatForm :list="platformIconsUrl" v-if="activeName === 'single'" />
    <div class="common-bottom" v-if="activeName === 'single'">
      <el-button type="primary" @click="onCapture(0)" :disabled="isStartCapture">
        <span style="line-height:21px">开始复制</span>
        <el-badge :value="captureUrlNums"></el-badge>
      </el-button>
    </div>
    <!-- 导入复制 -->
    <SupportPlatForm :list="platformIconsStore" v-if="activeName === 'shop'" />
    <div class="common-bottom" v-if="activeName === 'shop'">
      <el-button type="primary" @click="onCapture(1)" :disabled="isStartCapture">开始复制</el-button>
    </div>
    <!-- 绑定复制 -->
    <div class="common-bottom" v-if="activeName === 'bindCopy' && userBindList.length ">
      <el-button type="primary" @click="onCapture(1)" :disabled="isStartCapture" style="width:120px">开始复制</el-button>
    </div>
    <BindCopyTip v-if="activeName === 'bindCopy' && userBindList.length " />

    <el-dialog title="安装及使用教程" :show-close="true" :visible.sync="importFilePromptVisibe" width="60%">
      <iframe
        v-bind:src="'https://view.officeapps.live.com/op/embed.aspx?wdAccPdf=1&ui=zh-cn&rs=zh-cn&src=https://hhgj-manual.oss-cn-shanghai.aliyuncs.com/怎么安装及使用虎虎复制助手插件？.docx'"
        width='100%' height='800px;' frameborder='0'></iframe>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
import common from '@/common/common.js'
import helpTips from '@/components/HelpTips.vue'
import Setting from './Setting'
import SupportPlatForm from './SupportPlatForm'
import BindCopyTip from './BindCopyTip'
import { platformIconsUrl, platformIconsStore } from './config'
import Api from '@/api/apis'

export default {
  mixins: [request],
  data () {
    return {
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
      props: { multiple: true },

      model: {
        bandShop: undefined,
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        radio: 1
      },
      userBindList: []
    }
  },
  components: {
    helpTips,
    Setting,
    SupportPlatForm,
    BindCopyTip
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    }),
    ...mapGetters(['getTokenHeaders', 'getCaptureIdList', 'getUserId']),
    subscItemLevelMap () {
      return common.subscItemLevelMap
    },
    bandShopTip () {
      if (this.model.bandShop) {
        return this.userBindList.find(item => this.model.bandShop === item.user_id)
      }
      return {}
    },
    cascaderOptions () {
      if (this.model.bandShop) {
        const bandShopTip = this.userBindList.find(item => this.model.bandShop === item.user_id)
        const children = (bandShopTip.first_category_list || []).map(item => {
          return {
            value: item.category_id,
            label: `${item.category_name}-${item.category_id}`
          }
        })
        return [{
          value: 1,
          label: '全选',
          children
        }]
      }
      return []
    }
  },
  activated () {
    this.getUserBindList()
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    async getUserBindList () {
      const data = await Api.hhgjAPIs.getUserBindList({need_first_category: 1})
      let arr = []
      const selfUserId = this.getUserId
      let bandShopsMap = new Map()
      data.forEach(item => {
        if (item.user_list) {
          arr = [...arr, ...item.user_list]
        }
      })
      arr.forEach(item => {
        if (!bandShopsMap.get(item.user_id)) {
          if (item.user_id === selfUserId) {
            item.shop_name = `${item.shop_name}(本店铺)`
          }
          bandShopsMap.set(item.user_id, item)
        }
      })
      this.userBindList = [...bandShopsMap.values()]
      console.log(this.userBindList)
    },
    open (name) {
      const list = {
        '淘宝': 'https://www.taobao.com/',
        '天猫': 'https://www.tmall.com/',
        '1688': 'https://www.1688.com/',
        '京东': 'https://www.jd.com/',
        '苏宁易购': 'https://www.suning.com/',
        '唯品会': 'https://www.vip.com/',
        '网易考拉': 'https://www.kaola.com/',
        '17网': 'https://gz.17zwd.com/',
        '抖音': 'https://www.yuque.com/huxiao-rkndm/ksui6u/muvtyt',
        '拼多多': 'https://www.yuque.com/huxiao-rkndm/ksui6u/yd9cd1',
        '禅妈妈': 'https://www.chanmama.com/'
      }
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '搬家上货', '开始复制', name])
      }
      window.open(list[name])
    },
    changeCaptureUrl () {
      let urls = this.textCaptureUrls.split('\n')
      urls = urls.map(s => s.trim()).filter(s => s !== '')
      this.captureUrlNums = urls.length
    },
    onCapture (captureType) {
      if (this.isStartCapture) { // 当前有抓取请求
        return
      }
      let textUrls = ''
      let limit = 1
      let message = ''
      if (captureType === 0) {
        textUrls = this.textCaptureUrls
        limit = 50
        message = '链接抓取超过' + limit + '条限制'
      } else {
        textUrls = this.textCaptureShopUrls
        message = '整店抓取超过' + limit + '条限制'
      }
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
      let self = this
      this.isStartCapture = true
      this.request('capture', { urls, capture_type: captureType }, data => {
        this.isStartCapture = false
        let captureId = data.capture_id
        this.$router.push({
          path: '/productList',
          query: {
            captureId: captureId
          }
        })
      }, err => {
        this.$alert(err.message + "  <a href='https://www.yuque.com/huxiao-rkndm/ksui6u/tm5odl' target='_blank'>查看帮助</a>", '警告', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          type: 'error',
          callback: action => {
            self.isStartCapture = false
          }
        })
      }, true)
    },
    uploadBeforeUpload (file) {
      // let type = file.type
       // todo
      let size = file.size / 1024
      // if (type !== 'text/csv' && type !== 'application/vnd.ms-excel') {
      //   this.$message.error('只能上传 csv 文件')
      //   return false
      // }
      if (size > 100) {
        this.$message.error('上传文件太大')
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
    }

  }
}
</script>
<style lang="less" scoped>
.left {
  text-align: left;
}
</style>
