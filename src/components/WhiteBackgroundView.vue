<template lang="html">
    <div>
      <div v-show="isFirstPage" style="height:300px;margin-top:80px">
          <el-upload
            drag
            :action="uploadAction"
            :headers="getTokenHeaders"
            :data="{'upload_type': 'local'}"
            :before-upload="uploadBeforeUpload"
            :on-progress="uploadOnProgress"
            :on-success="uploadOnSuccess"
            :limit=1
            :show-file-list="false"
            :multiple="false"
            :disabled="!this.isAuth">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将需要处理的图片拖到此处，或点击上传</div>
          </el-upload>
          <!-- <el-row style="display:flex; align-items:center;margin:10px">
              <el-col :span="2" :offset="5">
                  <span>图片链接</span>
              </el-col>
              <el-col :span="12">
                <el-input placeholder="图片链接地址" v-model="pictureUrl">
                    <el-button slot="append" @click="extractPictureUrl(pictureUrl)">提取</el-button>
                </el-input>
              </el-col>
          </el-row> -->
          <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过8M，长，宽大于480，小于1000</div>
      </div>
      <div v-show="!isFirstPage">
          <el-row style="margin-top:20px;">
           <el-col :span="12" style="text-align: left">
              <!-- <el-button style="margin-left:5px" type="primary" size="small" @click="startMatting" :disabled="uploading || matLoading || furtherMatLoading">开始扣图</el-button> -->
              <div style="display:inline-block;margin-left:10px">
               <el-upload
                          :action="uploadAction"
                          :headers="getTokenHeaders"
                          :data="{'upload_type': 'local'}"
                          :before-upload="uploadBeforeUpload"
                          :on-progress="uploadOnProgress"
                          :on-success="uploadOnSuccess"
                          :show-file-list="false"
                          :multiple="false">
                          <el-button size="small" type="primary" :disabled="uploading || matLoading || furtherMatLoading">重选图片</el-button>
                      </el-upload></div>

           </el-col>
           <el-col :span="7" style="text-align: left">
              <span style="font-size:14px;">对细节不满意？对下图进行编辑</span>
              <el-button size="small" type="primary" :disabled="uploading || matLoading || furtherMatLoading"
               @click="isEditMattingMap=true">编辑</el-button>
              <el-card class="edit-card" v-show="isEditMattingMap">
                <div slot="header">
                  <el-button style="float: right;padding:0" type="text" size="mini" @click="isEditMattingMap=false">关闭</el-button>
                </div>
                <el-row class="edit-row">
                  <el-col :span="4"><span class="edit-title">操作</span></el-col>
                  <el-col :span="20">
                  <el-radio-group v-model="eraseMode" size="mini">
                    <el-radio-button label="recover">还原</el-radio-button>
                    <el-radio-button label="erase">擦除</el-radio-button>
                  </el-radio-group>
                  </el-col>
                </el-row>
                <el-row class="edit-row">
                  <el-col :span="4"><span class="edit-title">画笔</span></el-col>
                  <el-col :span="20">
                    <el-slider v-model="eraseBrush.pixel" :min="5" :max="15" :marks="bushMask" :step=5>
                    </el-slider>
                    </el-col>
                </el-row>
                <el-row class="edit-row">
                  <el-col :span="4"><span class="edit-title">缩放</span></el-col>
                  <el-col :span="20">
                    <el-slider v-model="scale" :max=2 :min=1 :step=0.1 @change="doScale" :marks="scaleMask"></el-slider>
                    </el-col>
                </el-row>
              </el-card>

              </el-col>

              <el-col :span="5" style="text-align: right">
              <div style="margin-right:38px">
                <span style="font-size:14px">已满意，请下载</span>
                <el-button @click="downloadMattingImage"  size="small" type="primary" :disabled="uploading || matLoading || furtherMatLoading">下载</el-button>
                <a :download="downloadImageName" href="" ref="downloadLink"></a>
                <canvas v-show="false" ref='resultImageCanvas'></canvas>
              </div>
           </el-col>
         </el-row>
         <el-row style="margin-top:5px">
              <el-col :span="12">
               <!-- <el-tag>原图</el-tag> -->
               <div class='canvas-wrapper'
                  v-loading="uploading || matLoading || furtherMatLoading"
                  :element-loading-text="uploading?'载入中':'正在扣图'"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(255, 255, 255, 0.6)">
                 <canvas class='canvas' ref="originalImageCanvas">
                 </canvas>
                  <!-- <DrawLineCanvas
                  class='transparent-canvas canvas'
                  ref="maskCanvas" :canvas_size="canvasSize" :brush="maskBrush"></DrawLineCanvas> -->
               </div>
              </el-col>
              <el-col :span="12">
                <!-- <el-tag>效果图</el-tag> -->
                  <div class='canvas-wrapper'>
                    <canvas class='canvas' ref="bottomImageCanvas"
                      :style="{width: dwidth + 'px', height: dheight + 'px'}" ></canvas>
                    <EraseCanvas
                      class="canvas"
                      ref="mattingImageCanvas"
                      :canvas_size="canvasSize" :brush="eraseBrush"
                      :mode="eraseMode"
                      :style="{width: dwidth + 'px', height: dheight + 'px'}"
                    ></EraseCanvas>
                  </div>
                  <!-- <div v-show="isAutoMatting" style="text-align: left">
                    <img style="width:300px;height:300px" src="../assets/images/wb.gif" />
                  </div> -->
              </el-col>
         </el-row>
          <!-- <el-row style="margin-top:10px;">
             <el-col :span="2" style="text-align: left">
                 <el-tooltip class="item" effect="dark" content="重新选图片" placement="left" style="display:inline-block;">
                    <el-upload
                        :action="uploadAction"
                        :headers="getTokenHeaders"
                        :data="{'upload_type': 'local'}"
                        :before-upload="uploadBeforeUpload"
                        :on-progress="uploadOnProgress"
                        :on-success="uploadOnSuccess"
                        :show-file-list="false"
                        :multiple="false">
                        <el-button size="small" type="primary" :disabled="uploading || matLoading || furtherMatLoading">重新选图片</el-button>
                    </el-upload>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="重新输入图片链接" placement="right" style="margin-top: 10px">
                    <el-button size="mini" icon="el-icon-link" @click="openUrlMsg" circle :disabled="uploading || matLoading || furtherMatLoading"
                    ></el-button>
                </el-tooltip>
            </el-col>
            </el-row> -->
      </div>
        <el-dialog
        :visible.sync="warningDialogVisible"
        width="30%">
        <span slot="title">
          <div style="text-align: left">提示</div>
        </span>
        <el-row style="margin-top:-30px;margin-bottom:-30px">
            <el-col :span="13">
               <div style="text-align: left;margin-top: 50px;line-height: 30px;">
                <span>需要用
                    <span style="color: green">绿色</span>划出要
                    <span style="color: green">保留</span>的内容</span><br>
                <span>需要用
                  <span style="color: red">红色</span>划出要
                  <span style="color: red">删除的内容</span></span>
              </div>
            </el-col>
            <el-col :span="11">
               <div style="text-align: left">
                <img style="width:180px;height:180px" src="../assets/images/wb.gif" />
                </div>
            </el-col>
        </el-row>
        <span slot="footer" style="text-align: center">
          <el-button type="primary" @click="warningDialogVisible = false" size="small">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>

import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
import DragResizeRectCanvas from '@/components/BaseDragResizeRectCanvas.vue'
import DrawLineCanvas from '@/components/BaseDrawLineCanvas.vue'
import EraseCanvas from '@/components/BaseEraseCanvas.vue'
import utils from '@/common/utils'

export default {
  mixins: [request],
  components: {
    DragResizeRectCanvas,
    DrawLineCanvas,
    EraseCanvas
  },

  activated () {
    if (this.selectedPictureUrl) {
      clearInterval(this.syncMattingStatusInterval)
      this.matLoading = false
      this.mattingStep = 0
      this.isAutoMatting = true
      this.extractPictureUrl(this.selectedPictureUrl)
      this.setSelectedPictureUrl('')
    }
  },
  mounted () {
    this.originalImageCanvas = this.$refs['originalImageCanvas']
    this.originalImageCanvasCtx = this.originalImageCanvas.getContext('2d')

    this.bottomImageCanvas = this.$refs['bottomImageCanvas']
    this.bottomImageCanvasCtx = this.bottomImageCanvas.getContext('2d')

    this.resultImageCanvas = this.$refs['resultImageCanvas']
    this.resultImageCanvasCtx = this.resultImageCanvas.getContext('2d')
  },
  data () {
    return {
      scale: 1,
      dwidth: '480',
      dheight: '480',
      dialogVisible: true,
      uploadAction: '/api/uploadImage',
      matLoading: false,
      isFirstPage: true,
      uploading: false,
      handleImageName: '',
      handleImageData: '',
      token: '',
      fakeToken: '',
      isShowResizeRect: true,
      mattingStep: 0, // 0 - 还没开始 ， 1 - 已经完成初步去背景
      canvasSize: [],
      mattingImg: '',
      maskBrush: {
        color: '',
        pixel: 20
      },
      furtherMatLoading: false,
      eraseBrush: {
        color: '#ffffff',
        pixel: 10
      },
      eraseMode: '',
      downloadImage: '',
      bushMask: {
        5: {style: {'font-size': '12px'},
          label: '5px'},
        10: {style: {'font-size': '12px'},
          label: '10px'},
        15: {style: {'font-size': '12px', 'width': '30px'},
          label: '15px'}
      },
      scaleMask: {
        1: {style: {'font-size': '12px'},
          label: '100%'},
        1.5: {style: {'font-size': '12px'},
          label: '150%'},
        2: {style: {'font-size': '12px', 'width': '50px'},
          label: '200%'}
      },
      originalImageName: '',
      downloadImageName: '',
      pictureUrl: '',
      asynMattingJobId: -1,
      syncMattingStatusInterval: false,
      isAutoMatting: true,
      isEditMattingMap: false,
      warningDialogVisible: false
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      getTokenHeaders: 'getTokenHeaders',
      selectedPictureUrl: 'getSelectedPictureUrl'
    })
  },
  methods: {
    ...mapActions([
      'setSelectedPictureUrl'
    ]),
    ...mapGetters({
    }),
    extractPictureUrl (value) {
      this.pictureUrl = value
      let params = {
        upload_type: 'url',
        url: this.pictureUrl
      }
      // let _URL = window.URL || window.webkitURL
      let img = new Image()
      let self = this
      img.onload = function () {
        self.uploadOnProgress()
        if (img.width < 480 || img.height < 480) {
          self.$message.error('图片尺寸太小, 最小为480*480')
        } else {
          self.request('uploadImage', params, data => {
            self.isFirstPage = false
            self.handleUploadImage(data, 'image.jpeg')
          })
        }
      }
      img.onerror = function () {
        this.$message.error('加载图片失败，请重试')
      }
      img.src = this.pictureUrl
    },
    uploadBeforeUpload (file) {
      let type = file.type
       // todo
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 8) {
        this.$message.error('上传文件太大')
        return false
      }
      return new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
          if (img.width < 480 || img.height < 480) {
            reject(new Error('sizeSmallError'))
          } else {
            resolve(file)
          }
        }
        img.onerror = function () {
          reject(new Error('loadError'))
        }
        img.src = _URL.createObjectURL(file)
      }).then(file => file, err => {
        if (err.message === 'sizeSmallError') {
          this.$message.error('图片尺寸太小, 最小为480*480')
        } else if (err.message === 'sizeBigError') {
          this.$message.error('图片尺寸太大, 最小为1000*1000')
        } else {
          this.$message.error('加载图片失败，请重试')
        }
        return Promise.reject(new Error('sizeError'))
      })
    },
    uploadOnProgress () {
      this.isFirstPage = false
      this.uploading = true
    },
    // todo
    uploadOnError: function () {

    },
    uploadOnSuccess: function (response, file, fileList) {
      let code = parseInt(response.code)
      if (code !== 0) {
        this.uploading = false
        this.requestFail(new Error('上传图片出错'))
        return
      }
      this.handleUploadImage(response.data, file.name)
    },
    handleUploadImage (data, fileName) {
      this.originalImage = new Image()
      // for test
      // this.handleImageName = '/image/1.jpeg'
      // this.originalImage.src = 'http://t00img.yangkeduo.com/openapi/images/2019-06-11/47af6b59fac7b45f2762be36d2a71bbd.jpeg'
      // end for test

      this.handleImageName = data.image_file
      this.originalImage.src = 'data:image/jpeg;base64,' + data.image_data_base64
      let self = this
      this.originalImage.onload = function () {
        self.canvasSize = [this.width, this.height]
        self.originalImageCanvas.width = this.width
        self.originalImageCanvas.height = this.height
        self.originalImageCanvasCtx.drawImage(this, 0, 0, this.width, this.height)
        self.bottomImageCanvas.width = this.width
        self.bottomImageCanvas.height = this.height
        self.bottomImageCanvasCtx.drawImage(this, 0, 0, this.width, this.height)
        self.resultImageCanvas.width = this.width
        self.resultImageCanvas.height = this.height

        self.startMatting()
      }
      this.mattingStep = 0
      // this.$refs.maskCanvas.reset()
      this.uploading = false
      this.originalImageName = fileName
      let s = fileName.split('.')
      this.downloadImageName = s[0] + '-wb.' + (s.length > 1 ? s[1] : 'png')
    },
    getTrimapImage () {
      let canvas = this.$refs.maskCanvas.canvas
      let ctx = canvas.getContext('2d')
      let image = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let data = image.data
      let fgcnt = 0
      let bgcnt = 0
      for (var i = 0; i < data.length; i += 4) {
        // red - background
        if (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 0) {
          data[i] = data[i + 1] = data[i + 2] = 0
          data[i + 3] = 255
          bgcnt += 1
        } else if (data[i] === 0 && data[i + 1] === 255 && data[i + 2] === 0) { // lime -front
          data[i] = data[i + 1] = data[i + 2] = 255
          data[i + 3] = 255
          fgcnt += 1
        } else { // 设置成灰色
          data[i] = data[i + 1] = data[i + 2] = 211
          data[i + 3] = 255
        }
      }
      if (fgcnt === 0 || bgcnt === 0) {
        this.warningDialogVisible = true
        return ''
      }
      let canvasTemp = document.createElement('canvas')
      canvasTemp.width = canvas.width
      canvasTemp.height = canvas.height
      let ctxTemp = canvasTemp.getContext('2d')
      ctxTemp.putImageData(image, 0, 0)
      return canvasTemp.toDataURL()
    },
    startMatting () {
      // let imageDataBase64 = this.getTrimapImage()
      // if (imageDataBase64 === '') {
      //   return
      // }
      this.isAutoMatting = false
      this.matLoading = true
      let params = {
        image_file: this.handleImageName
        // image_data_base64: imageDataBase64
      }
      this.request('asynStartMatting', params, data => {
        this.asynMattingJobId = data['job_id']
        this.syncMattingStatusInterval = setInterval(this.syncMattingStatus, 1000)
      }, data => { this.matLoading = false })
    },
    syncMattingStatus () {
      let params = {
        job_id: this.asynMattingJobId
      }
      this.request('getMattingStatus', params, data => {
        let status = data.status
        if (status === 'succ') {
          this.mattingImg = new Image()
          this.mattingImg.src = 'data:image/jpeg;base64,' + data.image_data_base64
          this.$refs.mattingImageCanvas.drawImage(this.mattingImg)
          this.mattingStep = 1
          this.matLoading = false
          clearInterval(this.syncMattingStatusInterval)
        } else if (status === 'fail') {
          this.matLoading = false
          clearInterval(this.syncMattingStatusInterval)
          this.requestFail(new Error('后台处理错误，请重试'))
        }
      }, data => { this.matLoading = false; clearInterval(this.syncMattingStatusInterval) })
    },
    resetMatting () {
      let self = this
      this.$confirm('确认重置？')
        .then(_ => {
          self.mattingStep = 0
          self.$refs.maskCanvas.reset()
          self.$refs.mattingImageCanvas.reset()
          self.eraseMode = ''
        })
        .catch(_ => {})
    },
    furtherMatting (isSilent = false) {
      this.furtherMatLoading = true
      let canvas = this.$refs.maskCanvas.canvas
      let ctx = canvas.getContext('2d')
      let image = ctx.getImageData(0, 0, canvas.width, canvas.height)
      let data = image.data
      for (var i = 0; i < data.length; i += 4) {
        // red - background
        if (data[i] === 255 && data[i + 1] === 0 && data[i + 2] === 0) {
          data[i] = data[i + 1] = data[i + 2] = 0
          data[i + 3] = 255
        } else if (data[i] === 0 && data[i + 1] === 255 && data[i + 2] === 0) { // lime -front
          data[i] = data[i + 1] = data[i + 2] = 255
          data[i + 3] = 255
        } else { // 设置成灰色
          data[i] = data[i + 1] = data[i + 2] = 211
          data[i + 3] = 255
        }
      }
      let canvasTemp = document.createElement('canvas')
      canvasTemp.width = canvas.width
      canvasTemp.height = canvas.height
      let ctxTemp = canvasTemp.getContext('2d')
      ctxTemp.putImageData(image, 0, 0)

      let params = {
        image_data_base64: canvasTemp.toDataURL(),
        image_file: this.handleImageName
      }
      this.request('furtherMatting', params, data => {
        this.mattingImg = new Image()
        this.mattingImg.src = 'data:image/jpeg;base64,' + data.image_data_base64
        this.$refs.mattingImageCanvas.drawImage(this.mattingImg)
        this.mattingStep = 1
        this.furtherMatLoading = false
      }, data => { this.furtherMatLoading = false }, isSilent)
    },
    downloadMattingImage () {
      this.resultImageCanvasCtx.drawImage(this.bottomImageCanvas, 0, 0)
      this.resultImageCanvasCtx.drawImage(this.$refs.mattingImageCanvas.canvas, 0, 0)
      this.downloadImage = this.resultImageCanvas.toDataURL()
      this.$refs.downloadLink.href = this.downloadImage
      this.$refs['downloadLink'].click()
      let f = this.handleImageName.split('/').pop()
      let s = f.split('.')
      let params = {
        image_data_base64: this.downloadImage,
        image_file: s[0] + '-wb.' + s[1]
      }
      this.request('uploadBase64Image', params, data => {
      }, undefined, true)
    },
    undoCanvas (domName) {
      this.$refs[domName].undo()
    },
    openUrlMsg () {
      this.$prompt('', '图片链接', {
        confirmButtonText: '提取',
        cancelButtonText: '取消',
        inputValidator: utils.inputValidatorNoEmpty,
        inputErrorMessage: '链接为空'
      }).then(({ value }) => {
        this.extractPictureUrl(value)
      }).catch(() => {
      })
    },
    doScale (scale) {
      // !!! 480 是初始div的宽度
      this.dwidth = 480 * scale
      this.dheight = 480 * scale
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/whitebackgroundview.less';
   /deep/ .el-popover{
    min-width:115px !important;
  }
  /deep/ .el-card__body{
    padding: 10px
  }
  .edit-row {
    margin-top:5px;
    margin-left:5px;
    margin-right: 20px;
  }
  .edit-title {
    font-size:14px;
    line-height:38px;
  }
  .edit-card {
    top: -60px;
    left: 300px;
    z-index: 2013;
    position: absolute;
    width: 280px;
  }
</style>
