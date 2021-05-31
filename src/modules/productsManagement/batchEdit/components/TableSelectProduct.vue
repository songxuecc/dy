<!-- 选择商品 -->
<template>
     <el-drawer
        :with-header="false"
        direction="rtl"
        :visible.sync="visible"
        @closed="handleClose(false)"
        size="80%">
        <!-- 搜索 -->
        <el-form ref="form" :model="form" label-width="60px" :inline="true" size="small" label-position="left" class="left ml-20 mt-20">
           <el-form-item label="状态">
            <el-select v-model="form.status" placeholder="请选择商品状态"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发货模式">
            <el-select v-model="form.presell_type" placeholder="请选择发货模式"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in presellTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否抓取">
            <el-select v-model="form.captureStatus" placeholder="请选择是否抓取"  class="w-200 mr-10 ">
                <el-option
                class="left dropdown"
                v-for="item in captureStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称" >
            <el-input v-model="form.keyword" class="w-200"></el-input>
          </el-form-item>
          <br/>
          <el-form-item label="商品ID">
            <el-input class="w-486" type="textarea" :rows="1" :autosize="false" placeholder="输入多个商品ID,以换行分隔，最多可输入100个" v-model="goods_ids"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" size="medium" class="ml-10" :loading="loading" :disabled="loading">搜索</el-button>
          </el-form-item>
        </el-form>
        <!-- 列表 -->
        <div class="relative">
          <span class="absolute font-12 yaHei" style="left:40px;z-index:1;top:9px;position:absolute">全选/{{multipleSelection.length}}</span>
          <el-table
              row-key="goods_id"
              v-loading="loading"
              ref="multipleTable"
              :data="productListTableData"
              tooltip-effect="dark"
              style="width: 100%"
              height="calc(100vh - 223px)"
              @selection-change="handleSelectionChange">
              <el-table-empty slot="empty"/>

              <el-table-column
                type="selection"
                :reserve-selection="true"
                width="80">
              </el-table-column>

              <el-table-column
                  label="图片"
                  width="70"
                  align="center"
                  prop="id">
                <template slot-scope="scope">
                  <el-image
                      style="height:50px;max-width:50px;border-radius:2px"
                      :src="scope.row.image_url"
                      fit="contain"
                      :preview-src-list="[scope.row.image_url]"
                      >
                      <div slot="placeholder">
                          <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
                      </div>
                      <div slot="error" class="flex align-c" style="height:100%">
                          <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                      </div>
                  </el-image>
                </template>
              </el-table-column>

              <el-table-column
                label="标题"
                width="">
                <template slot-scope="scope">
                    <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                      {{ scope.row.goods_name }}
                      </el-link><br>
                      <div class="font-12 flex align-c color-999 mt-5">
                          <span >商品ID: {{ scope.row.goods_id }}</span>
                          <span class="ml-10 mr-10 presell_type jieti" v-if="scope.row.presell_type === 2">阶梯发货</span>
                          <span class="ml-10 mr-10 presell_type xianhuo" v-if="scope.row.presell_type === 0">现货发货</span>
                          <span class="ml-10 mr-10 presell_type yushou" v-if="scope.row.presell_type === 1">预售发货</span>
                      </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="category_show"
                label="类目"
                width="120">
              </el-table-column>
              <el-table-column
                prop="min_price"
                label="售卖价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="market_price"
                label="市场价"
                width="120">
              </el-table-column>
              <el-table-column
                prop="status"
                label="销售状态"
                width="120">
              </el-table-column>
            </el-table>
          </div>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="productListPagination.page_index"
          :page-size="productListPagination.page_size"
          :page-sizes="productListSizes"
          :total="productListTotal">
        </el-pagination>

        <div class="flex justify-c align-c">
            <el-button type="primary" style="width:120px"  @click="handleClose(true)">确认选择</el-button>
        </div>
    </el-drawer>
</template>

<script>
import common from '@/common/common.js'
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'selectProduct',
  props: {
    visible: Boolean
  },
  data () {
    return {
      form: {
        status: '-',
        presell_type: -1,
        captureStatus: -1,
        keyword: ''
      },
      goods_ids: '',
      captureStatusOptions: [
        {value: -1, label: '全部'},
        {value: 0, label: '非抓取'},
        {value: 1, label: '抓取'}
      ],
      presellTypeOptions: [
        {value: -1, label: '全部发货模式'},
        {value: 0, label: '现货发货'},
        {value: 1, label: '预售发货'},
        {value: 2, label: '阶梯发货'}
      ],
      multipleSelection: []
    }
  },
  computed: {
    ...mapState({
      loading: state => state['@@loading'].effects['productManagement/batchEdit/productListFetch']
    }),
    ...mapState('productManagement/batchEdit', [
      'productListPagination',
      'productListSizes',
      'productListTableData',
      'productListTotal'
    ]),
    statusOptions () {
      const options = []
      Object.entries(common.dyProductStatusMap).forEach(([value, label]) => {
        if (!['草稿箱', '封禁中'].includes(label)) {
          options.push({ value, label })
        }
      })
      return options
    }
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['fetchProductList', 'productListSetFilter']),
    ...mapMutations('productManagement/batchEdit', ['save']),
    toggleVisible (index) {
      this.$emit('update:visible', false)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    onSubmit () {
      this.getData()
    },
    async getData () {
      const statusArray = this.form.status.split('-')
      let status = -1
      let checkStatus = -1
      if (statusArray.length > 1 && statusArray[0]) {
        status = parseInt(statusArray[0])
        checkStatus = parseInt(statusArray[1])
      }

      const goodsIds = this.goods_ids.split(/[\s\n]/).filter(item => item).map(item => item.trim())
      const goodsIdsSet = [...new Set(goodsIds)]
      const limit = 100
      if (goodsIdsSet.length && goodsIdsSet.length > limit) {
        this.$message.error(`搜索id不可以超过${limit}条！`)
      }

      let filters = {
        status: status,
        check_status: checkStatus,
        capture_status: this.form.captureStatus,
        presell_type: this.form.presell_type,
        keyword: this.form.keyword,
        goods_ids: goodsIdsSet.length ? goodsIdsSet : ''
      }
      await this.fetchProductList({
        filters
      })
    },
    handleCurrentChange (pageIndex) {
      if (this.loading) return
      this.fetchProductList({
        pagination: {
          page_index: pageIndex
        }
      })
    },
    handleSizeChange (pageSize) {
      this.fetchProductList({
        pagination: {
          page_index: 1,
          page_size: pageSize
        }
      })
    },
    handleClose (needPreview) {
      if (!this.multipleSelection.length) return this.$message.error('请选择商品')
      this.toggleVisible()
      const ids = this.multipleSelection.map(item => item.goods_id)
      this.$emit('preview', ids, needPreview)
    }
  }
}
</script>
<style lang="less" scoped>
.dropdown {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
}

.w-200 {
  width: 200px;
}

.w-486 {
  width: 486px;
}

.presell_type {
      width: 58px;
      height: 18px;
      display: inline-block;
      color:#fff;
      text-align: center;
      font-size: 12px;
      font-family: MicrosoftYaHei;
      border-radius: 8px 0px 8px 0px;
  }

.jieti {
  background: linear-gradient(205deg, #F2D1C2 0%, #DC9E85 100%);
}

.xianhuo {
  background: linear-gradient(180deg, #757BC4 0%, #ADB7ED 100%);
}
.yushou {
  background: linear-gradient(180deg, #F9D6AF 0%, #D9A779 100%);
  border-radius: 8px 0px 8px 0px;
}

.selectProductTable{
  height: calc(100vh - 235px);
  overflow-y: auto;
}
</style>
