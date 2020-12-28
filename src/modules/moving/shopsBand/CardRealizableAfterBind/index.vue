<!-- 绑定后可实现 -->
<template>
    <div class="CardRealizableAfterBind">
      <h1>绑定后可实现</h1>
      <div v-for="(item,index) in list" :key="index" :class="['item', index === list.length-1 ? 'no-margin-bottom' :'']">
          <img :src="item.type" alt="图片" class="icon">
            <div>
              <h3>{{item.h3}}<span v-if="item.extra" class="extra">666</span></h3>
              <span>{{item.span}}</span>
          </div>
      </div>
    </div>
</template>

<script>
import keyTab from './keyTab.png'
import moving from './moving.png'
import paintBoard from './paintBoard.png'
export default {
  name: 'CardRealizableAfterBind',
  props: {
    msg: String
  },
  data () {
    return {
      list: [
        {
          type: moving,
          h3: '搬家上货至多个店铺',
          span: '绑定后，一次复制可以搬家至主店铺a和它所有子店铺bcd',
          extra: true
        },
        {
          type: paintBoard,
          h3: '各店铺间商品相互同步',
          span: '主店铺a和它所有子店铺bcd的商品可以相互同步'
        },
        {
          type: keyTab,
          h3: '店铺一键切换登录',
          span: '绑定后，主店铺a和它所有子店铺bcd间可以相互切换账号登录(顶部导航栏“多店铺管理”处切换）'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.CardRealizableAfterBind {
  width: 444px;
  background: #FFFFFF;
  box-shadow: 0px 4px 14px 0px rgba(0, 0, 0, 0.04);
  border-radius: 10px;
  border: 1px solid #F2F2F2;
  padding: 20px 40px;
  box-sizing: border-box;
  text-align: left;
  h1 {
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #4E4E4E;
    margin-bottom: 18px;
  }
  span {
    font-size: 12px;
    color: #333333;
    text-align: justify;
    line-height: 18px;
  }
  h3 {
    font-size: 16px;
    color: #333333;
    margin-bottom: 4px;
    display: flex;
    .extra {
      margin-left: 5px;
      width: 25px;
      height: 20px;
      font-size: 22px;
    }
  }
  .item {
    display: flex;
    margin-bottom: 12px;
    // justify-content: space-between;
  }
  .no-margin-bottom {
    margin-bottom: 0;
  }
  .icon {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    margin-right: 10px;
  }

}
</style>
