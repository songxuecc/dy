// 同步后台 页面进入检测 需求文档 https://meideng.yuque.com/huhuguanjia/fe92x6/hgovqe#WXY0a
import { mapActions } from 'vuex'
import moment from 'moment'
import './index.less'

const mixins = (type) => ({
  data: {
    hide: false
  },
  created: function () {
    this.checkSyncProducts()
  },
  activated: function () {
    this.checkSyncProducts()
  },
  methods: {
    ...mapActions(['handleSyncProducts']),
    clickHandler (v) {
      this.hide = v
    },
    checkSyncProducts () {
      const syncProducts = JSON.parse(localStorage.getItem('syncProducts')) || {}
      const syncProductsType = syncProducts[type] || {}
      const pre = moment(syncProductsType.showTime)
      this.hide = syncProductsType.hide || false
      const current = moment(new Date())
      const diff = syncProductsType.showTime ? current.diff(pre, 'hours') > 24 : true
      // const diff = syncProductsType.showTime ? current.diff(pre, 'seconds') > 30 : true // 测试
      if (!this.hide && diff) {
        const h = this.$createElement
        this.$confirm('', {
          message: h('div', null, [
            h('div', {
              class: 'checkSyncProducts-header'
            }, '同步后台商品提醒'),
            h('div', {
              class: 'checkSyncProducts-text left'
            }, '在使用该功能前请先同步后台商品（将抖店后台商品信息更新至软件内），若已同步可忽视本提醒。'),
            h('el-checkbox', {
              key: new Date(),
              class: 'checkSyncProducts-checkbox left',
              on: {
                change: this.clickHandler
              },
              directives: [
                {
                  name: 'v-model',
                  value: this.hide
                }
              ]
            }, '不再提醒我')
          ]),
          type: 'warning',
          customClass: 'checkSyncProducts-customClass',
          cancelButtonClass: 'checkSyncProducts-cancelButtonClass',
          confirmButtonClass: 'checkSyncProducts-confirmButtonClass',
          cancelButtonText: '先不同步',
          confirmButtonText: '开始同步',
          showClose: true,
          closeOnClickModal: false
        })
          .then(_ => {
            this.handleSyncProducts()
            const showTime = new Date()
            syncProducts[type] = {
              showTime,
              hide: this.hide
            }
            localStorage.setItem('syncProducts', JSON.stringify(syncProducts))
          })
          .catch(_ => {
            const showTime = new Date()
            syncProducts[type] = {
              showTime,
              hide: this.hide
            }
            localStorage.setItem('syncProducts', JSON.stringify(syncProducts))
            this.hide = false
          })
      }
    }
  }
})

export default mixins
