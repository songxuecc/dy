<template>
  <div class="left relative">
    <span
      class="click mr-20 pointer"
      style="
        align-content:right;
        position: absolute;
        right: 10px;
        top: 15px;
        z-index:1"
      v-hh-open="'https://www.yuque.com/huxiao-rkndm/ksui6u/alvq8l'"><hh-icon type="icontishi" ></hh-icon>各个状态的含义</span>
    <el-tabs v-model="activeTab" @tab-click="handelTabClick">
      <el-tab-pane
        :label="tab.text"
        :name="tab.text"
        v-for="tab in tabs"
        :key="tab.text"
      ></el-tab-pane>
    </el-tabs>

    <el-form
      ref="form"
      :model="search"
      size="mini"
      :inline="true"
      style="text-align: left"
      class="flex align-c wrap search"
    >
      <el-form-item  label-width="90px" style="width: 325px" label="商品状态">
        <el-select
          v-model="filter.status"
          placeholder="商品状态"
          popper-class="select-long"
          style="width: 195px"
          :disabled="['完成上线','保存至草稿箱'].includes(activeTab)"
          clearable
          @clear="handleClear('filter.status')"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="left dropdown"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label-width="90px" style="width: 325px" label="复制时间">
        <el-select
          v-model="filter.captureId"
          placeholder="复制时间"
          @change="handleCaptureChange"
          popper-class="select-long"
          style="width: 195px"
          clearable @clear="handleClear('filter.captureId')"
        >
          <el-option-group>
            <el-option
              v-for="item in captureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              class="left dropdown"
            >
            </el-option>
          </el-option-group>
          <el-option-group v-if="isShowCaptureExtendOpt">
            <el-option
              :key="capture.capture_id"
              :label="calendarTime(capture.create_time)"
              :value="capture.capture_id.toString()"
              disabled
              class="left dropdown"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item
        label-width="90px"
        style="width: 325px"
        label="整店复制"
      >
        <el-select
          v-model="filter.shopCaptureId"
          placeholder="请选择"
          @change="handleShopCaptureChange"
          popper-class="select-long"
          style="width: 195px"
          clearable
          @clear="handleClear('filter.shopCaptureId')"
        >
          <el-option
            v-for="item in shopCaptureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            class="left dropdown"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item  label-width="90px" style="width: 325px" label="商品标题">
        <el-input
          v-model="search.key"
          placeholder="商品标题"
          @keyup.enter.native="handleFilterChange"
          style="width: 195px"
          clearable
          @clear="handleClear('search.key')"
          :debounce="500"
        >
        </el-input>
      </el-form-item>
      <el-form-item  label-width="90px" style="width: 325px" label="多店铺切换">
        <el-select
          v-model="filter.child_shop_user_id"
          placeholder="请选择"
          popper-class="select-long"
          style="width: 195px"
          clearable
          @clear="handleClear('filter.child_shop_user_id')"
          v-if="bindShopList.length > 1"
        >
          <el-option
            v-for="item in bindShopList"
            :key="item.user_id"
            :label="item.shop_name"
            :value="item.user_id"
            class="left dropdown"
          >
          </el-option>
        </el-select>
        <span class="click font-12"  v-else @click="manageShops">点击绑定多店铺</span>
      </el-form-item>

      <el-form-item class="btn">
        <el-button
          type="primary"
          @click="handleFilterChange"
          style="width: 60px;margin-left:30px"
        >
          <span class="font-12">查询</span>
        </el-button>
        <NewComer type="搬家列表查询提示" ref="newComer" direction="bottom" :noAuth="true" class="nn">
          <div style="width:190px">
          <div  class="color-666 font-12 left mb-5">
              <hh-icon type="icontishi" ></hh-icon>&nbsp;小提醒：选择后请点击查询哦~
              <div class="ml-10 right">&nbsp;&nbsp;<span  class="right pointer underline primary" @click="tipTrigger">好的</span></div>
          </div>
          </div>
      </NewComer>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { productStatusMap } from '@/common/common.js'

import { mapActions, mapState } from 'vuex'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import set from 'lodash/set'

export default {
  name: 'component_name',
  props: {
    capture: Object
  },
  components: {
  },
  data () {
    return {
      activeTab: '全部',
      search: {
        key: ''
      },
      filter: {
        status: '-1',
        captureId: '-1',
        child_shop_user_id: '0',
        shopCaptureId: '-1'
      },
      captureOptionList: [],
      shopCaptureOptionList: [],
      tabs: [
        {
          text: '全部',
          options: ['-1', 0, 6, 7, 1, 2, 5, 9, 8, 3, 4]
        },
        {
          text: '未完成上线',
          options: [ '-2', 0, 6, 7, 1, 2, 5, 9, 8 ]
        },
        {
          text: '完成上线',
          options: [ 4 ]
        },
        {
          text: '保存至草稿箱',
          options: [ 3 ]
        }
      ]
    }
  },
  async activated () {
    let captureId = this.filter.captureId
    if (this.$route.query.captureId) {
      captureId = this.$route.query.captureId.toString()
    }
    await this.getCaptureOptionList()
    this.handleCaptureOptionChange(captureId)
    this.getBindShopList()
  },
  watch: {
    statusOptions (options) {
      this.filter.status = options[0].label
    },
    activeTab (val) {
      if (val !== '全部') {
        this.filter.status = this.tabs.find(tab => tab.text === val).options[0]
      } else {
        this.filter.status = '-1'
      }
      this.$emit('change', {
        filter: this.filter,
        search: this.search
      })
    },
    search: {
      handler: debounce(function (newVal, oldVal) {
        const pvObjectKeys = {
          key: '商品标题'
        }
        Object.keys(oldVal).forEach(key => {
          if (oldVal[key] !== newVal[key]) {
            if (window._hmt) {
              window._hmt.push(['_trackEvent', '复制商品', '点击', pvObjectKeys[key]])
            }
          }
        })
      }, 500),
      deep: true
    },
    filter: {
      handler: debounce(function (newVal, oldVal) {
        const pvObjectKeys = {
          status: '状态选择',
          captureId: '选择复制历史',
          child_shop_user_id: '选择店铺复制历史'
        }
        Object.keys(oldVal).forEach(key => {
          if (oldVal[key] !== newVal[key]) {
            if (window._hmt) {
              window._hmt.push(['_trackEvent', '复制商品', '点击', pvObjectKeys[key]])
            }
          }
        })
      }, 500),
      deep: true
    }
  },
  computed: {
    ...mapState('migrate/readyToMigrate', [
      'captureOptions',
      'bindShopList',
      'shopCaptureOptions'
    ]),
    statusOptions () {
      let options = []
      let keys = this.tabs.find(item => item.text === this.activeTab).options
      keys.map(key => {
        options.push({
          value: key,
          label: productStatusMap[key]
        })
      })
      return options.sort((a, b) => a.value - b.value)
    },
    isShowCaptureExtendOpt () {
      if (
        this.filter.captureId.toString() === '-1' ||
        !this.capture.capture_id
      ) {
        return false
      }
      for (let i in this.captureOptionList) {
        let capture = this.captureOptionList[i]
        if (
          capture.capture_id.toString() === this.filter.captureId.toString()
        ) {
          return false
        }
      }
      return true
    }
  },
  methods: {
    ...mapActions('migrate/readyToMigrate', [
      'getCaptureOptionList',
      'getBindShopList'
    ]),
    calendarTime (strTime) {
      return moment(strTime).calendar()
    },
    tipTrigger (e) {
      event.stopPropagation()
      const ref = this.$refs.newComer
      ref && ref.close && ref.close()
    },
    manageShops () {
      if (window._hmt) { window._hmt.push(['_trackEvent', '导航栏', '点击', '店铺绑定']) }
      this.$router.push({ path: '/customerSetting/shopsBand' })
    },
    handleClear (path) {
      const defaultValue = {
        search: {
          key: ''
        },
        filter: {
          captureId: '-1',
          child_shop_user_id: '0',
          shopCaptureId: '-1'
        }
      }
      const tab = this.tabs.find(item => item.text === this.activeTab)

      defaultValue.filter.status = tab.options[0]
      set(this, path, get(defaultValue, path))
    },
    // 复制时间
    handleCaptureChange (captureId) {
      this.handleCaptureOptionChange(captureId)
    },
    // 整店复制-复制名
    handleShopCaptureChange (captureId) {
      this.handleCaptureOptionChange(captureId)
    },
    // 查询
    handleFilterChange () {
      this.$emit('change', {
        filter: this.filter,
        search: this.search
      })
      this.tipTrigger()
    },
    handleCaptureOptionChange (value) {
      let captureId = value.toString()
      let shopCaptureId = value.toString()
      if (this.captureOptions.length && this.captureOptions.map((a) => a.value).indexOf(value) === -1) {
        captureId = '-1'
      }
      if (
        this.shopCaptureOptions.length && this.shopCaptureOptions.map((a) => a.value).indexOf(value) === -1
      ) {
        shopCaptureId = '-1'
      }
      this.$nextTick(() => {
        this.filter.captureId = captureId
        this.filter.shopCaptureId = shopCaptureId
      // 如果进行抓取选择，将店铺选择改为本店铺
        this.filter.child_shop_user_id = '0'
      })
    }
  }

}

</script>
<style lang="less" scoped>
.search {
  padding-top: 10px;
  background-color: #f9f9f9;
  border-radius: 3px;
  margin-top: 3px;
}

/deep/ .el-tabs__header {
  margin-bottom: 5px;
}

/deep/ .el-form--inline .el-form-item {
  margin-bottom: 10px;
}

.dropdown {
  height: 25px;
  line-height: 25px;
  font-size: 12px;
}
.btn {
  /deep/ .el-form-item__content{
    padding-right: 32px;
  }
}
</style>
