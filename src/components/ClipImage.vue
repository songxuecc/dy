<!--
1.上传图片 在线编辑
2. 已经有的图片
-->
<template>
    <el-dialog
      :visible.sync="visible"
      width="628px"
      :title="title? title: '图片裁剪'"
      append-to-body
      class="ClipImage-dialog">
        <div class="cut">
          <vue-cropper
            ref="cropper"
            :img="option.img"
            :output-size="option.size"
            :output-type="option.outputType"
            :info="true"
            :full="option.full"
            :fixed="fixed"
            :fixed-number="fixedNumber"
            :can-move="option.canMove"
            :can-move-box="option.canMoveBox"
            :fixed-box="option.fixedBox"
            :original="option.original"
            :auto-crop="option.autoCrop"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            :center-box="option.centerBox"
            :high="option.high"
            :max-img-size="option.max"
            @real-time="realTime"
            @img-moving="imgMoving"
            @img-load="imgLoad"
            @crop-moving="cropMoving"
            :mode="option.mode"
            ></vue-cropper>
        </div>
        <div >
            <el-button  size="small" type="primary" @click="changeScale(1)"  plain><i class="el-icon-plus"></i></el-button>
            <el-button  size="small" type="primary" @click="changeScale(-1)" plain><i class="el-icon-minus"></i></el-button>
            <el-button  size="small" type="primary" @click="refreshCrop" plain><i class="el-icon-refresh"></i></el-button>
            <el-button  size="small" type="primary" @click="down" plain><i class="el-icon-download"></i></el-button>
        </div>
          <div style="margin-top:25px">
            <el-button  size="medium" type="primary" style="width:70px" plain @click="visible = false">取消</el-button>
            <el-button  size="medium" type="primary" style="width:70px" @click="finish" :disbaled="loading" :loading="loading">保存</el-button>
          </div>
  </el-dialog>

</template>

<script>
import { VueCropper } from 'vue-cropper'
import servises from '@servises'

export default {
  name: 'ClipImage',
  props: {
    fixed: Boolean,
    fixedNumber: Object,
    title: String
  },
  components: {
    VueCropper
  },
  data: function () {
    return {
      previews: {},
      loading: false,
      visible: false,
      option: {
        img: '',
        size: 1,
        full: true,
        outputType: 'jpeg',
        canMove: false,
        fixedBox: false,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: 400,
        autoCropHeight: 400,
        centerBox: true,
        high: false,
        max: 5120,
        mode: '400px 400px'
      }
    }
  },
  methods: {
    open (img) {
      this.tranformImgToBase64(img, (base64) => {
        this.option.img = base64
        this.visible = true
      })
    },
    tranformImgToBase64 (src, callback) {
      let _this = this
      let image = new Image()
      image.crossOrigin = '*'
      src = src.includes('?') ? src + '&v=' + Math.random() : src + '?v=' + Math.random()
      // 处理缓存
      image.src = src
      // 支持跨域图片
      image.onload = function () {
        let base64 = _this.transBase64FromImage(image)
        callback && callback(base64)
      }
      image.onerror = function () {
        console.log('Error loading ' + src)
      }
    },
    transBase64FromImage (image) {
      let canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(image, 0, 0, image.width, image.height)
      // 可选其他值 image/jpeg
      return canvas.toDataURL('image/jpeg')
    },
    refreshCrop () {
      this.$refs.cropper.refresh()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    finish () {
      this.loading = true
      this.$refs.cropper.getCropBlob((data) => {
        let form = new FormData()
        form.append('file', data, 'jpeg')
        servises.imageCreate(form, {
          'Content-Type': 'multipart/form-data;'
        }).then(d => {
          const url = d.url
          console.log('裁剪图片地址：', url)
          this.visible = false
          this.$emit('submit', url)
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      })
    },
    down () {
      var aLink = document.createElement('a')
      aLink.download = '虎虎-裁剪后的图片'
      this.$refs.cropper.getCropBlob((data) => {
        this.downImg = window.URL.createObjectURL(data)
        aLink.href = window.URL.createObjectURL(data)
        aLink.click()
      })
    },
    // 实时预览函数
    realTime (data) {
      this.previews = data
    },
    imgMoving (data) {
    },
    imgLoad (data) {
    }
  }
}
</script>
<style lang="less" scoped>

   .cut {
        width: 565px;
        height: 400px;
        margin: 20px auto;
      }

      .c-item {
        max-width: 800px;
        margin: 10px auto;
        margin-top: 20px;
      }

      .content {
        margin: auto;
        max-width: 1200px;
        margin-bottom: 100px;
      }

      .des {
        line-height: 30px;
      }

      code.language-html {
        padding: 10px 20px;
        margin: 10px 0px;
        display: block;
        background-color: #333;
        color: #fff;
        overflow-x: auto;
        font-family: Consolas, Monaco, Droid, Sans, Mono, Source, Code, Pro, Menlo, Lucida, Sans, Type, Writer, Ubuntu, Mono;
        border-radius: 5px;
        white-space: pre;
      }

      /*.title, .title:hover, .title-focus, .title:visited {
        color: black;
      }*/

      .title {
        display: block;
        text-decoration: none;
        text-align: center;
        line-height: 1.5;
        margin: 20px 0px;
        background-image: -webkit-linear-gradient(left,#3498db,#f47920 10%,#d71345 20%,#f7acbc 30%,#ffd400 40%,#3498db 50%,#f47920 60%,#d71345 70%,#f7acbc 80%,#ffd400 90%,#3498db);
        color: transparent;
        -webkit-background-clip: text;
        background-size: 200% 100%;
        animation: slide 5s infinite linear;
        font-size: 40px;
      }

      .test {
        height: 400px;
      }

      .c-item {
        display: block;
        user-select: none;
      }
</style>

<style lang="less">
.ClipImage-dialog {
    .el-dialog {
      margin-top:10vh !important;
    }
  }
</style>
