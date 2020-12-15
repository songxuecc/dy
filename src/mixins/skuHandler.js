import utils from '@/common/utils'
import { StockHandler, PriceHandler } from '@/common/batchEditHandler'

export default {
  data () {
    return {
      skuPropertyMap: {},
      skuPropertyValueMap: {},
      skuMap: {},
      skuPropertyList: [],
      skuShowList: [],
      isSingleSku: false,
      stockHandler: new StockHandler(),
      promoPriceHandler: new PriceHandler(),
      priceHandler: new PriceHandler()
    }
  },
  computed: {
    skuRealShowList () {
      let skuRealShowList = []
      for (let i in this.skuShowList) {
        let sku = this.skuShowList[i]
        if (!sku.hidden) {
          skuRealShowList.push(sku)
        }
      }
      return skuRealShowList
    }
  },
  methods: {
    initSku (skuJson, tpId) {
      this.skuPropertyMap = skuJson.sku_property_map
      this.skuMap = skuJson.sku_map
      this.skuPropertyList = []
      this.skuShowList = []

      let nSkuPropertyValueMap = {}
      if (Object.keys(this.skuPropertyMap).length === 0) {
        this.skuPropertyList.push({ id: 0, name: '', filter: false })
        let item = Object.values(this.skuMap)[0]
        this.skuShowList.push({
          property_key: 'default',
          property_list: [{ id: 0, name: '默认规格' }],
          price: utils.fenToYuan(item.price),
          // sku原价不随售价的变化而变化
          originPrice: utils.fenToYuan(item.price),
          promo_price: utils.fenToYuan(item.promo_price),
          quantity: item.quantity,
          img: item.img,
          code: item.code,
          hidden: false
        })
      } else {
        let propertyIndexMap = {}
        for (let key in this.skuPropertyMap) {
          propertyIndexMap[key] = this.skuPropertyList.length
          this.skuPropertyList.push({
            id: key,
            name: this.skuPropertyMap[key]['name'],
            filter: false
          })
        }

        for (let key in this.skuMap) {
          let item = this.skuMap[key]
          let propertyValList = key.split(';')
          let propertyList = []
          let sortKey = ''
          for (let i in propertyValList) {
            let propertyKVId = propertyValList[i]
            let propKVIds = propertyKVId.split(':')
            let index = propertyIndexMap[propKVIds[0]]
            propertyList[index] = {
              id: propertyKVId,
              name: skuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value']
            }
            if (!(propKVIds[0] in nSkuPropertyValueMap)) {
              nSkuPropertyValueMap[propKVIds[0]] = {}
            }
            nSkuPropertyValueMap[propKVIds[0]][propKVIds[1]] = {
              'value': skuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value'],
              'checked': false
            }
            sortKey += skuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value']
          }
          this.skuShowList.push({
            property_key: key,
            sort_key: sortKey,
            property_list: propertyList,
            price: utils.fenToYuan(item.price),
            // sku原价不随售价的变化而变化
            originPrice: utils.fenToYuan(item.price),
            promo_price: utils.fenToYuan(item.promo_price),
            quantity: item.quantity,
            img: item.img,
            code: item.code,
            hidden: false
          })
        }
      }
      this.$set(this, 'skuPropertyValueMap', nSkuPropertyValueMap)
      this.updateIsSingleSku()
    },
    getSkuUploadObj () {
      let skuUploadObj = {}
      for (let i in this.skuShowList) {
        let skuShow = this.skuShowList[i]
        skuUploadObj[skuShow.property_key] = {
          price: utils.yuanToFen(skuShow.price),
          promo_price: utils.yuanToFen(skuShow.promo_price),
          quantity: skuShow.quantity,
          img: skuShow.img,
          code: skuShow.code,
          property_list: JSON.parse(JSON.stringify(skuShow.property_list))
        }
      }
      return { sku_map: skuUploadObj }
    },
    getSkuUploadObjByShowList (skuShowList) {
      let skuUploadObj = {}
      for (let i in skuShowList) {
        let skuShow = skuShowList[i]
        skuUploadObj[skuShow.property_key] = {
          price: utils.yuanToFen(skuShow.price),
          promo_price: utils.yuanToFen(skuShow.promo_price),
          quantity: skuShow.quantity,
          img: skuShow.img,
          code: skuShow.code,
          property_list: JSON.parse(JSON.stringify(skuShow.property_list))
        }
      }
      return { sku_map: skuUploadObj }
    },
    deleteSkus (pId, pVid) {
      let nSkuShowList = []
      let key = pId + ':' + pVid
      for (let i in this.skuShowList) {
        let sku = this.skuShowList[i]
        let isDel = false
        for (let j in sku.property_list) {
          if (sku.property_list[j].id === key) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          nSkuShowList.push(sku)
        }
      }
      this.skuShowList.splice(0, this.skuShowList.length)
      for (let i in nSkuShowList) {
        this.skuShowList.push(nSkuShowList[i])
      }
      this.updateSkuPropertyValueMap()
      this.updateIsSingleSku()
    },
    deleteSingleSku (idx) {
      this.skuShowList.splice(idx, 1)
      this.updateSkuPropertyValueMap()
      this.updateIsSingleSku()
    },
    updateIsSingleSku () {
      let count = 0 // PropertyValue数量大于1的个数
      let len = 0 // 最后一个PropertyValue数量大于1的数量
      for (let key in this.skuPropertyValueMap) {
        if (Object.keys(this.skuPropertyValueMap[key]).length > 1) {
          count++
          len = Object.keys(this.skuPropertyValueMap[key]).length
        }
      }
      if (count > 1 || len <= 1) {
        this.isSingleSku = false
      } else {
        this.isSingleSku = true
      }
    },
    updateSkuPropertyValueMap () {
      let nSkuPropertyValueMap = {}
      for (let i in this.skuShowList) {
        let sku = this.skuShowList[i]
        for (let j in sku.property_list) {
          let propKVIds = sku.property_list[j].id.split(':')
          if (!(propKVIds[0] in nSkuPropertyValueMap)) {
            nSkuPropertyValueMap[propKVIds[0]] = {}
          }
          nSkuPropertyValueMap[propKVIds[0]][propKVIds[1]] = this.skuPropertyValueMap[propKVIds[0]][propKVIds[1]]
        }
      }
      this.$set(this, 'skuPropertyValueMap', nSkuPropertyValueMap)
    },
    updateNameOfSkuPropertyValueMap (pid, vid, name) {
      for (let i in this.skuShowList) {
        let sku = this.skuShowList[i]
        for (let j in sku.property_list) {
          if (sku.property_list[j].id === pid + ':' + vid) {
            sku.property_list[j].name = name
          }
        }
      }
    },
    onSkuFilter () {
      let dicIsFilter = {}
      for (let i in this.skuPropertyList) {
        let pId = this.skuPropertyList[i].id
        this.skuPropertyList[i].filter = dicIsFilter[pId] = false
        for (let pVid in this.skuPropertyValueMap[pId]) {
          if (this.skuPropertyValueMap[pId][pVid].checked) {
            this.skuPropertyList[i].filter = true
            dicIsFilter[pId] = true
            break
          }
        }
      }
      for (let i in this.skuShowList) {
        let sku = this.skuShowList[i]
        sku.hidden = false
        for (let j in sku.property_list) {
          let propKVIds = sku.property_list[j].id.split(':')
          if (dicIsFilter[propKVIds[0]] && !this.skuPropertyValueMap[propKVIds[0]][propKVIds[1]].checked) {
            sku.hidden = true
            break
          }
        }
      }
    },
    cancelSkuFilter (pId) {
      for (let pVid in this.skuPropertyValueMap[pId]) {
        this.skuPropertyValueMap[pId][pVid].checked = false
      }
      this.onSkuFilter()
    },
    batchEditQuantity () {
      this.stockHandler.handleSkus(this.skuShowList)
    },
    batchEditPromoPrice () {
      this.promoPriceHandler.handleSkus(this.skuShowList, 'promo_price')
    },
    batchEditPrice () {
      this.priceHandler.handleSkus(this.skuShowList, 'price')
    }
  }
}
