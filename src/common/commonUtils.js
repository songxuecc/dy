import Api from '@/api/apis'
import { Message } from 'element-ui'
const pddHarf = process.env.BUILD_TYPE === 'yhds'
  ? '&response_type=code&client_id=eb864d87975a4716878287d2855c8d55&redirect_uri=https://optimize.huhuguanjia.com/authorize'
  : '&response_type=code&client_id=50a2a5a298fb42a8863ba1c5267159b9&redirect_uri=https://pdd.huhuguanjia.com/authorize'

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
    window.location.href = 'https://mms.pinduoduo.com/open.html?state=' + JSON.stringify(state) + pddHarf
  }
}
