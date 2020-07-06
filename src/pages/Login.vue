<template lang="html">
    <div>
        <br><br>
        {{ message }}
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      message: '正在授权...'
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    })
  },
  created () {
    localStorage.setItem('is_auth', false)
  },
  mounted () {
    if (this.$route.query.code || this.$route.query.authCode) {
      let code = this.$route.query.code
      if (!code) {
        code = this.$route.query.authCode
      }
      let params = {
        code: code
      }
      let state = decodeURI(this.$route.query.state)
      if (state) {
        let data = {}
        try {
          data = JSON.parse(state)
        } catch (error) {
          console.error(error)
        }
        if (data['host']) {
          let url = decodeURI(data['host']) + '/authorize?code=' + this.$route.query.code + '&state=' + JSON.stringify({'share_id': data['share_id']})
          window.location.href = url
        }
        if (data['share_id']) {
          params['share_id'] = data['share_id']
        }
      }
      this.requestToken(params).then(data => {
        this.message = '授权成功'
        this.$router.push({
          path: '/migrate'
        })
      }, e => {
        localStorage.setItem('is_auth', false)
        this.message = '授权失败，请重新尝试'
        this.$message.error(e.message)
      }).catch(err => {
        localStorage.setItem('is_auth', false)
        this.message = '授权失败，请重新尝试'
        this.$message.error(err.message)
      })
    } else {
      this.message = '传参code错误！'
    }
  },
  methods: {
    ...mapActions([
      'requestToken'
    ])
  }
}
</script>
