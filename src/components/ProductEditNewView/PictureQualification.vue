<!-- 资质图片 -->
<template>
  <div class="flex wrap">
    <div
      v-for="(file, index) in quarlitys"
      :key="index"
      class="el-upload--picture-card"
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
          @click="handleRemove(file)"
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
          handleUploadSuccess(response, file, fileList, specificationValue)
      "
      :on-error="handleUploadError"
      :before-upload="handleBeforeUpload"
      :headers="getTokenHeaders"
      :data="{ belong_type: 0 }"
      :multiple="true"
      :limit="limit"
      :on-exceed="imageExceedHandler"
      :file-list="quarlitys"
      :show-file-list="false"
      v-if="quarlitys.length < limit"
    >
      <span
        class="flex column align-c justify-c"
        slot="default"
        style="line-height: 28px; padding-top: 12px"
      >
        <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
        <span class="uploader-text">({{ quarlitys.length }}/{{ limit }})</span>
      </span>
    </el-upload>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import cloneDeep from 'lodash/cloneDeep'
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
      quarlitys: [],
      limit: 20
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  watch: {
    quarlitys (n) {}
  },
  methods: {
    imageExceedHandler (files, fileList) {
      this.$message.error('图片最多上传' + this.limit + '张')
    },
    handleRemove (file) {
      const arr = []
      this.quarlitys.forEach((item) => {
        if (item.url !== file.url) {
          arr.push(item)
        }
      })
      this.quarlitys = arr
      this.$set(this, 'quarlitys', arr)
    },
    handlePictureCardPreview (file) {
      const refName = file.url
      console.log(this.$refs[refName])
      if (
        this.$refs[refName] &&
        this.$refs[refName][0] &&
        this.$refs[refName][0].clickHandler
      ) {
        this.$refs[refName][0].clickHandler()
      }
    },
    handleDownload (file) {
      console.log(file)
    },
    handleUploadSuccess (response, file, fileList, row) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      this.quarlitys.push({
        url: response.data.url
      })
      console.log(this.quarlitys, this.quarlitys.length === this.limit)
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
@import '~./PictureQualification.less';
</style>
