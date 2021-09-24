<!-- 通知 -->
<template>
  <div class="Notify">
    <div class="tip left">
      <hh-icon type="iconxiaoxitongzhi" class="mr-5"></hh-icon> 消息通知
    </div>
    <div class="warp" @click="goBtnLink">
      <vue-seamless-scroll
      :data="listData"
      class="scroll"
      :class-option="classOption"
      ref="seamlessScroll"
    >
      <ul class="item" >
        <li v-for="(item, index) in listData" :key="index" >
          <span class="title">
            <hh-icon :type="item.is_read ? 'iconlaoxiaoxi':'iconxinxiaoxi'" class="icon"></hh-icon>
            <span class="text" >{{ item.title }}</span>
          </span>
          <span class="btn" :data-index="index">去体验</span>
        </li>
      </ul>
    </vue-seamless-scroll>

    </div>

    <div class="wechat">
      <div class="left">
        <div class="flex">
          <hh-icon type="iconlianxikefu" class="mr-5 font-20"></hh-icon>
          <span class="kefu">联系客服</span>
        </div>
        <div class="mt-5 fangshi">方式1:微信扫码添加人工客服</div>
        <div class="mt-5 fangshi">方式2:拨打电话 13611623496</div>
      </div>
      <div class="right">
         <el-popover
          placement="left"
          width="100"
          popper-class="popper-class-Notify"
          trigger="hover">
          <div>
             <img :src="require('@/assets/images/wxpic.jpg')" alt="" class="big-img"/>
          </div>
          <img :src="require('@/assets/images/wxpic.jpg')" alt="" class="img pointer" slot="reference"/>
        </el-popover>
      </div>
    </div>

    <div class="jiaohceng">
      <div class="left">
        <div class="flex ">
          <hh-icon type="iconruanjianjiaocheng" class="mr-5 font-20"></hh-icon>
          <span class="kefu">软件教程 <span class="click font-12" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'">查看全部</span></span>
        </div>
        <div class="flex">
            <div class="mt-5 mr-20 ">
                <div class="click font-12 mb-5 l-14" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l'">01新手必读:多商品复制教程</div>
                <div class="click font-12 l-14" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/qyqwt0'">02如何批量修改商品?</div>
            </div>
            <div class="mt-5">
                <div  class="click font-12 mb-5 l-14" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/muvtyt'">03如何获取抖音复制链接?</div>
                <div  class="click font-12 l-14" v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/tm5odl'">04怎么获取整店复制链接?</div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
import { mapGetters, mapActions } from 'vuex'
import request from '@/mixins/request.js'

export default {
  mixins: [request],
  name: 'Notify',
  props: {
    msg: String
  },
  components: {
    vueSeamlessScroll
  },
  computed: {
    ...mapGetters({
      isAuth: 'getIsAuth',
      notificationList: 'getNotificationList'
    }),
    list () {
      console.log(this.notificationList, 'notificationList')
      return this.notificationList
    }
  },
  created () {
    this.requestNotification().then(data => {
      this.listData = data.list.map(item => {
        return ({
          ...item,
          data: item.start_time.substr(0, 10)
        })
      })
    })
  },
  methods: {
    ...mapActions([
      'requestNotification'
    ]),
    getrequestNotification () {
      this.requestNotification().then(data => {
        this.listData = data.list.map(item => {
          return ({
            ...item,
            data: item.start_time.substr(0, 10)
          })
        })
      })
    },
    hideRedCircle (row) {
      let index = this.listData.indexOf(row)
      row.is_read = 1
      this.$set(this.listData, index, row)
    },
    goBtnLink (ev) {
      ev = ev || window.event
      var target = ev.target || ev.srcElement

      if (target) {
        const index = target.getAttribute('data-index')
        const notification = this.listData[index]
        if (window._hmt) {
          window._hmt.push(['_trackEvent', '通知列表--主按钮', '点击', `${notification.title}主按钮`])
        }
        let params = {
          notification_id: notification.id,
          is_read: 1
        }
        this.request('setNotificationStatus', params, data => {
          this.hideRedCircle(notification)
          this.$refs.seamlessScroll.reset()
          this.getrequestNotification()
          if (notification.is_new_window === 1) {
            window.open(notification.btn_link)
          } else {
            window.location.href = notification.btn_link
          }
        })
      }
    }
  },
  data () {
    return {
      classOption: {
        step: 0.7
      },
      listData: []
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
  width: 356px;
  height: 224px;
  background: rgba(247, 248, 249, 0.8);
  border-radius: 20px;
  box-sizing: border-box;
  margin-bottom: 16px;
  overflow: hidden;

}
.scroll {
  overflow: hidden;
  width: 322px;
  margin: 10px 14px 10px 20px;
  height: 204px;

  ul {
    list-style: none;
    padding: 0;
    margin: 0 auto;
    li {
      display: block;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #fff;
      padding: 7px 0;
      .title {
        display: inline-flex;
        width: 254px;
        max-height: 16px;
        font-size: 12px;
        font-family: MicrosoftYaqiHeiLight;
        color: #6a6e80;
        line-height: 16px;
        overflow: hidden;
        text-align: left;
      }
      .text {
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 220px;
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

    .img {
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

 /deep/ .big-img{
      width: 110px;
      height: 110px;
    }
</style>

<style lang="less">
.popper-class-Notify {
  min-width: 108px;
  padding: 5px;
}
</style>
