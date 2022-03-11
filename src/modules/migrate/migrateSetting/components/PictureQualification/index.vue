<!-- 资质图片 -->
<template>
  <div style="margin-bottom:50px" class="migrateSetting_pictureQualification">
    <div  v-for="(quality, index) in qualitys" :key="index"  :required="quality.is_required" label-width="100px">
      <div :class="'title'">
        {{quality.quality_name}}({{quality.quality_attachments && quality.quality_attachments.length}}/{{ limit }})
        <span class="fail ml-5 is-error" v-if="quality.quality_attachments && quality.quality_attachments.length > limit">最多设置20张，请删除{{quality.quality_attachments && quality.quality_attachments.length - limit}}张图片</span>
      </div>
      <div class="flex wrap">
          <div
            v-for="(file, index) in quality.quality_attachments"
            :key="index"
            class="el-upload--picture-card "
          >
          <el-image
            class="PictureQualification__item-thumbnail"
            :src="file.url"
            :ref="file.url"
            :preview-src-list="[file.url]"
            fits="contain"
            alt=""
          />
          <span class="PictureQualification__item-actions">
            <span
              class="PictureQualification__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="PictureQualification__item-delete"
              @click="handleRemove(file, quality.quality_attachments)"
            >
              <i class="el-icon-delete"></i>
            </span>

            <span
              v-if="!disabled"
              class="PictureQualification__item-delete"
              @click="handlePs(file, quality.quality_attachments)"
            >
              <i class="el-icon-edit-outline"></i>
            </span>
          </span>
        </div>
        <el-upload
            action="/api/image/create"
            class="PictureQualification--picture-card"
            :on-success="
              (response, file, fileList) =>
                handleUploadSuccess(response, file, fileList, quality.quality_attachments)
            "
            :on-error="handleUploadError"
            :before-upload="handleBeforeUpload"
            :on-change ="(file, fileList) => handleUploadChange(file, fileList, quality.quality_attachments)"
            :headers="getTokenHeaders"
            :data="{ belong_type: 0, is_no_delete:1 }"
            :multiple="true"
            :show-file-list="false"
            v-if="quality.quality_attachments && quality.quality_attachments.length < limit"
          >
          <span
            class="flex column align-c justify-c"
            slot="default"
            style="line-height: 18px; padding-top: 8px"
          >
            <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
            <span class="uploader-text">({{ quality.quality_attachments && quality.quality_attachments.length }}/{{ limit }})</span>
          </span>
        </el-upload>
      </div>
    </div>

    <el-dialog :visible.sync="visibleDrawingBoard" append-to-body width="80%" title="图片编辑">
      <DrawingBoard :imgUrl="activeUrl" v-if="visibleDrawingBoard"/>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import debounce from 'lodash/debounce'
import DrawingBoard from '@/components/DrawingBoard'

export default {
  name: 'PictureQualification',
  props: {
    qualitys: Array
  },
  components: {
    DrawingBoard
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      limit: 20,
      activeUrl: '',
      visibleDrawingBoard: false
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  methods: {
    handleRemove (file, row) {
      const index = row.findIndex((item, index) => item.url === file.url)
      row.splice(index, 1)

      const nextqualitys = this.qualitys.map(item => {
        return {
          ...item,
          media_type: 1
        }
      })
      this.$emit('change', nextqualitys)
    },
    handlePs (file) {
      console.log(file.url, 'url')
      // 测试 正常图片
      // this.activeUrl = 'https://p6-aio.ecombdimg.com/obj/temai/06276c7f3c7742bd6675d3e9ba1120c2www800-800'
      // 测试 跨域图片
      // this.activeUrl = 'https://dy-image-no-delete.oss-cn-shanghai.aliyuncs.com/5009091-vsxpXgWNbUoh.jpg?t=0767982350'
      this.activeUrl = file.url
      this.visibleDrawingBoard = true
    },
    handlePictureCardPreview (file) {
      const refName = file.url
      if (
        this.$refs[refName] &&
        this.$refs[refName][0] &&
        this.$refs[refName][0].clickHandler
      ) {
        this.$refs[refName][0].clickHandler()
      }
    },
    handleUploadSuccess (response, file, fileList, row) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      console.log(file)
      row.push({
        url: response.data.url
      })
      const nextqualitys = this.qualitys.map(item => {
        return {
          ...item,
          media_type: 1
        }
      })
      this.$emit('change', nextqualitys)
    },
    handleUploadError (err, file, fileList) {
      this.$message.error(err.message)
    },
    handleUploadChange: debounce(function (file, fileList, attachments) {
      let length = 0
      if (attachments) {
        length = attachments.length
      }
      if (length + fileList.length > this.limit) {
        this.$message.error('图片最多上传' + this.limit + '张')
        this.$emit('canSave', false)
      } else {
        this.$emit('canSave', true)
      }
    }, 1000),
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
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';
/deep/ .el-dialog__header{
  margin-bottom: 0;
  padding-top: 10px;
  background: rgba(39,41,47,.9);
  overflow: hidden;
  border-radius: 10px 10px 0 0;
  .el-dialog__title {
    color:#fff;
  }
}

/deep/ .el-dialog__body{
  padding: 0;
  height: calc(100% - 55px);
}

/deep/ .el-dialog {
  margin-top: 5vh !important;
  height: 85vh;
}

/deep/ .el-dialog__headerbtn {
  top:0px;
}
</style>
