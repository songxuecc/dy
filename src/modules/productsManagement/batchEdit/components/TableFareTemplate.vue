<!-- 上下架 -->
<template>
  <el-drawer
    :visible.sync="visible"
    :with-header="false"
    direction="rtl"
    custom-class="pl-10 pt-10"
    size="80%"
  >
    <div class="title center">
      预览效果
      <hh-icon
        type="iconquxiaoanniu"
        class="close pointer"
        @click="toggleVisible"
      ></hh-icon>
    </div>
    <el-table
      :data="hhTaskProductOverviewTableData"
      class="mt-10"
      ref="table"
      row-key="goods_id"
      height="calc(100vh - 181px)"
      style="width: 100%"
    >
      <el-table-empty slot="empty" />
      <el-table-column label="商品信息" prop="id" >
        <template slot-scope="scope">
          <div class="flex">
            <!-- {{scope.row.image_url}} -->
            <el-image
              style="height: 50px; max-width: 65px"
              :src="scope.row.image_url"
              fit="contain"
              class="mr-10"
              :preview-src-list="[scope.row.image_url]"
              lazy
            >
              <div slot="placeholder">
                <hh-icon
                  type="iconwuzhaopian"
                  style="font-size: 50px; display: inline-block"
                />
              </div>
              <div slot="error" class="flex align-c" style="height: 100%">
                <hh-icon
                  type="icontupianjiazaishibai03"
                  style="font-size: 30px"
                />
              </div>
            </el-image>
            <div>
              <el-link
                :underline="false"
                :href="
                  'https://haohuo.jinritemai.com/views/product/detail?id=' +
                  scope.row.goods_id
                "
                target="_blank"
              >
                {{ scope.row.goods_name }} </el-link
              ><br />
              <div class="font-12 flex align-c color-999 mt-5">
                <span>{{ scope.row.goods_id }}</span>
                <span
                  class="ml-10 mr-10 presell_type jieti"
                  v-if="scope.row.presell_type === 2"
                  >阶梯发货</span
                >
                <span
                  class="ml-10 mr-10 presell_type xianhuo"
                  v-if="scope.row.presell_type === 0"
                  >现货发货</span
                >
                <span
                  class="ml-10 mr-10 presell_type yushou"
                  v-if="scope.row.presell_type === 1"
                  >预售发货</span
                >
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="修改前" prop="old_data">
      </el-table-column> -->
      <el-table-column align="center" label="修改后" prop="new_data">
      </el-table-column>
      <el-table-column
          align="center"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <span class="click" @click="handleDelete(scope.$index, scope.row)">删除</span>
          </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="handleCurrentChange"
      :current-page="hhTaskProductOverviewPagination.page_index"
      :page-size="hhTaskProductOverviewPagination.page_size"
      @size-change="handleSizeChange"
      :total="hhTaskProductOverviewTotal"
    >
    </el-pagination>
    <div class="flex justify-c align-c">
      <el-button
        type="primary"
        plain
        style="width: 120px"
        @click="toggleVisible"
        >暂不修改</el-button
      >
      <el-button type="primary" style="width: 120px" @click="edit" :disabled="!hhTaskProductOverviewTableData.length"
        >开始批量修改</el-button
      >
    </div>
  </el-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TableStock',
  props: {},
  data () {
    return {
      expands: [],
      visible: false
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', [
      'hhTaskProductOverviewPagination',
      'hhTaskProductOverviewSizes',
      'hhTaskProductOverviewTableData',
      'hhTaskProductOverviewTotal',
      'hhTaskProductOverviewFilters'
    ])
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['updateProduct', 'saveDelete']),
    edit () {
      this.updateProduct(this.hhTaskProductOverviewFilters)
      this.toggleVisible()
    },
    toggleVisible () {
      this.visible = !this.visible
    },
    confirm () {
      this.expands = []
    },
    expandChange (row, expandedRows, expanded) {
      this.expands = expandedRows.map((item) => item.goods_id)
    },
    handleDelete (index, row) {
      this.saveDelete(row.goods_id)
    }
  }
}
</script>
<style lang="less" scoped>
.presell_type {
  width: 58px;
  height: 18px;
  display: inline-block;
  color: #fff;
  text-align: center;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  border-radius: 8px 0px 8px 0px;
}

.jieti {
  background: linear-gradient(205deg, #f2d1c2 0%, #dc9e85 100%);
}

.xianhuo {
  background: linear-gradient(180deg, #757bc4 0%, #adb7ed 100%);
}
.yushou {
  background: linear-gradient(180deg, #f9d6af 0%, #d9a779 100%);
  border-radius: 8px 0px 8px 0px;
}
.title {
  font-size: 22px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #4e4e4e;
  line-height: 30px;
  position: relative;
  padding: 15px 0;
  .close {
    position: absolute;
    right: 30px;
    top: 20px;
    bottom: 0;
    margin: auto;
  }
}

/deep/ .expand-table-cell {
  padding-top: 4px;
  padding-bottom: 4px;
  color: #4e4e4e;
  font-size: 12px;
}
</style>
