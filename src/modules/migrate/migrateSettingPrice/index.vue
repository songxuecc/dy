<!-- 我的页面 -->
<template>
  <div class="migrateSettingPrice" ref="migrateSettingPrice">
    <Title class="mt-5 mb-5" />
    <TableSkuPriceList ref="tableSkuPriceList" @templateError="handleTemplateError"
      v-loading="loadingData" />

    <div v-if="startMigrateBtnFixed" style="height:102px;width:100%"></div>
    <div
      ref="startMigrateBtn"
      :style="{'margin-right': startMigrateBtnFixed ? `${scrollWidth + 40}px` : 0}"
      :class="[startMigrateBtnFixed ? 'start-migrate-btn-fadeIn':'start-migrate-btn-fadeOut' ,'flex' ,'justify-c'] ">
      <div style="width:200px;margin-right:10px" v-if="startMigrateBtnFixed"></div>
      <div style="box-sizing: border-box;background:#ffffff;flex:1;padding: 10px;display:flex;" class="flex justify-c ">
        <el-button style="margin-right: 15px;" @click="showError" :disabled="!msgError" type="warning" plain>查看填写错误的价格</el-button>
        <el-button style="margin-right: 15px; width:120px" @click="goback" :disabled="loadingData" plain
          type="primary" :loading="loadingData">返回</el-button>
        <div>
          <el-button type="primary" :disabled="msgError || loadingData" @click="toSetTemplate"
            :loading="loadingData">下一步：修改模板</el-button>
          <NewComer type="下一步：修改模板" ref="newComer">
            <div class="left">
              <div style="width:180px" class="color-666 font-12">点击此处进行下一步操作</div>
              <div @click="closeNewComer" class="pointer pramiry underline right">好的</div>
            </div>
          </NewComer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions, mapMutations } from 'vuex'
import Title from './Title'
import TableSkuPriceList from './TableSkuPriceList'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

export default {
  data () {
    return {
      templateError: true,
      startMigrateBtnFixed: false
    }
  },
  components: {
    Title,
    TableSkuPriceList
  },
  computed: {
    ...mapState('migrate/migrateSettingPrice', ['tableData', 'originTableData', 'origin']),
    ...mapGetters('migrate/migrateSettingTemplate', {
      template: 'getTemplate'
    }),
    ...mapGetters('migrate/migrateSettingPrice', ['tableDataErrorMsg', 'dicCustomPrices', 'customPrices']),
    ...mapState({
      loadingGetTPProductByIds: state => state['@@loading'].effects['migrate/migrateSettingPrice/getTPProductByIds'],
      loadingFormatTableData: state => state['@@loading'].effects['migrate/migrateSettingPrice/formatTableData']
    }),
    msgError () {
      return this.tableDataErrorMsg.some(item => !isEmpty(item)) || this.templateError
    },
    loadingData () {
      return this.loadingGetTPProductByIds || this.loadingFormatTableData
    }
  },
  mounted () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.addEventListener('scroll', this.scroll)
  },
  activated () {
    window.addEventListener('beforeunload', this.beforeunloadFn)
  },
  deactivated () {
    window.removeEventListener('beforeunload', this.beforeunloadFn)
  },
  beforeDestroy () {
    const scrollEl = document.querySelector('.page-component__scroll')
    scrollEl.removeEventListener('scroll', this.scroll)
  },
  methods: {
    ...mapActions('migrate/migrateSettingTemplate', [
      'saveTempTemplate'
    ]),
    ...mapMutations('migrate/migrateSettingTemplate', ['save']),
    scroll: debounce(function () {
      // 判断是否有滚动条的方法
      function hasScrolled (el, direction = 'vertical') {
        if (direction === 'vertical') {
          return el.scrollHeight > el.clientHeight
        } else if (direction === 'horizontal') {
          return el.scrollWidth > el.clientWidth
        }
      }
      function getScrollbarWidth (el) {
        el = el || document.body
        var scrollDiv = document.createElement('div')
        scrollDiv.style.cssText =
          'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;'
        el.appendChild(scrollDiv)
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
        el.removeChild(scrollDiv)
        return scrollbarWidth
      }
      const scrollEl = document.querySelector('.page-component__scroll')
      const isScroll = hasScrolled(scrollEl)
      if (isScroll) {
        const scrollWidth = getScrollbarWidth(scrollEl)
        this.scrollWidth = scrollWidth
        const migrateSettingPrice = this.$refs.migrateSettingPrice
        const clientHeight = scrollEl.clientHeight
        const rect = migrateSettingPrice.getBoundingClientRect()
        const height = rect.height
        const dist = 5
        const disdance = height - clientHeight - dist
        const scrollTop = scrollEl.scrollTop
        if (scrollTop < disdance) {
          this.startMigrateBtnFixed = true
        } else {
          this.startMigrateBtnFixed = false
        }
      }
    }, 30),
    beforeunloadFn (e) {
      if (this.msgError) return false
      if (!this.template.isDiff() && Object.entries(this.dicCustomPrices).length === 0) {
        return undefined
      }
      let msg = '离开后本页面更改不会被保存'
      if (e) {
        e.returnValue = msg
      }
      return msg
    },
    handleTemplateError (value) {
      this.templateError = Object.values(value).some(item => item)
    },
    // 事件名称
    methodsName () {
      this.dialogVisible = false
    },
    closeNewComer () {
      this.$refs.newComer.close && this.$refs.newComer.close()
    },
    toSetTemplate () {
      if (this.msgError) return false
      this.save({
        dicCustomPrices: this.dicCustomPrices
      })
      this.saveTempTemplate()
      this.$router.push({
        name: 'MigrateSettingTemplate'
      })
    },
    showError () {
      if (this.msgError) {
        this.$nextTick(() => {
          let isError = document.getElementsByClassName('warn')
          isError[0].scrollIntoView({
              // 滚动到指定节点
              // 值有start,center,end，nearest，当前显示在视图区域中间
            block: 'center',
              // 值有auto、instant,smooth，缓动动画（当前是慢速的）s
            behavior: 'smooth'
          })
        })
      }
    },
    goback () {
      this.$router.push({
        name: 'ProductList',
        params: {
          keepStatus: true
        }
      })
    }

  }
}
</script>

<style lang='less' scoped>
//@import url(); 引入公共css类

.start-migrate-btn-fadeIn {
  position: fixed;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 2;
  animation: fadeIn ease 0.3s;
  margin: 0 40px;
}

.start-migrate-btn-fadeOut {
  transition: none;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}
</style>
