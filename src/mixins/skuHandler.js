import utils from '@/common/utils'
import { StockHandler, PriceHandler } from '@/common/batchEditHandler'
import cloneDeep from 'lodash/cloneDeep'
import shortid from 'shortid'

export default {
  data () {
    return {
      skuPropertyMap: {},
      skuPropertyValueMap: {},
      skuMap: {},
      sortSkuKeys: [],
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
      const newSkuJson = cloneDeep(skuJson)
      Object.entries(newSkuJson.sku_property_value_map).map(([skuPropertyValueKey, skuPropertyValue]) => {
        Object.entries(skuPropertyValue).map(([key, value]) => {
          value.skuKey = skuPropertyValueKey
          value.skuValueKey = key
          value.skuString = `${skuPropertyValueKey}:${key}`
        })
      })
      // 自定义规格列表的名称
      const specifications = Object.entries(newSkuJson.sku_property_value_map).map(([skuPropertyValueKey, skuPropertyValue]) => {
        const nextSkuPropertyValue = {}
        const specificationValueList = Object.entries(skuPropertyValue).map(([key, value]) => {
          const nextValue = cloneDeep(value)
          nextValue.originValue = nextValue.value
          nextValue.checkedValue = nextValue.value
          nextValue.edit = true
          nextValue.editBtnVisible = false
          nextValue.order = nextValue.length
          nextValue.checked = true
          nextValue.maskShow = false
          nextValue.image = nextValue.image
          return nextValue
        })
        nextSkuPropertyValue.specificationName = newSkuJson.sku_property_map[skuPropertyValueKey].name
        nextSkuPropertyValue.newSpecificationName = ''
        nextSkuPropertyValue.addSkuImage = specificationValueList.some(property => property.image)
        nextSkuPropertyValue.skuSelectCheckList = specificationValueList.map(item => item.value)
        nextSkuPropertyValue.addSpecificationValue = ''
        nextSkuPropertyValue.specificationValueList = specificationValueList
        nextSkuPropertyValue.specificationNameVisible = false
        nextSkuPropertyValue.date = new Date()
        nextSkuPropertyValue.spec_id = skuPropertyValueKey
        nextSkuPropertyValue.id = shortid.generate()
        return nextSkuPropertyValue
      })
      const sortSpecifications = []
      specifications.forEach(item => {
        if (item.specificationValueList.some(property => property.image)) {
          sortSpecifications.unshift(item)
        } else {
          sortSpecifications.push(item)
        }
      })
      this.skuPropertyMap = newSkuJson.sku_property_map
      this.skuMap = newSkuJson.sku_map
      this.skuPropertyList = []
      // 排序
      let sortSkuPropertyValueMapKey = []
      let sortSkuPropertyValueMap = {}
      let sortSkuKeys = []

      this.skuShowList = []

      let nSkuPropertyValueMap = {}
      let skuPropertyList = []

      Object.entries(newSkuJson.sku_property_value_map).forEach(([skuPropertyValueKey, skuPropertyValue]) => {
        if (Object.keys(skuPropertyValue).some(key => skuPropertyValue[key].image)) {
          sortSkuKeys.unshift({[skuPropertyValueKey]: skuPropertyValue})
        } else {
          sortSkuKeys.push({[skuPropertyValueKey]: skuPropertyValue})
        }
      })
      const length = sortSkuKeys.length
      const skuMapNodes = Object.keys(skuJson.sku_map).map(keys => {
        // const specDetailIds = []
        // let propertyValList = keys.split(';')
        // propertyValList.forEach(propertyKVId => {
        //   let propKVIds = propertyKVId.split(':')[1]
        //   specDetailIds.push(propKVIds)
        // })
        return ({
          ...skuJson.sku_map[keys],
          // specDetailIds,
          keys
        })
      })
      // nodes 要遍历的元素集合
      // sortSkuKeys 排序的列表
      // previewStrings 该集合的前一个 字符串集合
      // current 当前遍历到第几个集合
      // length 总长度
      let sortSkuMapNodes = []
      function sortSku (nodes, previewStrings = [], current = 0) {
        if (current !== length) {
          const skuPropertyValueMapValue = sortSkuKeys[current]
          current++
          let nextPreviewStrings = [...previewStrings]
          Object.entries(skuPropertyValueMapValue).map(([key, value]) => {
            Object.keys(value).map(item => {
              let str = `${key}:${item}`
              nextPreviewStrings.push(str)
              const arr = []
              nodes.map(node => {
                if (nextPreviewStrings.every(s => node.keys.includes(s))) {
                  arr.push(node)
                }
              })
              if (current === length) {
                sortSkuMapNodes = [...sortSkuMapNodes, ...arr]
              }
              sortSku(arr, nextPreviewStrings, current)
              nextPreviewStrings = [...previewStrings]
            })
          })
        }
      }

      sortSku(skuMapNodes)

      let sortSkuMapResult = {}
      sortSkuMapNodes.map(item => {
        const specDetailIds = []
        let propertyValList = item.keys.split(';')
        propertyValList.forEach(propertyKVId => {
          let propKVIds = propertyKVId.split(':')[1]
          specDetailIds.push(propKVIds)
        })
        item.specDetailIds = specDetailIds
        sortSkuMapResult[item.keys] = item
      })

      this.skuMap = cloneDeep(sortSkuMapResult)
      console.log(this.skuMap, 'this.skuMap')
      if (Object.keys(this.skuPropertyMap).length === 0) {
        skuPropertyList.push({ id: 0, name: '', filter: false })
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
        // 排序
        let propertyIndexMap = {}
        sortSkuKeys.map(item => {
          const key = Object.keys(item)[0]
          propertyIndexMap[key] = skuPropertyList.length
          skuPropertyList.push({
            id: key,
            name: this.skuPropertyMap[key]['name'],
            filter: false
          })
        })

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
              name: newSkuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value']
            }
            if (!(propKVIds[0] in nSkuPropertyValueMap)) {
              nSkuPropertyValueMap[propKVIds[0]] = {}
            }
            nSkuPropertyValueMap[propKVIds[0]][propKVIds[1]] = {
              value: newSkuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value'],
              checked: true,
              image: newSkuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['image']
            }
            sortKey += newSkuJson.sku_property_value_map[propKVIds[0]][propKVIds[1]]['value']
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

      Object.entries(nSkuPropertyValueMap).forEach(([key, value]) => {
        if (Object.values(value).some(item => item.image)) {
          sortSkuPropertyValueMapKey.unshift(key)
        } else {
          sortSkuPropertyValueMapKey.push(key)
        }
      })

      sortSkuPropertyValueMapKey.forEach(key => {
        sortSkuPropertyValueMap[key] = nSkuPropertyValueMap[key]
        const value = skuPropertyList.find(item => item.id === key)
        this.skuPropertyList.push(value)
      })
      this.$set(this, 'skuPropertyValueMap', nSkuPropertyValueMap)
      this.$set(this, 'specifications', sortSpecifications)
      this.$set(this, 'sortSkuKeys', sortSkuKeys)
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
      console.log(this.skuPropertyValueMap)
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
      console.log(this.skuShowList)
      this.promoPriceHandler.handleSkus(this.skuShowList, 'promo_price')
    },
    batchEditPrice () {
      this.priceHandler.handleSkus(this.skuShowList, 'price')
    }
  }
}
