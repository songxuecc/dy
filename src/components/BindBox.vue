<template lang="html">
  <el-dialog title="绑定店铺" :visible.sync="isShowBind">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="Appkey" :label-width="formLabelWidth">
        <el-input v-model="form.app_key" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Appsercet" :label-width="formLabelWidth">
        <el-input v-model="form.app_secret" autocomplete="off"></el-input>
      </el-form-item>
      <p>Appkey和Appsercet获取请到商家后台获取<span class="span-link" @click="goToDyOption">点击跳转</span>,如需帮助请联系客服</p>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <!--          <el-button @click="dialogFormVisible = false">取 消</el-button>-->
      <el-button type="primary" @click="subBindApp">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {mapActions, mapGetters} from 'vuex'

export default {
  props: {
    isShowBind: Boolean
  },
  data () {
    return {
      form: {
        app_key: '',
        app_secret: ''
      }
    }
  },
  inject: ['reload'],
  computed: {
    ...mapGetters({
      isBind: 'getIsBind',
      subsc: 'getCurrentSubsc'
    })
  },
  methods: {
    ...mapActions([
      'logout',
      'requestUserInfo',
      'requestBindApp'
    ]),
    subBindApp () {
      let params = {
        'app_key': this.form.app_key,
        'app_secret': this.form.app_secret
      }
      this.requestBindApp(params).then(data => {
        this.$message.success('绑定成功~')
        this.isShowBind = false
      }).catch(err => {
        this.message = '用户信息抓取失败'
        this.$message.error(err.message)
      })
    },
    goToDyOption () {
      window.open('https://fxg.jinritemai.com/index.html#/iview/shopfxg/accredit')
    }
  }
}
</script>
