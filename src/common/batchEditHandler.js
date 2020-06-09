
import utils from '@/common/utils'

class TextHandler {
  constructor () {
    this._checked = false
    this._checkedPrefix = false
    this._checkedSuffix = false
    this._checkedDelete = false
    this._checkedReplace = false
    this.textPrefix = ''
    this.textSuffix = ''
    this.textDelete = ''
    this.textReplace1 = ''
    this.textReplace2 = ''
  }
  get checked () {
    return this._checked
  }
  set checked (val) {
    if (!val) {
      this._checkedPrefix = false
      this._checkedSuffix = false
      this._checkedDelete = false
      this._checkedReplace = false
    }
    this._checked = val
  }
  get checkedPrefix () {
    return this._checkedPrefix
  }
  set checkedPrefix (val) {
    if (val) {
      this.checked = true
    }
    this._checkedPrefix = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedSuffix () {
    return this._checkedSuffix
  }
  set checkedSuffix (val) {
    if (val) {
      this.checked = true
    }
    this._checkedSuffix = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedDelete () {
    return this._checkedDelete
  }
  set checkedDelete (val) {
    if (val) {
      this.checked = true
    }
    this._checkedDelete = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  get checkedReplace () {
    return this._checkedReplace
  }
  set checkedReplace (val) {
    if (val) {
      this.checked = true
    }
    this._checkedReplace = val
    if (this.isAllFalse()) {
      this.checked = false
    }
  }
  isAllFalse () {
    return !this._checkedPrefix && !this._checkedSuffix && !this._checkedDelete && !this._checkedReplace
  }
  handle (productList, field) {
    for (let i in productList) {
      let product = productList[i]
      if (this._checkedDelete) {
        product[field] = product[field].replace(new RegExp(this.textDelete, 'g'), '')
      }
      if (this._checkedReplace) {
        product[field] = product[field].replace(new RegExp(this.textReplace1, 'g'), this.textReplace2)
      }
      if (this._checkedPrefix) {
        product[field] = this.textPrefix + product[field]
      }
      if (this._checkedSuffix) {
        product[field] = product[field] + this.textSuffix
      }
    }
  }
  cutOffTitle (productList, field, limit) {
    for (let i in productList) {
      let product = productList[i]
      product[field] = utils.getStrRealPrefix(product[field], limit)
    }
  }
  cutOffText (productList, field, limit) {
    for (let i in productList) {
      let product = productList[i]
      product[field] = product[field].substr(0, limit)
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
        if (parseInt(this._radio) === 1 && utils.isNumber(this.textStock)) {
          product.sku_list[j].quantity = this.textStock
          product.sku_list[j].update_type = 1
        } else if (parseInt(this._radio) === 2 && utils.isNumber(this.textStockAdd)) {
          product.sku_list[j].quantity = this.textStockAdd
          product.sku_list[j].update_type = 2
        } else if (parseInt(this._radio) === 3 && utils.isNumber(this.textStockSub)) {
          product.sku_list[j].quantity = Math.max(-this.textStockSub, -product.sku_list[j].quantity)
          product.sku_list[j].update_type = 2
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
