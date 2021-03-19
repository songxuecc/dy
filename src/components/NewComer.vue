<!-- newComer 新手指引 -->
<template>
    <div v-if="status"  :class="['newComer',className,`newComer-${direction}`]" :style="{left: `calc(50% - ${left}px)`,...style}">
        <slot></slot>
        <span :class="['triangle',`triangle-${direction}`]" :style="{left: `calc(50% + ${left}px)`}"></span>
        <span :class="['triangle-white',`triangle-white-${direction}`]"  :style="{left: `calc(50% + ${left}px)`}"></span>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'NewComer',
  props: {
    // 类型
    type: String,
    // 偏移量
    left: Number,
    // 方向
    direction: {
      type: 'top' | 'bottom',
      default: 'top'
    },
    className: String,
    style: Object
  },
  data () {
    return {
      visible: true
    }
  },
  mounted () {
    const newComer = this.$el.parentNode
    newComer.style.position = 'relative'
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
    },
    status () {
      return this.show && this.visible
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
    border-radius: 3px;
    padding: 10px 14px 8px;
    z-index: 2;
}

.triangle{
    position: absolute;
    content:"";
    width: 0;
    height: 0;
    left: 50%;
    transform: translateX(-50%);
    border: 9px solid transparent;
}

.triangle-white{
    position: absolute;
    content:"";
    width: 0;
    height: 0;
    left: 50%;
    transform: translateX(-50%);
    border: 9px solid transparent;
}

.newComer-top {
  top: -8px;
  transform: translate(-50%, -100%);
  border-bottom: 3px solid #1D8FFF;
}
.triangle-top {
  bottom: -17px;
  border-top: 6px solid #1D8FFF;
}
.triangle-white-top {
  bottom: -14px;
  border-top: 6px solid #ffffff;
}

  .newComer-bottom {
      bottom: -8px;
      transform: translate(-50%, 100%);
      border-top: 3px solid #1D8FFF;
  }
  .triangle-bottom {
      top: -17px;
      border-bottom: 6px solid #1D8FFF;
  }

  .triangle-white-bottom {
      top: -14px;
      border-bottom: 6px solid #ffffff;
  }
</style>
