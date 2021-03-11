<!-- newComer 新手指引 -->
<template>
    <div v-if="show && visible"  class="newComer" @click="close" >
        <slot></slot>
        <span class="triangle"></span>
        <span class="triangle-white"></span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewComer',
  props: {
    type: String
  },
  data () {
    return {
      visible: true
    }
  },
  mounted () {
    const newComer = this.$el.parentNode
    newComer.style.position = 'relative'
    newComer.style.overflow = 'inherit'
  },
  computed: {
    ...mapGetters(['getCurrentSubsc']),
    show () {
      // 是否需要展示
      if (!this.getCurrentSubsc) {
        return false
      }
      const isNewTips = JSON.parse(localStorage.getItem('is_new_tips') || '{}') || {}
      return (this.getCurrentSubsc.is_newcomer && !isNewTips[this.type])
    }
  },
  methods: {
    close () {
      const isNewTips = JSON.parse(localStorage.getItem('is_new_tips') || '{}') || {}
      isNewTips[this.type] = true
      localStorage.setItem('is_new_tips', JSON.stringify(isNewTips))
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
.newComer {
    position: absolute;
    background: #FFFFFF;
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
    left: 50%;
    top: -8px;
    transform: translate(-50%, -100%);
    border-bottom: 3px solid #1D8FFF;
    border-radius: 3px;
    padding: 10px 14px 8px;
    z-index: 1;
}

.triangle{
    position: absolute;
    content:"";
    width: 0;
    height: 0;
    left: 50%;
    bottom: -17px;
    transform: translateX(-50%);
    border: 9px solid transparent;
    border-top: 6px solid #1D8FFF;
}

.triangle-white{
    position: absolute;
    content:"";
    width: 0;
    height: 0;
    left: 50%;
    bottom: -14px;
    transform: translateX(-50%);
    border: 9px solid transparent;
    border-top: 6px solid #ffffff;
}

</style>
