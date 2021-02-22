<template lang="html">
<div style="position: relative;">
  <help-tips v-if="activeName === 'shop'" helpLink="captureShop" words="怎么获取店铺链接？" positionT="10" positionR="10">
  </help-tips>
  <el-tabs v-model="activeName">
    <el-tab-pane v-loading="loadingCnt" label="链接抓取" name="single">
      <el-input type="textarea" :rows="10" placeholder="输入其他平台的商品链接地址，换行分隔多个链接，最多不超过50个" @input="changeCaptureUrl"
        v-model="textCaptureUrls">
      </el-input>
      <div class="support">
        <div class="color-767989 font-12">支持平台:</div>
        <div class="flex color-666 ">
            <div>
            <img class="icon" src="@/assets/images/taobao.png" @click="open('淘宝')">
            <p class="color-4e4e4e font-12">淘宝</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/tm.png" @click="open('天猫')">
            <p class="font-12">天猫</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/1688.png" @click="open('1688')">
            <p class="font-12">1688</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/jd.png" @click="open('京东')">
            <p class="font-12">京东</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/sn.png" @click="open('苏宁易购')">
            <p class="font-12">苏宁</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/vph.png" @click="open('唯品会')">
            <p class="font-12">唯品会</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/kaola.png" @click="open('网易考拉')">
            <p class="font-12">网易考拉</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/17.png" @click="open('17网')">
            <p class="font-12">17网</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/dy.png" @click="open('抖音')">
            <p class="font-12">抖音</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/pdd.png" @click="open('拼多多')">
            <p class="font-12">拼多多</p>
          </div>
          <div>
            <img class="icon" src="@/assets/images/chanmama.png" @click="open('禅妈妈')">
            <p class="font-12">禅妈妈</p>
          </div>
        </div>
      </div>
      <div class="common-bottom">
        <el-button type="primary" @click="onCapture(0)" :disabled="isStartCapture">
          <span style="line-height:21px">开始抓取</span>
          <el-badge :value="captureUrlNums"></el-badge>
        </el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane v-loading="loadingCnt" label="整店抓取" name="shop">
      <el-input type="textarea" :rows="10" placeholder="输入其他平台的店铺地址" v-model="textCaptureShopUrls">
      </el-input>
      <div class="support">
        <span>支持平台:</span>
        <div>
          <img class="icon" src="@/assets/images/taobao.png">
          <p class="font-12">淘宝</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/tm.png">
          <p class="font-12">天猫</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/1688.png">
          <p class="font-12">1688</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/jd.png">
          <p class="font-12">京东</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/sn.png">
          <p class="font-12">苏宁</p>
        </div>
        <!-- <div> <p class="font-12">唯品会</p> -->
        <div>
          <img class="icon" src="@/assets/images/kaola.png">
          <p class="font-12">网易考拉</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/17.png">
          <p class="font-12">17网</p>
        </div>
        <div>
          <img class="icon" src="@/assets/images/dy.png">
          <p class="font-12">抖音</p>
        </div>
      </div>
      <div class="common-bottom">
        <el-button type="primary" @click="onCapture(1)" :disabled="isStartCapture">开始抓取</el-button>
      </div>
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
          <div class="el-upload__tip" slot="tip"><span style="color: #E02020;">*</span> 只能上传CSV文件，且不超过100KB，一次最多 200
            条，一天最多支持 1200 条</div>
          <el-progress v-show="showProcess" :percentage="processLength" :stroke-width="2"></el-progress>
        </el-upload>
      </div>
      <div style="text-align: left; margin-top: 50px;">
        <span class="prompt">使用方式:</span>
        <div class="prompt-content">方式1：下载导入模板，自行添加商品链接
          <el-link type="primary" size="mini" @click="downloadCSV()" :underline="false" class="prompt-link">下载模板
          </el-link>
        </div>
        <span class="prompt-content">方式2（推荐）：安装网页插件选取商品，然后下载并上传导入文件
          <el-link type="primary" size="mini" @click="navToHelp" :underline="false" class="prompt-link">安装及使用教程
          </el-link>
        </span>
        <span class="prompt-content" style="margin-left: 40px;">插件下载（暂不支持 IE 浏览器）：360浏览器、搜狗浏览器安装包
          <el-link class="prompt-link" type="primary" href="" target="_blank" :underline="false" @click="downloadCrx()"
            style="margin-right: 16px;">
            下载
          </el-link>
          Chrome 浏览器安装包
          <el-link class="prompt-link" type="primary" href="" target="_blank" :underline="false" @click="downloadZip()">
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
  </el-tabs>
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

export default {
  mixins: [request],
  data () {
    return {
      textCaptureUrls: '',
      textCaptureShopUrls: '',
      activeName: 'single',
      captureUrlNums: 0,
      uploadAction: '/api/importCaptureFile',
      importFilePromptVisibe: false,
      isStartCapture: false
    }
  },
  components: {
    helpTips
  },
  computed: {
    ...mapGetters({
      getCaptureIdList: 'getCaptureIdList',
      isAuth: 'getIsAuth',
      getTokenHeaders: 'getTokenHeaders'
    }),

    subscItemLevelMap () {
      return common.subscItemLevelMap
    }
  },
  methods: {
    ...mapActions([
      'setCaptureIdList'
    ]),
    ...mapGetters({
      subsc: 'getCurrentSubsc'
    }),
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
    }
  }
}
</script>
