<!-- 支付设置 -->
<template>
<div class="card">
    <h1>支付设置</h1>
    <el-form-item label="支付方式:" prop="reduce_type" class="item" required>
        <el-radio-group v-model="pay_type">
          <el-radio :label="1">在线支付</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="订单库存计数:" prop="reduce_type" class="item" required>
        <el-radio-group v-model="reduce_type">
            <div><el-radio :label="1">下单减库存 <span class="info">买家提交订单，扣减库存，存在恶拍风险</span></el-radio></div>
            <div><el-radio :label="2">付款减库存 <span class="info">买家支付订单时，扣件库存，存在超卖风险</span></el-radio></div>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="商品限购设置:" class="item-order item">
        <el-form-item prop="limit_per_buyer"  style="display:inline-block;margin-bottom:0">
        <span class="font-12  " style="margin-right:30px">单用户累计限购<el-input @input="handleChange" v-model.number="limit_per_buyer"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
        </el-form-item>
        <el-form-item prop="maximum_per_order" style="display:inline-block;margin-bottom:0">
        <span class="font-12  " style="margin-right:30px">每次限购<el-input @input="handleChange" v-model.number="maximum_per_order" class="input-num ml-5" style="width:125px"></el-input> 件 </span>
        </el-form-item>
        <el-form-item prop="minimum_per_order"  style="display:inline-block;margin-bottom:0">
        <span class="font-12  " style="margin-right:30px">每次至少购买<el-input @input="handleChange" v-model.number="minimum_per_order"  class="input-num ml-5" style="width:125px"></el-input> 件 </span>
        </el-form-item>
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
      pay_type: 1,
      reduce_type: 1
    }
  }
}
</script>
<style lang="less" scoped>
 /deep/ .item-order{
    .el-form-item__content {
      margin-left: 0 !important;
      align-items: center;
    display: flex;

    }
  }

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
