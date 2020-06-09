<template lang="html">
    <div class="picture-wall">
        <el-upload list-type="picture-card"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :on-success="handleUploadSuccess"
                   :on-error="handleUploadError"
                   :before-upload="handleBeforeUpload"
                   :file-list="pictureList"
                   action="/api/uploadProductImage"
                   :headers="getTokenHeaders"
                   :data="{'belong_type': belongType}"
        >
            <i class="el-icon-plus upload-icon">
                <br><span>({{ curPictureUrlList.length }}/{{ containLimit }})</span>
            </i>
        </el-upload>
        <div v-if="containLimit!=-1">
            <span>图片最多 {{containLimit}} 张</span>
        </div>
        <el-dialog :visible.sync="dialogVisible" custom-class="dialog-upward" append-to-body>
            <el-carousel ref="carousel" trigger="click" :autoplay="false" height="800px" :initial-index="initialIndex">
                <el-carousel-item v-for="url in curPictureUrlList" :key="url" :name="url" style="overflow: auto">
                    <img width="100%" :src="url" alt="">
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>
<script>
import common from '@/common/common'
import { mapGetters } from 'vuex'

export default {
  props: {
    belongType: {
      type: Number,
      default: 0
    },
    selectLimit: {
      type: Number,
      default: -1
    },
    containLimit: {
      type: Number,
      default: 10
    },
    featureType: {
      type: Number,
      default: common.PictureViewFeature['delete'] | common.PictureViewFeature['add']
    },
    pictureUrlList: Array
  },
  data () {
    return {
      dialogVisible: false,
      initialIndex: 0,
      imageNum: 0,
      curPictureUrlList: [],
      appendPictureUrlList: [],
      selectedPictureDic: {},
      elemUploadDiv: null
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    pictureList () {
      let list = []
      for (let i in this.pictureUrlList) {
        list.push({ url: this.pictureUrlList[i].url })
      }
      return list
    },
    uploadIconVisible () {
      return (this.featureType & common.PictureViewFeature['add']) &&
        this.curPictureUrlList.length < this.containLimit
    }
  },
  watch: {
    pictureUrlList (list) {
      this.$nextTick(function () {
        let dic = {}
        for (let i in this.pictureUrlList) {
          if (parseInt(this.pictureUrlList[i].bg) === 1) {
            dic[this.pictureUrlList[i].url] = 1
          }
        }
        let elemList = this.$el.querySelectorAll('li.el-upload-list__item')
        for (let i = 0; i < elemList.length; ++i) {
          let elem = elemList[i]
          let img = elem.querySelector('img.el-upload-list__item-thumbnail')
          if ('src' in img && img.src in dic) {
            let label = elem.querySelector('label.el-upload-list__item-status-label')
            label.style.visibility = 'visible'
          }
        }
        if (this.featureType & common.PictureViewFeature['delete']) {
          elemList = this.$el.querySelectorAll('span.el-upload-list__item-preview')
          for (let i = 0; i < elemList.length; ++i) {
            elemList[i].style.marginLeft = '0px'
          }
          elemList = this.$el.querySelectorAll('span.el-upload-list__item-delete')
          for (let i = 0; i < elemList.length; ++i) {
            elemList[i].style.visibility = 'visible'
          }
        }
        if (this.featureType & common.PictureViewFeature['select']) {
          elemList = this.$el.querySelectorAll('li.el-upload-list__item')
          for (let i = 0; i < elemList.length; ++i) {
            let input = document.createElement('input')
            input.type = 'checkbox'
            input.className = 'check-upload'
            input.disabled = (this.selectLimit === 0)
            input.style.position = 'absolute'
            input.style.top = '2px'
            input.style.right = '2px'
            input.style.fontSize = '20px'
            let self = this
            input.onchange = function (event) {
              if (input.checked) {
                self.handleSelect(i)
              } else {
                self.handleUnselect(i)
              }
            }
            elemList[i].appendChild(input)
          }
        }
        if (this.featureType & common.PictureViewFeature['handle_preview']) {
          elemList = this.$el.querySelectorAll('span.el-upload-list__item-preview')
          for (let i = 0; i < elemList.length; ++i) {
            elemList[i].firstElementChild.className = 'el-icon-edit-outline'
          }
        }
      })

      this.curPictureUrlList = []
      for (let i in list) {
        this.curPictureUrlList.push(list[i].url)
      }
      for (let i in this.appendPictureUrlList) {
        this.curPictureUrlList.push(this.appendPictureUrlList[i])
      }
      this.selectedPictureDic = {}

      this.elemUploadDiv = this.$el.querySelector('div.el-upload--picture-card')
      this.elemUploadDiv.style.visibility = (this.uploadIconVisible ? 'visible' : 'hidden')
      this.elemUploadDiv.style.height = (this.uploadIconVisible ? '148px' : '0')
    }
  },
  mounted () {
    let elementList = document.querySelectorAll('div.dialog-upward')
    for (let i = 0; i < elementList.length; ++i) {
      elementList[i].style.marginTop = '5vh'
    }
  },
  methods: {
    clear () {
      this.appendPictureUrlList = []
    },
    handleRemove (file, fileList) {
      this.curPictureUrlList = []
      for (let i in fileList) {
        this.curPictureUrlList.push(fileList[i].url)
      }
      delete this.selectedPictureDic[file.url]
      this.elemUploadDiv.style.visibility = (this.uploadIconVisible ? 'visible' : 'hidden')
      this.elemUploadDiv.style.height = (this.uploadIconVisible ? '148px' : '0')
    },
    handlePictureCardPreview (file) {
      if (this.featureType & common.PictureViewFeature['handle_preview']) {
        this.$emit('handlePreview', file)
      } else {
        for (let i in this.curPictureUrlList) {
          if (file.url === this.curPictureUrlList[i]) {
            this.initialIndex = parseInt(i)
            break
          }
        }
        this.dialogVisible = true
        let self = this
        setTimeout(function () {
          self.$refs['carousel'].setActiveItem(file.url)
        }, 10)
      }
    },
    handleSelect (index) {
      let url = this.pictureUrlList[index].url
      this.selectedPictureDic[url] = 1
      let cnt = Object.keys(this.selectedPictureDic).length
      this.$emit('onSelectChanged', cnt)
      if (cnt >= this.selectLimit) {
        let elemList = this.$el.querySelectorAll('input.check-upload')
        for (let i = 0; i < elemList.length; ++i) {
          if (!elemList[i].checked) {
            elemList[i].disabled = true
          }
        }
      }
    },
    handleUnselect (index) {
      let url = this.pictureUrlList[index].url
      delete this.selectedPictureDic[url]
      let cnt = Object.keys(this.selectedPictureDic).length
      this.$emit('onSelectChanged', cnt)
      if (cnt < this.selectLimit) {
        let elemList = this.$el.querySelectorAll('input.check-upload')
        for (let i = 0; i < elemList.length; ++i) {
          if (!elemList[i].checked) {
            elemList[i].disabled = false
          }
        }
      }
    },
    handleBeforeUpload (file) {
      let type = file.type
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 8) {
        this.$message.error('上传文件超过8M')
        return false
      }
    },
    handleUploadSuccess (response, file, fileList) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        fileList.pop()
        return
      }
      this.appendPictureUrlList.push(response.data.image_url)
      this.curPictureUrlList.push(response.data.image_url)
      file.url = response.data.image_url
      this.elemUploadDiv.style.visibility = (this.uploadIconVisible ? 'visible' : 'hidden')
      this.elemUploadDiv.style.height = (this.uploadIconVisible ? '148px' : '0')
    },
    handleUploadError (err, file, fileList) {
      this.$message.error(err.message)
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/pictureview.less';
</style>
