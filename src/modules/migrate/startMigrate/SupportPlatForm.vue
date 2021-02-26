<!-- 支持平台列表 -->
<template>
    <div class="support">
        <div class="color-767989 font-12 mb-10 bold">支持平台:</div>
        <div class="flex color-666 PlatformIcon">
            <div @mouseenter="setActive(item.key)" @mouseleave="moveActive" v-for="item in list" :key="item.key">
                <img :class="[platformIconActive==item.key ? 'active' :'']" :src="item.src"   @click="open(item.key)">
                <p :class="platformIconActive == item.key ? 'color-4e4e4e font-12 bold':'font-12'">{{item.tip}}</p>
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
      platformIconActive: ''
    }
  },
  methods: {
    setActive (val) {
      this.platformIconActive = val
    },
    moveActive (val) {
      this.platformIconActive = ''
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
