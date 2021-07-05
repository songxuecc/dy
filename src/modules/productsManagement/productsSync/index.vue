<template lang="html">
    <div v-loading="loadingCnt">
        <div>
            <el-row>
                <el-col :span="20">
                    <el-form ref="form" :model="search" :inline="true" style="text-align: left">
                        <el-form-item label="标题">
                            <el-input v-model="search.key" size="small" @keyup.enter.native="handleFilterChange" style="width: 200px"></el-input>
                        </el-form-item>
                        <el-form-item label="是否设置同步">
                            <el-select v-model="search.isSync" placeholder="请选择" size="small" @change="handleFilterChange"
                                       popper-class="select-long" style="width: 100px"
                            >
                                <el-option v-for="item in isSyncOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item style="margin-right:0;margin-bottom:0">
                          <el-button type="primary" size="medium" @click="handleFilterChange">
                            <hh-icon type="iconsousuo1" style="font-size:16px"></hh-icon>
                          </el-button>
                        </el-form-item>

                    </el-form>
                </el-col>
                <el-col :span="4" style="height:40px; display:flex; align-items:center;">
                    <el-button size="small" style="margin-left: auto;" :disabled="isDisableBatch"
                               @click="openSyncSetting"
                    >批量设置同步</el-button>
                </el-col>
            </el-row>
        </div>
        <product-list-view ref="productListView" :tpProductList="tpProductList" :isSyncSource="true"
                           @btnSyncClick="onBtnSyncClick" @btnSettingClick="onBtnSettingClick"
                           @selectChange="onSelectChange"
        ></product-list-view>
        <br>
        <el-pagination
                v-show="loadingCnt == 0"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.index"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pagination.total">
        </el-pagination>
        <el-dialog title="数据源同步设置" class="product-dialog" :visible.sync="dialogSyncSettingVisible">
            <products-sync-setting ref="productsSyncSetting" :selectTpProductList="selectTpProductList"
                                   @updateStatus="getSyncSourceStatus"
            ></products-sync-setting>
        </el-dialog>
    </div>
</template>
<script>
import productListView from '@/components/ProductListView'
import productsSyncSetting from '@/components/ProductsSyncSetting.vue'
import request from '@/mixins/request.js'
import common from '@/common/common.js'
export default {
  mixins: [request],
  components: {
    productListView,
    productsSyncSetting
  },
  data () {
    return {
      tpProductList: [],
      selectTpProductList: [],
      isDisableBatch: true,
      dialogSyncSettingVisible: false,
      search: {
        key: '',
        isSync: '-1'
      },
      isSyncOptions: [
        {value: '-1', label: '全部'},
        {value: '0', label: '未设置'},
        {value: '1', label: '已设置'}
      ],
      pagination: {
        index: 1,
        size: 10,
        total: 0
      },
      statusTimer: null
    }
  },
  computed: {},
  mounted () {
  },
  activated () {
    this.getProductList()
  },
  deactivated () {
    if (this.statusTimer) {
      clearTimeout(this.statusTimer)
      this.statusTimer = null
    }
  },
  methods: {
    resetProductList () {
      this.tpProductList = []
    },
    getProductList () {
      let params = {
        'keyword': this.search.key,
        'is_sync': this.search.isSync,
        'page_index': this.pagination.index,
        'page_size': this.pagination.size
      }
      this.request('getProductsWithCaptured', params, data => {
        this.tpProductList = data.items
        this.pagination.total = data.total
      })
    },
    resetPaginationIndex () {
      this.pagination.index = 1
    },
    handleFilterChange () {
      this.resetPaginationIndex()
      this.resetProductList()
      this.getProductList()
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.resetPaginationIndex()
      this.getProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.resetProductList()
//      if (this.isShopCapture) {
//        this.resetValidProductList()
//      }
      this.getProductList()
    },
    onSelectChange () {
      let dicSelectId = this.$refs.productListView.dicSelectId
      let selectCnt = 0
      for (let id in dicSelectId) {
        if (dicSelectId[id]) {
          selectCnt++
        }
      }
      this.isDisableBatch = (selectCnt === 0)
    },
    openSyncSetting () {
      let dicSelectId = this.$refs.productListView.dicSelectId
      let selectList = []
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        let id = tpProduct['tp_product_id']
        if (id in dicSelectId && dicSelectId[id]) {
          selectList.push(tpProduct)
        }
      }
      this.selectTpProductList = selectList
      this.dialogSyncSettingVisible = true
      this.$nextTick(function () {
        this.$refs.productsSyncSetting.init()
      })
    },
    onBtnSyncClick (item) {
      let params = { goods_ids: [item.goods_id] }
      this.request('syncProductsBySource', params, data => {
        this.getSyncSourceStatus([item.goods_id])
      })
    },
    onBtnSettingClick (item) {
      this.selectTpProductList = [item]
      this.dialogSyncSettingVisible = true
      this.$nextTick(function () {
        this.$refs.productsSyncSetting.init()
      })
    },
    checkNeedReloadStatus () {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      let goodsIdsList = []
      for (let i in this.tpProductList) {
        let tpProduct = this.tpProductList[i]
        if (tpProduct.sync_source_status.status === common.taskResultStatus['ready'] ||
          tpProduct.sync_source_status.status === common.taskResultStatus['running']
        ) {
          goodsIdsList.push(tpProduct.goods_id)
        }
      }
      if (goodsIdsList.length > 0) {
        let self = this
        this.timer = setTimeout(function () {
          self.getSyncSourceStatus(goodsIdsList)
        }, 2000)
      }
    },
    getSyncSourceStatus (goodsIdsList = []) {
      let params
      if (goodsIdsList.length > 0) {
        params = { goods_ids: goodsIdsList }
      } else {
        for (let i in this.tpProductList) {
          goodsIdsList.push(this.tpProductList[i]['goods_id'])
        }
        params = { goods_ids: goodsIdsList }
      }
      this.request('getSyncSourceStatus', params, data => {
        for (let i in this.tpProductList) {
          let tpProduct = this.tpProductList[i]
          if (tpProduct['goods_id'] in data) {
            let item = data[tpProduct['goods_id']]
            tpProduct['sync_source_status'] = item['sync_source_status']
            if (item['sync_setting']) {
              tpProduct['sync_setting'] = item['sync_setting']
            } else {
              delete tpProduct['sync_setting']
            }
          }
        }
        this.checkNeedReloadStatus()
      }, undefined, true)
    }
  }
}
</script>
