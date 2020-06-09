<template lang="html">
    <div style="height: 530px">
        <el-tabs v-loading="loadingCnt">
            <el-tab-pane label="标题优化">
                <el-form class="setting-content" ref="form" :model="product.model" label-width="90px" style="height: 400px">
                    <el-form-item label="商品标题:">
                        <el-input v-model="product.model.title" size="mini" style="width: 600px;"
                                  :class="['input-text-left', {'warn': isTitleWarn}]"
                        >
                            <span slot="append" class="hint">{{ getStrRealLength(product.model.title) }} / 60</span>
                        </el-input>
                        <el-button size="mini" @click="checkTitle" style="margin-left: 10px; width: 80px">检测</el-button>
                        <a href="https://mms.pinduoduo.com/sycm/search_data/keyword" target="_blank" style="margin-left: 20px;">
                            <el-button size="mini" type="info" plain>查看热搜词</el-button>
                        </a>
                    </el-form-item>
                    <div style="padding: 10px 20px">
                        <div v-for="(item, index) in titleCheckInfo" :key="index" style="padding-top: 5px">
                            <i v-if="item.status == 'success'" class="el-icon-success" style="color: limegreen; vertical-align: middle;"></i>
                            <i v-else class="el-icon-error"  style="color: red; vertical-align: middle;"></i>
                            <span style="display:inline-block; width:100px">{{ item.title }}</span>
                            <span>{{ item.message }}</span>
                        </div>
                    </div>
                </el-form>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveTitle">保存</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="属性填写">
                <div style="height: 400px">
                    <div v-if="!haveAttr" style="padding: 10px 50px;">属性为空</div>
                    <attribute-view v-show="haveAttr" ref="attributeView" @selectFilter="selectFilter" @onAttrChanged="onAttrChanged">
                    </attribute-view>
                </div>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSaveProperty">保存</el-button>
                </div>
            </el-tab-pane>
            <el-tab-pane label="白底图生成">
                <div style="height: 480px; overflow: auto;">
                    <div style="padding: 0 70px 5px; color: gray">
                        <span> * 选择图片编辑为白底图 </span>
                    </div>
                    <pictures-upload-view ref="allPicListView" :featureType="allPictureFeature" :pictureUrlList="allPicUrlList"
                                          @handlePreview="editPicture"
                    ></pictures-upload-view>
                </div>
            </el-tab-pane>
            <el-tab-pane label="轮播图补充">
                <div style="height: 400px; overflow: auto;">
                    <div style="padding: 0 70px 5px; color: gray">
                        <span> * 从详情图补充到轮播图 </span>
                        <span :style="{ color: bannerPicCnt >= 10 ? 'red' : 'gray' }">{{ '(' + bannerPicCnt + '/10)' }}</span>
                    </div>
                    <pictures-upload-view ref="descPicListView" :featureType="descPictureFeature" :pictureUrlList="descPicUrlList"
                                          :selectLimit="10 - Object.keys(bannerPicUrlList).length" @onSelectChanged="onSelectChanged"
                    ></pictures-upload-view>
                </div>
                <div class="common-bottom">
                    <el-checkbox v-if="isShowShelvesCheck" v-model="checkedShelves" style="margin-left:-127px">
                        保存并上架
                    </el-checkbox>
                    <el-button type="primary" @click="onSavePicture">保存</el-button>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import picturesUploadView from '@/components/PicturesUploadView'
import attributeView from '@/components/AttributeView.vue'
import request from '@/mixins/request.js'
import utils from '@/common/utils'
import common from '@/common/common'
import FormModel from '@/common/formModel'
import { mapActions } from 'vuex'

export default {
  mixins: [request],
  components: {
    picturesUploadView,
    attributeView
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
      checkedShelves: false
    }
  },
  computed: {
    isTitleWarn () {
      return utils.getStrRealLength(this.product.model.title) > 60
    }
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

      this.checkTitle()
      this.updateProperty()
    },
    onClose () {
      this.bannerPicUrlList = []
      this.descPicUrlList = []
      this.allPicUrlList = []
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
    },
    getStrRealLength (str) {
      return utils.getStrRealLength(str)
    },
    checkTitle () {
      this.request('checkTitle', {title: this.product.model.title}, data => {
        this.titleCheckInfo = data
      })
    },
    updateProperty (catId = -1) {
      let params = { goods_id: this.product.model.goods_id, cat_id: catId }
      this.request('getProductProperty', params, data => {
        this.bannerPicUrlList = data.banner_json
        this.descPicUrlList = data.desc_json
        this.allPicUrlList = data.banner_json.concat(data.desc_json)
        this.haveAttr = this.$refs.attributeView.initAttribute(data.attribute_json)
        this.bannerPicCnt = Object.keys(data.banner_json).length
      })
    },
    selectFilter (templatePid, key, callback) {
      let params = {
        cat_id: this.product.model.cat_id,
        template_pid: templatePid,
        key: key
      }
      this.request('selectFilter', params, data => {
        callback(data)
      }, undefined, true)
    },
    onAttrChanged (isRequiredComplete) {
      this.isRequiredComplete = isRequiredComplete
    },
    onSaveTitle () {
      let goods = {
        goods_id: this.product.model.goods_id,
        goods_name: this.product.model.title,
        is_onsale: 2
      }
      if (this.isShowShelvesCheck && this.checkedShelves) {
        goods['is_onsale'] = 1
      }
      this.loadingCnt++
      this.request('updateProduct', {goods: [ JSON.stringify(goods) ]}, data => {
        this.checkUpdateStatus(data.job_id)
      }, () => {
        this.loadingCnt--
      })
    },
    onSaveProperty () {
      let goods = {
        goods_id: this.product.model.goods_id,
        goods_property_list: [],
        is_onsale: 2
      }
      if (this.isShowShelvesCheck && this.checkedShelves) {
        goods['is_onsale'] = 1
      }
      let attrUploadList = this.$refs.attributeView.getAttrUploadList(true)
      for (let i in attrUploadList) {
        let attrUpload = attrUploadList[i]
        if (attrUpload.vid_matched_list && attrUpload.vid_matched_list.length > 0) {
          for (let j in attrUpload.vid_matched_list) {
            let matched = attrUpload.vid_matched_list[j]
            goods['goods_property_list'].push({
              template_pid: attrUpload.id,
              ref_pid: attrUpload.ref_pid,
              vid: matched.value,
              vvalue: matched.label,
              punit: attrUpload.unit_matched
            })
          }
        } else if (attrUpload.tp_value !== '') {
          goods['goods_property_list'].push({
            template_pid: attrUpload.id,
            ref_pid: attrUpload.ref_pid,
            vid: attrUpload.vid_matched,
            vvalue: attrUpload.tp_value,
            punit: attrUpload.unit_matched
          })
        }
      }
      this.loadingCnt++
      this.request('updateProduct', {goods: [ JSON.stringify(goods) ]}, data => {
        this.checkUpdateStatus(data.job_id)
      }, () => {
        this.loadingCnt--
      })
    },
    onSavePicture () {
      let urls = Object.keys(this.$refs.descPicListView.selectedPictureDic)

      let goods = {
        goods_id: this.product.model.goods_id,
        append_carousel_gallery_list: urls,
        is_onsale: 2
      }
      if (this.isShowShelvesCheck && this.checkedShelves) {
        goods['is_onsale'] = 1
      }
      this.loadingCnt++
      this.request('updateProduct', {goods: [ JSON.stringify(goods) ]}, data => {
        this.checkUpdateStatus(data.job_id)
      }, () => {
        this.loadingCnt--
      })
    },
    checkUpdateStatus (jobId) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      this.request('getUpdateProductRes', {job_id: jobId}, data => {
        if (data.status !== 'complete') {
          let self = this
          this.syncTimer = setTimeout(function () {
            self.checkUpdateStatus(jobId)
          }, 500)
        } else {
          this.loadingCnt--
          if (data.goods_list.length > 0 && parseInt(data.goods_list[0].code) === 0) {
            let goods = {
              title: this.product.model.title
            }
            if (this.isShowShelvesCheck && this.checkedShelves) {
              goods['status'] = 1
            }
            this.$emit('changeProduct', goods)
            this.$message({
              message: '更新成功',
              type: 'success'
            })
          } else {
            if (data.goods_list.length > 0) {
              this.$message.error(data.goods_list[0].message)
            }
          }
        }
      })
    },
    onSelectChanged (selectCnt) {
      this.bannerPicCnt = selectCnt + Object.keys(this.bannerPicUrlList).length
    },
    editPicture (picture) {
      this.setSelectedPictureUrl(picture.url)
      this.$router.push({
        path: '/shopDecorate/whitebg'
      })
    }
  }
}
</script>
<style lang="less" scoped>
    @import '~@/assets/css/base.less';
</style>
