<template lang="html">
    <div style="height: 530px">
        <el-tabs v-loading="loadingCnt">
            <el-tab-pane label="商品图片">
              <div style="padding: 0 0 10px; color: gray; text-align: left">
                  <span>选择一张图片作为制作白底图的素材图</span>
              </div>
              <pictures-upload-view style="height: 400px" ref="allPicListView" :featureType="allPictureFeature" :pictureUrlList="allPicUrlList"
                                    @handlePreview="editPicture" :containLimit=-1
              ></pictures-upload-view>
            </el-tab-pane>
            <el-tab-pane label="本地图片">
                <div style="margin-top:80px">
                  <el-upload
                    drag
                    :action="uploadAction"
                    :headers="getTokenHeaders"
                    :data="{'upload_type': 'local', 'need_save_to_remote': true}"
                    :before-upload="uploadBeforeUpload"
                    :on-progress="uploadOnProgress"
                    :on-success="uploadOnSuccess"
                    :limit=1
                    :show-file-list="false"
                    :multiple="false"
                    :disabled="!this.isAuth">
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">上传一张图片作为制作白底图的素材图</div>
                  </el-upload>
                  <div class="el-upload__tip" slot="tip">只能上传jpg/jpeg/png文件，且不超过8M，长，宽大于480，小于1000</div>
              </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import picturesUploadView from '@/components/PicturesUploadView'
import request from '@/mixins/request.js'
import utils from '@/common/utils'
import common from '@/common/common'
import FormModel from '@/common/formModel'
import { mapGetters, mapActions } from 'vuex'

export default {
  mixins: [request],
  components: {
    picturesUploadView
  },
  data () {
    return {
      haveAttr: true,
      product: new FormModel(),
      titleCheckInfo: [],
      bannerPicUrlList: [],
      descPicUrlList: [],
      allPicUrlList: [],
      syncTimer: null,
      allPictureFeature: common.PictureViewFeature['handle_preview'],
      descPictureFeature: common.PictureViewFeature['select'],
      bannerPicCnt: 0,
      isShowShelvesCheck: false,
      checkedShelves: false,

      uploadAction: '/api/uploadImage'
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      getTokenHeaders: 'getTokenHeaders'
    })
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'setSelectedPictureUrl'
    ]),
    setProduct (product) {
      this.product.assign({
        goods_id: product.goods_id,
        title: product.goods_name,
        price: utils.fenToYuan(product.market_price),
        cat_id: product.cat_id,
        category_show: product.category_show,
        outer_id: product.outer_goods_id,
        description: product.goods_desc
      })
      this.isShowShelvesCheck = (parseInt(product.status) === 2)

      this.updateProperty()
    },
    updateProperty (catId = -1) {
      let params = { goods_id: this.product.model.goods_id, cat_id: catId }
      this.request('getProductProperty', params, data => {
        this.bannerPicUrlList = data.banner_json
        this.descPicUrlList = data.desc_json
        this.allPicUrlList = data.banner_json.concat(data.desc_json)
        this.bannerPicCnt = Object.keys(data.banner_json).length
      })
    },
    editPicture (picture) {
      this.setSelectedPictureUrl(picture.url)
    },

    uploadBeforeUpload (file) {
      let type = file.type
       // todo
      let size = file.size / 1024 / 1024
      if (type !== 'image/jpeg' && type !== 'image/png') {
        this.$message.error('只能上传jpg/jpeg/png文件')
        return false
      }
      if (size > 8) {
        this.$message.error('上传文件太大')
        return false
      }
      return new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL
        let img = new Image()
        img.onload = function () {
          if (img.width < 480 || img.height < 480) {
            reject(new Error('sizeSmallError'))
          } else {
            resolve(file)
          }
        }
        img.onerror = function () {
          reject(new Error('loadError'))
        }
        img.src = _URL.createObjectURL(file)
      }).then(file => file, err => {
        if (err.message === 'sizeSmallError') {
          this.$message.error('图片尺寸太小, 最小为480*480')
        } else if (err.message === 'sizeBigError') {
          this.$message.error('图片尺寸太大, 最小为1000*1000')
        } else {
          this.$message.error('加载图片失败，请重试')
        }
        return Promise.reject(new Error('sizeError'))
      })
    },
    uploadOnProgress () {
    },
    // todo
    uploadOnError: function () {
    },
    uploadOnSuccess: function (response, file, fileList) {
      let code = parseInt(response.code)
      if (code !== 0) {
        this.uploading = false
        this.requestFail(new Error('上传图片出错'))
        return
      }
      this.setSelectedPictureUrl(response.data.image_url)
    }
  }
}
</script>
