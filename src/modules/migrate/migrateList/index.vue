<template lang="html">
    <div v-loading="loadingCnt">
        <div class="text-left">
            复制列表
        </div>
        <product-list-view ref="productListView" :tpProductList="captureTPProductList"
                           @onSelectChange="selectIdList = $event"
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
        <div  class="common-bottom">
            <el-button @click="$router.go(-1)">
                <span>返回上一步</span>
            </el-button>
            <el-button :disabled="selectIdList.length == 0" type="primary" @click="toMigrate" style="padding: 9px 15px">
                <span style="line-height:21px">上传抖音</span>
                <el-badge v-if="selectIdList.length > 0" :value="selectIdList.length"></el-badge>
            </el-button>
        </div>
    </div>
</template>
<script>
import productListView from '@/components/ProductListView'
import request from '@/mixins/request.js'
import { mapGetters, mapActions } from 'vuex'
export default {
  mixins: [request],
  components: {
    productListView
  },
  data () {
    return {
      captureTPProductList: [],
      selectIdList: [],
      dicSelectPage: {},
      pagination: {
        index: 1,
        size: 10,
        total: 0
      }
    }
  },
  computed: {
    ...mapGetters([
      'getCaptureIdList'
    ])
  },
  mounted () {
    this.pagination.total = this.getCaptureIdList.length
    this.getCaptureProductList(false)
  },
  methods: {
    ...mapActions([
      'setSelectTPProductIdList'
    ]),
    productEdit (product) {
      this.curTPProduct = product
      this.dialogEditVisible = true
    },
    getCaptureProductList (isResetIndex = true) {
      if (isResetIndex) {
        this.pagination.index = 1
      }
      let startIndex = (this.pagination.index - 1) * this.pagination.size
      let endIndex = this.pagination.index * this.pagination.size
      let sliceList = this.getCaptureIdList.slice(startIndex, endIndex)
      if (sliceList.length > 0) {
        let params = {capture_ids: sliceList}
        this.request('getCaptureTPProductList', params, data => {
          this.captureTPProductList = data.items
          if (!this.dicSelectPage[this.pagination.index]) {
            this.dicSelectPage[this.pagination.index] = true
          }
        })
      }
    },
    handleSizeChange (val) {
      this.pagination.size = val
      this.getCaptureProductList()
    },
    handleCurrentChange (val) {
      this.pagination.index = val
      this.getCaptureProductList(false)
    },
    toMigrate () {
      this.setSelectTPProductIdList(this.selectIdList)
    }
  }
}
</script>
<style lang="less" scoped>
</style>
