<!-- 续订 -->
<template>
    <div class="Renew" v-if="subsc && subsc.item_name" :class="[subsc.item_name === '高级版' ? 'gaoji':'shiyong']" >
        <div class="left">
          <div class="name bold" style="margin-top:3px;color:#fff">{{subsc.item_name}}</div>
          <div class="daoqi"> {{subsc.deadline.substring(0,10) || '-'}}到期 还剩  {{leftDays || '-'}}天</div>
          <div v-for="order in subsc.order_list" :key="order.order_id" v-if="subsc.order_list.length" class="banben" >
            {{order.start_time}}~{{order.end_time}}&nbsp;&nbsp;{{order.sku_spec || '-'}}
          </div>
      </div>
      <div class="btn">
        <div @click="goToOrder">点击续订</div>
      </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import seniorVersion from '../images/seniorVersion.png'
export default {
  name: 'Renew',
  props: {
    msg: String
  },
  data () {
    return {
      seniorVersion
    }
  },
  computed: {
    ...mapGetters({
      name: 'getName',
      shopName: 'getShopName',
      isAuth: 'getIsAuth',
      subsc: 'getCurrentSubsc',
      syncStatus: 'getSyncStatus'
    }),
    leftDays () {
      console.log(this.subsc, 'this.subsc')
      if (this.subsc.total_left_days === '') {
        return '-'
      }
      return this.subsc.total_left_days
    },
    subscName () {
      if (this.subsc.item_name === '') {
        return '-'
      }
      return this.subsc.item_name.split(' ')[0]
    }
  },
  methods: {
    goToOrder () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '首页', '点击', '续费点击'])
      }
      window.location.href =
        'https://fuwu.jinritemai.com/detail?from=tab&service_id=42'
    }
  }
}
</script>
<style lang="less" scoped>
.Renew {
    background-size: 100% 100%;
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    height: 90px;
    cursor: pointer;
    display: flex;
}

.gaoji {
    background-image: url('../images/seniorVersion.png');
    .daoqi {
      height: 19px;
      font-size: 14px;
      font-family: MicrosoftYaqiHei;
      font-weight: bold;
      color: #E29E35;
      line-height: 19px;
      padding-top: 10px;
    }
    .banben {
      height: 30px;
      font-size: 11px;
      font-family: MicrosoftYaqiHei;
      color: #E29E35;
      line-height: 15px;
    }

}

.shiyong {
    background-image: url('../images/tryVersion.png');
    .daoqi {
      height: 19px;
      font-size: 14px;
      font-family: MicrosoftYaqiHei;
      font-weight: bold;
      color: #636DBA;
      line-height: 19px;
      padding-top: 10px;
    }
    .banben {
      height: 30px;
      font-size: 11px;
      font-family: MicrosoftYaqiHei;
      color: #636DBA;
      line-height: 15px;
    }

}

.left {
  flex:1;
  padding-left: 90px;
}
@keyframes breath {
  from { opacity: 1; transform: scale(1);  }                          /* 动画开始时 */
  50%  { opacity: 1; transform: scale(1.05); }      /* 动画50% 时 */
  to   { opacity: 1; transform: scale(1); }                          /* 动画结束时 */
}
 .btn {
    width: 64px;
    font-size: 20px;
    font-family: MicrosoftYaqiHei;
    font-weight: normal;
    color: #FFFFFF;
    line-height: 23px;
    letter-spacing: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-left: 4px;
    box-sizing: border-box;
    div {
      width: 46px;
      font-weight: bold;
      &:hover {
        animation: breath 0.95s infinite linear;

      }
    }
  }

  @media screen and (min-width:1680px) and (max-width:1920px){
  .gaoji {
    background-image: url('../images/seniorVersion-1680.png');
  }
  .shiyong {
    background-image: url('../images/tryVersion-1680.png');
  }

  .btn {
    width: 74px;
    div {
    width: 46px;
    }
  }
}
</style>
