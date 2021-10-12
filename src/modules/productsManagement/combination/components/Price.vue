<!--  -->
<template>
    <div class="card">
        <h1>类目价格</h1>
        <el-form-item required label="商品标题:" class="item">
          <el-select v-model="default_brand_id" placeholder="默认无品牌设置" style="width:280px;margin-right:12px"
            clearable @clear="clear">
            <el-option label="默认无品牌" :value="0"></el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="发货模式:" class="item" >
              <el-radio-group v-model="radio">
                <el-radio :label="3">现货发货</el-radio>
                <el-radio :label="6">全款预售发货</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item  label="售卖价:"  class="item">
                <el-input
                    style="width: 295px"
                    :max="99999999"
                    v-model="incr_diff"
                    class="price"
                >
                    <template slot="append">元</template>
                </el-input>
            </el-form-item>

            <el-form-item  label="划线价:"  class="item">
                <el-input
                    style="width: 295px"
                    :max="99999999"
                    v-model="incr_diff"
                    class="price"
                >
                    <template slot="append">元</template>
                </el-input>
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
.price {
        /deep/ .el-input__inner {
          // border-right: none;
          padding: 5px;
          padding-left: 10px;
        }

      }

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
