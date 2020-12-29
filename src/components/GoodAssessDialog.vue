<template lang="html">
  <div class="goods-assess-dialog">
    <!-- 七天免费用户弹窗 -->
    <el-dialog v-if="goods_assess_notify.show_type === 'new'"
               title=""
               :visible.sync="goods_assess_notify.is_show"
               width="392px"
               top="8%"
               :show-close="false"
               :modal="true"
               :close-on-click-modal="false"
               custom-class="good-assess-box">
      <div class="inside">
        <div class="first-text">给“虎虎搬家”<a class="five-star-assess"
                                          @mouseenter="isShowGoodAssessPopUp=true"
                                          @mouseleave="isShowGoodAssessPopUp=false">5星好评</a>并联系客服，送你一个月高级版<span class="seven-text">免费用</span>！
        </div>
        <div class="second-text">该福利仅有一次，错过再无～</div>
      </div>
      <div class="goods-assess-btn" @click="go_to_market('five_star_goods_assess')">去五星好评</div>
      <div class="complaints-btn" @click="complaints">不 我要吐槽</div>
      <div class="wait-btn" @click="createStatisticsEvent('wait')">下次再说</div>
      <div v-if="isShowGoodAssessPopUp" class="good-assess-popup"></div>
    </el-dialog>
    <!-- 三个月免费或者付费用户弹窗 -->
    <el-dialog v-else-if="goods_assess_notify.show_type === 'old'"
               title=""
               :visible.sync="goods_assess_notify.is_show"
               width="392px"
               top="8%"
               :show-close="false"
               :modal="true"
               :close-on-click-modal="false"
               custom-class="good-assess-box">
      <div class="inside">
        <div class="third-text">hello，最近用虎虎还顺手吗～可以给“虎虎搬家”<a class="five-star-assess"
                                                            @mouseenter="isShowGoodAssessPopUp=true"
                                                            @mouseleave="isShowGoodAssessPopUp=false">5星好评</a>吗？
        </div>
        <div class="four-text">仅需30秒，您忍心拒绝吗？</div>
      </div>
      <div class="goods-assess-btn is-short" @click="go_to_market('goods_assess')">去五星好评</div>
      <div class="complaints-btn is-btn" @click="complaints">不 我要吐槽</div>
      <div v-if="isShowGoodAssessPopUp" class="good-assess-popup"></div>
      <div class="big-cancel" @click="cancel">
        <hh-icon type="iconquxiao1" style="font-size:50px; "/>
      </div>
    </el-dialog>
    <!-- 客服微信弹窗 -->
    <el-dialog v-if="isShowCustomerDialog"
               title=""
               :visible.sync="isShowCustomerDialog"
               width="240px"
               top="8%"
               :show-close="false"
               :close-on-click-modal="false"
               custom-class="customer-dialog-box">
      <div class="customer-qrcode"></div>
      <div class="customer-text1">微信扫码联系客服</div>
      <div class="customer-text2">“槽点”我们尽快改进！</div>
      <div class="customer-btn" @click="isShowCustomerDialog=false">已联系客服</div>
      <div class="customer-inside"></div>
      <div class="cancel-btn" @click="isShowCustomerDialog=false">
        <hh-icon type="iconquxiaoxiao" style="font-size:20px; "/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import apis from '@/api/apis.js'

export default {
  name: 'GoodAssessDialog',
  data () {
    return {
      fiveStarAssessUrl: 'https://fuwu.jinritemai.com/evaluation/',
      isShowGoodAssessPopUp: false,
      isShowCustomerDialog: false,
      goods_assess_notify: {
        is_show: false,
        show_type: 'new',
        dy_order_id: ''
      }
    }
  },
  watch: {
    subsc (val) {
      this.goods_assess_notify = val.goods_assess_notify
      this.fiveStarAssessUrl += this.goods_assess_notify.dy_order_id
    }
  },
  computed: {
    ...mapGetters({
      subsc: 'getCurrentSubsc',
      projectConfig: 'getProjectConfig'
    })
  },
  methods: {
    /**
     * 去服务市场评价
     */
    go_to_market (action) {
      this.createStatisticsEvent(action)
      window.open(this.fiveStarAssessUrl)
    },
    /**
     * 创建统计事件
     * @param action
     */
    createStatisticsEvent (action) {
      this.goods_assess_notify.is_show = false
      apis.hhgjAPIs.createStatisticsEvent({
        'event_type': 'good_assess_dialog_' + this.goods_assess_notify.dy_order_id,
        'action': action
      }).then(data => {
        this.goods_assess_notify.is_show = false
      }).catch(err => {
        console.log(err)
        this.goods_assess_notify.is_show = false
      })
    },
    /**
     * 去吐槽
     */
    complaints () {
      // this.isShowCustomerDialog = true
      window.open('https://www.wjx.cn/m/99756598.aspx')
      this.createStatisticsEvent('complaints')
    },
    /**
     * 取消评价
     */
    cancel () {
      this.goods_assess_notify.is_show = false
      this.createStatisticsEvent('wait')
    }
  }
}
</script>

<style lang="less">
.goods-assess-dialog {
  .good-assess-box {
    background-image: url('../assets/images/components/assess_dialog/bg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: rgba(255, 255, 255, 0);
    box-shadow: 0 0 black;
  }
  .el-dialog__wrapper {
    background-color: rgba(0,0,0,0.4);
  }
}

</style>

<style lang="less" scoped>
.inside {
  height: 248px;

  .five-star-assess {
    cursor: pointer;
    color: #1C9BEB;
    text-decoration: none;
  }
}

.big-cancel {
  position: absolute;
  display: inline-block;
  width: 100%;
  top: 362px;
  left: 0px;
  cursor: pointer;
  .icon-big-cancel {
    width: 50px;
    height: 50px;
  }
}

.cancel-btn {
  position: absolute;
  display: inline-block;
  left: 214.4px;
  top: 14.1px;
  cursor: pointer;
}

.customer-inside {
  height: 264px;
}

.customer-btn {
  background: #1D8FFF;
  border-radius: 4px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 288px;
  left: 40px;
  width: 160px;
  height: 40px;
  color: white;
  font-size: 17px;
  cursor: pointer;
}

.customer-text1 {
  position: absolute;
  top: 218px;
  left: 64px;
}

.customer-text2 {
  position: absolute;
  top: 243px;
  left: 43px;
}

.customer-qrcode {
  background-image: url('../assets/images/components/assess_dialog/customer_qrcode.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 188px;
  height: 188px;
  display: inline-block;
  position: absolute;
  top: 21px;
  left: 26px;
}

.goods-assess-btn {
  position: absolute;
  display: inline-block;
  width: 207px;
  height: 45px;
  top: 273px;
  left: 94px;
  background-image: url('../assets/images/components/assess_dialog/long-orange-btn.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;

  font-size: 18px;
  color: #FFFFFF;
  line-height: 40px;
  font-weight: 900;
}

.is-short {
  background-image: url('../assets/images/components/assess_dialog/orange-btn.png');
  width: 140px;
  left: 198px;
  font-size: 18px;
}

.first-text {
  width: 313px;
  height: 42px;
  display: inline-block;
  text-align: left;
  position: absolute;
  top: 177px;
  left: 43px;
}

.second-text {
  width: 308px;
  height: 21px;
  display: inline-block;
  text-align: left;
  position: absolute;
  top: 229px;
  left: 43px;
}

.third-text {
  width: 313px;
  height: 42px;
  display: inline-block;
  text-align: left;
  position: absolute;
  top: 177px;
  left: 43px;
}

.four-text {
  width: 308px;
  height: 21px;
  display: inline-block;
  text-align: left;
  position: absolute;
  top: 229px;
  left: 43px;
}

.seven-text {
  color: #FF5600;
}

.complaints-btn {
  position: absolute;
  display: inline-block;
  width: 85px;
  height: 22px;
  left: 62px;
  top: 352px;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  color: #F2F2F2;
  font-size: 16px;
}

.is-btn {
  background-image: url('../assets/images/components/assess_dialog/grey-btn.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;

  width: 140px;
  height: 45px;
  left: 34px;
  top: 273px;
  font-size: 18px;

  display: inline-flex;
  color: #FFFFFF;
  justify-content: center;
  align-items: center;
}

.good-assess-popup {
  position: absolute;
  width: 159px;
  height: 153px;
  left: -139px;
  top: 163px;
  background-image: url('../assets/images/components/assess_dialog/good-assess.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.wait-btn {
  position: absolute;
  display: inline-block;
  width: 85px;
  height: 22px;
  right: 62px;
  top: 352px;
  background-color: rgba(255, 255, 255, 0);
  cursor: pointer;
  color: #F2F2F2;
  font-size: 16px;
}

</style>
