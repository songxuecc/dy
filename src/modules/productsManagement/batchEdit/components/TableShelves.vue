<!-- 上下架 -->
<template>
    <el-drawer
        :visible.sync="visible"
        :with-header="false"
        direction="rtl"
        @closed="toggleVisible"
        size="80%">
        <el-table
            :data="tableData"
            class="mt-10"
            ref="table"
            row-key="id"
            :expand-row-keys="expands"
            @expand-change="expandChange"
            style="width: 100%">
            <el-table-column
            label="商品信息"
            prop="id">
            </el-table-column>
            <el-table-column
            label="修改前"
            prop="name">
            </el-table-column>
            <el-table-column
            label="修改后"
            prop="desc">
            </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="1000">
          </el-pagination>
        <div>
            <el-button type="primary" plain style="width:120px" @click="toggleVisible">暂不修改</el-button>
            <el-button type="primary" style="width:120px"  @click="toggleVisible">开始批量修改</el-button>
        </div>
    </el-drawer>
</template>

<script>
export default {
  name: 'component_name',
  props: {
    visible: Boolean
  },
  data () {
    return {
      expands: ['12987122'],
      tableData: [{
        id: '12987122',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987123',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987125',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }, {
        id: '12987126',
        name: '好滋好味鸡蛋仔',
        category: '江浙小吃、小吃零食',
        desc: '荷兰优质淡奶，奶香浓而不腻',
        address: '上海市普陀区真北路',
        shop: '王小虎夫妻店',
        shopId: '10333'
      }]
    }
  },
  methods: {
    toggleVisible (index) {
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
</style>
