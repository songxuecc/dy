<!--  -->
<template>
  <el-dialog
    class="dialog-tight"
    title="同步数据修改详情对比"
    width="800px"
    :visible.sync="visible"
    append-to-body
    center
  >
    <div style="padding-bottom:120px">
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
        style="width: 100%" >
        <el-table-empty slot="empty"/>
        <el-table-column prop="data_type" label="检测内容" width="180" align="center">
          <template slot-scope="scope">
              <span v-if="scope.row.data_type === 'title'">标题</span>
              <span v-if="scope.row.data_type === 'stock'">库存</span>
              <span v-if="scope.row.data_type === 'price'">价格</span>
              <span v-if="scope.row.data_type === 'shelf'">上下架</span>
          </template>
        </el-table-column>
        <el-table-column prop="old_data" label="原数据" align="center">
        </el-table-column>
        <el-table-column prop="new_data" label="现数据" align="center"> </el-table-column>
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
      rowData: {}
    }
  },
  methods: {
    open (rowData) {
      this.visible = true
      console.log(rowData, 'rowData')
      this.tableData = rowData.data_list
      this.rowData = rowData
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
</style>
