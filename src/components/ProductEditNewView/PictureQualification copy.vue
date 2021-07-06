<!-- 资质图片 -->
<template>
  <div>
    <el-upload
      action="/api/image/create"
      class="PictureQualification--picture-card"
      :show-file-list="false"
      :on-success="
        (response, file, fileList) =>
          handleUploadSuccess(
            response,
            file,
            fileList,
            specificationValue
          )
      "
      :on-error="handleUploadError"
      :before-upload="handleBeforeUpload"
      :headers="getTokenHeaders"
      :data="{ belong_type: 0 }"
      :multiple="false"
      list-type="picture-card"
    >
      <span
        class="flex column align-c justify-c"
        slot="default"
        style="line-height: 28px;padding-top:12px"
      >
        <span ><i class="el-icon-plus avatar-uploader-icon"></i></span>
        <span class="uploader-text">({{quarlitys.length}}/20)</span>
      </span>
      <div slot="file" slot-scope="{ file }">
        <el-image
          class="PictureQualification__item-thumbnail"
          :src="file.url"
          :ref="file.url"
          :preview-src-list="[file.url]"
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
    </el-upload>

    <!-- <el-dialog :visible.sync="dialogVisible" :modal="false" width="400">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      quarlitys: cloneDeep([])
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  methods: {
    handleRemove (file) {
      console.log(file)
      // const arr = []
      // this.quarlitys.forEach(item => {
      //   if (item.url !== file) {
      //     arr.push(item)
      //   }
      // })
      // this.quarlitys = arr
    },
    // handleRemove (file, fileList) {
    //   console.log(file, fileList)
    // },
    handlePictureCardPreview (file) {
      const refName = file.url
      if (this.$refs[refName] && this.$refs[refName] && this.$refs[refName].clickHandler) {
        this.$refs[refName].clickHandler()
      }
    },
    handleDownload (file) {
      console.log(file)
    },
    handleUploadSuccess (response, file, fileList, row) {
      console.log(this.quarlitys, '1')
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      console.log(fileList, 'fileList')
      console.log(response, 'response')
      this.quarlitys.push({
        url: response.data.url
      })
      console.log(this.quarlitys, this.quarlitys.length)

      this.$set(fileList)
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
// @import '~./SkuSelect.less';
/deep/ .el-form-item__content {
  line-height: 28px;
}
</style>

<style lang="less" scoped>
/deep/ .el-upload--picture-card {
  width: 88px;
  height: 88px;
  .avatar-uploader-icon {
    font-size: 20px;
    line-height: 28px;
  }
  &:hover {
    border-color: @color-primary;
    color: @color-primary;
    .avatar-uploader-icon {
      color: @color-primary;
    }
  }
  &:focus {
    border-color: @color-primary;
    color: @color-primary;
    color: @color-primary;
    .avatar-uploader-icon {
      color: @color-primary;
    }
  }
}
/deep/ .PictureQualification--picture-card {
  .el-upload--text {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 4px;
    box-sizing: border-box;
    width: 88px;
    height: 88px;
    cursor: pointer;
    vertical-align: top;
  }

  .el-upload-list__item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 88px;
    height: 88px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    border-radius: 5px;
    line-height: 1;
    margin-top: 0;
    transition: all 0.1s !important;
  }
  .PictureQualification__item-actions {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: opacity 0.1s;
    display: flex;
    align-items: center;
    font-size: 12px;
    justify-content: space-around;
    &:hover {
      opacity: 1;
    }
  }
}
/deep/  .PictureQualification__item-thumbnail {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background-color: rgba(0, 0, 0, 0.04);
  user-select: none;
}
</style>
