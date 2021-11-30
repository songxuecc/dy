<!-- 绑定后可实现 -->
<template>
    <div class="CardRealizableAfterBind">
      <h1>绑定后可实现
         <span
          class="click pointer font-12 ml-5"
          style="padding-top: 7px;color: #1D8FFF"
          v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/sow5gi'"><hh-icon type="iconwenhao" ></hh-icon>绑定后操作教程</span>
      </h1>
      <div v-for="(item,index) in list" :key="index" :class="['item', index === list.length-1 ? 'no-margin-bottom' :'']">
          <img :src="item.type" alt="图片" class="icon">
            <div>
              <h3>{{item.h3}}<el-link v-if="item.extra" type="primary" class="ml-5" :underline="false" @click="open">去使用</el-link></h3>
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
          span: '绑定后，一次复制可以搬家至主店铺a和它所有子店铺bcd'
        },
        {
          type: keyTab,
          h3: '店铺一键切换登录',
          span: '绑定后，主店铺a和它所有子店铺bcd间可以相互切换账号登录(顶部导航栏“绑定店铺管理”处切换）'
        },
        {
          type: paintBoard,
          h3: '绑定复制',
          span: '绑定后，主店铺a和它所有子店铺bcd可以进行店铺商品一键复制同步，包括sku编码的复制',
          extra: true
        }
      ]
    }
  },
  methods: {
    open () {
      this.$router.push({ name: 'StartMigrate',
        params: {
          activeName: 'bindCopy'
        }
      })
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
    display: flex;
    margin-bottom: 14px;
  }
  span {
    font-size: 12px;
    color: #333333;
    text-align: justify;
    line-height: 18px;
  }
  h3 {
    font-family: PingFangSC-Medium;
    margin-bottom: 4px;
    display: flex;
    font-size: 16px;
    color: #333333;
    font-weight: 600;
    .extra {
      margin-left: 5px;
      width: 25px;
      height: 20px;
      font-size: 22px;
      color:#FF9527;
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
