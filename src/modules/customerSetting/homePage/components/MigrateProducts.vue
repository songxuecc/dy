<!-- 搬家上货 & 搬家辅助功能 -->
<template>
  <div class="flex MigrateProducts">
    <div class="products">
      <div class="title">
        <hh-icon type="iconbanjiashanghuo1" class="mr-5"></hh-icon> 搬家上货
      </div>
      <div class="step one">第一步 基本设置 <span>新手请从这里开始操作</span></div>
      <div class="flex justify-b tip">
        <span class="text">完成基本设置填写，后续操作更方便</span>
        <span class="edit">
          去操作 <hh-icon type="iconqucaozuoweixuanzhong" class="btn"></hh-icon>
        </span>
      </div>

      <div class="step two">第二步 设置完成 复制商品</div>
      <div class="flex justify-b tip">
        <span class="text">支持4种复制方式，请按需选择</span>
        <span class="edit">
          去操作 <hh-icon type="iconqucaozuoweixuanzhong" class="btn"></hh-icon>
        </span>
      </div>

    </div>
    <div class="function">
      <div class="title">
        <hh-icon type="iconbanjiafuzhugongneng" class="mr-5"></hh-icon>
        搬家辅助功能
      </div>

      <div class="collect">
        <div class="mb-5">
          <hh-icon type="iconshangpincaiji"></hh-icon>
          商品采集
        </div>
        <p>系统将您需要的商品链接一键采集，无需手动复制链接</p>
        <div class="right edit">
          去操作 <hh-icon type="iconqucaozuoweixuanzhong" class="btn"></hh-icon>
        </div>
      </div>
      <div class="collect mt-10">
        <div class="mb-5">
          <hh-icon type="iconbangdingdianpuguanli"></hh-icon>
          绑定店铺管理
        </div>
        <p>多店铺卖家必备：多店铺商品任意复制、一次复制多店同时上货</p>
        <div class="right edit">
          去操作 <hh-icon type="iconqucaozuoweixuanzhong" class="btn"></hh-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import migrateProducts from '../images/migrateProducts.png'

export default {
  name: 'MigrateProducts',
  props: {
    msg: String
  },
  data () {
    return {
      migrateProducts
    }
  }
}
</script>
<style lang="less" scoped>

// .pxMixin() {
//   @functions: ~`(function() {
//     var clientWidth = '(100vw - 200px) / 1079 * ';
//     function convert(size) {
//       return typeof size === 'string' ?
//         size.replace('px', '') : (size + '');
//     }
//     this.rem =  function(size) {
//       return 'calc(' + clientWidth + convert(size) + ')';
//     }
//   })()`;
// }
// .pxMixin();

.title {
  height: 28px;
  font-size: 20px;
  font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
  font-weight: normal;
  color: #6a6e80;
  line-height:  28px;
  margin-bottom: 9px;
}
.MigrateProducts {
  margin: 16px 0;

  .products {
    width: 370px;
    height: 310px;
    background: rgba(247, 248, 249, 0.8);
    border-radius: 20px;
    margin-right: 16px;
    padding: 16px;
    box-sizing: border-box;
    background-image: url('../images/migrateProducts.png');
    background-size: 100% 100%;

    .step {
      height: 22px;
      font-size: 16px;
      font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
      font-weight: normal;
      color: #6a6e80;
      line-height: 22px;
      margin-left: 20px;
    }
    .one {
      margin-top: 59px;
      span {
        width: 112px;
        height: 15px;
        background: rgba(255, 230, 194, 0.55);
        border-radius: 6px 0px 6px 0px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #FA8100;
        line-height: 15px;
        padding: 0 4px;
      }
    }
    .two {
      margin-top: 82px;
    }

    .tip {
      margin-left: 20px;
      .text {
        height: 26px;
        font-size: 12px;
        font-family: FZLTXHK--GBK1-0, FZLTXHK--GBK1;
        font-weight: normal;
        color: #767989;
        line-height: 26px;
      }

      .edit {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #6a6e80;
        line-height: 26px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
          .btn {
            width: 26px;
            height: 26px;
            background: rgba(50, 119, 255, 0.5);
            border-radius: 13px;
            font-size: 26px;
            margin-left: 4px;
            margin-right: 20px;
          }
      }

    }
  }

  .function {
    width: 258px;
    height: 309px;
    background: rgba(247, 248, 249, 0.8);
    border-radius: 20px;
    padding: 16px;
    box-sizing: border-box;

    .collect {
      width: 222px;
      height: 111px;
      background: #ffffff;
      border-radius: 20px;
      padding: 12px 18px;
      box-sizing: border-box;
      p {
        height: 36px;
        font-size: 12px;
        font-family: FZLTXHK--GBK1-0, FZLTXHK--GBK1;
        font-weight: normal;
        color: #767989;
        line-height: 18px;
        margin-bottom: 2px;
      }

      .edit {
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #6a6e80;
        line-height: 26px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .btn {
        width: 26px;
        height: 26px;
        background: rgba(50, 119, 255, 0.5);
        border-radius: 13px;
        font-size: 26px;
        margin-left: 4px;
      }
    }
  }
}
</style>
