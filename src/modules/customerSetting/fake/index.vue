<template lang="html">
    <div>
        <br><br>
        {{ message }}
    </div>
</template>
<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      message: '切换中...'
    }
  },
  mounted () {
    if (this.$route.query.id) {
      let params = {
        id: this.$route.query.id
      }
      this.fakeUser(params).then(data => {
        this.message = '切换成功'
        this.$router.push({
          path: '/migrate/productList'
        }).catch(() => {})
      }, e => {
        this.message = '切换失败，请重新尝试'
        this.$message.error(e.message)
      }).catch(err => {
        this.message = '切换失败，请重新尝试'
        this.$message.error(err.message)
      })
    }
  },
  methods: {
    ...mapActions([
      'fakeUser'
    ])
  }
}
</script>
