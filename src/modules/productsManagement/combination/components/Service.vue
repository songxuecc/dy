<!--  -->
<template>
    <div class="card">
        <h1>服务与资质</h1>
        <el-form-item class="item" label="运费模版:" prop="freight_id" required>
            <el-select v-model="freight_id" placeholder="请选择" size="small" @change="check" style="width:295px;">
                <el-option
                :label="template_name"
                :value="id"
                v-for="(costTemplate,index) in costTemplateList"
                :key="index"></el-option>
            </el-select>
            <el-button type="text" @click="getCostTemplateList"><hh-icon type="iconjiazai" style="font-size:12px;"/>刷新</el-button>
            <el-button type="text" @click="open()">添加运费模版</el-button>
        </el-form-item>

        <el-form-item class="item supply_7day_return" label="售后服务:"  prop="supply_7day_return">
            <el-radio-group v-model="supply_7day_return" style="flex:1">
                <el-radio style="display:block" :label="1">7天无理由退换货,类目商品须支持【7天无理由退换货】服务</el-radio>
                <el-radio style="display:block" :label="2">支持7天无理由退换货(拆封后不支持)</el-radio>
                <el-radio style="display:block" :label="0">不支持7天无理由退换货</el-radio>
            </el-radio-group>
            <span class="primary" style="margin-right:20px" v-hh-open="'https://school.jinritemai.com/doudian/web/article/109931'">点击了解售后期规则</span>
        </el-form-item>

         <el-form-item class="item" label="客服电话:" prop="mobile" >
            <el-input v-model="mobile"  class="input-num" style="width:295px;" placeholder="请填写"></el-input>
        </el-form-item>

        <el-form-item class="item"  label="商家备注:">
            <el-input :maxlength="50" :minlength="8" show-word-limit  v-model="remark"  placeholder="请填写" clearable @clear="handleClear('default_recommend_remark')"></el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
  name: 'Service',
  data () {
    return {
      dySupplyImg: 'https://img.pddpic.com/mms-material-img/2021-04-21/091fb3a4-fa82-49eb-9821-229aaa330567.png.a.jpeg',
      dySupplyImgVisible: false,
      freight_id: ''
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

    .supply_7day_return {
      /deep/ .el-form-item__content{
        display: flex;
      }
    }
</style>
