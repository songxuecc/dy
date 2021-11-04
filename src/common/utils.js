import moment from 'moment'
import isEmpty from 'lodash/isEmpty'

export default {
  fenToYuan (price) {
    return Math.round(price) / 100
  },
  yuanToFen (price) {
    return Math.round(price * 100)
  },
  getStrRealLength (str) {
    if (typeof str === 'undefined') {
      return 0
    }
    let len = str.length
    let realLen = 0
    for (let i = 0; i < len; i++) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLen += 1
      else realLen += 2
    }
    return realLen
  },
  getStrRealPrefix (str, len) {
    let strLen = str.length
    let realLen = 0
    let preLen = 0
    for (let i = 0; i < strLen; i++) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLen += 1
      else realLen += 2
      if (realLen > len) break
      preLen++
    }
    return str.substr(0, preLen)
  },
  getStrRealSuffix (str, len) {
    let strLen = str.length
    let realLen = 0
    let useLen = 0
    for (let i = strLen - 1; i >= 0; i--) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLen += 1
      else realLen += 2
      if (realLen > len) break
      useLen++
    }
    return str.substr(strLen - useLen)
  },
  getDyStrRealLength (str) {
    return parseInt((this.getStrRealLength(str) + 1) / 2)
  },
  getDyStrRealPrefix (str, len) {
    len *= 2 // 抖音计算方式
    let strLen = str.length
    let realLen = 0
    let preLen = 0
    for (let i = 0; i < strLen; i++) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLen += 1
      else realLen += 2
      if (realLen > len) break
      preLen++
    }
    return str.substr(0, preLen)
  },
  getDyStrRealSuffix (str, len) {
    len *= 2 // 抖音计算方式
    let strLen = str.length
    let realLen = 0
    let useLen = 0
    for (let i = strLen - 1; i >= 0; i--) {
      let charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) realLen += 1
      else realLen += 2
      if (realLen > len) break
      useLen++
    }
    return str.substr(strLen - useLen)
  },
  isDate (date) {
    return (new Date(date) !== 'Invalid Date') && !isNaN(new Date(date))
  },
  diffDate (data) {
    return moment(data).diff(moment(), 'days')
  },
  getLastCategory (category) {
    let arrCate = category.split('>').map(s => s.trim())
    return arrCate[arrCate.length - 1]
  },
  calendarShort (strTime) {
    if (moment().isSame(strTime, 'day')) {
      return '今天'
    } else if (moment().add(1, 'day').isSame(strTime, 'day')) {
      return '明天'
    } else if (moment().subtract(1, 'day').isSame(strTime, 'day')) {
      return '昨天'
    }
    return moment(strTime).format('MMMD日')
  },
  isNumber (val) {
    if (isNaN(val)) {
      return false
    }
    return !isNaN(parseFloat(val))
  },
  initMoment () {
    moment.locale('zh-cn', {
      months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
      monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
      weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
      weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
      weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
      longDateFormat: {
        LT: 'Ah点mm分',
        LTS: 'Ah点m分s秒',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MMMD日',
        LLL: 'YYYY年MMMD日Ah点mm分',
        LLLL: 'YYYY年MMMD日ddddAh点mm分',
        l: 'YYYY-MM-DD',
        ll: 'YYYY年MMMD日',
        lll: 'YYYY年MMMD日Ah点mm分',
        llll: 'YYYY年MMMD日ddddAh点mm分'
      },
      meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
      meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
          hour = 0
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
          meridiem === '上午') {
          return hour
        } else if (meridiem === '下午' || meridiem === '晚上') {
          return hour + 12
        } else {
          // '中午'
          return hour >= 11 ? hour : hour + 12
        }
      },
      meridiem: function (hour, minute, isLower) {
        var hm = hour * 100 + minute
        if (hm < 600) {
          return '凌晨'
        } else if (hm < 900) {
          return '早上'
        } else if (hm < 1130) {
          return '上午'
        } else if (hm < 1230) {
          return '中午'
        } else if (hm < 1800) {
          return '下午'
        } else {
          return '晚上'
        }
      },
      calendar: {
        sameDay: function () {
          return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT'
        },
        nextDay: function () {
          return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT'
        },
        lastDay: function () {
          return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT'
        },
        nextWeek: function () {
          var startOfWeek, prefix
          startOfWeek = moment().startOf('week')
          prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]'
          return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
        },
        lastWeek: function () {
          var startOfWeek, prefix
          startOfWeek = moment().startOf('week')
          prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]'
          return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm'
        },
        // sameElse: 'LLL'
        sameElse: function () {
          return this.minutes() === 0 ? 'MMMD日Ah点整' : 'MMMD日Ah点mm'
        }
      },
      ordinalParse: /\d{1,2}(日|月|周)/,
      ordinal: function (number, period) {
        switch (period) {
          case 'd':
          case 'D':
          case 'DDD':
            return number + '日'
          case 'M':
            return number + '月'
          case 'w':
          case 'W':
            return number + '周'
          default:
            return number
        }
      },
      relativeTime: {
        future: '%s内',
        past: '%s前',
        s: '几秒',
        m: '1 分钟',
        mm: '%d 分钟',
        h: '1 小时',
        hh: '%d 小时',
        d: '1 天',
        dd: '%d 天',
        M: '1 个月',
        MM: '%d 个月',
        y: '1 年',
        yy: '%d 年'
      },
      week: {
        dow: 1,
        doy: 4
      }
    })
  },
  getMousePosInCanvas (e, canvas) {
    let x = e.offsetX === undefined ? e.originalEvent.layerX : e.offsetX
    let y = e.offsetY === undefined ? e.originalEvent.layerY : e.offsetY
    return {
      x: parseInt(x * canvas.width / canvas.clientWidth),
      y: parseInt(y * canvas.height / canvas.clientHeight)
    }
  },
  inputValidatorNoEmpty (input) {
    return input !== '' && input !== null
  },
  adjustPriceFen (priceFen, rate, diffFen, originPriceDiff = 0) {
    // 调整公式 ((原价 - originPriceDiff) * rate - dfffFen * 10000) / 10000 = 最终展示价格
    let minVal = 0
    priceFen = parseInt(priceFen)
    rate = parseInt(rate * 100) // 百分比的 10000 倍
    diffFen = parseInt(diffFen)
    originPriceDiff = parseInt(originPriceDiff)
    let ret = parseInt(((priceFen - originPriceDiff) * rate - diffFen * 10000) / 10000)
    if (ret < 0) {
      ret = 0
    }
    return Math.max(ret, minVal)
  },
  getObjectValue (obj, arrRecursiveField) {
    for (let i in arrRecursiveField) {
      let field = arrRecursiveField[i]
      if (typeof obj[field] === 'undefined') {
        return undefined
      }
      obj = obj[field]
    }
    return obj
  },
  downloadURL (href, name) {
    let eleLink = document.createElement('a')
    eleLink.download = name
    eleLink.href = href
    eleLink.click()
    eleLink.remove()
  },
  isObjectValueEqual (a, b) {
    var aProps = Object.keys(a)
    var bProps = Object.keys(b)
    if (aProps.length !== bProps.length) {
      return false
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i]
      if (!(propName in b)) {
        return false
      }
      var propA = a[propName]
      var propB = b[propName]
      if (propA !== null && (typeof (propA) === 'object')) {
        if (!this.isObjectValueEqual(propA, propB)) {
          return false
        }
      } else if (propA !== null && propA.toString() !== propB.toString()) {
        return false
      }
    }
    return true
  },
  isAppendNotice (list, times, leftDays) {
    if ((parseInt(list.order_times) === 0) && (parseInt(list.order_time_less_five) === 0)) {
      return true
    } else if ((parseInt(list.order_times) === times) && (parseInt(list.order_time_less_five) === 0)) {
      return true
    } else if ((parseInt(list.order_times) === 0) && (parseInt(list.order_time_less_five) === leftDays)) {
      return true
    } else if ((parseInt(list.order_times) === times) && (parseInt(list.order_time_less_five) === leftDays)) {
      return true
    } else {
      return false
    }
  },
  getHHlink (name) {
    let url = location.href
    if (/(\.sit\.|\.test\.|localhost|0.0.0.0|10.15.*|192.*)/.test(url)) {
      return 'http://localhost:8080/'
    } else if (/nix\./.test(url)) {
      if (name === 'hhgj') {
        return 'http://nix.huhuguanjia.com/'
      } else {
        return 'http://optimize.nix.huhuguanjia.com/'
      }
    } else {
      if (name === 'hhgj') {
        return 'https://pdd.huhuguanjia.com/'
      } else {
        return 'https://optimize.huhuguanjia.com/'
      }
    }
  },
  /**
   * 将正则表达式中的特殊符号进行转义
   * @param regStr
   */
  transferRegStr (reqStr) {
    let reqCharList = ['$', '(', ')', '*', '+', '.', '[', ']', '?', '^', '{', '}', '|']

    for (let reqChar of reqCharList) {
      // eslint-disable-next-line no-eval
      reqStr = eval('reqStr.replace(/\\' + reqChar + '/g, "\\\\' + reqChar + '")')
    }

    return reqStr
  },
  setCookie (key, value, t = 2 * 365 * 24 * 60 * 60) {
    let oDate = new Date()
    oDate.setDate(oDate.getDate() + t)
    document.cookie = key + '=' + value + 'expires=' + oDate.toDateString()
  },
  getCookie (key) {
    let arr1 = document.cookie.split(';') // 由于cookie是通过一个分号+空格的形式串联起来的，所以这里需要先按分号空格截断,变成[name=Jack,pwd=123456,age=22]数组类型；
    for (let i = 0; i < arr1.length; i++) {
      let arr2 = arr1[i].split('=') // 通过=截断，把name=Jack截断成[name,Jack]数组；
      if (arr2[0] === key) {
        return decodeURI(arr2[1])
      }
    }
  },
  isEmptyObj (obj) {
    return isEmpty(obj)
  },
  // 获取图片大小
  getImgRawSize (img) {
    return new Promise((resolve, reject) => {
      var _image = img
      if (_image instanceof HTMLImageElement) {
        if (_image.naturalWidth) {
          resolve({width: _image.naturalWidth, height: _image.naturalHeight})
        }
        img = img.src
      }
      if (typeof img === 'string') {
        _image = new Image()
        _image.src = img
      }
      _image.onload = _ => resolve({width: _image.naturalWidth || _image.width, height: _image.naturalHeight || _image.height})
      _image.onerror = _ => {
        const err = {width: 0, height: 0}
        reject(err)
      }
    })
  }
}
