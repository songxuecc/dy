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
  mounted () {
    if (this.$route.query.code) {
      let params = {
        code: this.$route.query.code
      }
      let state = this.$route.query.state
      if (state) {
        let data = JSON.parse(state)
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
          path: '/pddPoductList'
        })
        this.requestNotification().then(data => {
        })
      }, e => {
        this.message = '授权失败，请重新尝试'
        this.$message.error(e.message)
      }).catch(err => {
        this.message = '授权失败，请重新尝试'
        this.$message.error(err.message)
      })
    } else {
      this.message = '传参code错误！'
    }
  },
  methods: {
    ...mapActions([
      'requestToken',
      'requestNotification'
    ])
  }
}
</script>
