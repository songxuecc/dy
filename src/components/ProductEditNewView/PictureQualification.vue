<!-- 资质图片 -->
<template>
  <div>
    <div v-for="(specification,index) in specifications" :key="index">
      <el-upload
        v-if="specification.addSkuImage && !specificationValue.image"
        slot="reference"
        :class="[
          'skuSelect-el-upload--picture-card ',
          'hover-skuSelect-el-upload--picture-card',
        ]"
        :show-file-list="true"
        :on-success="
          (response, file, fileList) =>
            handleUploadSuccess(response, file, fileList, specificationValue)
        "
        :on-error="handleUploadError"
        :before-upload="handleBeforeUpload"
        action="/api/image/create"
        :headers="getTokenHeaders"
        :data="{ belong_type: belongType }"
        :multiple="true"
        :limit="20"
      >
        <span class="flex column align-c justify-c">
          <span><i class="el-icon-plus avatar-uploader-icon"></i></span>
          <span class="uploader-text">(0/1)</span>
        </span>
      </el-upload>

      <div
        v-if="specification.addSkuImage && specificationValue.image"
        :class="['skuSelect-el-upload--picture-card ']"
      >
        <div class="imgWrapper">
          <el-image
            :src="specificationValue.image"
            class="avatar"
            :ref="`img${specificationValue.skuString}-${idx}`"
            :preview-src-list="[specificationValue.image]"
          />
          <div :class="['mask', 'flex', 'justify-b', 'align-c']">
            <hh-icon
              type="iconshanchu1"
              style="font-size: 13px"
              class="iconshanchu1"
              @click="
                deleteImage(idx, specificationValue, specification, index)
              "
            />
            <hh-icon
              type="iconreview"
              style="font-size: 15px"
              class="iconreview"
              @click="
                previewImage(
                  specificationValue,
                  `img${specificationValue.skuString}-${idx}`
                )
              "
            />
          </div>
        </div>
      </div>
    </div>
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
      specifications: []
    }
  }
}
</script>
<style lang="less" scoped>
</style>
