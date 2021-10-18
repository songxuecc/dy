<!-- 组合商品 -->
<template>
  <div class='combination left relative'>
    <el-tabs v-model="activeTab" @tab-click="handleClick" class="tabs">
      <el-tab-pane :label="tab.label" v-for="(tab) in tabs" :key="tab.label"></el-tab-pane>
    </el-tabs>

    <div  class="form" :style="{'padding-bottom': mBottom}">
      <!-- 基础信息 -->
      <BasicInfo class="content combination-basicInfo" ref="BasicInfo"/>

      <!-- 规格 -->
      <TableSepcify class="content combination-specify " @refresh="refresh" ref="TableSepcify"/>

      <!-- 类目价格 -->
      <Price class="content combination-price " ref="Price"/>

      <!-- 支付设置 -->
      <PaySet class="content combination-paySet" ref="PaySet"/>

      <!-- 服务与资质 -->
      <ServiceComponent class="content combination-service" ref="Service"/>

      <div class="flex justify-c align-c btn" ref="btn">
        <el-button type="primary" plain style="width:120px"  @click="handleCancle(0)" :loading="loading" :disabled="loading">保存草稿箱</el-button>
        <el-button type="primary" style="width:120px"  @click="handleClose(1)" :loading="loading" :disabled="loading">发布商品</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import TableSepcify from './components/TableSepcify'
import Price from './components/Price'
import PaySet from './components/PaySet'
import ServiceComponent from './components/Service'
import BasicInfo from './components/BasicInfo'
import servises from '@servises'
import moment from 'moment'

export default {
  data () {
    return {
      activeTab: '',
      loading: false,
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
    const pre = moment(localStorage.getItem('combination-syncProductsTime') || new Date())
    const current = moment(new Date())
    const diff = current.diff(pre, 'hours')

    // if (diff > 24) {
    if (!diff) {
      const h = this.$createElement
      this.$confirm('', {
        message: h('div', null, [
          h('div', {
            class: 'center'
          }, [
            h('hh-icon', {
              props: {
                type: 'iconjinggao1'
              },
              class: 'TableSepcify-icon'
            })
          ]),
          h('div', {
            class: 'TableSepcify-text'
          }, '在使用该功能前请先同步后台商品（将抖店后台商品信息更新至软件内），若已同步可忽视本提醒。'),
          h('div', {
            class: 'TableSepcify-text'
          }, '在使用该功能前请先同步后台商品（将抖店后台商品信息更新至软件内），若已同步可忽视本提醒。')
        ]),
        type: 'warning',
        customClass: 'TableSepcify-customClass',
        cancelButtonClass: 'TableSepcify-cancelButtonClass',
        confirmButtonClass: 'TableSepcify-confirmButtonClass',
        showClose: false
      })
        .then(_ => {
        })
        .catch(_ => {
          return false
        })
    }
    console.log(diff)
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
    ServiceComponent,
    BasicInfo
  },
  methods: {
    refresh () {
      this.setScrollTop()
    },
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
          const marginBottom = index ? 16 : 0
          const dist = 120
          if (tab.length - 1 === index) {
            maxPaddingBottom = height - elHeight - dist
          }
          const result = {
            ...item,
            scrollTop: previous + current + marginBottom,
            top
          }
          previous = previous + current + marginBottom
          current = elHeight
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
      this.unBindScroll()
      const n = this.activeTab
      const tabsHeight = 0
      const marginBottom = 0
      const scrollTop = this.tabs[n].scrollTop + tabsHeight + marginBottom * n
      this.$nextTick(() => {
        const elScroll = document.querySelector('.page-component__scroll')
        elScroll.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: 'smooth'
        })
      })
    },
    async handleClose (commitType) {
      const basicInfoPromise = this.$refs.BasicInfo.getForm()
      const pricePromise = this.$refs.Price.getForm()
      const paySetPromise = this.$refs.PaySet.getForm()
      const servicePromise = this.$refs.Service.getForm()
      const TableSepcifyPromise = this.$refs.TableSepcify.getForm()
      this.loading = true
      console.log(this.loading, 'this.loading = true')
      Promise.all([ basicInfoPromise, pricePromise, paySetPromise, servicePromise, TableSepcifyPromise ])
        .then(([basicInfoData, priceData, paySetData, serviceData, TableSepcifyData]) => {
          const parmas = {
            ...basicInfoData,
            ...priceData,
            ...paySetData,
            ...serviceData,
            ...TableSepcifyData,
            commit: commitType
          }
          servises.thirdpartDyGoodsBundleCreate(parmas).then(data => {
            this.loading = false
            this.$confirm('创建成功，是否去抖店后台查看?', '', {
              showClose: false,
              confirmButtonText: '确认，去抖店',
              cancelButtonText: '不，留在虎虎',
              type: 'warning',
              cancelButtonClass: 'combination-cancelButtonClass',
              confirmButtonClass: 'combination-confirmButtonClass',
              customClass: 'combination-customClass'
            }).then(() => {
              console.log(data, 'data')
              const productId = data.product_id
              window.open(`https://fxg.jinritemai.com/ffa/g/create?product_id=${productId}`)
            }).catch(() => {
            })
          })
            .catch(err => {
              this.$message.error(`${err}`)
              this.loading = false
            }).finally(() => {

            })
        }).catch((err) => {
          console.log(err)
          this.loading = false
          let isError = document.getElementsByClassName('is-error')
          this.$message.error('请按提示修改错误')
          if (isError && isError[0]) {
            this.$nextTick(() => {
              isError[0].scrollIntoView({
                // 滚动到指定节点
                // 值有start,center,end，nearest，当前显示在视图区域中间
                block: 'center',
                // 值有auto、instant,smooth，缓动动画（当前是慢速的）
                behavior: 'smooth'
              })
            })
          }
        })
    }
  }
}
</script>

<style lang='less' scoped>
    @import '~./index.less';
</style>

<style lang="less">
.combination-cancelButtonClass{
    padding: 10px;
    font-size: 12px;
    margin-right: 10px;
    width: 100px;

}

.combination-confirmButtonClass{
    padding: 10px;
    font-size: 12px;
    width: 100px;
}

.combination-customClass {
  padding-bottom: 25px;
  .el-message-box__btns {
    text-align: center;
  }
  .el-message-box__content {
    .el-message-box__message {
      padding-left: 0;
    }
    p {
      font-size: 18px;
      margin: 15px 0 10px;
      text-align: center;
    }
    .el-icon-warning {
      display: none;
    }
  }
}

</style>

<style lang="less">
.TableSepcify-cancelButtonClass{
  font-size: 12px;
  margin-right: 10px;
  width: 120px;
  padding: 12px;
  border-color: #1D8FFF;
  color: #1D8FFF;
  font-size: 14px;
}

.TableSepcify-confirmButtonClass{
  font-size: 12px;
  width: 140px;
  padding: 12px;
  font-size: 14px;
  background: #1D8FFF;
}

.TableSepcify-icon {
  width: 50px;
  height: 50px;
  font-size: 50px;
}

.TableSepcify-text {
  width: 364px;
  height: 20px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #4E4E4E;
  line-height: 20px;
  text-align: center;
  margin-top: 16px;
  margin-bottom: 20px;
}

.TableSepcify-customClass {
    padding-bottom: 20px;
    .el-message-box__header {
      padding-top: 0;
    }
    .el-message-box__btns {
      text-align: center;
    }
    .el-message-box__content {
      .el-message-box__message {
        padding-left: 0;
      }
      p {
        font-size: 18px;
        margin: 15px 0 10px;
        text-align: center;
      }
      .el-icon-warning {
        display: none;
      }
    }
}
</style>
