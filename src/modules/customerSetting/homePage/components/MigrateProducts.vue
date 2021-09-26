<!-- 搬家上货 & 搬家辅助功能 -->
<template>
  <div class="flex MigrateProducts">
    <div class="products">
      <div class="title">
        <hh-icon type="iconbanjiashanghuo1" class="mr-5"></hh-icon>
        搬家上货<span class="douzaiyong">90%商家都在用</span>
      </div>

      <div class="hoverDiv" @click="go({name:'MigrateSetting'},'搬家上货-第一步')">
        <div class="step one"  >第一步 基本设置 <span class="xinshou">新手请从这里开始操作</span></div>
        <div class="flex justify-b tip">
          <span class="text">完成基本设置填写，后续操作更方便</span>
          <span class="edit">
            去操作 <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
          </span>
        </div>
      </div>

      <div class="hoverDiv" @click="go({name:'StartMigrate',params:{activeName:'single'}},'辅助功能-第二步')">
        <div class="step two" >第二步 设置完成 复制商品</div>
        <div class="flex justify-b tip">
          <span class="text">支持4种复制方式，请按需选择</span>
          <span class="edit">
            去操作 <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
          </span>
        </div>
      </div>

    </div>
    <div class="function">
      <div class="title">
        <hh-icon type="iconbanjiafuzhugongneng" class="mr-5"></hh-icon>
        搬家辅助功能
      </div>

      <div class="collect" @click="go({name:'ProductionCollection'},'辅助功能-商品采集')">
        <div class="mb-5 name bold"  style="color:#6A6E80">
          <hh-icon type="iconshangpincaiji" style="font-size:20px;margin-right:5px;"></hh-icon>
          商品采集
        </div>
        <p>系统将您需要的商品链接一键采集，无需手动复制链接</p>
        <div class="right edit">
          去操作 <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
        </div>
      </div>
      <div class="collect mt-10" @click="go({name:'ShopsBand'},'辅助功能-绑定店铺')">
        <div class="mb-5 name bold" style="color:#6A6E80">
          <hh-icon type="iconbangdingdianpuguanli" style="font-size:20px;margin-right:5px;"></hh-icon>
          绑定店铺管理
        </div>
        <p>多店铺卖家必备：多店铺商品任意复制、一次复制多店同时上货</p>
        <div class="right edit">
          去操作 <hh-icon type="iconqucaozuoxuanzhong" class="btn"></hh-icon>
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
  },
  data () {
    return {
      migrateProducts
    }
  },
  methods: {
    go (options) {
      this.$router.push(options)
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '主页', '点击', `${name}`])
      }
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
  font-family: MicrosoftYaHei;
  font-weight: bold;
  color: #6A6E80;
  line-height:  28px;
  margin-bottom: 9px;
  display: flex;
  align-items: center;
  .douzaiyong {
    display: inline-block;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #FFFFFF;
    line-height: 16px;
    height: 20px;
    background: linear-gradient(180deg, #FFB470 0%, #FF581E 100%);
    border-radius: 6px 0px 6px 0px;
    padding: 2px 8px;
    box-sizing: border-box;
    margin-left: 4px;
    transform: scale(0.8);
    margin-left: -6px;
  }
}
.MigrateProducts {
  margin: 16px 0;

  .products {
    width: 370px;
    height: 310px;
    background: rgba(247, 248, 249, 0.8);
    border-radius: 20px;
    margin-right: 16px;
    padding: 16px 16px 14px 16px;
    box-sizing: border-box;
    background-image: url('../images/migrateProducts.png');
    background-size: 100% 100%;
    background-position-y: -3px;
    .step {
      height: 22px;
      font-size: 16px;
      font-family: MicrosoftYaHei;
      font-weight: normal;
      color: #6A6E80;
      line-height: 22px;
      margin-left: 20px;
    }

    .hoverDiv {
      cursor: pointer;
      &:hover {
        .btn {
          opacity: 1 !important;
        }
      }
    }
    .one {
      margin-top: 52px;
      .xinshou {
        transform: scale(0.8);
        display: inline-block;
        height: 18px;
        background: rgba(255, 230, 194, 0.55);
        border-radius: 6px 0px 6px 0px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        color: #FA8100;
        line-height: 15px;
        padding: 2px 6px;
        margin-bottom: 4px;
        box-sizing: border-box;
        margin-left: -10px;
        margin-top: -5px;
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
        font-family: MicrosoftYaHei;
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
            opacity: 0.6;
            cursor: pointer;
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
      background: #ffffff;
      border-radius: 20px;
      padding: 12px 18px;
      box-sizing: border-box;
      cursor: pointer;

      .name {
        display: flex;
        align-items: center;
      }
      p {
        height: 36px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
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
        margin-top: 2px;

      }
      &:hover {
          .btn {
            opacity: 1;
          }
        }
      .btn {
        opacity: 0.6;
        width: 26px;
        height: 26px;
        background: rgba(50, 119, 255, 0.5);
        border-radius: 13px;
        font-size: 26px;
        margin-left: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>
