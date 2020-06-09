<template lang="html">
  <div class="login_page fillcontain">
    <transition name="form-fade" mode="in-out">
      <section class="form_contianer" v-show="showLogin">
        <div class="manage_tip">
          <p>抖音小店</p>
        </div>
        <el-radio-group v-model="tabPosition" @change="changeTab">
          <el-radio-button label="login">登录</el-radio-button>
          <el-radio-button label="register">注册</el-radio-button>
        </el-radio-group>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="手机号"><span>dsfsf</span></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">{{btnTitle}}</el-button>
          </el-form-item>
        </el-form>
        <p class="tip">温馨提示：如果未注册请点击<span @click="goToRegister">注册</span></p>
      </section>
    </transition>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      tabPosition: 'login',
      btnTitle: '登录',
      loginForm: {
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      showLogin: false
    }
  },
  computed: {
    ...mapGetters({
      token: 'getToken'
    })
  },
  mounted () {
    this.showLogin = true
  },
  methods: {
    ...mapActions([
      'requestToken',
      'requestLogin',
      'requestRegister'
    ]),
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          }
          if (this.tabPosition === 'login') {
            this.requestLogin(params).then(data => {
              this.message = '授权成功'
              this.$router.push({
                path: '/migrate'
              })
            }, e => {
              this.message = '授权失败，请重新尝试'
              this.$message.error(e.message)
            }).catch(err => {
              this.message = '授权失败，请重新尝试'
              this.$message.error(err.message)
            })
          } else {
            this.requestRegister(params).then(data => {
              this.message = '授权成功'
              this.$router.push({
                path: '/migrate'
              })
            }, e => {
              this.message = '授权失败，请重新尝试'
              this.$message.error(e.message)
            }).catch(err => {
              this.message = '授权失败，请重新尝试'
              this.$message.error(err.message)
            })
          }
        } else {
          this.$notify.error({
            title: '错误',
            message: '请输入正确的用户名密码',
            offset: 100
          })
          return false
        }
      })
    },
    changeTab () {
      this.btnTitle = this.tabPosition === 'login'
        ? '登录'
        : '注册'
    },
    goToRegister () {
      this.tabPosition = 'register'
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/base.less';
  @import '~@/assets/css/mixin.less';
  .login_page{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #324057;
  }
  .manage_tip{
    position: absolute;
    width: 100%;
    top: -100px;
    left: 0;
    p{
      font-size: 34px;
      color: #fff;
    }
  }
  .form_contianer{
    .wh(320px, 330px);
    .ctp(320px, 330px);
    padding: 25px;
    border-radius: 5px;
    text-align: center;
    background-color: #fff;
    .submit_btn{
      width: 100%;
      font-size: 16px;
    }
  }
  .tip{
    font-size: 12px;
    color: #62ffb3;
    span {
      padding: 0 6px;
      color: #409EFF;
      cursor: pointer;
    }
  }
  .form-fade-enter-active, .form-fade-leave-active {
    transition: all 1s;
  }
  .form-fade-enter, .form-fade-leave-active {
    transform: translate3d(0, -50px, 0);
    opacity: 0;
  }
</style>
