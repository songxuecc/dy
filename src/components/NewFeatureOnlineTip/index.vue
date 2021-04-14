<!-- 新功能上线提醒 -->
<template>
    <div class="NewFeatureOnlineTip" v-bind="$attrs" :style="{display:display}">
        <span @click="handleClose" class="close"></span>
        <p class="bold font-16 color-fff left">{{msg}}</p>
        <span class="btn" @click="handleClick">立即设置</span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewFeatureOnlineTip',
  props: {
    msg: String,
    type: String
  },
  data () {
    return {
      display: 'none'
    }
  },
  beforeMount () {
    if (!this.getCurrentSubsc) {
      return false
    }
    if (!this.getCurrentSubsc.is_newcomer) return false
    const newFeatureOnlineTip = localStorage.getItem('newFeatureOnlineTip')
    const Obj = JSON.parse(newFeatureOnlineTip)
    if (Obj) {
      const display = Obj[this.type]
      this.display = !display ? 'block' : 'none'
      this.newFeatureOnlineTipData = Obj
    } else {
      this.newFeatureOnlineTipData = {}
      this.display = 'block'
    }
  },
  computed: {
    ...mapGetters(['getCurrentSubsc'])
  },
  methods: {
    setLocalStorage () {
      const newFeatureOnlineTip = localStorage.getItem('newFeatureOnlineTip')
      const newFeatureOnlineTipData = JSON.parse(newFeatureOnlineTip) || {}
      newFeatureOnlineTipData[this.type] = true
      localStorage.setItem('newFeatureOnlineTip', JSON.stringify(newFeatureOnlineTipData))
    },
    handleClick () {
      this.setLocalStorage()
      this.display = 'none'
      this.$emit('click', this.type)
    },
    handleClose () {
      this.setLocalStorage()
      this.display = 'none'
      this.$emit('close', this.type)
    }
  }
}
</script>
<style lang="less" scoped>
  .NewFeatureOnlineTip {
      transition:all 0.3s;
      width:263px;
      height: 82px;
      background-image: url("./settingTip.png");
      background-size: cover;
      padding: 20px 25px;
      box-sizing: border-box;
      word-break: break-all;
      .btn {
        position:absolute;
        right: 20px;
        bottom: 10px;
        background-image: linear-gradient(164deg, #FF9527 0%, #EB2202 100%);
        border-radius: 16px;
        font-size: 10px;
        color: #FFFFFF;
        display: inline-block;
        line-height: 16px;
        text-align: center;
        height: 16px;
        padding: 2px 8px;
        font-weight: bold;
      }
      .close {
        position:absolute;
        right:10px;
        top:10px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }
  }
</style>
