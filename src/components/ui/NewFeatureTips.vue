<!-- 新功能提示 -->
<template>
    <hh-icon type="icon60" class="left-translate" v-if="visible && type && isAuth()">
        <span class="font-12 new-features">新功能</span>
    </hh-icon>
</template>

<script>
import moment from 'moment'
import {mapGetters} from 'vuex'

class GetNewFeature {
  constructor () {
    this.instance = null
    this.hasMounted = true
    this.delay = {
      time: 2,
      unit: 'days'
    }
  }
  static getInstance () {
    this.instance = this.instance || new GetNewFeature()
    return this.instance
  }

  init (type) {
    if (this.hasMounted) {
      this.hasMounted = false
      const newFeature = localStorage.getItem('newFeature')
      if (!newFeature) {
        let newFeatureMap = new Map()
        localStorage.setItem('newFeature', JSON.stringify(newFeatureMap))
      }
    }
  }
  getVisible (type) {
    const newFeature = localStorage.getItem('newFeature')
    let newFeatureMap = new Map(JSON.parse(newFeature))
    const value = newFeatureMap.get(type)
    let visible = false
    if (value && value.expiredTime) {
      const expiredTime = moment(value.expiredTime)
      const now = moment()
      const diff = now.diff(expiredTime, this.delay.unit, true)
      if (diff > this.delay.time) {
        visible = false
      } else {
        visible = true
      }
    } else {
      const expiredTime = {expiredTime: moment()}
      newFeatureMap.set(type, expiredTime)
      localStorage.setItem('newFeature', JSON.stringify(newFeatureMap))
      visible = true
    }
    return visible
  }
}
export default {
  name: 'NewFeatureTips',
  props: {
    type: String
  },
  data () {
    return {
      visible: false
    }
  },
  created () {
    this.newFeature = GetNewFeature.getInstance()
    this.newFeature.init(this.type)
  },
  beforeMount () {
    this.visible = this.newFeature.getVisible(this.type)
  },
  beforeDestroy () {
    this.newFeature = null
  },
  methods: {
    ...mapGetters({
      isAuth: 'getIsAuth'
    })
  }
}
</script>
<style lang="less" scoped>
.left-translate {
    display: inline-flex;
    align-items: center;
    margin-left:-2px;
    color:#ffffff;
    font-size:16px;
    padding:0 2px !important;
    line-height:14px;
    border-radius:2px;
    animation: slideLeft 1s infinite linear;
    @keyframes slideLeft {
    0% {
        transform: translate(0px);
    }

    25% {
        transform: translate(1px);
    }

    50% {
        transform: translate(3px);
    }

    75% {
        transform: translate(1px);
    }

    100% {
        transform: translate(0);
    }
    }
}

.new-features {
    padding:0 !important;
    font-size:12px;
    color:#d81e06;
    transform:scale(0.8);
    display:inline-block;
    margin-left: -3px;
    padding-top: 2px !important;
}

</style>
