<!-- 上下架 -->
<template>
    <el-drawer
        :visible.sync="visible"
        :with-header="false"
        direction="rtl"
        @closed="toggleVisible"
        custom-class="pl-10 pt-10"
        size="80%">
        <el-table
            :data="productListTableData"
            class="mt-10"
            ref="table"
            row-key="id"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            style="width: 100%">
            <el-table-empty slot="empty"/>
            <el-table-column
                label="商品信息"
                prop="id">
            <template slot-scope="scope">
              <div  class="flex">
                <!-- {{scope.row.image_url}} -->
                  <el-image
                      style="height:50px;max-width:50px"
                      :src="scope.row.image_url"
                      fit="contain"
                      class="mr-10"
                      :preview-src-list="[scope.row.image_url]"
                      lazy>
                      <div slot="placeholder">
                          <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
                      </div>
                      <div slot="error" class="flex align-c" style="height:100%">
                          <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                      </div>
                  </el-image>
                <div>
                    <el-link :underline="false" :href="'https://haohuo.jinritemai.com/views/product/detail?id=' + scope.row.goods_id" target="_blank" >
                    {{ scope.row.goods_name }}
                    </el-link><br>
                    <div class="font-12 flex align-c color-999 mt-5">
                        <span >{{ scope.row.goods_id }}</span>
                        <span class="ml-10 mr-10 presell_type jieti" v-if="scope.row.presell_type === 2">阶梯发货</span>
                        <span class="ml-10 mr-10 presell_type xianhuo" v-if="scope.row.presell_type === 0">现货发货</span>
                        <span class="ml-10 mr-10 presell_type yushou" v-if="scope.row.presell_type === 1">预售发货</span>
                    </div>
                </div>
              </div>
            </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="修改前"
                prop="isOnSalePrevious">
            </el-table-column>
            <el-table-column
                align="center"
                label="修改后"
                prop="isOnSaleCurrent">
            </el-table-column>
        </el-table>
         <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          :current-page="productListPagination.page_index"
          :page-size="productListPagination.page_size"
          @size-change="handleSizeChange"
          :total="productListTotal">
        </el-pagination>
        <div class="flex justify-c align-c">
            <el-button type="primary" plain style="width:120px" @click="toggleVisible">暂不修改</el-button>
            <el-button type="primary" style="width:120px"  @click="edit">开始批量修改</el-button>
        </div>
    </el-drawer>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TableShelves',
  props: {
    visible: Boolean
  },
  data () {
    return {
      expands: ['12987122']
    }
  },
  computed: {
    ...mapState('productManagement/batchEdit', [
      'productListPagination',
      'productListSizes',
      'productListTableData',
      'productListTotal'
    ])
  },
  methods: {
    ...mapActions('productManagement/batchEdit', ['updateProduct']),
    edit () {
      console.log(this.productListTableData, 'this.productListTableData')
      const goods = this.productListTableData.map(item => {
        return JSON.stringify({
          is_onsale: item.isOnSale,
          goods_id: item.goods_id
        })
      })
      this.updateProduct({
        jobName: '上下架批量修改',
        goods,
        type: 1
      })
      this.toggleVisible()
    },
    toggleVisible () {
      this.$emit('update:visible', false)
    },
    confirm () {
      console.log('confirm')
      console.log(this.$refs.table)
      this.expands = []
    },
    expandChange (row, expandedRows, expanded) {
      console.log(row, expandedRows, expanded)
      this.expands = expandedRows.map(item => item.id)
    }
  }
}
</script>
<style lang="less" scoped>
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
</style>
