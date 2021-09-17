<!--  -->
<template>
  <el-dialog
    class="dialog-tight"
    title="同步数据修改详情对比"
    width="800px"
    style="margin-top: -5vh"
    :visible.sync="visible"
    append-to-body
    center
  >
    <div style="padding-bottom:30px">
      <div class="title flex align-c">
          <div class="left flex align-c" style="margin-right:50px">
            <el-image
              style="height:50px;max-width:50px;border-radius:2px;margin-right:14px"
              fit="contain"
              :src="rowData.image_url"
              :preview-src-list="[rowData.image_url]"
              >
              <div slot="placeholder">
                  <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
              </div>
              <div slot="error" class="flex align-c" style="height:100%">
                  <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
              </div>
            </el-image>
          <div>
            <p class="color-4e font-12 mb-5">{{rowData.goods_name}}</p>
            <p class="color-999 font-12">商品ID： {{rowData.goods_id}}</p>
          </div>
          </div>
          <div class="right color-4e">
            同步时间：{{rowData.sync_time}}
          </div>
      </div>

      <el-table
        :data="tableData"
        :expand-row-keys="expands"
        @expand-change="expandChange"
        row-key="goods_id"
        style="width: 100%"
        >
        <el-table-empty slot="empty"/>
        <el-table-column prop="data_type" label="检测内容" width="180" align="center">
          <template slot-scope="scope">
              <span v-if="scope.row.data_type === 'title'">标题</span>
              <span v-if="scope.row.data_type === 'stock'">库存</span>
              <span v-if="scope.row.data_type === 'price'">价格</span>
              <span v-if="scope.row.data_type === 'shelf'">上下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="old_data" label="修改内容" align="center">

            <template slot-scope="scope">
              <span v-if="scope.row.data_type === 'stock'">
                  <el-table
                      style="width: 100%"
                      max-height="250"
                      :data="scope.row.change_sku_list"
                      cell-class-name="expand-table-cell"
                    >
                      <el-table-column prop="spec_name" label="规格名称" />
                      <el-table-column
                        prop="old_stock"
                        label="修改前"
                        align="center"
                        width="180"
                      />
                    <el-table-column
                      prop="new_stock"
                      label="修改后"
                      align="center"
                      width="180"
                    />
                  </el-table>
              </span>
              <span v-if="scope.row.data_type === 'price'">
                  <el-table
                      style="width: 100%"
                      max-height="250"
                      :data="scope.row.change_sku_list"
                      cell-class-name="expand-table-cell"
                    >
                      <el-table-column prop="spec_name" label="规格名称" />
                      <el-table-column
                        prop="new_price"
                        label="修改前"
                        align="center"
                        width="180"
                      >
                      <template slot-scope="scope">
                        {{ (scope.row.old_price / 100).toFixed(2) }}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="old_price"
                      label="修改后"
                      align="center"
                      width="180"
                    >
                      <template slot-scope="scope">
                        {{ (scope.row.new_price / 100).toFixed(2) }}
                      </template>
                    </el-table-column>
                  </el-table>
              </span>

              <div v-if="scope.row.data_type === 'title'">
                <div class="flex" style="justify-content: space-around">
                  <div>修改前: {{scope.row.new_data}}</div>
                  <div>修改后: {{scope.row.old_data}}</div>
                </div>
              </div>
            </template>

        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    return {
      visible: false,
      tableData: [],
      rowData: {},
      expands: []
    }
  },
  methods: {
    open (rowData) {
      this.visible = true
      console.log(rowData, 'rowData')
      this.tableData = rowData.ext_json.change_list
      this.rowData = rowData
    },
    confirm () {
      this.expands = []
    },
    expandChange (row, expandedRows, expanded) {
      this.expands = expandedRows.map((item) => item.goods_id)
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  width: 725px;
  height: 50px;
  background: #EAEDFA;
  padding: 12px ;
}

.sku {
  width: 100px;
}

/deep/ .el-table td, .el-table th {
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 12px;
}
</style>
