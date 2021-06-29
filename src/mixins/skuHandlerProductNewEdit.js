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
      priceHandler: new PriceHandler(),
      skuJson: {},
      originSkuShowList: []
    }
  },
  computed: {
    // skuRealShowList () {
    //   let skuRealShowList = []
    //   const specifications = this.specifications
    //   for (let i in this.skuShowList) {
    //     let sku = this.skuShowList[i]

    //     const specDetailIds = sku.specDetailIds
    //     const isShow = specDetailIds.every((ids, index) => {
    //       const specification = specifications[index]
    //       const specificationValueList = specification.specificationValueList
    //       const i = specificationValueList.find(specificationValue => specificationValue.skuString === ids)
    //       return i.checked
    //     })
    //     console.log(isShow, 'isShow')
    //     sku.hidden = !isShow
    //     if (!sku.hidden) {
    //       skuRealShowList.push(sku)
    //     }
    //   }
    //   return skuRealShowList
    // }
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

      this.originSkuShowList = []
      Object.entries(newSkuJson.sku_map).forEach(([key, value]) => {
        const specDetailIds = key.split(';')
        const obj = {
          ...value,
          specDetailIds
        }
        this.originSkuShowList.push(obj)
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
        nextSkuPropertyValue.id = `id-${shortid.generate()}`
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
      this.handleSpecifications(sortSpecifications)
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
    },
    handleSpecifications (specifications) {
      console.log(specifications, 'specifications')
      const skuPropertyValueMap = {}
      const skuPropertyMap = {}
      let sortSkuMapNodes = []
      specifications.map(specification => {
        const specId = specification.spec_id
        const specificationValueList = specification.specificationValueList
        if (specificationValueList.some(specificationValue => specificationValue.checked)) {
          const nextObj = {}
          specificationValueList.map(specificationValue => {
            if (specificationValue.checked) {
              const skuValueKey = specificationValue.skuValueKey
              nextObj[skuValueKey] = specificationValue
            }
          })
          skuPropertyMap[specId] = {
            id: specId,
            values: specificationValueList,
            name: specification.specificationName
          }
          skuPropertyValueMap[specId] = nextObj
        }
      })

      let sortSkuKeys = []
      Object.entries(skuPropertyValueMap).forEach(([skuPropertyValueKey, skuPropertyValue]) => {
        if (Object.keys(skuPropertyValue).some(key => skuPropertyValue[key].image)) {
          sortSkuKeys.unshift({[skuPropertyValueKey]: skuPropertyValue})
        } else {
          sortSkuKeys.push({[skuPropertyValueKey]: skuPropertyValue})
        }
      })
      const sortSpecifications = specifications
        .filter(item => item.specificationValueList.some(specificationValue => specificationValue.checked))

      const length = sortSpecifications.length
      const originSkuShowList = this.originSkuShowList
      function sortSku (previewStrings = [], current = 0) {
        if (current !== length) {
          current++
          let nextPreviewStrings = [...previewStrings]
          sortSpecifications[current - 1].specificationValueList
            .filter(item => item.checked)
            .map(item => {
              let str = item.skuString
              nextPreviewStrings.push(str)
              let arr = []
              if (current === length) {
                console.log(item, 'item')
                let propertyList = []
                let img = ''
                nextPreviewStrings.map(string => {
                  specifications.map(item => {
                    item.specificationValueList.map(v => {
                      if (v.skuString === string) {
                        propertyList.push(v)
                        if (v.image) {
                          img = v.image
                        }
                      }
                    })
                  })
                })
                let obj = {}
                originSkuShowList.map(item => {
                  if (nextPreviewStrings.every(str => item.specDetailIds.includes(str))) {
                    obj = {
                      code: item.code,
                      keys: item.keys,
                      price: item.price,
                      originPrice: utils.fenToYuan(item.price),
                      promo_price: utils.fenToYuan(item.promo_price),
                      quantity: item.quantity,
                      sku_id: item.sku_id
                    }
                  }
                })
                const skuJson = {
                  code: '',
                  img: img,
                  keys: '',
                  price: 0,
                  originPrice: 0,
                  promo_price: 0,
                  quantity: 0,
                  sku_id: '',
                  specDetailIds: nextPreviewStrings,
                  property_key: nextPreviewStrings.join(';'),
                  property_list: propertyList,
                  hidden: false,
                  ...obj
                }
                arr.push(skuJson)
                sortSkuMapNodes = [...sortSkuMapNodes, ...arr]
              }
              sortSku(nextPreviewStrings, current)
              nextPreviewStrings = [...previewStrings]
            })
        }
      }
      sortSku()
      console.log(sortSkuMapNodes, 'specifications')
      this.skuShowList = sortSkuMapNodes
      this.$set(this, 'specifications', specifications)
      this.$set(this, 'skuShowList', sortSkuMapNodes)
      this.product.assign({skuShowList: sortSkuMapNodes})
      this.product.assign({specifications: specifications})
    }
  }
}
