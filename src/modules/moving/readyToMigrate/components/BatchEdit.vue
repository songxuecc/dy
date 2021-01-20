<!--  -->
<template>
  <div style="margin-bottom: 10px">
    <el-row type="flex" justify="start" style="margin-bottom: 4px">
      <el-col style="text-align: left">
        <!-- <el-dropdown size="mini" split-button>
            批量修改
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
              <el-dropdown-item>双皮奶</el-dropdown-item>
              <el-dropdown-item>蚵仔煎</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        <el-dropdown size="mini" split-button type="primary">
          更多操作 <span>10</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span style="margin-left: 10px; font-size: 12px">每页商品数
          <el-select v-model="value" placeholder="请选择" size="mini" style="width: 100px" @change="onChange">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </span>
      </el-col>
    </el-row>
    <div class="info left">注：批量修改本页勾选产品</div>
  </div>
</template>

<script>
export default {
  name: 'BatchEdit',
  props: {
    pageSize: String
  },
  data () {
    return {
      options: [
        {
          value: 10,
          label: '10条/页'
        },
        {
          value: 20,
          label: '20条/页'
        },
        {
          value: 50,
          label: '50条/页'
        },
        {
          value: 100,
          label: '100条/页'
        }
      ],
      value: this.pageSize
    }
  },
  methods: {
    onChange (value) {
      this.$emit('onSizeChange', value)
    }
  }
}
</script>
<style lang="less" scoped></style>
