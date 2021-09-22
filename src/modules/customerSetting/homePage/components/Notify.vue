<!-- 通知 -->
<template>
  <div class="Notify">
    <div class="tip left">
      <hh-icon type="iconxiaoxitongzhi" class="mr-5"></hh-icon> 消息通知
    </div>
    <vue-seamless-scroll
      :data="listData"
      class="warp"
      :class-option="classOption"
    >
      <ul class="item">
        <li v-for="(item, index) in listData" :key="index">
          <span class="title">
            <hh-icon type="iconxinxiaoxi" class="icon"></hh-icon>
            <span>{{ item.title }}</span>
          </span>
          <span class="btn">去体验</span>
        </li>
      </ul>
    </vue-seamless-scroll>

    <div class="wechat">
      <div class="left">
        <div class="flex">
          <hh-icon type="iconlianxikefu" class="mr-5 font-20"></hh-icon>
          <span class="kefu">联系客服</span>
        </div>
        <div class="mt-5 fangshi">方式1:微信扫码添加人工客服</div>
        <div class="mt-5 fangshi">方式2:拨打电话 12345678</div>
      </div>
      <div class="right">
        <img :src="require('../images/qrcode.png')" alt="" />
      </div>
    </div>

    <div class="jiaohceng">
      <div class="left">
        <div class="flex ">
          <hh-icon type="iconruanjianjiaocheng" class="mr-5 font-20"></hh-icon>
          <span class="kefu">软件教程 <span class="click font-12">查看全部?</span></span>
        </div>
        <div class="flex">
            <div class="mt-5 mr-20 ">
                <div class="click font-12 mb-5 l-14">01新手必读:多商品复制教程</div>
                <div class="click font-12 l-14">02如何批量修改商品?</div>
            </div>
            <div class="mt-5">
                <div  class="click font-12 mb-5 l-14">03如何获取抖音复制链接?</div>
                <div  class="click font-12 l-14" >04怎么获取整店复制链接?</div>
            </div>
        </div>
      </div>
      <div class="right">
        <img src="" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'Notify',
  props: {
    msg: String
  },
  components: {
    vueSeamlessScroll
  },
  data () {
    return {
      classOption: {
        step: 0.7
      },
      listData: [
        {
          title:
            '2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧',
          date: '2017-12-16'
        },
        {
          title:
            '2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧',
          date: '2017-12-16'
        },
        {
          title:
            '2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧',
          date: '2017-12-16'
        },
        {
          title:
            '2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧2021年4月5日xxx功能上线吧啦吧啦吧',
          date: '2017-12-16'
        },
        {
          title: '无缝滚动第五行无缝滚动第五行',
          date: '2017-12-16'
        },
        {
          title: '无缝滚动第六行无缝滚动第六行',
          date: '2017-12-16'
        },
        {
          title: '无缝滚动第七行无缝滚动第七行',
          date: '2017-12-16'
        },
        {
          title: '无缝滚动第八行无缝滚动第八行',
          date: '2017-12-16'
        },
        {
          title: '无缝滚动第九行无缝滚动第九行',
          date: '2017-12-16'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>

.Notify {
  width: 356px;
}
.tip {
  height: 28px;
  font-size: 20px;
  font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
  font-weight: normal;
  color: #6a6e80;
  line-height: 28px;
  margin-bottom: 9px;
}
.warp {
  overflow: hidden;
  width: 100%;
  aspect-ratio: 356/190;
  background: rgba(247, 248, 249, 0.8);
  border-radius: 20px;
  box-sizing: border-box;
  padding: 10px 14px 10px 20px;
  margin-bottom: 16px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li {
      display: block;
      display: flex;
      justify-content: space-between;
      margin-bottom: 17px;
      border-bottom: 1px solid #fff;
      .title {
        display: inline-flex;
        width: 254px;
        max-height: 32px;
        font-size: 12px;
        font-family: MicrosoftYaqiHeiLight;
        color: #6a6e80;
        line-height: 16px;
        overflow: hidden;
        text-align: left;
      }

      .icon {
        margin-right: 5px;
        line-height: 16px;
        display: inline-block;
        margin-top: 1px;
      }

      .btn {
        width: 36px;
        height: 16px;
        font-size: 12px;
        color: #3277ff;
        line-height: 16px;
        cursor: pointer;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

.wechat {
  display: flex;
  box-sizing: border-box;
  padding: 11px 25px 11px 27px;

  width: 100%;
  aspect-ratio: 356/89;
  background: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(30, 30, 30, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(50, 119, 255, 0.5);
  margin-bottom: 16px;
  justify-content: space-between;
  align-items: center;
  .left {
    .kefu {
      font-size: 16px;
      font-family: FZLTZHK--GBK1-0, FZLTZHK--GBK1;
      font-weight: normal;
      color: #6a6e80;
      line-height: 22px;
      text-shadow: 0px 3px 4px rgba(30, 30, 30, 0.05);
    }
  }
  .right {
    width: 74px;
    display: flex;

    img {
      width: 74px;
      height: 74px;
    }
  }

  .fangshi {
    font-weight: normal;
    color: #6A6E80;
    line-height: 16px;
    font-size: 12px;
  }
}

.jiaohceng {
  display: flex;
  box-sizing: border-box;
  padding-top: 3px;
  aspect-ratio: 356/89;
  background: #ffffff;
  box-shadow: 0px 3px 4px 0px rgba(30, 30, 30, 0.05);
  border-radius: 20px;
  border: 1px dashed #dbdbdb;
  .left {
    margin:auto;
    .l-14{
  line-height: 16px;

    }
  }
}
</style>
