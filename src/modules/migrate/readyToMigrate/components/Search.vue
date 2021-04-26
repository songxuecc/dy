<template>
  <div class="left">
    <el-tabs v-model="activeTab">
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
      <el-form-item  label-width="100px" style="width: 325px" label="商品状态">
        <el-select
          v-model="filter.status"
          placeholder="商品状态"
          popper-class="select-long"
          style="width: 195px"
          :disabled="activeTab !== '全部'"
          clearable @clear="handleClear('filter.status')"
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

      <el-form-item  label-width="100px" style="width: 325px" label="复制时间">
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
        label-width="100px"
        style="width: 325px"
        label="整店复制-复制名"
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

      <el-form-item  label-width="100px" style="width: 325px" label="商品标题">
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
      <el-form-item  label-width="100px" style="width: 325px" label="多店铺切换">
        <el-select
          v-model="filter.child_shop_user_id"
          placeholder="请选择"
          popper-class="select-long"
          style="width: 195px"
          clearable
          @clear="handleClear('filter.child_shop_user_id')"
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
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="handleFilterChange"
          style="width: 60px"
        >
          <span class="font-12">查询</span>
        </el-button>
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
    msg: String
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
      defaultValue: {
        search: {
          key: ''
        },
        filter: {
          status: '-1',
          captureId: '-1',
          child_shop_user_id: '0',
          shopCaptureId: '-1'
        }
      },
      captureOptionList: [],
      shopCaptureOptionList: [],
      tabs: [
        {
          text: '全部',
          options: [ '-1', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
        },
        {
          text: '未完成上线',
          options: [ 0 ]
        },
        {
          text: '完成上线',
          options: [ 4 ]
        },
        {
          text: '保存至草稿箱',
          options: [ 3 ]
        }
      ],
      isShowCaptureExtendOpt: false
    }
  },
  activated () {
    this.getCaptureOptionList()
    this.getBindShopList()
  },
  watch: {
    statusOptions (options) {
      this.filter.status = options[0].label
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
              console.log(pvObjectKeys[key], 'pvObjectKeys[key]')
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
    handleClear (path) {
      set(this, path, get(this.defaultValue, path))
    },
    // 复制时间
    handleCaptureChange (captureId) {
      console.log(captureId, '复制时间captureId')

      this.handleCaptureOptionChange(captureId)
    },
    // 整店复制-复制名
    handleShopCaptureChange (captureId) {
      console.log(captureId, '整店复制captureId')
      this.handleCaptureOptionChange(captureId)
    },
    // 查询
    handleFilterChange () {
      this.$emit('change', {
        filter: this.filter,
        search: this.search
      })
    },
    handleCaptureOptionChange (captureId) {
      if (this.captureOptions.map((a) => a.value).indexOf(captureId) !== -1) {
        this.filter.captureId = captureId
      } else {
        this.filter.captureId = '-1'
      }
      if (
        this.shopCaptureOptions.map((a) => a.value).indexOf(captureId) !== -1
      ) {
        this.filter.shopCaptureId = captureId
      } else {
        this.filter.shopCaptureId = '-1'
      }
      // 如果进行抓取选择，将店铺选择改为本店铺
      this.filter.child_shop_user_id = '0'
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
</style>
