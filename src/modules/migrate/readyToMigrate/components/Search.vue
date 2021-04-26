<template>
  <div >
    <el-tabs v-model="activeTab" @tab-click="handleClick($event,null,tab)">
        <el-tab-pane :label="tab.text" :name="tab.status" v-for="tab in tabs" :key="tab.status"></el-tab-pane>
    </el-tabs>

    <el-form
      ref="form"
      :model="search"
      size="mini"
      :inline="true"
      style="text-align: left"
      class="flex align-c wrap search"
    >
    <el-form-item label-width="100px" style="width:325px" label="商品状态">
        <el-select
          v-model="search.status"
          placeholder="商品状态"
          @change="handleStatusFilterChange"
          popper-class="select-long"
          style="width: 195px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label-width="100px" style="width:325px" label="复制时间">
        <el-select
          v-model="captureId"
          placeholder="复制时间"
          @change="handleCaptureChange"
          popper-class="select-long"
          style="width: 195px"
        >
          <el-option-group>
            <el-option
              v-for="item in captureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
          <el-option-group v-if="isShowCaptureExtendOpt">
            <el-option
              :key="capture.capture_id"
              :label="calendarTime(capture.create_time)"
              :value="capture.capture_id.toString()"
              disabled
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

    <el-form-item label-width="100px" style="width:325px"  label="整店复制-复制名">
        <el-select
          v-model="shopCaptureId"
          placeholder="请选择"
          @change="handleShopCaptureChange"
          popper-class="select-long"
          style="width: 195px"
        >
          <el-option-group>
            <el-option
              v-for="item in shopCaptureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

    <el-form-item label-width="100px" style="width:325px"  label="商品标题">
        <el-input
          v-model="search.key"
          placeholder="商品标题"
          @keyup.enter.native="handleFilterChange"
          style="width: 195px"
        >
        </el-input>
      </el-form-item>
      <el-form-item label-width="100px" style="width:325px" label="多店铺切换">
        <el-select
          v-model="search.child_shop_user_id"
          placeholder="请选择"
          @change="handleShopFilterChange"
          popper-class="select-long"
          style="width: 195px"
        >
          <el-option
            v-for="item in bindShopList"
            :key="item.user_id"
            :label="item.shop_name"
            :value="item.user_id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item >
        <el-button type="primary"  @click="handleFilterChange" style="width:60px">
            <span class="font-12" >查询</span>
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import moment from 'moment'
import { productStatusMap } from '@/common/common.js'
import utils from '@/common/utils'

import { mapActions, mapState } from 'vuex'

export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    return {
      activeTab: '全部',
      search: {
        key: '',
        status: '-1',
        captureId: '-1',
        child_shop_user_id: 0
      },
      captureOptionList: [],
      captureId: '-1',
      shopCaptureOptionList: [],
      tabs: [
        {
          text: '全部',
          status: productStatusMap['-1']
        },
        {
          text: '未上线',
          status: productStatusMap[0]
        },
        {
          text: '已上线',
          status: productStatusMap[4]
        },
        {
          text: '草稿箱',
          status: productStatusMap[3]
        }
      ]
    }
  },
  activated () {
    this.getCaptureOptionList()
    this.getBindShopList()
  },
  computed: {
    ...mapState('migrate/readyToMigrate', [
      'captureOptions',
      'bindShopList',
      'shopCaptureOptions'
    ]),
    statusOptions () {
      let options = []
      for (let key in productStatusMap) {
        options.push({
          value: key,
          label: productStatusMap[key]
        })
      }
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
    handleClick (tab, event, a) {
      console.log(tab, event, a, this.activeTab)
    }
  }
}
</script>
<style lang="less" scoped>

    /deep/ .el-tabs__header{
        margin-bottom: 5px;
    }

    /deep/  .el-form--inline .el-form-item{
      margin-bottom: 10px;
    }

    .search {
      padding-top: 10px;
      // background-color: rgb(247, 248, 250);
      background-color: #f9f9f9;
      border-radius: 3px;
      margin-top: 3px;
    }
</style>
