<!-- 绑定后可实现 -->
<template>
    <div class="CardRealizableAfterBind">
      <h1>绑定后可实现</h1>
      <div v-for="(item,index) in list" :key="index">
          <div class="item">
            <hh-icon :type="item.type" class="icon">888</hh-icon>
            <div>
              <h3>{{item.h3}}</h3>
              <span>{{item.span}}</span>
            </div>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'CardRealizableAfterBind',
  props: {
    msg: String
  },
  data () {
    return {
      list: [
        {
          type: '',
          h3: '搬家上货至多个店铺',
          span: '绑定后，一次复制可以搬家至主店铺a和它所有子店铺bcd'
        },
        {
          type: '',
          h3: '各店铺间商品相互同步',
          span: '主店铺a和它所有子店铺bcd的商品可以相互同步'
        },
        {
          type: '',
          h3: '店铺一键切换登录',
          span: '绑定后，主店铺a和它所有子店铺bcd间可以相互切换账号登录(顶部导航栏“多店铺管理”处切换）'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.CardRealizableAfterBind{
  width: 444px;
  height: 276px;
  background: #FFFFFF;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  border: 1px solid #F2F2F2;
  .item {
    display: flex;
    // justify-content: space-between;
  }
  .icon {
    width: 44px;
    height: 44px;
  }
  h3 {
    font-size: 16px;
    color: #333333;
  }
  span {
    font-size: 12px;
    color: #333333;
    text-align: justify;
    line-height: 18px;
  }
}
</style>
