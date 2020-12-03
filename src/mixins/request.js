import Api from '@/api/apis'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    })
  },
  data () {
    return {
      loadingCnt: 0,
      notNeedAuthList: [
        'getSubscItems',
        'saveChannelInfo'
      ]
    }
  },
  methods: {
    request (method, params, cbsuccess, cbfail, isSilent = false) {
      if (!this.isAuth && !this.notNeedAuthList.includes(method)) {
        return
      }
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
      this.$message.error(err.message)
    }
  }
}
