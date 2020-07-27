import utils from '@/common/utils'

class FormModel {
  constructor (compareFields = []) {
    this.model = {}
    this.originModel = {}
    this.compareFields = compareFields
  }
  deepClone (obj) {
    let _obj = JSON.stringify(obj)
    let objClone = JSON.parse(_obj)
    return objClone
  }
  assign (obj) {
    this.model = Object.assign({}, this.model, obj)
    this.originModel = Object.assign({}, this.originModel, this.deepClone(obj))
  }
  getDiff () {
    let diff = {}
    let compareFields = this.compareFields
    if (compareFields.length === 0) { // this.compareFields 为空则比较所有 key
      compareFields = Object.keys(this.model)
    }
    for (let i in compareFields) {
      let key = compareFields[i]
      let modelPrototype = Object.prototype.toString.call(this.model[key])
      let originModelPrototype = Object.prototype.toString.call(this.originModel[key])
      if (modelPrototype === '[object Undefined]') {
        // model Undefined 的情况
        if (originModelPrototype !== '[object Undefined]') {
          diff[key] = ''
        }
      } else if (originModelPrototype === '[object Undefined]') {
        // originModel Undefined 的情况
        diff[key] = this.model[key]
      } else if (modelPrototype === '[object Object]' || modelPrototype === '[object Array]') {
        // Object, Array 的情况
        if (!utils.isObjectValueEqual(this.model[key], this.originModel[key])) {
          diff[key] = this.model[key]
        }
      } else {
        // Number, String, ... 等情况
        if (this.model[key] !== undefined && this.originModel[key] !== null && this.model[key].toString() !== this.originModel[key].toString()) {
          diff[key] = this.model[key]
        }
      }
    }
    return diff
  }
  isDiff () {
    let diff = this.getDiff()
    return Object.entries(diff).length > 0
  }
  checkNumber (key) {
    if (typeof this.model[key] === 'undefined') {
      return false
    }
    return utils.isNumber(this.model[key])
  }
  rollback () {
    this.model = this.deepClone(this.originModel)
  }
  rollbackPart (key) {
    Object.assign(this.model, {[key]: this.deepClone(this.originModel[key])})
  }
  saveNow () {
    this.originModel = this.deepClone(this.model)
  }
}

export default FormModel
