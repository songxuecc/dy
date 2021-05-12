<template>
  <el-form
    :inline="true"
    :model="model"
    class="flex align-c wrap search justify-b"
    size="mini"
    label-position="left"
  >
    <div class="pt-10 ml-10">
        <el-form-item label="修改内容" >
        <el-select v-model="model.region" placeholder="请选择修改内容"  style="width: 200px">
            <el-option label="sku信息: 价格、库存、编码" value="shanghai"></el-option>
            <el-option label="商品信息: 商品标题" value="beijing"></el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="匹配方式" >
        <el-select v-model="model.region" placeholder="请选择匹配方式" style="width: 200px">
            <el-option label="按ID匹配" value="shanghai"></el-option>
            <el-option label="按名称匹配" value="beijing"></el-option>
        </el-select>
        </el-form-item>

        <el-form-item class="btn">
        <el-button
          type="primary"
          @click="handleFilterChange"
          style="width: 60px;"
        >
          <span class="font-12">查询</span>
        </el-button>
        <NewComer type="导入表格修改查询提示" ref="newComer" direction="bottom" :noAuth="true" class="nn">
          <div style="width:190px">
          <div  class="color-666 font-12 left mb-5">
              <hh-icon type="icontishi" ></hh-icon>&nbsp;小提醒：选择后请点击查询哦~
              <div class="ml-10 right">&nbsp;&nbsp;<span  class="right pointer underline primary" @click="tipTrigger">好的</span></div>
          </div>
          </div>
      </NewComer>
      </el-form-item>

    </div>

    <span class="click mr-20" style="align-content:right">抖店商品导出</span>
  </el-form>
</template>

<script>
export default {
  name: 'Search',
  props: {
    msg: String
  },
  data () {
    return {
      model: {}
    }
  },
  methods: {
    handleFilterChange () {},
    tipTrigger (e) {
      event.stopPropagation()
      const ref = this.$refs.newComer
      ref && ref.close && ref.close()
    }
  }
}
</script>
<style lang="less" scoped>
.search {
  background-color: #f9f9f9;
  border-radius: 3px;
  margin-bottom: 10px;
  /deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 10px;
  }
}
</style>
