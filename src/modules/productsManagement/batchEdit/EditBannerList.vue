<template>
    <div>
     <draggable v-model="bannerImage" style="display: inline-block;" @end="handleSortImage"
     :options="{filter:'.banner-upload'}">
      <div v-for="(url,i) in bannerImage"  :key="i" class="banner-image">
          <div v-if="url" class="el-upload-list--picture-card">
            <img :src="url" style="width: 50px;height: 50px;display: block;" >
            <span class="el-upload-list__item-actions" style="font-size:12px;">
              <span class="el-upload-list__item-delete" @click="handleRemoveUploadImage(i, url)">
                <i class="el-icon-delete"></i>
              </span>
              <span class="el-upload-list__item-preview" @click="handlePreview(url)" style="margin-left: 0px;">
                <i class="el-icon-zoom-in"></i>
               </span>
            </span>
          </div>
          <el-upload v-else
            action="/api/uploadProductImage"
            class="banner-upload"
            :show-file-list="false"
            :before-upload="beforeUploadBanner"
            :on-success="function (res, file) { return handleUploadBannerSuccess(res, file, i)}"
            :on-error="handleUploadBannerError"
            :headers="getTokenHeaders"
            :data="{'belong_type': 0}"
            >
            <i  class="el-icon-plus banner-upload-icon">
              <br>
                <span style="font-size: 8px;">位置{{i+1}}</span>
            </i>
          </el-upload>
      </div>
      </draggable>
      <div class="banner-image"  v-if="bannerImage.length<10">
         <el-upload
          action="/api/uploadProductImage"
          class="banner-upload"
          :show-file-list="false"
          :before-upload="beforeUploadBanner"
          :on-success="function (res, file) { return handleUploadBannerSuccess(res, file, i)}"
          :on-error="handleUploadBannerError"
          :headers="getTokenHeaders"
          :data="{'belong_type': 0}"
          >
          <i  class="el-icon-plus banner-upload-icon">
            <br>
              <span style="font-size: 8px;">位置{{bannerImage.length + 1}}</span>
          </i>
        </el-upload>
      </div>
       <el-dialog :visible.sync="dialogPreviewVisible" width="400px" :modal="false">
            <el-image :src="previewPic" alt=""></el-image>
       </el-dialog>
    </div>
</template>

<script>
// import common from '@/common/common.js'
import { mapGetters } from 'vuex'
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: {
    bannerImage: Array,
    bannerEditProduct: Object
  },
  data () {
    return {
      dialogPreviewVisible: false,
      previewPic: ''
    }
  },
  computed: {
    ...mapGetters({
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  mounted () {
  },
  methods: {
    beforeUploadBanner (file) {
      let type = file.type
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 3) {
        this.$message.error('轮播图超过3M')
        return false
      }
    },
    handleUploadBannerError (err, file, fileList) {
      this.$message.error(err.message)
    },
    handleUploadBannerSuccess (response, file, index) {
      if (parseInt(response.code) !== 0) {
        if (response.msg) {
          this.$message.error(response.msg)
        }
        return
      }
      let url = response.data.image_url
      this.$set(this.bannerImage, index, url)
      for (let key in this.bannerEditProduct) {
        let product = this.bannerEditProduct[key]
        if (product.model['carousel_gallery_list'].length > index) {
          product.model['carousel_gallery_list'][index] = url
          this.$set(product.model['carousel_gallery_list'], index, url)
        } else {
          product.model['carousel_gallery_list'].push(url)
        }
      }
    },
    handleRemoveUploadImage (index, url) {
      this.$set(this.bannerImage, index, '')
      for (let key in this.bannerEditProduct) {
        let product = this.bannerEditProduct[key]
        if (index < product.model['carousel_gallery_list'].length) {
          if (product.model['carousel_gallery_list'][index] === url) {
            product.model['carousel_gallery_list'].splice(index, 1)
          }
        } else {
          let idx = product.model['carousel_gallery_list'].lastIndexOf(url)
          if (idx !== -1) {
            product.model['carousel_gallery_list'].splice(idx, 1)
          }
        }
      }
    },
    handleSortImage (event) {
      for (let key in this.bannerEditProduct) {
        let product = this.bannerEditProduct[key]
        for (let i in product.model['carousel_gallery_list']) {
          this.$set(product.model['carousel_gallery_list'], i, this.bannerImage[i])
        }
      }
    },
    handlePreview (url) {
      this.dialogPreviewVisible = true
      this.previewPic = url
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
    .banner-image {
      display: inline-block;
      margin-left: 5px;
      position:relative;
      width: 50px;height: 50px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      overflow: hidden;
    }
    /deep/ .banner-upload .el-upload {
        cursor: pointer;
        position: relative;

      }
    /deep/ .banner-upload .el-upload:hover {
        border-color: #409EFF;
      }
    /deep/ .banner-upload-icon {
        font-size: 14px;
        color: #8c939d;
        width: 50px;
        height: 50px;
        line-height: 25px;
        text-align: center;
      }
</style>
