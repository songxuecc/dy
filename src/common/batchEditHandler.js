
import utils from '@/common/utils'

class TextHandler {
  constructor () {
    this.reset()
  }
  reset () {
    this.textPrefix = ''
    this.textSuffix = ''
    this.textDelete = ''
    this.textReplace1 = ''
    this.textReplace2 = ''
  }
  handle (text, type = -1) {
    if (this.textDelete !== '' && [-1, 2].includes(type)) {
      // 正则特殊符号需要转义
      let replaceStr = utils.transferRegStr(this.textDelete)
      text = text.replace(new RegExp(replaceStr, 'g'), '')
    }
    if (this.textReplace1 !== '' && this.textReplace2 !== '' && [-1, 1].includes(type)) {
      let replaceStr = utils.transferRegStr(this.textReplace1)
      text = text.replace(new RegExp(replaceStr, 'g'), this.textReplace2)
    }
    if (this.textPrefix !== '' && [-1, 0].includes(type)) {
      text = this.textPrefix + text
    }
    if (this.textSuffix !== '' && [-1, 0].includes(type)) {
      text = text + this.textSuffix
    }
    return text
  }
  cutOffCnText (text, isUsePrefix, limit) {
    if (isUsePrefix) {
      return utils.getDyStrRealPrefix(text, limit)
    } else {
      return utils.getDyStrRealSuffix(text, limit)
    }
  }
  cutOffText (text, isUsePrefix, limit) {
    if (isUsePrefix) {
      return text.substr(0, limit)
    } else {
      return text.substr(-limit)
    }
  }
}

class StockHandler {
  constructor () {
    this.checked = false
    this._radio = '1'
    this.textStock = ''
    this.textStockAdd = ''
    this.textStockSub = ''
  }
  get radio () {
    return this._radio
  }
  set radio (val) {
    this.checked = true
    this._radio = val
  }
  handleProducts (productList) {
    for (let i in productList) {
      let product = productList[i]
      for (let j in product.sku_list) {
        let sku = product.sku_list[j]
        if (parseInt(this._radio) === 1 && utils.isNumber(this.textStock)) {
          sku.quantity = parseInt(this.textStock)
        } else if (parseInt(this._radio) === 2 && utils.isNumber(this.textStockAdd)) {
          sku.quantity = parseInt(sku.quantity) + parseInt(this.textStockAdd)
        } else if (parseInt(this._radio) === 3 && utils.isNumber(this.textStockSub)) {
          sku.quantity = Math.max(parseInt(sku.quantity) - parseInt(this.textStockSub), 0)
        }
      }
    }
  }
  handleSkus (skuShowList) {
    for (let i in skuShowList) {
      let sku = skuShowList[i]
      if (!sku.hidden) {
        if (parseInt(this._radio) === 1 && utils.isNumber(this.textStock)) {
          sku.quantity = parseInt(this.textStock)
        } else if (parseInt(this._radio) === 2 && utils.isNumber(this.textStockAdd)) {
          sku.quantity = parseInt(sku.quantity) + parseInt(this.textStockAdd)
        } else if (parseInt(this._radio) === 3 && utils.isNumber(this.textStockSub)) {
          sku.quantity = Math.max(parseInt(sku.quantity) - parseInt(this.textStockSub), 0)
        }
      }
    }
  }
}

class PriceHandler {
  constructor () {
    this.checked = false
    this._radio = '1'
    this.textPrice = ''
    this.textPriceAdd = ''
    this.textPriceSub = ''
    this.textPricePercentAdd = ''
    this.textPricePercentSub = ''
  }
  get radio () {
    return this._radio
  }
  set radio (val) {
    this.checked = true
    this._radio = val
  }
  handleProducts (productList, field = 'price') {
    for (let i in productList) {
      let product = productList[i]
      for (let j in product.sku_list) {
        let sku = product.sku_list[j]
        if (!sku.hidden) {
          if (parseInt(this._radio) === 1 && utils.isNumber(this.textPrice)) {
            sku[field] = parseFloat(this.textPrice)
          } else if (parseInt(this._radio) === 2 && utils.isNumber(this.textPriceAdd)) {
            sku[field] = parseFloat(sku[field]) + parseFloat(this.textPriceAdd)
          } else if (parseInt(this._radio) === 3 && utils.isNumber(this.textPriceSub)) {
            sku[field] = parseFloat(sku[field]) - parseFloat(this.textPriceSub)
          } else if (parseInt(this._radio) === 4 && utils.isNumber(this.textPricePercentAdd)) {
            sku[field] = parseFloat(sku[field]) * (1 + parseFloat(this.textPricePercentAdd) / 100)
          } else if (parseInt(this._radio) === 5 && utils.isNumber(this.textPricePercentSub)) {
            sku[field] = parseFloat(sku[field]) * (1 - parseFloat(this.textPricePercentSub) / 100)
          }
          sku[field] = Math.max(sku[field], 0)
          sku[field] = Math.round(sku[field] * 100) / 100
        }
      }
    }
  }
  handleSkus (skuShowList, field) {
    for (let i in skuShowList) {
      let sku = skuShowList[i]
      if (!sku.hidden) {
        if (parseInt(this._radio) === 1 && utils.isNumber(this.textPrice)) {
          sku[field] = parseFloat(this.textPrice)
        } else if (parseInt(this._radio) === 2 && utils.isNumber(this.textPriceAdd)) {
          sku[field] = parseFloat(sku[field]) + parseFloat(this.textPriceAdd)
        } else if (parseInt(this._radio) === 3 && utils.isNumber(this.textPriceSub)) {
          sku[field] = parseFloat(sku[field]) - parseFloat(this.textPriceSub)
        } else if (parseInt(this._radio) === 4 && utils.isNumber(this.textPricePercentAdd)) {
          sku[field] = parseFloat(sku[field]) * (1 + parseFloat(this.textPricePercentAdd) / 100)
        } else if (parseInt(this._radio) === 5 && utils.isNumber(this.textPricePercentSub)) {
          sku[field] = parseFloat(sku[field]) * (1 - parseFloat(this.textPricePercentSub) / 100)
        }
        sku[field] = Math.max(sku[field], 0)
        sku[field] = Math.round(sku[field] * 100) / 100
      }
    }
  }
}

class TemplateHandler {
  constructor () {
    this._checked = false
    this._checkedCarriage = false
    this._checkedPreSale = false
    this._checkedShipment = false
    this._checkedPromise = false
    this.checkedRefundable = false
    this.checkedFolt = false
    this.template = {}
  }
  get checked () {
    return this._checked
  }
  set checked (val) {
    if (!val) {
      this._checkedCarriage = false
      this._checkedPreSale = false
      this._checkedShipment = false
      this._checkedPromise = false
    }
    this._checked = val
  }
  get checkedCarriage () {
    return this._checkedCarriage
  }
  set checkedCarriage (val) {
    if (val) {
      this.checked = true
    }
    this._checkedCarriage = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedPreSale () {
    return this._checkedPreSale
  }
  set checkedPreSale (val) {
    if (val) {
      this.checked = true
    }
    this._checkedPreSale = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedShipment () {
    return this._checkedShipment
  }
  set checkedShipment (val) {
    if (val) {
      this.checked = true
    }
    this._checkedShipment = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedPromise () {
    return this._checkedPromise
  }
  set checkedPromise (val) {
    if (val) {
      this.checked = true
    }
    this._checkedPromise = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  isAllFalse () {
    return !this._checkedCarriage && !this._checkedPreSale && !this._checkedShipment && !this._checkedPromise
  }
  handle (productList) {
    for (let i in productList) {
      let product = productList[i]
      if (this._checkedCarriage) {
        product.cost_template_id = this.template.cost_template_id
      }
      if (this._checkedPreSale) {
        product.is_pre_sale = this.template.is_pre_sale
      }
      if (this._checkedShipment) {
        product.shipment_limit_second = this.template.shipment_limit_second
      }
      if (this._checkedPromise) {
        product.is_refundable = this.checkedRefundable ? 1 : 0
        product.is_folt = this.checkedFolt ? 1 : 0
      }
    }
  }
}

export { TextHandler, StockHandler, PriceHandler, TemplateHandler }
