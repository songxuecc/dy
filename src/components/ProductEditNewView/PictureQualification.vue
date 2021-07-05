<!-- 资质图片 -->
<template>
  <div>
    <el-upload
        v-if="quarlity"
        slot="reference"
        :class="[
          'skuSelect-el-upload--picture-card ',
          'hover-skuSelect-el-upload--picture-card',
        ]"
        :show-file-list="true"
        :on-success="
          (response, file, fileList) =>
            handleUploadSuccess(response, file, fileList, quarlityValue)
        "
        :on-error="handleUploadError"
        :before-upload="handleBeforeUpload"
        action="/api/image/create"
        :headers="getTokenHeaders"
        :data="{ belong_type: belongType }"
        :multiple="true"
        :limit="20"
      >
        <span class="flex column align-c justify-c" slot="default">
          <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
          <span class="uploader-text">(0/1)</span>
        </span>

        <div slot="file" slot-scope="{file}">
          <img
            class="el-upload-list__item-thumbnail"
            :src="file.url" alt=""
          >
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePictureCardPreview(file)"
            >
              <i class="el-icon-zoom-in"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleDownload(file)"
            >
              <i class="el-icon-download"></i>
            </span>
            <span
              v-if="!disabled"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>

      </el-upload>

      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PictureQualification',
  props: {
    msg: String
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      quarlitys: []
    }
  },
  methods: {
    handleRemove (file) {
      console.log(file)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
