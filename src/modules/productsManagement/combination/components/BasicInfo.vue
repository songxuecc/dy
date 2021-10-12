<!-- 基础信息 -->
<template>
    <div class="card">
        <h1>基础信息</h1>
        <el-form-item required label="商品标题:" class="item">
          <el-input :maxlength="30" :minlength="8" show-word-limit  v-model="default_recommend_remark"  placeholder="请填写" clearable @clear="handleClear('default_recommend_remark')"></el-input>
        </el-form-item>
        <el-form-item  label="推荐语:"  >
            <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="default_recommend_remark"  placeholder="请填写商家推荐语设置,限8-50个汉字" clearable @clear="handleClear('default_recommend_remark')"></el-input>
        </el-form-item>

    </div>
</template>

<script>
export default {
  name: 'component_name',
  props: {
    msg: String
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.item {
        padding-bottom: 10px;
        box-sizing: border-box;
    }

    .card {
      background: #f9f9fa;
      border-radius: 4px;
      margin-bottom: 16px;
      padding: 24px 24px 1px;
    }
    h1 {
        color: #333;
        font-size: 16px;
        margin-bottom: 20px;
        font-family: yahei;
    }
</style>
