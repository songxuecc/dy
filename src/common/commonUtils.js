import Api from '@/api/apis'
import { Message } from 'element-ui'
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
  login (shareId = null) {
    let host = encodeURI(window.location.protocol + '//' + window.location.host)
    let state = {}
    if (process.env.BUILD_ENV !== 'prod') {
      state['host'] = host
    }
    if (shareId) {
      state['share_id'] = shareId
    }
    let url = 'https://fxg.jinritemai.com/index.html#/ffa/open/applicationAuthorize?response_type=code&app_id=6839207088506422798&redirect_uri=https://dy.huhuguanjia.com/authorize&state=' + JSON.stringify(state)

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
  }
}
