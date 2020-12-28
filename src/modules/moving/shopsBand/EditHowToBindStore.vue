<!-- 如何绑定店铺 -->
<template>
    <div class="EditHowToBindStore">
      <h1>绑定后可实现<span class="tutorials">666</span></h1>
      <h3><span>1、</span>当前店铺如果作为主店铺，授权码为xxxxx</h3>
      <el-button
        class="code"
        size="mini"
        type="primary"
        :loading="postCodeLoading"
        @click="copy">复制授权码</el-button>
      <p>复制授权码后<a>登陆其他店铺</a> 并粘贴该串授权码则完成绑定</p>
      <h1><span>2、</span>当前店铺如果作为子店铺，请在此输入主店铺的授权码</h1>
      <div class="input-code">
        <el-input placeholder="请输入主店铺授权码" size="medium" class="input" style="width:230px" />
        <el-button
          size="medium"
          type="primary"
          style="width:120px"
          :loading="postSubmitLoading"
          @click="submit">确认</el-button>
      </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const {
  mapActions,
  mapState
} = createNamespacedHelpers('moving/shopsBand')

export default {
  name: 'EditHowToBindStore',
  props: {
    msg: String
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['postSubmitLoading', 'postCodeLoading'])
  },
  methods: {
    ...mapActions(['postUserBindCreate', 'changeActive', 'postBindSuthCodeCreate']),
    async copy () {
      const result = await this.postBindSuthCodeCreate()
      if (result) {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      }
    },
    submit () {
      this.postUserBindCreate()
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
      width: 50px;
      line-height: 18px;
      text-align: center;
      height: 18px;
      margin-top: 2px;
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
</style>
