<!-- 如何绑定店铺 -->
<template>
    <div class="EditHowToBindStore">
      <h1>如何绑定<span class="tutorials" @click="caozuojiaocheng">操作教程 ></span></h1>
      <h3><span>1、</span>当前店铺如果作为主店铺，授权码为</h3>
      <div class="code">
        <el-link
          type="primary"
          :underline="false"
          class="code-link"
          v-if="auth_code"
          >{{auth_code}}</el-link>
        <a class="skeleton skeleton-item" v-else/>
        <el-button
        size="mini"
        type="primary"
        :loading="postCodeLoading"
        @click="copy">复制授权码</el-button>
      </div>
      <p>复制授权码后<b>&nbsp;登陆其他店铺&nbsp;</b>并粘贴该串授权码则完成绑定</p>
      <h1><span>2、</span>当前店铺如果作为子店铺，请在此输入主店铺的授权码</h1>
      <div class="input-code">
        <el-input placeholder="请输入主店铺授权码" size="medium" class="input" style="width:230px" v-model="parent_auth_code"/>
        <el-button
          size="medium"
          type="primary"
          style="width:120px;height:36px"
          :loading="postSubmitLoading"
          @click="submit">确认</el-button>
      </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
import Api from '@/api/apis'
const {
  mapState,
  mapMutations,
  mapActions
} = createNamespacedHelpers('migrate/shopsBand')

export default {
  name: 'EditHowToBindStore',
  props: {
    msg: String
  },
  data () {
    return {
      parent_auth_code: '',
      auth_code: ''
    }
  },
  async created () {
    const data = await Api.hhgjAPIs.postBindSuthCodeCreate()
    this.auth_code = data.auth_code
  },
  computed: {
    ...mapState(['postSubmitLoading', 'postCodeLoading'])
  },
  methods: {
    ...mapMutations(['save']),
    ...mapActions(['getUserBindList']),
    caozuojiaocheng () {
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/knnu2m')
      return false
    },
    copy: async function () {
      try {
        this.save({postCodeLoading: true})
        await this.$copyText(this.auth_code)
        this.save({postCodeLoading: false})
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      } catch (err) {
        this.save({postCodeLoading: false})
        this.$message({
          message: err,
          type: 'error'
        })
      }
    },
    async submit () {
      if (!this.parent_auth_code) {
        this.$message({
          message: '请输入授权码',
          type: 'error'
        })
        return false
      }
      if (this.parent_auth_code === this.auth_code) {
        this.$message({
          message: '授权失败，请切换其他店铺输入授权码',
          type: 'error'
        })
        return false
      }
      this.save({postSubmitLoading: true})
      try {
        await Api.hhgjAPIs.postUserBindCreate({
          parent_auth_code: this.parent_auth_code
        })
        this.save({postSubmitLoading: false})
        this.$message({
          message: '绑定成功',
          type: 'success'
        })
        this.getUserBindList({ loading: true })
        this.parent_auth_code = ''
      } catch (err) {
        this.save({postSubmitLoading: false})
        this.$message({
          message: err,
          type: 'error'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.EditHowToBindStore{
  background: #FFFFFF;
  border: 1px solid #F2F2F2;
  box-shadow: 0 4px 14px 0 rgba(0,0,0,0.04);
  border-radius: 10px;
  border-radius: 10px;
  padding: 20px 43px;
  box-sizing: border-box;
  text-align: left;
  h1 {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #4E4E4E;
    display: flex;
    margin-bottom: 14px;
    .tutorials{
      background-image: linear-gradient(164deg, #FF9527 0%, #EB2202 100%);
      border-radius: 8px 0 8px 0;
      font-size: 10px;
      color: #FFFFFF;
      display: inline-block;
      line-height: 18px;
      text-align: center;
      height: 18px;
      padding: 0 4px;
      margin-top: 3px;
      margin-left: 5px;
      cursor: pointer;
      &:hover {
        transition: 0.3s;
        transform: scale(1.05);
      }
    }
  }
  h3 {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #333333;
  }
  .code {
    margin-left: 28px;
    margin-top: 7px;
    display: flex;
    align-items: center;
    .code-link {
      margin-right: 5px;
      font-size: 16px;
      font-weight: 600;
    }
  }
  p {
    font-family: PingFangSC-Light;
    font-size: 12px;
    color: #333333;
    text-align: justify;
    margin-top: 6px;
    margin-bottom: 16px;
    margin-left: 28px;
  }
  .input-code {
    margin-top: 12px;
    margin-left: 28px;
    .input {
      margin-right: 10px;
    }
  }
}
.skeleton-item {
  height:24px;
  width:290px;
  display:inline-block;
  margin-right: 5px;
  border-radius: 2px;
}
.skeleton {
  background: linear-gradient(90deg,#f2f2f2 25%,#e6e6e6 37%,#f2f2f2 63%);
  background-size: 400% 100%;
  -webkit-animation: hh-skeleton-loading 1.4s ease infinite;
  animation: hh-skeleton-loading 1.4s ease infinite;
}
@keyframes hh-skeleton-loading {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
