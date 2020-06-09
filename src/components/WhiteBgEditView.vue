<template lang="html">
    <div  style="margin-top: -30px;">
      <el-row>
        <el-col :span="16">

          <el-row>
            <el-col :span="16">
          <el-input-number v-model="imageScaleNum" @change="doScale" :min="20" :max="200" size="small" :step=20
          style="margin-bottom:10px;"></el-input-number>
          </el-col>
          <el-col :span="8" style="text-align: center;">
          <!-- <el-button type="primary" size="mini" @click="downloadImage">保存</el-button> -->
          <el-button type="primary" size="mini" @click="saveImage">保存</el-button>
          </el-col>
          </el-row>
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
          </el-col>
          <el-col :span="8" style="margin-top:50px;">
              <el-row class="edit-row">
                  <el-col :span="24">
                  <el-radio-group v-model="eraseMode" size="mini">
                    <el-radio-button label="recover">还原</el-radio-button>
                    <el-radio-button label="erase">擦除</el-radio-button>
                  </el-radio-group>
                  </el-col>
                </el-row>
                <el-row class="edit-row">
                  <el-col :span="4"><span class="edit-title" style="line-height: 38px;">粗细</span></el-col>
                  <el-col :span="20">
                    <el-slider v-model="eraseBrush.pixel" :min="5" :max="15" :marks="bushMask" :step=5>
                    </el-slider>
                    </el-col>
                </el-row>
                <!-- <el-row class="edit-row" style="margin-top:20px">
                    <el-button type="primary" size="small">保存</el-button>
                    <el-button type="primary" size="small">下载</el-button>
                </el-row> -->
          </el-col>
      </el-row>
    </div>
</template>
<script>

import request from '@/mixins/request.js'
import utils from '@/common/utils.js'
import EraseCanvas from '@/components/BaseEraseCanvas.vue'

export default {
  mixins: [request],
  components: {
    EraseCanvas
  },
  props: {
    product: Object
  },
  watch: {
    product: {
      handler: function (newVal) {
        this.product = newVal
        this.load()
      },
      deep: true
    }
  },
  data () {
    return {
      imageScaleNum: 100,
      editWhiteBgImageUrl: '',
      scale: 1,
      dwidth: '480',
      dheight: '480',
      bushMask: {
        5: {style: {'font-size': '12px'},
          label: '5px'},
        10: {style: {'font-size': '12px'},
          label: '10px'},
        15: {style: {'font-size': '12px', 'width': '30px'},
          label: '15px'}
      },
      eraseBrush: {
        color: '#ffffff',
        pixel: 10
      },
      eraseMode: 'recover',
      canvasSize: []
    }
  },
  activated () {
  },
  mounted () {
    this.load()
  },
  methods: {
    load () {
      this.$refs.mattingImageCanvas.reset()
      if (this.product.original_pic && this.product.white_bg_pic) {
        this.bottomImageCanvas = this.$refs['bottomImageCanvas']
        this.bottomImageCanvasCtx = this.bottomImageCanvas.getContext('2d')
        this.originalImage = new Image()
        this.originalImage.crossOrigin = 'anonymous'
        this.originalImage.src = this.product.original_pic
        let self = this
        this.originalImage.onload = function () {
          self.canvasSize = [this.width, this.height]
          self.bottomImageCanvas.width = this.width
          self.bottomImageCanvas.height = this.height
          self.bottomImageCanvasCtx.drawImage(this, 0, 0, this.width, this.height)

          self.mattingImg = new Image()
          self.mattingImg.crossOrigin = 'anonymous'
          self.mattingImg.src = self.product.white_bg_pic
          self.$refs.mattingImageCanvas.drawImage(self.mattingImg)
        }
      }
    },
    doScale (scale) {
      scale = scale / 100
      // !!! 480 是初始div的宽度
      this.dwidth = 480 * scale
      this.dheight = 480 * scale
    },
    downloadImage () {
      let canvas = document.createElement('canvas')
      canvas.width = this.canvasSize[0]
      canvas.height = this.canvasSize[1]
      let ctx = canvas.getContext('2d')

      ctx.drawImage(this.bottomImageCanvas, 0, 0)
      ctx.drawImage(this.$refs.mattingImageCanvas.canvas, 0, 0)
      canvas.toBlob((blob) => {
        let url = URL.createObjectURL(blob)
        utils.downloadURL(url, this.product.goods_id + '.jpeg')
        URL.revokeObjectURL(url)
      })
    },
    saveImage () {
      let canvas = document.createElement('canvas')
      canvas.width = this.canvasSize[0]
      canvas.height = this.canvasSize[1]
      let ctx = canvas.getContext('2d')

      ctx.drawImage(this.bottomImageCanvas, 0, 0)
      ctx.drawImage(this.$refs.mattingImageCanvas.canvas, 0, 0)
      let params = {
        goods_id: this.product.goods_id,
        image_data_base64: canvas.toDataURL()
      }
      this.request('saveProductWhiteBg', params, data => {
        this.product.white_bg_pic = data['white_bg_pic']
        this.$message({
          message: '保存成功',
          type: 'success'
        })
        this.$emit('closeDialog')
      }, data => { })
    },
    hasChangeImage () {
      return this.$refs.mattingImageCanvas.points.length > 0
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    @import '~@/assets/css/whitebackgroundview.less';
    .action-button{
      display: block;
      margin-bottom: 5px;
      margin-left: 12px;
    }
    .edit-row {
      margin-top:5px;
      margin-left:5px;
      margin-right: 20px;
  }
</style>
