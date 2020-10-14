<template lang="html">
  <div class="help-tips" @click="goHelpLink" :style="{top: positionT + 'px', right: positionR + 'px'}">
    <span><i class="el-icon-s-opportunity"></i>{{showWords}}</span>
  </div>
</template>
<script>
import common from '@/common/common.js'
export default {
  props: {
    helpLink: String,
    words: String,
    positionT: Number,
    positionR: Number
  },
  data () {
    return {
    }
  },
  computed: {
    showWords () {
      if (this.words && this.words !== '') {
        return this.words
      }
      return '不会用？点我查看教程'
    }
  },
  methods: {
    goHelpLink () {
      if (window._hmt) {
        window._hmt.push(['_trackEvent', this.helpLink, '点击', `${this.helpLink}语雀帮助中心`])
      }
      window.open(common.HELP_TIPS_LINK[this.helpLink])
    }
  }
}
</script>

<style lang="less" scoped>
.help-tips {
  position: absolute;
  z-index: 9;
  font-size: 12px;
  color: #409EFF;
  cursor: pointer;
  i {
    font-size: 13px;
    color: #efb947;
    padding-right: 2px;
  }
}
</style>
