<!-- 组合商品 -->
<template>
  <div class='combination left'>
    <el-tabs v-model="activeTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane :label="tab.label" v-for="(tab) in tabs" :key="tab.label"></el-tab-pane>
    </el-tabs>

    <el-form ref="template" :rules="rules" size="mini" :model="$data" label-width="100px" class="form" :style="{'padding-bottom': mBottom}">
      <!-- 基础信息 -->
      <BasicInfo class="content combination-basicInfo" />

      <!-- 规格 -->
      <TableSepcify class="content combination-specify "/>

      <!-- 类目价格 -->
      <Price class="content combination-price "/>

      <!-- 支付设置 -->
      <PaySet class="content combination-paySet" />

      <!-- 服务与资质 -->
      <Service class="content combination-service" />

    </el-form>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TableSepcify from './components/TableSepcify'
import Price from './components/Price'
import PaySet from './components/PaySet'
import Service from './components/Service'
import BasicInfo from './components/BasicInfo'

export default {
  data () {
    return {
      activeTab: '',
      tabs: [
        { label: '基础信息', className: '.combination-basicInfo' },
        { label: '规格', className: '.combination-specify' },
        { label: '类目价格', className: '.combination-price' },
        { label: '支付设置', className: '.combination-paySet' },
        { label: '服务与资质', className: '.combination-service' }
      ]

    }
  },
  computed: {},
  watch: {},
  created () {

  },
  mounted () {
    this.setScrollTop()
    this.bindScroll()
  },
  beforeMount () {
    this.unBindScroll()
  },
  activated () {
    this.bindScroll()
    this.activeTab = '0'
  },
  deactivated () {
    this.unBindScroll()
  },
  components: {
    TableSepcify,
    Price,
    PaySet,
    Service,
    BasicInfo
  },
  methods: {
    setScrollTop: debounce(function () {
      this.$nextTick(() => {
        const tab = this.tabs
        let maxPaddingBottom = 0
        const height =
      document.documentElement.offsetHeight || document.body.offSetHeight
        let previous = 0
        let current = previous
        const nextTab = tab.map((item, index) => {
          const className = item.className
          const el = document.querySelector(className)
          const rect = el.getBoundingClientRect()
          const top = rect.top
          const elHeight = rect.height
          const dist = 120
          if (tab.length - 1 === index) {
            maxPaddingBottom = height - elHeight - dist
          }
          const result = {
            ...item,
            scrollTop: previous + current,
            top
          }
          previous = previous + current
          current = elHeight
          console.log(previous, elHeight, 'previous')
          return result
        })
        this.tabs = nextTab

        this.mBottom = `${maxPaddingBottom}px`
      })
    }, 300),
    bindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl.addEventListener('scroll', this.scroll)
    },
    unBindScroll () {
      const scrollEl = document.querySelector('.page-component__scroll')
      scrollEl && scrollEl.removeEventListener('scroll', this.scroll)
    },
    scroll: debounce(function (e) {
      const scrollTop = e.target.scrollTop
      let active = 0
      const dist = 10
      this.tabs.forEach((item, index) => {
        if ((scrollTop + dist) >= item.scrollTop) {
          active = index
        }
      })
      this.changeActive(active)
    }, 300),
    changeActive: function (active) {
      this.activeTab = active.toString()
    },
    handleClick (index) {
      const n = this.activeTab
      const tabsHeight = 0
      const scrollTop = this.tabs[n].scrollTop + tabsHeight
      this.$nextTick(() => {
        const elScroll = document.querySelector('.page-component__scroll')
        elScroll.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: 'smooth'
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
    @import '~./index.less';
</style>
