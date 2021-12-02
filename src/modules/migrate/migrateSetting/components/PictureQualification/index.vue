<!-- 资质图片 -->
<template>
  <div style="margin-bottom:50px">
    <el-form-item  v-for="(quality, index) in qualitys" :key="index"  :label="quality.quality_name + ':'" :required="quality.is_required" label-width="100px">
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
      :headers="getTokenHeaders"
      :data="{ belong_type: 0 }"
      :multiple="true"
      :limit="quality.quality_attachments ? limit - quality.quality_attachments.length : 20"
      :on-exceed="imageExceedHandler"
      :show-file-list="false"
      v-if="quality.quality_attachments && quality.quality_attachments.length < limit"
    >
      <span
        class="flex column align-c justify-c"
        slot="default"
        style="line-height: 28px; padding-top: 12px"
      >
        <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
        <span class="uploader-text">({{ quality.quality_attachments && quality.quality_attachments.length }}/{{ limit }})</span>
      </span>
    </el-upload>
    </div>
  </el-form-item>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PictureQualification',
  props: {
    qualitys: Array
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      limit: 20
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  methods: {
    imageExceedHandler (files, fileList) {
      this.$message.error('图片最多上传' + this.limit + '张')
    },
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
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    }
  }
}
</script>
<style lang="less" scoped>
@import '~./index.less';
</style>
