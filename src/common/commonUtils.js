import Api from '@/api/apis'
import { Message } from 'element-ui'
import moment from 'moment'
import common from '@/common/common'
const dyHarf = '&response_type=code&redirect_uri=https://dy.huhuguanjia.com/authorize'

export default {
  request (method, params, cbsuccess, cbfail, isSilent = false) {
    if (!isSilent) {
      this.loadingCnt++
    }
    Api.hhgjAPIs[ method ](params).then(data => {
      if (!isSilent) {
        this.loadingCnt--
      }
      if (typeof data !== 'undefined') {
        if (cbsuccess) {
          cbsuccess(data)
        }
      } else {
        if (!isSilent) {
          this.requestFail(new Error('接口数据出错'))
        }
        if (cbfail) {
          cbfail(new Error('接口数据出错'))
        }
      }
    }, err => {
      console.error(err)
      if (!isSilent) {
        this.loadingCnt--
        this.requestFail(err)
      }
      if (cbfail) {
        cbfail(err)
      }
    }).catch(err => {
      console.error(err)
      if (!isSilent) {
        this.requestFail(err)
      }
      if (cbfail) {
        cbfail(err)
      }
    })
  },
  requestFail (err) {
    console.log(err.message)
    Message.error(err.message)
  },
  getLoginUrl (shareId = null, from = null) {
    let host = encodeURI(window.location.protocol + '//' + window.location.host)
    let state = {}
    if (process.env !== 'production') {
      state['host'] = host
    }
    if (shareId) {
      state['share_id'] = shareId
    }
    // 登录后会跳转到from对应的routerName页面
    if (from) {
      state['from'] = from
    }
    let url = 'https://fuwu.jinritemai.com/authorize?service_id=42&state=' + (Object.keys(state).length !== 0 ? encodeURI(JSON.stringify(state)) : '') + dyHarf
    return url
  },
  getChannelegisterUrl (channel = null, shareId = null, from = null) {
    let host = encodeURI(window.location.protocol + '//' + window.location.host)
    let state = {}
    if (process.env !== 'production') {
      state['host'] = host
    }
    // 如果有渠道名称
    if (channel) {
      state['channel_name'] = channel
    }
    if (shareId) {
      state['share_id'] = shareId
    }
    // 登录后会跳转到from对应的routerName页面
    if (from) {
      state['from'] = from
    }
    // 目前抖音新用户或者部分支付用户授权登录不完善，先到订购页面
    // let url = 'https://fuwu.jinritemai.com/authorize?service_id=42&state=' + encodeURI(JSON.stringify(state)) + dyHarf
    let url = common.DY_SERVICE_LINK
    return url
  },
  login (shareId = null) {
    let host = encodeURI(window.location.protocol + '//' + window.location.host)
    let state = {}
    if (process.env !== 'production') {
      state['host'] = host
    }
    if (shareId) {
      state['share_id'] = shareId
    }
    let url = 'https://fuwu.jinritemai.com/authorize?service_id=42&state=' + encodeURI(JSON.stringify(state)) + dyHarf

    window.location.href = url
  },
  addToFavorite () {
    let url = 'https://dy.huhuguanjia.com/'
    let title = '虎虎搬家助手'
    let strShortcut = navigator.userAgent.toLowerCase().indexOf('mac') !== -1 ? 'Command+D' : 'Ctrl+D'
    let ua = navigator.userAgent.toLowerCase()
    if (ua.indexOf('360se') > -1) {
      alert('由于360浏览器功能限制，请按 ' + strShortcut + ' 手动收藏！')
    } else if (ua.indexOf('msie 8') > -1) {
      window.external.AddToFavoritesBar(url, title) // IE8
    } else if (document.all) {
      try {
        window.external.addFavorite(url, title)
      } catch (e) {
        alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
      }
    } else if (window.sidebar) {
      try {
        window.sidebar.addPanel(title, url, '')
      } catch (e) {
        alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
      }
    } else {
      alert('您的浏览器不支持,请按 ' + strShortcut + ' 手动收藏!')
    }
  },
  getURLSearchParams (params) {
    let reg = new RegExp('(^|&)' + params + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    } else {
      return null
    }
  },
  checkDeliveryDelayDay (rule, value, callback) {
    const startTime = new Date()
    const days = moment(value).diff(moment(startTime), 'days', true)
    if (days > 30) {
      callback(new Error('不可以超过30天'))
    } else {
      callback()
    }
  }
}
