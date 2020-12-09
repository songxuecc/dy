<template lang="html">
    <div class="picture-wall">
        <div v-if="tip" style="padding: 0 70px 5px; color: gray">{{ tip }}</div>
        <ul class="el-upload-list el-upload-list--picture-card">
            <draggable v-model="curPictureList" group="people" :disabled="!canDraggable || isPauseDraggable"
                       @start="isDraging=true" @end="isDraging=false"
            >
              <div v-for="(picture, index) in curPictureList" style="display: inline-block">
                <li :key="picture.url + index"
                    class="el-upload-list__item is-success" @click="onClickImage(picture, index)"
                    style="margin-bottom: 0px"
                >
                    <el-image :ref="'image'+index" :src="picture.url" :preview-src-list="curPictureUrlList"
                    ></el-image>
                    <label class="el-upload-list__item-status-label" :style="{visibility: picture.bg ? 'visible' : 'hidden'}">
                        <i class="el-icon-upload-success el-icon-check"></i>
                    </label>
                    <span class="el-upload-list__item-actions" @click.self="onClick(picture, index)">
                        <span class="el-upload-list__item-preview" style="margin-left: 0px;"
                              @click="onShowPreview(picture, index)"
                        > <i class="el-icon-zoom-in"></i> </span>
                        <span v-if="isAllowOperation('handle')" class="el-upload-list__item-delete"
                              style="visibility: visible;" @click="onHandle(picture, index)"
                        > <i class="el-icon-edit-outline"></i> </span>
                        <span v-if="isAllowOperation('delete')" class="el-upload-list__item-delete"
                              style="visibility: visible;" @click="onRemove(picture, index)"
                        > <i class="el-icon-delete"></i> </span>
                    </span>
                    <input type="checkbox" v-if="isAllowOperation('select')" :ref="'pictureCheck'+index" class="check-upload"
                           @change="handleSelect(picture, index, $event.target || $event.srcElement)"
                    >
                </li>
                <div style="font-size: 12px">第{{index + 1}}张</div>
              </div>
                <el-upload
                    slot="footer"
                    class="el-upload el-upload--picture-card"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :before-upload="handleBeforeUpload"
                    :on-exceed="imageExceedHandler"
                    action="/api/image/create"
                    :headers="getTokenHeaders"
                    :data="{'belong_type': belongType}"
                    :multiple="false"
                >
                    <i class="el-icon-plus upload-icon">
                        <br><span>({{ curPictureList.length }}/{{ containLimit }})</span>
                    </i>
                </el-upload>
            </draggable>
        </ul>
        <div>
          <span v-if="containLimit!=-1">图片最多 {{containLimit}} 张，</span><span>sku图片+轮播图+详情图 不能超过 50 张</span>
        </div>
    </div>
</template>
<script>
import common from '@/common/common'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'
import IconSvg from './icon-svg'

export default {
  components: {
    IconSvg,
    draggable
  },
  props: {
    tip: {
      type: String,
      default: ''
    },
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
      default: common.PictureViewFeature['delete'] | common.PictureViewFeature['add'] | common.PictureViewFeature['sort']
    },
    pictureUrlList: Array
  },
  data () {
    return {
      isDraging: false,
      canDraggable: true,
      isPauseDraggable: false,
      curPictureList: [],
      selectedPictureDic: {},
      elemUploadDiv: null,
      currentPicNums: 0
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    }),
    curPictureUrlList () {
      let list = []
      for (let i in this.curPictureList) {
        list.push(this.curPictureList[i].url)
      }
      this.$emit('imageChanged', this.curPictureList)
      return list
    },
    uploadIconVisible () {
      // return false
      return (this.featureType & common.PictureViewFeature['add']) &&
        this.curPictureList.length < this.containLimit
    }
  },
  watch: {
    pictureUrlList (list) {
      this.curPictureList.splice(0, this.curPictureList.length)
      for (let i in list) {
        this.curPictureList.push(list[i])
      }
      this.selectedPictureDic = {}

      this.elemUploadDiv = this.$el.querySelector('div.el-upload--picture-card')
      this.elemUploadDiv.style.visibility = (this.uploadIconVisible ? 'visible' : 'hidden')
      this.elemUploadDiv.style.height = (this.uploadIconVisible ? '148px' : '0')
    }
  },
  mounted () {
    this.canDraggable = this.isAllowOperation('sort')
  },
  methods: {
    imageExceedHandler (files, fileList) {
      this.$message.error('图片最多上传' + this.containLimit + '张')
    },
    clear () {
    },
    setCurPictureList (arr) {
      if (arr) {
        this.curPictureList = [...arr]
      }
    },
    isAllowOperation (operation) {
      if (!['delete', 'select', 'add', 'handle', 'sort'].includes(operation)) {
        return false
      }
      return (this.featureType & common.PictureViewFeature[operation]) !== 0
    },
    onClick (picture, index) {
      if (this.isAllowOperation('select')) {
        let checkElements = this.$refs['pictureCheck' + index]
        if (checkElements.length > 0 && !checkElements[0].disabled) {
          checkElements[0].checked = !checkElements[0].checked
          this.handleSelect(picture, index, checkElements[0])
        }
      } else {
        this.onShowPreview(picture, index)
      }
    },
    onClickImage (picture, index) {
      if (this.$refs['image' + index].length > 0 && !this.$refs['image' + index][0].showViewer) {
        this.isPauseDraggable = false
      }
    },
    onShowPreview (picture, index) {
      this.isPauseDraggable = true
      // clickHandler 文档中没有，在源码中找到的
      // https://github.com/ElemeFE/element/blob/dev/packages/image/src/main.vue
      this.$refs['image' + index][0].clickHandler()
    },
    onRemove (picture, index) {
      this.curPictureList.splice(index, 1)
      delete this.selectedPictureDic[picture.url]
      this.elemUploadDiv.style.visibility = (this.uploadIconVisible ? 'visible' : 'hidden')
      this.elemUploadDiv.style.height = (this.uploadIconVisible ? '148px' : '0')
    },
    onHandle (picture, index) {
      this.$emit('handleEdit', picture, index)
    },
    handleSelect (picture, index, target) {
      let url = this.pictureUrlList[index].url
      let cnt = Object.keys(this.selectedPictureDic).length
      let isEditDisable = 0
      if (target.checked) {
        this.selectedPictureDic[url] = 1
        cnt++
        isEditDisable = (cnt === this.selectLimit ? 1 : 0)
      } else {
        delete this.selectedPictureDic[url]
        cnt--
        isEditDisable = (cnt === this.selectLimit - 1 ? -1 : 0)
      }
      this.$emit('onSelectChanged', cnt)
      if (isEditDisable) {
        let length = this.curPictureList.length
        for (let i = 0; i < length; ++i) {
          let checkElements = this.$refs['pictureCheck' + i]
          if (checkElements.length > 0 && !checkElements[0].checked) {
            checkElements[0].disabled = (isEditDisable > 0)
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
        return
      }
      this.curPictureList.push({ 'url': response.data.url, 'bg': 0 })
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
