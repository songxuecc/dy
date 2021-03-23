<!-- 支持平台列表 -->
<template>
    <div class="support">
        <div class="color-767989 font-12 mb-10 bold">支持平台:</div>
        <div class="flex color-666 PlatformIcon wrap">
            <div @mouseenter="setActive(item.key)" @mouseleave="moveActive" v-for="item in list" :key="item.key" class="mb-5">
                <img :class="[platformIconActive==item.key ? 'active' :'', 'pointer']" :src="item.src"   @click="open(item.key)">
                <p :class="platformIconActive == item.key ? 'color-4e4e4e font-12 bold':'font-12'">{{item.tip}}</p>
            </div>
            <div class="newcomer " v-if="visibleNewcomerBtn">
              <img class="newcomer-btn pointer" src="@/assets/images/newguy_banner.gif" @click="goTutorials"/>
              <div @click.stop="close" class="close pointer flex align-c justify-c" ><i class="el-icon-close " ></i></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'SupportPlatForm',
  props: {
    list: Array
  },
  data () {
    return {
      platformIconActive: '',
      visibleNewcomerBtn: false
    }
  },
  created () {
    const visibleNewcomerBtn = !localStorage.getItem('newcomer-btn')
    this.visibleNewcomerBtn = visibleNewcomerBtn
  },
  methods: {
    setActive (val) {
      this.platformIconActive = val
    },
    moveActive (val) {
      this.platformIconActive = ''
    },
    open (name) {
      const list = {
        '淘宝': 'https://www.taobao.com/',
        '天猫': 'https://www.tmall.com/',
        '1688': 'https://www.1688.com/',
        '京东': 'https://www.jd.com/',
        '苏宁易购': 'https://www.suning.com/',
        '唯品会': 'https://www.vip.com/',
        '网易考拉': 'https://www.kaola.com/',
        '17网': 'https://gz.17zwd.com/',
        '抖音': 'https://www.yuque.com/huxiao-rkndm/ksui6u/muvtyt',
        '拼多多': 'https://www.yuque.com/huxiao-rkndm/ksui6u/yd9cd1',
        '禅妈妈': 'https://www.chanmama.com/',
        '搜款网': 'https://www.vvic.com/gz',
        '淘宝特价': 'https://www.yuque.com/huxiao-rkndm/ksui6u/gb8emy'
      }
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '搬家上货', '开始复制', name])
      }
      window.open(list[name])
    },
    goTutorials () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', '搬家上货', '搬家教程', name])
      }
      window.open('https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l')
    },
    close () {
      localStorage.setItem('newcomer-btn', 1)
      this.visibleNewcomerBtn = false
    }
  }
}
</script>
<style lang="less" scoped>
.PlatformIcon {
    div {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 20px;
        transition:all 0.3s;
    }
    img {
        width: 40px;
        height: 40px;
        margin-bottom: 5px;
        transition: all 0.3s;
    }
    .active {
        border-radius:14px;
        animation: opacity 0.5s;
    }
    .newcomer {
      position: relative;
      .close {
        width: 25px;
        height: 25px;
        position: absolute;
        margin-right: 0;
        right: -10px;
        top: -10px;
        border-radius: 50%;
      }
      .newcomer-btn {
        width: 161.89px;
        height: 58px;
        margin-left: 20px;
        cursor: pointer;
      }
      .el-icon-close {
        color:#ffffff;
        width: 16px;
        height: 16px;
        font-size: 10px;
        font-weight: bolder;
        text-align: center;
        line-height: 16px;
        background:#b8b7b7;
        border-radius: 50%;
        overflow: hidden;
      }
    }

}
@keyframes opacity {
    0% {
    opacity: 1;
    }
    15% {
    opacity: 0.35;
    }

    30% {
    opacity: 0.5;
    }

    75% {
    opacity: 0.85;
    }
    100% {
    opacity: 1;
    }
}
</style>
