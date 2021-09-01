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
              :src="'https://img01.yzcdn.cn/upload_files/2017/06/19/Fme9JZz7T1rB8sSLnsnCk2gILNp_.png'"
              :preview-src-list="['https://img01.yzcdn.cn/upload_files/2017/06/19/Fme9JZz7T1rB8sSLnsnCk2gILNp_.png']"
              >
              <div slot="placeholder">
                  <hh-icon  type="iconwuzhaopian" style="font-size:50px" />
              </div>
              <div slot="error" class="flex align-c" style="height:100%">
                  <hh-icon  type="icontupianjiazaishibai03" style="font-size:30px" />
              </div>
            </el-image>
          <div>
            <p class="color-4e font-12 mb-5">移动互联网产品设计的核心要素有哪些？</p>
            <p class="color-999 font-12">商品ID：371073012830918</p>
          </div>
          </div>
          <div class="right color-4e">
            同步时间：2021-10-12 10:1
          </div>
      </div>

      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" align="center">
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="180" align="center">
        </el-table-column>
        <el-table-column prop="address" label="地址"> </el-table-column>
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
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    }
  },
  methods: {
    open () {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.title {
  width: 725px;
  height: 50px;
  background: #EAEDFA;
  padding: 12px 16px;
}
</style>
