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
        <el-form :size="formSize" :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item label="手机号：" prop="phone">
            <el-input v-model="loginForm.phone" placeholder="手机号"><span>dsfsf</span></el-input>
          </el-form-item>
          <el-form-item label="密码：" prop="password">
            <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
          </el-form-item>
          <span v-if="errorTips !== ''" class="error-tip">{{errorTips}}</span>
          <el-form-item class="phone-check" label="验证码：" prop="captcha" v-if="!isLogin">
            <el-input v-model="loginForm.captcha" placeholder="手机验证码"><span>dsfsf</span></el-input>
            <el-button v-show="sendAuthCode" type="success" @click="getAuthCode" size="small">获取验证码</el-button>
            <span v-show="!sendAuthCode" class="auth_text"> <span class="auth_text_blue">{{auth_time}} </span> 秒之后重新发送验证码</span>
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
    let checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号码不能为空'))
      }
      setTimeout(() => {
        let phoneReg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
        if (!phoneReg.test(value)) {
          callback(new Error('请输入手机号码'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      tabPosition: 'login',
      isLogin: true,
      sendAuthCode: true,
      auth_time: 60,
      formSize: '',
      verification: '',
      captchaTime: null,
      btnTitle: '登录',
      loginForm: {
        phone: '',
        password: '',
        captcha: ''
      },
      rules: {
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      showLogin: false,
      errorTips: ''
    }
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    })
  },
  mounted () {
    if (this.isAuth) {
      this.getUserInfo()
    } else {
      this.showLogin = true
    }
  },
  watch: {
    isAuth (val) {
      if (val) {
        this.getUserInfo()
      } else {
        this.showLogin = true
      }
    }
  },
  methods: {
    ...mapActions([
      'requestUserInfo',
      'requestLogin',
      'requestRegister',
      'requestSendCaptcha'
    ]),
    getUserInfo () {
      this.requestUserInfo({}).then(data => {
        if (data.phone && data.phone !== '') {
          this.$router.push({
            path: '/info'
          })
        }
      }).catch(err => {
        this.showLogin = true
        this.message = '请重新登录'
        this.$message.error(err.message)
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let params = {
            phone: this.loginForm.phone,
            password: this.loginForm.password
          }
          if (this.tabPosition === 'login') {
            delete params.captcha
            this.requestLogin(params).then(data => {
              this.$router.push({
                path: '/info'
              })
            }).catch(err => {
              this.errorTips = err.message
              this.$message.error(err.message)
            })
          } else {
            params.captcha = this.loginForm.captcha
            this.requestRegister(params).then(data => {
              this.$router.push({
                path: '/info'
              })
            }).catch(err => {
              this.errorTips = err.message
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
      if (this.tabPosition === 'login') {
        this.isLogin = true
        this.formSize = ''
      } else {
        this.isLogin = false
        this.formSize = 'small'
      }
      this.btnTitle = this.tabPosition === 'login'
        ? '登录'
        : '注册'
    },
    goToRegister () {
      this.tabPosition = 'register'
      this.changeTab()
    },
    getAuthCode () {
      let params = {
        phone: this.loginForm.phone
      }
      this.requestSendCaptcha(params).then(data => {
        this.sendAuthCode = false
        this.auth_time = 60
        this.captchaTime = setInterval(() => {
          this.auth_time--
          if (this.auth_time <= 0) {
            this.sendAuthCode = true
            clearInterval(this.captchaTime)
          }
        }, 1000)
      }).catch(err => {
        this.errorTips = err.message
        this.$message.error(err.message)
      }) // 发送验证码
    }
  }
}
</script>
<style lang="less" scoped>
  @import '~@/assets/css/mixin.less';
  .login_page{
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 9999;
    background-color: #324057;
  }
  .manage_tip{
    position: absolute;
    width: 100%;
    top: -76px;
    left: 0;
    p{
      font-size: 34px;
      color: #fff;
    }
  }
  .form_contianer{
    .wh(320px, 340px);
    .ctp(320px, 340px);
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
  .error-tip {
    color: #F56C6C;
    position: relative;
    top: -10px;
  }
  .phone-check {
    text-align: left;
    /deep/ .el-input--small {
      width: 100px;
      input {
        width: 100px;
      }
    }
  }
  .auth_text {
    color: #999999;
    font-size: 12px;
  }
</style>
