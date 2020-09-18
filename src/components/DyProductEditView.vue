<script>
import productEditView from '@/components/ProductEditView.vue'
import utils from '@/common/utils'
import FormModel from '@/common/formModel'
import moment from 'moment'
import { mapActions } from 'vuex'

export default {
  extends: productEditView,
  components: {
  },
  data () {
    return {
      syncTimer: null,
      dateRange: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    }
  },
  computed: {},
  mounted () {
    this.isDyProduct = true
    this.isShowTemplateTab = false
    this.saveBtnText = '保存'
  },
  methods: {
    ...mapActions([
      'addUpdateJobId',
      'deleteUpdateJobId'
    ]),
    setProduct (product) {
      this.product.assign({
        goods_id: product.goods_id,
        title: product.goods_name,
        price: utils.fenToYuan(product.market_price),
        cat_id: product.cat_id,
        category_show: product.category_show,
        outer_id: product.outer_goods_id,
        description: product.goods_desc,
        status: product.status,
        check_error_msg_static: product.check_error_msg_static
      })
      this.isShowShelvesCheck = (parseInt(product.status) === 2)
      this.template = new FormModel()
      this.template.assign({
        pay_type: product.pay_type,
        mobile: product.mobile
      })
      this.checkedRefundable = (parseInt(product.is_refundable) === 1)
      this.checkedFolt = (parseInt(product.is_folt) === 1)

      this.initSku(product.sku_list)
      this.updateIsSingleSku()

      this.updateProperty()
      // this.getTemplate()
    },
    getTemplate () {
      this.request('getTemplate', {}, data => {
        this.template.assign({
          template_list: data.template_list
        })
      })
    },
    updateProperty (catId = -1) {
      let params = { goods_id: this.product.model.goods_id, cat_id: catId }
      this.request('getProductProperty', params, data => {
        this.origionAttr = data.raw_attribute_json ? data.raw_attribute_json : {}
        this.haveAttr = this.$refs.attributeView.initAttribute(data.attribute_json)

        if (catId === -1) { // 首次初始化
          this.bannerPicUrlList = data.banner_json
          this.descPicUrlList = data.desc_json

          this.product.assign({bannerPicUrlList: this.bannerPicUrlList.map(val => val['url'])})
          this.product.assign({descPicUrlList: this.descPicUrlList.map(val => val['url'])})
          this.product.assign({attrs: JSON.parse(JSON.stringify(this.$refs.attributeView.getAttrUploadList()))})
        }
      })
    },
    initSku (skuList) {
      if (!skuList || skuList.length === 0) {
        this.skuPropertyList = []
        this.skuShowList = []
        this.product.assign({skuMap: this.getSkuList()})
        return
      }
      this.skuPropertyList = []
      let propertyIndexMap = {}
      for (let i in skuList[0].spec) {
        let item = skuList[0].spec[i]
        this.skuPropertyList.push({
          id: item.parent_id,
          name: item.parent_name,
          filter: false
        })
        propertyIndexMap[item.parent_id] = i
      }
      if (this.skuPropertyList.length === 0) {
        this.skuPropertyList = [{ id: 0, name: '', filter: false }]
      }

      this.skuShowList = []
      let nSkuPropertyValueMap = {}
      for (let i in skuList) {
        let sku = skuList[i]
        let propertyList = []
        for (let j in sku.spec) {
          let item = sku.spec[j]
          let index = propertyIndexMap[item.parent_id]
          propertyList[index] = {
            id: item.parent_id + ':' + item.spec_id,
            name: item.spec_name
          }
          if (!nSkuPropertyValueMap[item.parent_id]) {
            nSkuPropertyValueMap[item.parent_id] = {}
          }
          nSkuPropertyValueMap[item.parent_id][item.spec_id] = {
            'value': item.spec_name,
            'checked': false
          }
        }
        if (propertyList.length === 0) {
          propertyList = [{ id: 0, name: '默认规格' }]
        }
        this.skuShowList.push({
          property_key: 'default',
          property_list: propertyList,
          sku_id: sku.sku_id,
          price: utils.fenToYuan(sku.price),
          promo_price: utils.fenToYuan(sku.multi_price),
          quantity: sku.quantity,
          img: sku.thumb_url,
          // is_onsale: sku.is_onsale,
          // limit_quantity: sku.limit_quantity,
          spec: sku.spec,
          hidden: false
        })
      }
      this.$set(this, 'skuPropertyValueMap', nSkuPropertyValueMap)
      this.product.assign({skuMap: this.getSkuList()})
    },
    onSaveProduct () {
      this.refreshProduct()
      let goods = {
        goods_id: this.product.model.goods_id,
        is_onsale: 2,
        cat_id: this.product.model.cat_id,
        goods_name: this.product.model.title,
        market_price: utils.yuanToFen(this.product.model.price),
        out_goods_id: this.product.model.outer_id,
        goods_desc: this.product.model.description,
        goods_property_list: [],
        cost_template_id: this.template.model.cost_template_id,
        is_pre_sale: this.template.model.is_pre_sale
      }
      let templateDiff = this.template.getDiff()
      for (let key in templateDiff) {
        goods[key] = templateDiff[key]
      }
      if ('is_pre_sale' in templateDiff && templateDiff['is_pre_sale']) {
        let date = ''
        if (this.preSaleDate) {
          date = moment(this.preSaleDate).format('YYYY-MM-DD HH:mm:ss')
        }
        if (date) {
          goods['pre_sale_date'] = date
        }
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
      let diff = this.product.getDiff()
      if ('skuMap' in diff) {
        goods['sku_list'] = this.getSkuList()
      }
      if ('bannerPicUrlList' in diff || 'descPicUrlList' in diff) {
        goods['carousel_gallery_list'] = this.$refs['bannerPicListView'].curPictureUrlList
        goods['detail_gallery_list'] = this.$refs['descPicListView'].curPictureUrlList
      }
      this.loadingCnt++
      this.request('updateProduct', {goods: [ JSON.stringify(goods) ]}, data => {
        this.checkUpdateStatus(data.job_id)
      }, () => {
        this.loadingCnt--
      })
    },
    getSkuList () {
      let skuList = []
      for (let i in this.skuShowList) {
        let skuShow = this.skuShowList[i]
        skuList.push({
          sku_id: skuShow.sku_id,
          quantity: skuShow.quantity,
          price: utils.yuanToFen(skuShow.price),
          multi_price: utils.yuanToFen(skuShow.promo_price),
          // is_onsale: skuShow.is_onsale,
          // limit_quantity: skuShow.limit_quantity,
          spec: skuShow.spec
        })
      }
      return skuList
    },
    onChangeCate (data) {
      this.dialogVisible = false
      this.product.model.cat_id = data.id
      this.product.model.category_show = data.name

      this.updateProperty(this.product.model.cat_id)
    },
    onClose () {
      this.bannerPicUrlList = []
      this.descPicUrlList = []
      this.origionAttr = {}
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      this.$refs['bannerPicListView'].clear()
      this.$refs['descPicListView'].clear()
      this.$refs['attributeView'].clear()
    },
    checkUpdateStatus (jobId, isUpdateProperty = false) {
      if (this.syncTimer) {
        clearTimeout(this.syncTimer)
        this.syncTimer = null
      }
      this.request('getUpdateProductRes', {job_ids: [jobId]}, data => {
        if (!(jobId in data)) {
          this.$message.error('更新失败，没有添加更新任务')
          return
        }
        let jobItem = data[jobId]
        if (jobItem.status !== 'complete') {
          let self = this
          this.syncTimer = setTimeout(function () {
            self.checkUpdateStatus(jobId, isUpdateProperty)
          }, 500)
        } else {
          this.deleteUpdateJobId(jobId)
          this.loadingCnt--
          if (jobItem.goods_list.length > 0 && parseInt(jobItem.goods_list[0].code) === 0) {
            let goods = {
              cat_id: this.product.model.cat_id,
              category_show: this.product.model.category_show,
              title: this.product.model.title,
              price: utils.yuanToFen(this.product.model.price),
              outer_id: this.product.model.outer_id,
              description: this.product.model.description,
              cost_template_id: this.template.model.cost_template_id,
              is_pre_sale: this.template.model.is_pre_sale,
              shipment_limit_second: this.template.model.shipment_limit_second,
              is_refundable: this.template.model.is_refundable,
              is_folt: this.template.model.is_folt,
              sku_list: this.getSkuList()
            }
            if (this.isShowShelvesCheck && this.checkedShelves) {
              goods['status'] = 1
            }
            this.$emit('changeProduct', goods)
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.$emit('closeDialog')
          } else {
            if (jobItem.goods_list.length > 0) {
              this.$message.error(jobItem.goods_list[0].message)
            }
          }
          if (isUpdateProperty) {
            this.updateProperty()
          }
        }
      })
    },
    refreshProduct () {
      this.product.model.skuMap = this.getSkuList()
      this.product.model.bannerPicUrlList = this.$refs['bannerPicListView'].curPictureUrlList
      this.product.model.descPicUrlList = this.$refs['descPicListView'].curPictureUrlList
      this.product.model.attrs = JSON.parse(JSON.stringify(this.$refs.attributeView.getAttrUploadList()))
    },
    isProductChange () {
      this.refreshProduct()
      return this.product.isDiff() || this.template.isDiff()
    }
  }
}
</script>
