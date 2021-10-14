<!--  -->
<template>
    <div>
        <el-drawer
            :with-header="false"
            style="overflow:hidden;"
            size="50%"
            v-if="drawer"
            :visible.sync="drawer">
            <div style="">
            <!-- 搜索 -->
            <div ref="form">
              <el-form  :model="filters" label-width="60px" :inline="true" size="small" label-position="left" class="left ml-20 mt-20">
                <el-form-item label="商品名称" >
                  <el-input v-model="filters.keyword" class="w-400"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit" size="medium" class="ml-10" :loading="loading" :disabled="loading">搜索</el-button>
                </el-form-item>
              </el-form>
            </div>
              <div style="margin-left:-48px;">
                <el-table
                  v-loading="loading"
                  height="calc(100vh - 200px)"
                  :data="tableData"
                  row-key="goods_id"
                  ref="table"
                  :header-cell-style="getHeaderCellStyle"
                  @row-click="toggleRowExpansion"
                  :cell-style="getCellStyle">
                  <el-table-empty slot="empty"/>
                  <el-table-column type="expand">
                    <template slot-scope="props">
                      <el-radio-group v-model="props.row.choosedSkuId">
                        <el-radio :label="0"  :key="0">
                          不选择
                        </el-radio>
                        <el-radio :label="`${props.row.goods_id}-${sku.sku_id}-${index}`" v-for="(sku,index) in props.row.sku_list" :key="`${props.row.goods_id}-${sku.sku_id}-${index}`">
                          <div style="flex:1">{{sku.spec_detail_names}}</div>
                          <div style="width:90px;padding:0 0;text-align:center">{{(sku.price / 100).toFixed(2)}}</div>
                          <div style="width:90px;padding:0 0;text-align:center">{{sku.quantity}}</div>
                        </el-radio>
                      </el-radio-group>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    cell-style="text-overflow:clip;"
                    align="center"
                    width="50">
                    <template slot-scope="scope">
                      <div class="add pointer"  v-if="!scope.row.add"><i class="el-icon-plus " ></i></div>
                      <div class="add pointer"  v-else><i class="el-icon-minus " ></i></div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="date"
                    label="商品/规格">
                    <template slot-scope="scope">
                      <div class="flex align-c">
                        <div style="width:60px;">
                          <el-image
                              style="height:60px;max-width:60px;border-radius:2px;margin-right:8px"
                              :src="scope.row.image_url"
                              fit="contain"
                              :preview-src-list="[scope.row.image_url]"
                              >
                              <div slot="placeholder">
                                  <hh-icon  type="iconwuzhaopian" style="font-size:60px" />
                              </div>
                              <div slot="error" class="flex align-c" style="height:100%">
                                  <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
                              </div>
                          </el-image>
                        </div>
                        <div>
                          <div class="font-12">{{ scope.row.goods_name }}</div>
                          <div class="font-12 flex align-c color-999" style="margin-top:3px">商品ID: {{ scope.row.goods_id }}</div>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    width="90"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                      <span v-if="scope.row.choosedSkuId" class="warning">已选</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="单价"
                    align="center"
                    width="90">
                  </el-table-column>
                  <el-table-column
                    prop="address"
                    width="90"
                    align="center"
                    label="库存">
                  </el-table-column>
                </el-table>
              </div>

              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.page_index"
                class="pt-20 right mr-20"
                :page-size="pagination.page_size"
                :page-sizes="[10, 20, 50, 100]"
                layout="slot,total, sizes, prev, pager, next, jumper"
                :total="total"
              >
                <span  class="mr-10 warning" v-if="hasChoosedProducts.length">已选择 {{hasChoosedProducts.length}} / 5 条</span>
              </el-pagination>

              <div class="flex justify-c align-c" ref="btn">
                <el-button type="primary" plain style="width:120px"  @click="handleCancle">取消选择</el-button>
                <el-button type="primary" style="width:120px"  @click="handleClose">确认选择</el-button>
              </div>
            </div>

        </el-drawer>
    </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

export default {
  name: 'DrawChooseProducts',
  props: {
    msg: String
  },
  data () {
    return {
      form: {

      },
      drawer: false
    }
  },
  created () {
  },
  computed: {
    ...mapState({
      loading: (state) => state['@@loading'].effects['productManagement/combination/drawChooseProducts/query']
    }),
    ...mapState('productManagement/combination/drawChooseProducts', [
      'tableData',
      'total',
      'pagination',
      'filters'
    ]),
    hasChoosedProducts () {
      return this.tableData.filter(item => item.choosedSkuId)
    }
  },
  methods: {
    ...mapMutations('productManagement/combination/drawChooseProducts', ['save']),
    ...mapActions('productManagement/combination/drawChooseProducts', [
      'fetch',
      'handleCurrentChange',
      'handleSizeChange',
      'setFilter',
      'clear'
    ]),
    open () {
      this.fetch()
      this.drawer = true
    },
    getHeaderCellStyle ({row, column, rowIndex, columnIndex}) {
      // if (columnIndex === 0) {
      //   return 'margin-left:-30px'
      // }
    },
    getCellStyle ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        return 'opacity:0'
      }
      if (columnIndex === 4) {
        return 'padding-right:10px'
      }
    },
    onSubmit () {
      this.setFilter({
        filters: this.filters
      })
    },
    toggleRowExpansion (row) {
      const add = row.add || false
      this.$refs.table.toggleRowExpansion(row, !add)
      this.$set(row, 'add', !row.add)
    },
    handleClose () {
      if (!this.hasChoosedProducts.length) {
        return this.$message.error('请选择商品')
      }

      if (this.hasChoosedProducts.length > 5) {
        return this.$message.error('最多5个商品')
      }
      this.$emit('submit', this.hasChoosedProducts)
      console.log(this.hasChoosedProducts, 'this.hasChoosedProducts')
      this.drawer = false
      this.save({
        tableData: [],
        filters: {}
      })
    },
    handleCancle () {
      this.drawer = false
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-table tr:hover {
  .add {
    color: @color-primary;
    border: 1px solid @color-primary;
  }
}
.add {
  border: 1px solid #cdcdcd;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #cdcdcd;
  border-radius: 3px;
  font-weight: 500;
  margin-left: 10px;
  &:hover {
    color: @color-primary;
    border: 1px solid @color-primary;
  }
  i {
    transform: scale(0.8);
  }
}

/deep/ .el-radio-group{
  display: block;
}
/deep/ .el-radio{
  display: flex;
  margin-right: 0;
  padding-bottom: 4px;
  // border-bottom: 1px solid #F2F2F2;
}
/deep/ .el-radio__input{
  padding-left: 40px;
}
/deep/ .el-radio__label{
  display: flex;
  justify-content: space-between;
  flex:1;
  color:#000;

}
/deep/ .el-table__expanded-cell {
  padding-right: 0;
  padding-top: 6px;
  padding-bottom: 6px;

}
.w-400 {
  width: 400px;
}

</style>
